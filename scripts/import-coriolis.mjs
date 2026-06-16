// One-shot importer: convert the Referee's Coriolis spreadsheets (exported as CSV)
// into the app's canonical reference-csv/{categories,weapons,gear}.csv schema.
//
//   node scripts/import-coriolis.mjs [rangedCsv] [meleeCsv] [equipmentCsv]
//
// Defaults point at the files in the user's Downloads folder. This is DISTINCT
// from generate-references.mjs (which turns the canonical CSVs into src/data/*.js
// at build time). Run this only when the Referee sends updated Coriolis sheets,
// then review `git diff reference-csv/`, then `npm run gen:refs`.
//
// The Referee's sheets are human-readable (section-header rows, a merged
// "Name & Type" column, ASCII fractions, comma-thousand costs) and the ranged
// sheet is internally inconsistent (grenade rows drop the ROF column, a stray
// numeric "Extra Features" column, nameless rows). This script normalizes all of
// that and prints a report of anything it had to drop or assume.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV_DIR   = join(__dirname, '..', 'reference-csv')
const HOME      = process.env.USERPROFILE || process.env.HOME || ''
const DL        = join(HOME, 'Downloads')

const RANGED = process.argv[2] || join(DL, '(NEW-PRINT) Coriolis Ranged and Heavy Weapons-1-Ranged Weapons and Explosives.csv')
const MELEE  = process.argv[3] || join(DL, '(NEW) Coriolis Melee Weapons-Coriolis Melee.csv')
const EQUIP  = process.argv[4] || join(DL, '(NEW) Coriolis Equipment-Equipment.csv')

const report = []
const log = m => report.push(m)

// ── RFC-4180 CSV parser (quotes, escaped quotes, CRLF, BOM); keeps empty cells ─
function parseCsv(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1)
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false }
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += c
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

// drop the header row and any fully-blank lines; keep the raw arrays (positional)
function dataRows(file) {
  const rows = parseCsv(readFileSync(file, 'utf8'))
  rows.shift()                                       // header
  return rows.filter(r => r.some(c => (c ?? '').trim() !== ''))
}

const T  = v => (v ?? '').trim()
const isNum = s => /^-?\d+(?:\.\d+)?$/.test(s)
// a section-header row: first cell set, every other cell blank
const isSection = r => T(r[0]) !== '' && r.slice(1).every(c => T(c) === '')

// ── value normalizers ────────────────────────────────────────────────────────
const FRAC = { '1/4': '¼', '1/2': '½', '3/4': '¾', '1/3': '⅓', '2/3': '⅔' }
function normWeight(s) {
  s = T(s)
  if (s === '' || s === '0') return ''
  if (s === '-' || s === '–' || s === '—') return '–'
  s = s.replace(/\d+\/\d+/g, m => FRAC[m] || m)      // 1/2 -> ½
  s = s.replace(/\s*-\s*/g, '–')                     // "1/4 - 1" -> "¼–1"
  return s
}
function normPrice(s) {
  s = T(s)
  if (s === '' || s === '-' || s === '–' || s === '—') return ''
  while (/\d,\d{3}(\D|$)/.test(s)) s = s.replace(/(\d),(\d{3})(\D|$)/g, '$1$2$3')  // 1,500 -> 1500
  s = s.replace(/(\d)\s*-\s*(\d)/g, '$1–$2')         // 50-1000 -> 50–1000
  return s
}
function normArmor(s) {
  s = T(s)
  if (s === '' || s === '-' || s === '–' || s === '—') return '0'
  return s.replace(/^-(\d)/, '–$1')                  // -1 -> –1
}
function normBlast(s) {
  s = T(s)
  return (s === '' || s === '-' || s === '—') ? '–' : s
}
// rel/rof/damage/crit/range/mag/ammo: dash/blank -> '' (so the reference pill hides)
function normStat(s) {
  s = T(s)
  return (s === '-' || s === '–' || s === '—') ? '' : s
}

// known source typos -> fixes (names + free text)
const FIXES = [
  ['Vulcan Scoripon', 'Vulcan Scorpion'],
  ['Thermal Macine Gun', 'Thermal Machine Gun'],
  ['Articificial Gills', 'Artificial Gills'],
  ['Balistic Cartograph', 'Ballistic Cartograph'],
  ['Singe Shot', 'Single Shot'],
  ['Voile Amplifier', 'Voice Amplifier'],
]
const fix = s => FIXES.reduce((a, [from, to]) => a.split(from).join(to), s ?? '')

// CSV writer (quote when needed)
const q = v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s }
const toCsv = (header, rows) => [header.join(','), ...rows.map(r => header.map(h => q(r[h])).join(','))].join('\n') + '\n'

