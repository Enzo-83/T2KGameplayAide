# Reference data (source of truth)

These CSVs are the **canonical** reference data (weapons, gear, armor, talents).
The app's `src/data/{weapons,gear,armor,talents}.js` are **generated** from them —
do not edit those `.js` files by hand (they carry a "GENERATED" header and get
overwritten).

## Editing workflow

1. Open `weapons.csv`, `gear.csv`, or `categories.csv` in Excel / Google Sheets /
   any editor. Save as **UTF-8 CSV** (keep the `× ½ ¼ –` characters intact).
2. Regenerate the data modules:
   ```
   npm run gen:refs
   ```
   (This also runs automatically before `npm run dev` and `npm run build`, so a
   plain `npm run dev` already picks up CSV edits.)
3. `git diff` to review, `npm run lint` / `npm run build` to confirm, then commit.

To re-derive the CSVs from the current `.js` (e.g. a one-time baseline), run
`npm run export:refs` — it overwrites these CSVs from `src/data/*.js`.

## Files & columns

- **`categories.csv`** — `dataset, id, label`. Defines which categories exist,
  their display label, and their **order** (tabs render in this order). A
  category with no item rows still shows (weapons show it as "coming soon").
  `dataset` is `weapons` or `gear`. Add a category here before using its `id` in
  the row CSVs.
- **`weapons.csv`** — `category, name, type, ammo, rel, rof, damage, crit, blast,
  range, mag, armor, weight, price, slots, notes`.
- **`gear.csv`** — `category, name, sub, weight, price, rel, range, effect, notes`.
- **`armor.csv`** — `category, name, rating, slots, weight, tech, cost, features`.
  `rating` is the Armor Rating (`–` = no rating, e.g. a helmet); `slots` is the
  number of Modifications it can take; `cost` is ₴ for items and a **percentage**
  surcharge for `mods` rows. The `mods` category comes from the Referee's separate
  "Armor Features" sheet and lists add-ons (its `weight` is a delta, e.g. `-½`).
- **`talents.csv`** — `category, name, type, source, effect`. `category` is the
  talent's section (General, the five profession groups, Icon, Cyberware & Bioware,
  Mystic Powers); `source` is the rulebook it comes from; `type` is only surfaced
  in the app for Cyberware & Bioware (Body vs Accessory).

`category` must match an `id` from `categories.csv`. Leave a cell blank for
"none"; commas/quotes in a cell are fine (standard CSV quoting).

## Field conventions (from the T2K 4e rulebook)

- **weight** drives encumbrance in the character sheet's inventory grid. Use
  quarter-unit notation: `¼ ½ ¾ 1 2 3 …`, `0`/blank = weightless (→ Tiny Items),
  `—` = bulk/liquid. Items over ~4 units route to Cabin/Stash. Keep it parseable
  or the block won't size correctly.
- **blast** — `–` none, or `D`/`C`/`B`/`A` radius class (`Fire B` etc. allowed).
- **armor** — `+1`/`+2` (easier to hit), `0` none, `–1`/`–2` (harder).
- **mag** — a `*` suffix denotes an ammo belt (one encumbrance unit).
- **slots** — number of modification/feature slots on the weapon: how many add-on
  features (scope, suppressor, etc.) can be bought and fitted to it. Blank = none.
- **category mapping (inventory picker colors/buckets):** a gear `category` id
  that the inventory builder doesn't recognize falls back to the generic *Tools*
  color, and a weapon `type` it doesn't recognize is treated as a *Firearm*. If
  you add Coriolis-flavoured categories/types, tell the dev so the mapping in
  `src/data/inventory.js` (`GEAR_CAT` / `weaponCat`) gets a matching entry.
- A row whose **name starts with `—`** (em dash) is treated as a note/separator:
  it's shown as a plain caption in the reference list and skipped by the
  inventory picker.
