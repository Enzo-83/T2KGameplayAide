// Generate src/data/weapons.js and src/data/gear.js from the canonical CSVs in
// reference-csv/. The CSVs are the source of truth — the .js files are build
// artifacts and must not be hand-edited.
//
//   node scripts/generate-references.mjs      (npm run gen:refs)
//
// Runs automatically before `npm run dev` / `npm run build` (see package.json).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV_DIR   = join(__dirname, '..', 'reference-csv')
const DATA_DIR  = join(__dirname, '..', 'src', 'data')

// ── minimal RFC-4180 CSV parser (handles quotes, escaped quotes, CRLF, BOM) ────
function parseCsv(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1)
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += c
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row) }
  // drop fully-empty rows (blank lines)
  return rows.filter(r => r.some(cell => cell !== ''))
}

function readRows(file) {
  const rows = parseCsv(readFileSync(join(CSV_DIR, file), 'utf8'))
  const header = rows.shift().map(h => h.trim())
  return rows.map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])))
}

// ── value typing ──────────────────────────────────────────────────────────────
const isInt = s => /^-?\d+$/.test(s)
// number when an integer literal, else the raw string (keeps '–' / '' / 'varies')
const numOrStr = raw => { const s = raw.trim(); return s !== '' && isInt(s) ? Number(s) : raw }

// JS literal for emission: null, number, or JSON-quoted string (handles apostrophes/unicode)
function lit(v) {
  if (v === null) return 'null'
  if (typeof v === 'number') return String(v)
  return JSON.stringify(v)
}
const ident = k => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k))
const obj   = entries => '{ ' + entries.map(([k, v]) => `${ident(k)}: ${lit(v)}`).join(', ') + ' }'

// ── build category metadata + ordering from categories.csv ────────────────────
const catRows = readRows('categories.csv')
function categoriesFor(dataset) {
  return catRows.filter(r => r.dataset === dataset).map(r => ({ id: r.id.trim(), label: r.label }))
}

// group item rows by category id, preserving categories.csv order, then row order
function groupByCategory(rows, cats, dataset) {
  const known = new Set(cats.map(c => c.id))
  for (const r of rows) {
    const id = (r.category || '').trim()
    if (!known.has(id)) throw new Error(`${dataset}: row "${r.name}" has category "${id}" not in categories.csv`)
  }
  const out = {}
  for (const c of cats) out[c.id] = rows.filter(r => (r.category || '').trim() === c.id)
  return out
}

// ── WEAPONS ───────────────────────────────────────────────────────────────────
function weaponItem(r) {
  return [
    ['name',   r.name],
    ['type',   r.type],
    ['ammo',   r.ammo],
    ['rel',    numOrStr(r.rel)],
    ['rof',    numOrStr(r.rof)],
    ['damage', numOrStr(r.damage)],
    ['crit',   numOrStr(r.crit)],
    ['blast',  r.blast],
    ['range',  numOrStr(r.range)],
    ['mag',    r.mag],
    ['armor',  r.armor],
    ['weight', r.weight],
    ['price',  numOrStr(r.price)],
    ...(r.slots !== undefined && r.slots !== '' ? [['slots', numOrStr(r.slots)]] : []),
    ...(r.notes !== '' ? [['notes', r.notes]] : []),
  ]
}

// ── GEAR ──────────────────────────────────────────────────────────────────────
function gearItem(r) {
  const isNote = r.name.startsWith('—')           // em-dash note/separator row
  const relEmpty = r.rel.trim() === ''
  const entries = [['name', r.name]]
  if (r.sub !== '') entries.push(['sub', r.sub])
  entries.push(['weight', isNote ? null : r.weight])
  entries.push(['price',  isNote ? null : r.price])
  entries.push(['rel',    isNote ? null : (relEmpty ? null : numOrStr(r.rel))])
  entries.push(['range',  isNote ? null : (r.range.trim() === '' ? null : r.range)])
  entries.push(['effect', r.effect])
  if (r.notes !== '') entries.push(['notes', r.notes])
  return entries
}

