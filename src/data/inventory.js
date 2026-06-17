// ── Inventory / encumbrance model ───────────────────────────────────────────
// Shared logic for the InventoryGrid component. The gear/weapon LIBRARY is
// derived from the existing T2K reference data, so anything you add to
// gear.js / weapons.js automatically shows up in the inventory picker.

import { GEAR }    from './gear'
import { WEAPONS } from './weapons'
import { ARMOR }   from './armor'

// ── Category palette (muted, matches the app's worn-military tokens) ──────────
export const CATS = {
  firearm:    { label: 'Firearm',    color: '#b06a4a' },
  melee:      { label: 'Melee',      color: '#6f86a8' },
  explosive:  { label: 'Explosive',  color: '#c79a4e' },
  medical:    { label: 'Medical',    color: '#6fa07a' },
  optics:     { label: 'Optics',     color: '#8f7fb0' },
  comms:      { label: 'Comms',      color: '#5f9aa0' },
  tools:      { label: 'Tools',      color: '#a08c5a' },
  field:      { label: 'Field',      color: '#7f955f' },
  protective: { label: 'Protective', color: '#5e93a8' },
  food:       { label: 'Food',       color: '#a87c52' },
  custom:     { label: 'Custom',     color: '#8a8a8a' },
}

// ── Encumbrance is measured in QUARTER-units. 1 unit = 4 quarters. ────────────
//  ¼ -> 1   ½ -> 2   ¾ -> 3   1 -> 4   2 -> 8   3 -> 12   4 -> 16 …
const FRAC = { '¼': 1, '½': 2, '¾': 3, '⅓': 1, '⅔': 3 }

// Parse a T2K weight string ("¼", "½", "1", "2", "¼/unit", "As rifle", "–"…)
// into quarter-units. Returns 0 for weightless / negligible items.
export function toQuarters(w) {
  if (w == null) return 0
  const s = String(w).trim()
  if (s === '' || s === '–' || s === '—' || s === '-' || s === '0') return 0
  if (/rifle/i.test(s) && !/^[0-9¼½¾⅓⅔]/.test(s)) return 0   // "As rifle"
  const first = s[0]
  if (first in FRAC) return FRAC[first]                       // ¼ ½ ¾ … (and "¼/unit")
  const n = parseInt(s, 10)                                   // "1", "2", "15", "3–5"…
  return isNaN(n) ? 0 : n * 4
}

// Human label for a quarter-unit size.
export function qLabel(q) {
  if (q <= 0) return '0'
  if (q === 1) return '¼'
  if (q === 2) return '½'
  if (q === 3) return '¾'
  if (q % 4 === 0) return (q / 4) + 'U'
  return (q / 4).toFixed(2) + 'U'
}

// ── Rulesets ──────────────────────────────────────────────────────────────────
//  Capacity is read from the character's STRENGTH:
//   • Twilight 2000 — capacity (in units) = STR die size (D6→6 … D12→12).
//                     Quarter-unit granularity. Backpack adds the same again,
//                     for −2 Mobility while worn.
//   • Coriolis      — capacity (in slots) = STRENGTH rating × 2.
//                     Items bucket to Tiny (0) / Light (½) / Normal (1) / Heavy (2).
//                     Going over forces ENDURANCE rolls.
function dieSize(die) {
  if (die == null) return 8
  const n = parseInt(String(die).replace(/[^0-9]/g, ''), 10)
  return !n ? 8 : n
}
function ratingOf(rating) {
  const n = parseInt(rating, 10)
  return !n ? 3 : n
}

export const RULESETS = {
  t2k: {
    key: 't2k',
    label: 'Twilight 2000',
    unit: 'u',
    subdivides: true,                       // gridlines every quarter
    capacity: (str) => dieSize(str.die),
    capSource: (str) => 'STR ' + (str.die || 'D8'),
    effQ: (q) => q,                          // literal quarter weight
    backpackNote: '−2 Mobility',
    backpackBadge: '−2 MOBILITY',
    overLabel: 'OVER CAPACITY',
    hint: 'Twilight 2000 · each unit splits into 4 quarters; on-body capacity = your STR die. A worn backpack adds the same again but costs −2 Mobility.',
  },
  coriolis: {
    key: 'coriolis',
    label: 'Coriolis',
    unit: 'slots',
    subdivides: false,                       // gridlines every half (no quarters)
    capacity: (str) => ratingOf(str.rating) * 2,
    capSource: (str) => 'STR ' + (str.rating || 3) + ' ×2',
    effQ: (q) => (q <= 2 ? 2 : q <= 4 ? 4 : 8), // Light / Normal / Heavy
    backpackNote: 'extra slots',
    backpackBadge: null,
    overLabel: 'OVER-ENCUMBERED',
    hint: 'Coriolis · carry items equal to Strength × 2. Sizes: Tiny (free), Light (½), Normal (1), Heavy (2). Past the limit you must make Endurance rolls.',
  },
}

