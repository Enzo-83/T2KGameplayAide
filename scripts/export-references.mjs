// One-time / repeatable export of the weapons & gear reference data to CSV.
//
//   node scripts/export-references.mjs
//
// Writes UTF-8 (with BOM, so Excel renders × ½ ¼ – correctly):
//   reference-csv/weapons.csv
//   reference-csv/gear.csv
//
// Column order is the canonical import order (see import-references, when added).
// `category` holds the object key from WEAPONS / GEAR (e.g. "us_military").
// Separator/note rows (name starts with "—") are exported verbatim for fidelity.

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { WEAPONS, WEAPON_CATEGORIES } from '../src/data/weapons.js'
import { GEAR,    GEAR_CATEGORIES }   from '../src/data/gear.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = join(__dirname, '..', 'reference-csv')

const WEAPON_COLS   = ['category', 'name', 'type', 'ammo', 'rel', 'rof', 'damage', 'crit', 'blast', 'range', 'mag', 'armor', 'weight', 'price', 'notes']
const GEAR_COLS     = ['category', 'name', 'sub', 'weight', 'price', 'rel', 'range', 'effect', 'notes']
const CATEGORY_COLS = ['dataset', 'id', 'label']

// ── CSV helpers ───────────────────────────────────────────────────────────────
function csvCell(v) {
  if (v == null) return ''                       // null / undefined → empty
  const s = String(v)
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}
function toCsv(cols, rows) {
  const lines = [cols.join(',')]
  for (const r of rows) lines.push(cols.map(c => csvCell(r[c])).join(','))
  return '﻿' + lines.join('\r\n') + '\r\n'   // BOM + CRLF for Excel
}

// Flatten a category-keyed object ({ catId: [item, ...] }) into rows that carry
// their category id, preserving source order.
function flatten(byCategory) {
  const rows = []
  for (const category of Object.keys(byCategory)) {
    for (const item of byCategory[category]) rows.push({ category, ...item })
  }
  return rows
}

// ── Run ───────────────────────────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true })

const weaponRows = flatten(WEAPONS)
const gearRows   = flatten(GEAR)
const categoryRows = [
  ...WEAPON_CATEGORIES.map(c => ({ dataset: 'weapons', id: c.id, label: c.label })),
  ...GEAR_CATEGORIES.map(c   => ({ dataset: 'gear',    id: c.id, label: c.label })),
]

writeFileSync(join(OUT_DIR, 'weapons.csv'),    toCsv(WEAPON_COLS,   weaponRows))
writeFileSync(join(OUT_DIR, 'gear.csv'),       toCsv(GEAR_COLS,     gearRows))
writeFileSync(join(OUT_DIR, 'categories.csv'), toCsv(CATEGORY_COLS, categoryRows))

console.log(`weapons.csv     ${weaponRows.length} rows across ${Object.keys(WEAPONS).length} categories`)
console.log(`gear.csv        ${gearRows.length} rows across ${Object.keys(GEAR).length} categories`)
console.log(`categories.csv  ${categoryRows.length} rows`)
console.log(`→ ${OUT_DIR}`)
