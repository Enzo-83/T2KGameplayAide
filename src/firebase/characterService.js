import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// ── Default empty character (Version 2 layout — attribute in parentheses) ──
export const EMPTY_CHARACTER = {
  // Identity
  name: '',
  personalProblem: '',
  icon: '',
  groupConcept: '',

  // Attributes — each has a Rating (number) and Die (e.g. D8)
  attributes: {
    str: { rating: '', die: '' },
    agi: { rating: '', die: '' },
    wit: { rating: '', die: '' },
    emp: { rating: '', die: '' },
  },

  // 18 skills grouped by governing attribute
  skills: {
    // STR
    force:        { rating: '', die: '' },
    heavyWeapons: { rating: '', die: '' },
    meleeCombat:  { rating: '', die: '' },
    stamina:      { rating: '', die: '' },
    // AGI
    dexterity:    { rating: '', die: '' },
    infiltration: { rating: '', die: '' },
    pilot:        { rating: '', die: '' },
    rangedCombat: { rating: '', die: '' },
    // WITS
    dataDjinn:    { rating: '', die: '' },
    medicalAid:   { rating: '', die: '' },
    observation:  { rating: '', die: '' },
    science:      { rating: '', die: '' },
    survival:     { rating: '', die: '' },
    technology:   { rating: '', die: '' },
    // EMP
    command:      { rating: '', die: '' },
    culture:      { rating: '', die: '' },
    mysticPowers: { rating: '', die: '' },
    persuasion:   { rating: '', die: '' },
  },

  // Talents — structured list of {name, effect, source, type}, shown as
  // collapsible pills on the sheet. `talents` (below) is kept as a free-text
  // notes field for anything not in the compendium / legacy characters.
  talentList: [],
  talents: '',

  // Combat stats
  hitCapacity:       '',
  stressCapacity:    '',
  coolnessUnderFire: '',
  unitMorale:        '',
  criticalInjuries:  '',
  stress:            '',
  radiation:         '',

  // Armor by hit location
  armor: { head: '', arms: '', torso: '', legs: '' },

  // Conditions (boolean toggles)
  conditions: {
    starving:      false,
    dehydrated:    false,
    sleepDeprived: false,
    hypothermic:   false,
  },

  // ── Inventory & encumbrance (drives the InventoryGrid component) ──
  //   ruleset:      't2k' (STR die → units, quarter granularity) | 'coriolis' (STR ×2 slots)
  //   backpackWorn: doubles capacity for −2 Mobility (T2K)
  //   items:        [{ uid, libId, name, cat, w, q, kind, sub, container, col }]
  //                 container ∈ 'combat' | 'backpack' | 'tiny' | 'cabin'
  inventory: { ruleset: 't2k', backpackWorn: true, items: [] },

  // Legacy free-text gear slots — kept for backward compatibility with older
  // saved characters. No longer rendered; the InventoryGrid above supersedes them.
  combatGear:   Array(12).fill(''),
  backpack:     Array(12).fill(''),
  tinyItems:    '',
  cabinStorage: '',

  // Weapons (up to 5 rows matching the paper sheet)
  weapons: Array(5).fill(null).map(() => ({
    name: '', rel: '', rof: '', damage: '', crit: '',
    blast: '', range: '', mag: '', armor: '', weight: '', spentAmmo: '',
  })),
}

function ref(playerId) {
  return doc(db, 'characters', playerId)
}

export async function saveCharacter(playerId, data) {
  await setDoc(ref(playerId), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

export async function loadCharacter(playerId) {
  const snap = await getDoc(ref(playerId))
  return snap.exists() ? mergeWithEmpty(snap.data()) : { ...EMPTY_CHARACTER }
}

export function subscribeToCharacter(playerId, callback) {
  return onSnapshot(ref(playerId), snap => {
    callback(snap.exists() ? mergeWithEmpty(snap.data()) : { ...EMPTY_CHARACTER })
  })
}

// Deep-merge data (from Firestore or an imported JSON file) with EMPTY_CHARACTER
// so all keys always exist. Exported so the import flow can normalise files too.
export function mergeWithEmpty(data) {
  data = data ?? {}
  return {
    ...EMPTY_CHARACTER,
    ...data,
    attributes: { ...EMPTY_CHARACTER.attributes, ...(data.attributes ?? {}) },
    skills:     { ...EMPTY_CHARACTER.skills,     ...(data.skills ?? {}) },
    armor:      { ...EMPTY_CHARACTER.armor,      ...(data.armor ?? {}) },
    conditions: { ...EMPTY_CHARACTER.conditions, ...(data.conditions ?? {}) },
    talentList: Array.isArray(data.talentList) ? data.talentList : EMPTY_CHARACTER.talentList,
    inventory: {
      ...EMPTY_CHARACTER.inventory,
      ...(data.inventory ?? {}),
      items: Array.isArray(data.inventory?.items) ? data.inventory.items : EMPTY_CHARACTER.inventory.items,
    },
    combatGear: data.combatGear ?? EMPTY_CHARACTER.combatGear,
    backpack:   data.backpack   ?? EMPTY_CHARACTER.backpack,
    weapons:    data.weapons    ?? EMPTY_CHARACTER.weapons,
  }
}
