// Local multi-character library. The full character data still lives in Firestore
// (`characters/{id}` via characterService); this module just keeps a lightweight
// per-browser index of the player's characters and which one is "active", so they
// can keep several PCs and pick which to play instead of having a single implicit
// character per browser.

import { saveCharacter, EMPTY_CHARACTER } from '../firebase/characterService'

const LIST_KEY   = 't2k_characters'   // JSON: [{ id, name, updatedAt }]
const ACTIVE_KEY = 't2k_active_char'  // id of the active character
const LEGACY_KEY = 't2k_player_id'    // pre-library single-character id

function newId() {
  return 'char_' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
}

function readList() {
  try {
    const v = JSON.parse(localStorage.getItem(LIST_KEY))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}
function writeList(list) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list))
}

// One-time: fold a pre-library character (random t2k_player_id) into the index so
// the user's existing PC stays put and keeps its session/combatant identity.
function ensureMigrated() {
  if (localStorage.getItem(LIST_KEY)) return
  const legacy = localStorage.getItem(LEGACY_KEY)
  if (legacy) {
    writeList([{ id: legacy, name: 'My Character', updatedAt: Date.now() }])
    if (!localStorage.getItem(ACTIVE_KEY)) localStorage.setItem(ACTIVE_KEY, legacy)
  } else {
    writeList([])
  }
}

export function listCharacters() {
  ensureMigrated()
  return readList()
}

// Always returns an id. If none exists yet, creates a local slot — the Firestore
// doc is created lazily on first save (matching the old single-character behaviour).
export function getActiveId() {
  ensureMigrated()
  const list = readList()
  const active = localStorage.getItem(ACTIVE_KEY)
  if (active && list.some(c => c.id === active)) return active
  if (list.length) {
    localStorage.setItem(ACTIVE_KEY, list[0].id)
    return list[0].id
  }
  const id = newId()
  writeList([{ id, name: '', updatedAt: Date.now() }])
  localStorage.setItem(ACTIVE_KEY, id)
  // keep legacy key in sync so any old code paths still resolve the same id
  localStorage.setItem(LEGACY_KEY, id)
  return id
}

export function setActiveId(id) {
  localStorage.setItem(ACTIVE_KEY, id)
}

// Update (or insert) an index entry's name + timestamp. Called after a save so the
// selector labels stay current.
export function touchCharacter(id, name) {
  const list = readList()
  const i = list.findIndex(c => c.id === id)
  const entry = { id, name: name || (i >= 0 ? list[i].name : '') || 'Unnamed', updatedAt: Date.now() }
  if (i >= 0) list[i] = entry
  else list.push(entry)
  writeList(list)
}

// Create a fresh character, persist an empty doc, and make it active. Returns its id.
export async function createCharacter(name = '') {
  const id = newId()
  touchCharacter(id, name || 'New Character')
  setActiveId(id)
  await saveCharacter(id, { ...EMPTY_CHARACTER, name })
  return id
}

// Import a (normalised) character object as a new library entry; make it active.
export async function importToLibrary(character) {
  const id = newId()
  touchCharacter(id, character?.name || 'Imported Character')
  setActiveId(id)
  await saveCharacter(id, character)
  return id
}

// Remove from the index (Firestore doc is left intact — cheap, and recoverable).
// Returns the new active id (first remaining, or a freshly created slot).
export function deleteCharacter(id) {
  const list = readList().filter(c => c.id !== id)
  writeList(list)
  if (localStorage.getItem(ACTIVE_KEY) === id) {
    localStorage.removeItem(ACTIVE_KEY)
  }
  return getActiveId()
}
