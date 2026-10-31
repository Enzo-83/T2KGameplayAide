// ── Coriolis → Twilight 2000 homebrew rules, v2 ──────────────────────────────
// Character-creation constants and helpers taken from the referee's
// "Coriolis to Twilight 2000 Rules v2" document. Kept in one place so the
// sheet, the creation checker and any future screens agree.

// Ranks D (lowest) → A (highest). Skills may also be untrained (blank / "F").
export const RANKS = ['D', 'C', 'B', 'A']
export const RANK_DIE = { D: 'D6', C: 'D8', B: 'D10', A: 'D12' }
export const DIE_RANK = { D6: 'D', D8: 'C', D10: 'B', D12: 'A' }
export const RANK_SIZE = { D: 6, C: 8, B: 10, A: 12 }

// Normalise whatever is stored on a {rating, die} pair into a rank letter.
// Handles v2 data ("C"), legacy die-only data ("D8"/"d8") and legacy Coriolis
// numeric ratings (1–2 → D, 3 → C, 4 → B, 5 → A, per the v2 conversion note).
export function rankOf(entry) {
  if (!entry) return ''
  const r = String(entry.rating ?? '').trim().toUpperCase()
  if (RANKS.includes(r)) return r
  const d = String(entry.die ?? '').trim().toUpperCase().replace(/^(\d)/, 'D$1')
  if (DIE_RANK[d]) return DIE_RANK[d]
  const n = parseInt(r, 10)
  if (n >= 1 && n <= 2) return 'D'
  if (n === 3) return 'C'
  if (n === 4) return 'B'
  if (n >= 5) return 'A'
  return ''
}

// Skills marked (A) in v2: cannot be used, or used to help, when untrained.
export const ADVANCED_SKILLS = new Set([
  'heavyWeapons', 'pilot', 'dataDjinn', 'science', 'technology', 'culture', 'mysticPowers',
])

// Hit Capacity = (STR die + AGI die) / 4, round up. Stress = (WIT + EMP) / 4.
export function capacity(a, b) {
  const ra = rankOf(a), rb = rankOf(b)
  if (!ra || !rb) return ''
  return String(Math.ceil((RANK_SIZE[ra] + RANK_SIZE[rb]) / 4))
}

