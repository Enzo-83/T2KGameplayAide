import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// Generate a random 4-character alphanumeric session code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// Build a fresh 10-card deck (cards 1–10), shuffled
function buildDeck() {
  const deck = Array.from({ length: 10 }, (_, i) => i + 1)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

// Create a new session, returns the session code (used as document ID)
export async function createSession(gmName) {
  const code = generateCode()
  const sessionRef = doc(db, 't2k_sessions', code)
  await setDoc(sessionRef, {
    code,
    gmName,
    createdAt: serverTimestamp(),
    status: 'lobby',        // lobby | combat | ended
    round: 0,
    currentTurn: null,      // card number whose turn it is
    deck: buildDeck(),
    combatants: [],         // { id, name, type: 'player'|'npc', card, actions: {fast, slow}, visible: true }
    players: [],            // { id, name } — joined players
    combatAwareness: [],    // array of player ids that have Combat Awareness active
  })
  return code
}

// Player joins a session — verifies the code exists, returns { code, playerId }
export async function joinSession(code, playerName) {
  const sessionRef = doc(db, 't2k_sessions', code)
  const snap = await getDoc(sessionRef)
  if (!snap.exists()) throw new Error('Session not found. Check the code.')

  const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  await updateDoc(sessionRef, {
    players: arrayUnion({ id: playerId, name: playerName }),
  })
  return { code, playerId }
}

// Subscribe to a session document (real-time)
export function subscribeToSession(sessionId, callback) {
  const sessionRef = doc(db, 't2k_sessions', sessionId)
  return onSnapshot(sessionRef, snap => {
    if (snap.exists()) callback(snap.data())
  })
}

// GM: start combat — auto-deal cards to all joined players + NPC groups
// npcGroups: combatants added by GM (type: 'npc')
// surpriseId: optional id of combatant that gets card #1 automatically
// combatAwareness is read directly from Firestore so player toggles are included
export async function startCombat(sessionId, npcGroups = [], surpriseId = null) {
  const sessionRef = doc(db, 't2k_sessions', sessionId)
  const snap = await getDoc(sessionRef)
  const data = snap.data()
  const doubleDrawIds = new Set(data.combatAwareness ?? [])

  // Build full combatant list: joined players + NPC groups
  const playerCombatants = (data.players ?? []).map(p => ({
    id: p.id,
    name: p.name,
    type: 'player',
    card: null,
    actions: { fast: false, slow: false },
    visible: true,
  }))

  const allCombatants = [
    ...playerCombatants,
    ...npcGroups.map(n => ({ ...n, card: null, actions: { fast: false, slow: false } })),
  ]

  // Build a working deck (mutable, cards removed as dealt)
  const deck = [...data.deck]
  function drawOne() { return deck.splice(Math.floor(Math.random() * deck.length), 1)[0] ?? null }
  function drawKeepHigher() {
    const a = drawOne()
    const b = drawOne()
    if (a == null) return b
    if (b == null) return a
    return Math.max(a, b)
  }

  // Assign cards — surprise gets #1, double-draw gets two cards (keep higher), rest get one
  if (surpriseId) {
    const idx = deck.indexOf(1)
    if (idx !== -1) deck.splice(idx, 1)
    allCombatants.forEach(c => {
      if (c.id === surpriseId) {
        c.card = 1
      } else if (doubleDrawIds.has(c.id)) {
        c.card = drawKeepHigher()
      } else {
        c.card = drawOne()
      }
    })
  } else {
    allCombatants.forEach(c => {
      c.card = doubleDrawIds.has(c.id) ? drawKeepHigher() : drawOne()
    })
  }

  allCombatants.sort((a, b) => (a.card ?? 99) - (b.card ?? 99))

  await updateDoc(sessionRef, {
    combatants: allCombatants,
    currentTurn: allCombatants[0]?.card ?? null,
    status: 'combat',
    round: 1,
  })
}

// GM: add a combatant (player or NPC group)
export async function addCombatant(sessionId, combatant) {
  const sessionRef = doc(db, 't2k_sessions', sessionId)
  await updateDoc(sessionRef, {
    combatants: arrayUnion(combatant),
  })
}

// GM: update all combatants (used for action tracking, exchanges, etc.)
export async function updateCombatants(sessionId, combatants) {
  const sessionRef = doc(db, 't2k_sessions', sessionId)
  await updateDoc(sessionRef, { combatants })
}

// Toggle Combat Awareness for a player (usable by both GM and player)
export async function toggleCombatAwareness(sessionId, playerId) {
  const sessionRef = doc(db, 't2k_sessions', sessionId)
  const snap = await getDoc(sessionRef)
  const current = snap.data().combatAwareness ?? []
  const updated = current.includes(playerId)
    ? current.filter(id => id !== playerId)
    : [...current, playerId]
  await updateDoc(sessionRef, { combatAwareness: updated })
}

// Player: toggle one action on their own combatant only (avoids overwriting others)
export async function togglePlayerAction(sessionId, playerId, actionType) {
  const sessionRef = doc(db, 't2k_sessions', sessionId)
  const snap = await getDoc(sessionRef)
  const combatants = snap.data().combatants ?? []
  const updated = combatants.map(c => {
    if (c.id !== playerId) return c
    return { ...c, actions: { ...c.actions, [actionType]: !c.actions[actionType] } }
  })
  await updateDoc(sessionRef, { combatants: updated })
}

// GM: advance to next turn
export async function advanceTurn(sessionId, combatants, currentTurn, round) {
  const sorted = [...combatants].sort((a, b) => a.card - b.card)
  const idx = sorted.findIndex(c => c.card === currentTurn)
  const next = sorted[idx + 1]

  if (next) {
    await updateDoc(doc(db, 't2k_sessions', sessionId), { currentTurn: next.card })
  } else {
    // End of round — reset actions, advance round
    const reset = combatants.map(c => ({ ...c, actions: { fast: false, slow: false } }))
    await updateDoc(doc(db, 't2k_sessions', sessionId), {
      combatants: reset,
      currentTurn: sorted[0]?.card ?? null,
      round: round + 1,
    })
  }
}

// GM: reshuffle deck and clear combat
export async function reshuffleDeck(sessionId) {
  await updateDoc(doc(db, 't2k_sessions', sessionId), {
    deck: buildDeck(),
    combatants: [],
    currentTurn: null,
    round: 0,
    status: 'lobby',
  })
}

// GM: close the session — marks it ended so players see a message
export async function closeSession(sessionId) {
  await updateDoc(doc(db, 't2k_sessions', sessionId), {
    status: 'ended',
  })
}

// GM: reopen a previously closed session — resets to lobby
export async function reopenSession(sessionId) {
  const sessionRef = doc(db, 't2k_sessions', sessionId)
  const snap = await getDoc(sessionRef)
  if (!snap.exists()) throw new Error('Session not found.')
  await updateDoc(sessionRef, {
    status: 'lobby',
    deck: buildDeck(),
    combatants: [],
    currentTurn: null,
    round: 0,
  })
}

// GM: verify a session exists and return its data (for rejoining)
export async function getSession(sessionId) {
  const snap = await getDoc(doc(db, 't2k_sessions', sessionId))
  if (!snap.exists()) throw new Error('Session not found. Check the code.')
  return snap.data()
}

// GM: exchange initiative between two combatants
export async function exchangeInitiative(sessionId, combatants, idA, idB) {
  const updated = combatants.map(c => {
    if (c.id === idA) return { ...c, card: combatants.find(x => x.id === idB).card }
    if (c.id === idB) return { ...c, card: combatants.find(x => x.id === idA).card }
    return c
  })
  updated.sort((a, b) => a.card - b.card)
  await updateDoc(doc(db, 't2k_sessions', sessionId), { combatants: updated })
}