// ── categories (display order) ────────────────────────────────────────────────
const CATS = [
  // weapons
  ['weapons', 'pistols',        'Pistols'],
  ['weapons', 'smgs',           'Submachine Guns'],
  ['weapons', 'carbines',       'Carbines'],
  ['weapons', 'assault_rifles', 'Assault Rifles'],
  ['weapons', 'grape',          'Grape Weapons'],
  ['weapons', 'marksman',       'Marksman Rifles'],
  ['weapons', 'heavy',          'Heavy Weapons'],
  ['weapons', 'launchers',      'Grenade Launchers'],
  ['weapons', 'systems',        'Weapon Systems'],
  ['weapons', 'melee',          'Melee'],
  ['weapons', 'grenades',       'Grenades'],
  ['weapons', 'explosives',     'Explosives'],
  ['weapons', 'other',          'Other'],
  // gear
  ['gear', 'common',        'Common Items'],
  ['gear', 'combat_gear',   'Combat Gear'],
  ['gear', 'medical',       'Medicurgical'],
  ['gear', 'tools',         'Tools & Repairs'],
  ['gear', 'survival',      'Survival & Colonization'],
  ['gear', 'exos_vehicles', 'Exos & Vehicles'],
  ['gear', 'recon',         'Recon & Infiltration'],
]

// map a ranged section-header label -> { id, type }. "HEAVY WEAPONS" appears
// twice (machine guns, then grenade launchers) — resolved by occurrence count.
let heavyN = 0
function rangedSection(label) {
  const k = label.toUpperCase().replace(/\s+/g, ' ').trim()
  const m = {
    'PISTOLS':            ['pistols', 'Pistol'],
    'SUBMACHINE GUNS':    ['smgs', 'SMG'],
    'CARBINES':           ['carbines', 'Carbine'],
    'ASSAULT RIFLES':     ['assault_rifles', 'Assault rifle'],
    'GRAPE WEAPONS':      ['grape', 'Shotgun'],
    'MARKSMAN RIFLES':    ['marksman', 'Marksman rifle'],
    'WEAPON SYSTEMS':     ['systems', 'Weapon system'],
    'OTHER':              ['other', 'Other'],
    'EXPLOSIVE':          ['explosives', 'Explosive'],
    'GRENADE':            ['grenades', 'Grenade'],
  }
  if (k === 'HEAVY WEAPONS') return (++heavyN === 1) ? ['heavy', 'Machine gun'] : ['launchers', 'Grenade launcher']
  return m[k] || null
}

// ── RANGED + EXPLOSIVES weapons ───────────────────────────────────────────────
// Row columns (13): name,ammo,rel,rof,dmg,crit,blast,range,mag,armor,weight,extra,features
// Some rows ship 12 fields (the trailing Features text lands in the "extra" slot
// and the real Features col is absent) — handled by the notes logic below.
function buildRanged() {
  const out = []
  const rows = dataRows(RANGED)
  let cat = null, type = null, parent = null, nameless = 0
  rows.forEach((r, i) => {
    if (isSection(r)) {
      const s = rangedSection(T(r[0]))
      if (!s) log(`! ranged: unknown section "${T(r[0])}" — its rows were skipped`)
      cat = s ? s[0] : null; type = s ? s[1] : null; parent = null
      return
    }
    if (!cat) return
    let name = fix(T(r[0]))
    if (name === '') { nameless++; return }          // nameless rows (4 launcher rows)

    // child variant ("- Small") -> "<parent> Small"
    const isChild = /^-\s*/.test(name)
    if (isChild) name = (parent ? parent + ' ' : '') + name.replace(/^-\s*/, '')
    else parent = name

    const c = r
    const weight = normWeight(c[10])
    const price  = ''                                 // ranged sheet has no Cost column
    // col 11 = "Extra Features" = number of modification/feature slots you can buy
    // add-on features into. 12-field rows have no number here and put the Features
    // TEXT in col 11 instead (col 12 absent), so a bare number => slots, else notes.
    const slots = isNum(T(c[11])) ? T(c[11]) : ''
    let notes = fix(T(c[12]))
    if (notes === '') { const e = fix(T(c[11])); notes = isNum(e) ? '' : e }

    // skip a pure parent header with no stats of its own (e.g. "Breach Charge")
    const stats = [c[2], c[3], c[4], c[5], c[6], c[7], c[8]].map(T)
    const empty = stats.every(s => s === '' || s === '-' || s === '–')
    const next = rows[i + 1]
    if (!isChild && empty && (weight === '' || weight === '–') && next && /^-\s*/.test(T(next[0]))) return

    out.push({
      category: cat, name, type,
      ammo: normStat(c[1]), rel: normStat(c[2]), rof: normStat(c[3]),
      damage: normStat(c[4]), crit: normStat(c[5]), blast: normBlast(c[6]),
      range: normStat(c[7]), mag: normStat(c[8]), armor: normArmor(c[9]),
      weight, price, slots, notes,
    })
  })
  if (nameless) log(`! ranged: ${nameless} nameless row(s) in the grenade-launcher block were skipped (source has no name)`)
  return out
}