// ── ARMOR ─────────────────────────────────────────────────────────────────────
// rating/cost may be numeric ('0','1',300) or carry a marker ('–', '10%'); slots
// is a count. Empty cells stay '' so the reference card hides that pill.
function armorItem(r) {
  return [
    ['name',     r.name],
    ['rating',   numOrStr(r.rating)],
    ['slots',    numOrStr(r.slots)],
    ['weight',   r.weight],
    ['tech',     r.tech],
    ['cost',     numOrStr(r.cost)],
    ['features', r.features],
  ]
}

// ── TALENTS ───────────────────────────────────────────────────────────────────
function talentItem(r) {
  return [
    ['name',   r.name],
    ['type',   r.type],
    ['source', r.source],
    ['effect', r.effect],
  ]
}

// ── emit a data module ────────────────────────────────────────────────────────
const HEADER =
  '// ⚠ GENERATED FILE — DO NOT EDIT BY HAND.\n' +
  '// Source of truth: reference-csv/*.csv. Regenerate with `npm run gen:refs`\n' +
  '// (runs automatically before `npm run dev` and `npm run build`).\n'

function emitModule({ catConst, dataConst, cats, grouped, itemFn }) {
  let s = HEADER + '\n'
  s += `export const ${catConst} = [\n`
  s += cats.map(c => '  ' + obj([['id', c.id], ['label', c.label]]) + ',').join('\n') + '\n]\n\n'
  s += `export const ${dataConst} = {\n`
  s += cats.map(c => {
    const items = grouped[c.id].map(r => '    ' + obj(itemFn(r)) + ',').join('\n')
    return `  ${ident(c.id)}: [\n${items}\n  ],`
  }).join('\n\n') + '\n}\n'
  return s
}

// ── run ───────────────────────────────────────────────────────────────────────
const weaponCats = categoriesFor('weapons')
const gearCats   = categoriesFor('gear')
const armorCats  = categoriesFor('armor')
const talentCats = categoriesFor('talents')
const weaponRows = readRows('weapons.csv')
const gearRows   = readRows('gear.csv')
const armorRows  = readRows('armor.csv')
const talentRows = readRows('talents.csv')

const weaponsOut = emitModule({
  catConst: 'WEAPON_CATEGORIES', dataConst: 'WEAPONS', cats: weaponCats,
  grouped: groupByCategory(weaponRows, weaponCats, 'weapons'), itemFn: weaponItem,
})
const gearOut = emitModule({
  catConst: 'GEAR_CATEGORIES', dataConst: 'GEAR', cats: gearCats,
  grouped: groupByCategory(gearRows, gearCats, 'gear'), itemFn: gearItem,
})
const armorOut = emitModule({
  catConst: 'ARMOR_CATEGORIES', dataConst: 'ARMOR', cats: armorCats,
  grouped: groupByCategory(armorRows, armorCats, 'armor'), itemFn: armorItem,
})
const talentsOut = emitModule({
  catConst: 'TALENT_CATEGORIES', dataConst: 'TALENTS', cats: talentCats,
  grouped: groupByCategory(talentRows, talentCats, 'talents'), itemFn: talentItem,
})

writeFileSync(join(DATA_DIR, 'weapons.js'), weaponsOut)
writeFileSync(join(DATA_DIR, 'gear.js'),    gearOut)
writeFileSync(join(DATA_DIR, 'armor.js'),   armorOut)
writeFileSync(join(DATA_DIR, 'talents.js'), talentsOut)

console.log(`weapons.js  ${weaponRows.length} items / ${weaponCats.length} categories`)
console.log(`gear.js     ${gearRows.length} items / ${gearCats.length} categories`)
console.log(`armor.js    ${armorRows.length} items / ${armorCats.length} categories`)
console.log(`talents.js  ${talentRows.length} items / ${talentCats.length} categories`)