// ── Archetypes (technical recommendations from the v2 document) ──────────────
export const ARCHETYPES = [
  { key: 'artist',      label: 'Artist',      attr: 'Empathy',  cuf: 'D', skills: ['Culture', 'Persuasion'],
    subs: { Courtesan: ['Mobility', 'Observation', 'Survival'], Musician: ['Observation', 'Mobility', 'Stamina'], Noble: ['Observation', 'Pilot', 'Ranged Combat'] } },
  { key: 'dataSpider',  label: 'Data Spider', attr: 'Wits',     cuf: 'D', skills: ['Data Djinn', 'Persuasion'],
    subs: { Analyst: ['Culture', 'Science', 'Infiltration'], Correspondent: ['Culture', 'Observation', 'Infiltration'], 'Data Djinn': ['Observation', 'Science', 'Technology'] } },
  { key: 'fugitive',    label: 'Fugitive',    attr: 'Empathy',  cuf: 'D', skills: ['Observation', 'Infiltration'],
    subs: { Criminal: ['Force', 'Melee Combat', 'Mobility'], Mystic: ['Mystic Powers', 'Persuasion', 'Mobility'], Revolutionary: ['Ranged Combat', 'Stamina', 'Survival'] } },
  { key: 'negotiator',  label: 'Negotiator',  attr: 'Empathy',  cuf: 'D', skills: ['Persuasion', 'Culture'],
    subs: { Agitator: ['Data Djinn', 'Force', 'Observation'], Diplomat: ['Command', 'Observation', 'Melee Combat'], Trader: ['Observation', 'Pilot', 'Survival'] } },
  { key: 'operative',   label: 'Operative',   attr: 'Agility',  cuf: 'B', skills: ['Observation', 'Mobility'],
    subs: { Assassin: ['Melee Combat', 'Ranged Combat', 'Infiltration'], Bodyguard: ['Force', 'Ranged Combat', 'Melee Combat'], Spy: ['Persuasion', 'Data Djinn', 'Ranged Combat'] } },
  { key: 'pilot',       label: 'Pilot',       attr: 'Agility',  cuf: 'C', skills: ['Pilot', 'Technology'],
    subs: { Driver: ['Stamina', 'Ranged Combat', 'Survival'], Fighter: ['Heavy Weapons', 'Data Djinn', 'Technology'], Freighter: ['Data Djinn', 'Technology', 'Force'] } },
  { key: 'preacher',    label: 'Preacher',    attr: 'Empathy',  cuf: 'D', skills: ['Culture', 'Persuasion'],
    subs: { Ascetic: ['Mobility', 'Science', 'Stamina'], Missionary: ['Medicurgy', 'Stamina', 'Survival'], Prophet: ['Observation', 'Stamina'] } },
  { key: 'scientist',   label: 'Scientist',   attr: 'Wits',     cuf: 'D', skills: ['Science', 'Observation'],
    subs: { Archaeologist: ['Culture', 'Survival', 'Technology'], Medicurg: ['Medicurgy', 'Persuasion', 'Mobility'], Engineer: ['Data Djinn', 'Technology', 'Force'] } },
  { key: 'shipWorker',  label: 'Ship Worker', attr: 'Strength', cuf: 'D', skills: ['Force', 'Stamina'],
    subs: { Deckhand: ['Melee Combat', 'Mobility', 'Technology'], Dockworker: ['Mobility', 'Persuasion', 'Technology'], Technician: ['Data Djinn', 'Observation', 'Technology'] } },
  { key: 'soldier',     label: 'Soldier',     attr: 'Agility',  cuf: 'B', skills: ['Ranged Combat', 'Melee Combat'],
    subs: { Legionnaire: ['Force', 'Survival', 'Stamina'], Mercenary: ['Mobility', 'Observation', 'Stamina'], Officer: ['Command', 'Culture', 'Persuasion'] } },
  { key: 'trailblazer', label: 'Trailblazer', attr: 'Wits',     cuf: 'C', skills: ['Survival', 'Observation'],
    subs: { Colonist: ['Stamina', 'Mobility', 'Ranged Combat'], Prospector: ['Pilot', 'Science', 'Technology'], Scout: ['Infiltration', 'Mobility', 'Ranged Combat'] } },
]
export const ARCHETYPE_BY_KEY = Object.fromEntries(ARCHETYPES.map(a => [a.key, a]))

// ── Creation budget check ────────────────────────────────────────────────────
// Attributes: all start at C, 3 increases (one step each), optionally drop ONE
// attribute to D for a 4th increase. Skills: one B, two C, three D.
export function attributeBudget(attributes) {
  const ranks = ['str', 'agi', 'wit', 'emp'].map(k => rankOf(attributes?.[k]))
  if (ranks.some(r => !r)) return { complete: false, ok: false, msg: 'Set all four attributes.' }
  const lowered = ranks.filter(r => r === 'D').length
  const spent = ranks.reduce((s, r) => s + Math.max(0, RANKS.indexOf(r) - 1), 0)
  const allowed = 3 + (lowered === 1 ? 1 : 0)
  if (lowered > 1) return { complete: true, ok: false, msg: `Only one attribute may be lowered to D (you have ${lowered}).` }
  if (spent !== allowed) return { complete: true, ok: false, msg: `Attribute increases used: ${spent} of ${allowed}.` }
  return { complete: true, ok: true, msg: `Attribute increases used: ${spent} of ${allowed}.` }
}

export function skillBudget(skills) {
  const count = { A: 0, B: 0, C: 0, D: 0 }
  for (const v of Object.values(skills || {})) {
    const r = rankOf(v)
    if (r) count[r]++
  }
  const want = { A: 0, B: 1, C: 2, D: 3 }
  const ok = RANKS.every(r => count[r] === want[r])
  const msg = `Skills: B ${count.B}/1 · C ${count.C}/2 · D ${count.D}/3` + (count.A ? ` · A ${count.A}/0` : '')
  return { ok, msg }
}

// XP cost to reach each skill rank, and the flat talent cost.
export const SKILL_XP = { D: 5, C: 10, B: 15, A: 20 }
export const TALENT_XP = 10