// ── MELEE weapons (clean, 9 cols): name,rel,dmg,crit,armor,weight,features,tech,cost
function buildMelee() {
  const out = []
  for (const r of dataRows(MELEE)) {
    if (isSection(r)) continue                        // KNIVES/AXES/BLUNT/etc -> one "melee" cat
    const name = fix(T(r[0]))
    if (!name) continue
    const tech = T(r[7])
    const notes = [fix(T(r[6])), tech ? `Tech ${tech}` : ''].filter(Boolean).join(' · ')
    out.push({
      category: 'melee', name, type: 'Melee',
      ammo: '', rel: normStat(r[1]), rof: '',
      damage: normStat(r[2]), crit: normStat(r[3]), blast: '–',
      range: '', mag: '', armor: normArmor(r[4]),
      weight: normWeight(r[5]), price: normPrice(r[8]), notes,
    })
  }
  return out
}

// ── EQUIPMENT -> gear (clean, 6 cols): name,bonus,features,weight,tech,cost ─────
const EQUIP_SECTION = {
  'COMMON ITEMS': 'common',
  'COMBAT GEAR': 'combat_gear',
  'MEDICURGICAL TECHNOLOGY': 'medical',
  'TOOLS & REPAIRS': 'tools',
  'SURVIVAL & COLONIZATION': 'survival',
  'EXOS & VEHICLES': 'exos_vehicles',
  'RECON & INFILTRATION': 'recon',
}
const TECH = { P: 'Primitive', O: 'Ordinary', A: 'Advanced', F: 'Faction' }
function techLabel(t) {
  t = T(t)
  if (t === '') return ''
  if (t.includes('/')) return 'Varies'
  return TECH[t.replace('*', '')[0]] || t
}
function buildGear() {
  const out = []
  const rows = dataRows(EQUIP)
  let cat = null, parent = null
  rows.forEach((r, i) => {
    if (isSection(r)) {
      const id = EQUIP_SECTION[T(r[0]).toUpperCase().replace(/\s+/g, ' ').trim()]
      if (!id) log(`! equipment: unknown section "${T(r[0])}" — its rows were skipped`)
      cat = id || null; parent = null
      return
    }
    if (!cat) return
    let name = fix(T(r[0]))
    if (!name) return
    const isChild = /^-\s*/.test(name)
    if (isChild) name = (parent ? parent + ' ' : '') + name.replace(/^-\s*/, '')
    else parent = name

    const weight = normWeight(r[3])
    const price  = normPrice(r[5])
    const bonus  = T(r[1])
    let effect   = fix(T(r[2]))
    if (bonus && !effect.includes(bonus)) effect = `(${bonus}) ${effect}`

    // skip a pure parent header (e.g. "Communicator") followed by "- " children
    const next = rows[i + 1]
    if (!isChild && (weight === '' || weight === '–') && price === '' && next && /^-\s*/.test(T(next[0]))) return

    out.push({ category: cat, name, sub: techLabel(r[4]), weight, price, rel: '', range: '', effect, notes: '' })
  })
  return out
}

// ── run ───────────────────────────────────────────────────────────────────────
const weaponRows = [...buildMelee(), ...buildRanged()]   // melee first, then ranged
// order weapon rows by the category order in CATS
const wOrder = CATS.filter(c => c[0] === 'weapons').map(c => c[1])
weaponRows.sort((a, b) => wOrder.indexOf(a.category) - wOrder.indexOf(b.category))
const gearRows = buildGear()

writeFileSync(join(CSV_DIR, 'categories.csv'),
  toCsv(['dataset', 'id', 'label'], CATS.map(([dataset, id, label]) => ({ dataset, id, label }))))
writeFileSync(join(CSV_DIR, 'weapons.csv'),
  toCsv(['category', 'name', 'type', 'ammo', 'rel', 'rof', 'damage', 'crit', 'blast', 'range', 'mag', 'armor', 'weight', 'price', 'slots', 'notes'], weaponRows))
writeFileSync(join(CSV_DIR, 'gear.csv'),
  toCsv(['category', 'name', 'sub', 'weight', 'price', 'rel', 'range', 'effect', 'notes'], gearRows))

console.log(`\ncategories.csv  ${CATS.length} categories`)
console.log(`weapons.csv     ${weaponRows.length} weapons`)
console.log(`gear.csv        ${gearRows.length} gear items`)
if (report.length) { console.log('\nnotes:'); report.forEach(m => console.log('  ' + m)) }
console.log()