// ── Build the pickable library from the existing reference data ───────────────
const GEAR_CAT = {
  common: 'tools', combat_gear: 'optics', medical: 'medical', tools: 'tools',
  survival: 'field', exos_vehicles: 'tools', recon: 'optics',
}

function weaponCat(type) {
  const t = (type || '').toLowerCase()
  if (t.includes('melee')) return 'melee'
  if (t.includes('grenade') || t === 'gl' || t === 'agl' || t.includes('atrl') || t.includes('atgm') ||
      t.includes('explosive') || t.includes('mine') || t.includes('charge') ||
      t.includes('missile') || t.includes('rocket') || t.includes('system')) return 'explosive'
  return 'firearm'
}
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function clip(s, n = 36) { if (!s) return ''; return s.length > n ? s.slice(0, n - 1) + '…' : s }

// Best-guess hit-location coverage for an armor item, from its name/features text.
// Coriolis coverage is free text, so this is a starting point the player can edit.
// Shared by the inventory mod-bonus logic and PlayerScreen's add-to-sheet.
export function armorCoverage(item) {
  if (/helmet/i.test(item.name)) return ['head']
  const f = (item.features || '').toLowerCase()
  if (f.includes('full body') || f.includes('all hit locations')) return ['head', 'arms', 'torso', 'legs']
  const locs = []
  if (f.includes('head'))  locs.push('head')
  if (/\barm/.test(f))     locs.push('arms')
  if (f.includes('torso')) locs.push('torso')
  if (/\bleg/.test(f))     locs.push('legs')
  return locs.length ? locs : ['torso']
}

// A modification grants a flat +1 Armor Rating only when its effect plainly says so
// (High-density armalite, the "Armor" feature). Conditional ones like Hydrostatic gel
// ("+1 ... against explosions") are excluded.
export function flatArmor(effect) {
  const e = String(effect || '')
  return /\+1 to armor rating/i.test(e) && !/against/i.test(e) ? 1 : 0
}

export function buildLibrary() {
  const lib = []
  // Weapons
  for (const catId of Object.keys(WEAPONS)) {
    for (const w of WEAPONS[catId]) {
      if (/^—/.test(w.name)) continue
      const sub = [
        w.type,
        (w.damage != null && w.damage !== '' && w.damage !== '–') ? 'Dmg ' + w.damage : null,
        (w.range != null && w.range !== '') ? 'Rng ' + w.range : null,
      ].filter(Boolean).join(' · ')
      lib.push({ id: 'w-' + slug(w.name) + '-' + slug(catId), name: w.name, cat: weaponCat(w.type), w: w.weight, kind: 'weapon', sub, effect: w.notes || '', slots: Number(w.slots) || 0 })
    }
  }
  // Gear
  for (const catId of Object.keys(GEAR)) {
    for (const g of GEAR[catId]) {
      if (/^—/.test(g.name)) continue
      lib.push({ id: 'g-' + slug(g.name) + '-' + slug(catId), name: g.name, cat: GEAR_CAT[catId] || 'tools', w: g.weight, kind: 'gear', sub: clip(g.effect), effect: g.effect || '' })
    }
  }
  // Armor (worn protective items only — the `mods` category is modifications, not carried items)
  for (const catId of Object.keys(ARMOR)) {
    if (catId === 'mods') continue
    for (const a of ARMOR[catId]) {
      const sub = [a.rating !== '–' && a.rating !== '' ? 'AR ' + a.rating : null, a.tech].filter(Boolean).join(' · ')
      lib.push({ id: 'a-' + slug(a.name) + '-' + slug(catId), name: a.name, cat: 'protective', w: a.weight, kind: 'armor', sub, effect: a.features || '', slots: Number(a.slots) || 0, coverage: armorCoverage({ name: a.name, features: a.features }) })
    }
  }
  return lib
}

export const LIBRARY = buildLibrary()

// Full item details for the inventory detail panel, keyed by libId (avoids bloating
// saved character docs with description text).
export const ITEM_DETAILS = Object.fromEntries(LIBRARY.map(x => [x.id, x]))

// Modification pools. Weapon mods are the Combat Gear attachments (scopes, suppressors,
// sights); armor mods are the Armor "Modifications" list (incl. the supplemental "Armor"
// feature). Effects are shown to the player; only `flatArmor` ones auto-bump the rating.
export const WEAPON_MODS = (GEAR.combat_gear || []).map(g => ({
  id: 'wm-' + slug(g.name), name: g.name, effect: g.effect || '', weight: g.weight, flatArmor: 0,
}))
export const ARMOR_MODS = (ARMOR.mods || []).map(m => ({
  id: 'am-' + slug(m.name), name: m.name, effect: m.features || '', weight: m.weight, flatArmor: flatArmor(m.features),
}))
