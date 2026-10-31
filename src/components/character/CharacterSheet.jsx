import { useState } from 'react'
import InventoryGrid from './InventoryGrid'
import {
  RANKS, RANK_DIE, rankOf, ADVANCED_SKILLS, capacity,
  ARCHETYPES, ARCHETYPE_BY_KEY, attributeBudget, skillBudget, SKILL_XP, TALENT_XP,
} from '../../data/rulesV2'

// ── Skill definitions matching Version 2 of the Coriolis/T2K sheet ──────────
// Three columns of six, left-to-right as on the paper sheet
const SKILL_COLUMNS = [
  [
    { key: 'force',        label: 'Force',         attr: 'STR' },
    { key: 'heavyWeapons', label: 'Heavy Weapons',  attr: 'STR' },
    { key: 'meleeCombat',  label: 'Melee Combat',   attr: 'STR' },
    { key: 'stamina',      label: 'Stamina',        attr: 'STR' },
    { key: 'dexterity',    label: 'Mobility',       attr: 'AGI' }, // displayed as "Mobility"; data key stays `dexterity` for back-compat
    { key: 'infiltration', label: 'Infiltration',   attr: 'AGI' },
  ],
  [
    { key: 'pilot',        label: 'Pilot',          attr: 'AGI' },
    { key: 'rangedCombat', label: 'Ranged Combat',  attr: 'AGI' },
    { key: 'dataDjinn',    label: 'Data Djinn',     attr: 'WITS' },
    { key: 'medicalAid',   label: 'Medicurgy',      attr: 'WITS' }, // v2 name; data key kept for back-compat
    { key: 'observation',  label: 'Observation',    attr: 'WITS' },
    { key: 'science',      label: 'Science',        attr: 'WITS' },
  ],
  [
    { key: 'survival',     label: 'Survival',       attr: 'WITS' },
    { key: 'technology',   label: 'Technology',     attr: 'WITS' },
    { key: 'command',      label: 'Command',        attr: 'EMP' },
    { key: 'culture',      label: 'Culture',        attr: 'EMP' },
    { key: 'mysticPowers', label: 'Mystic Powers',  attr: 'EMP' },
    { key: 'persuasion',   label: 'Persuasion',     attr: 'EMP' },
  ],
]

const WEAPON_COLS = ['REL','ROF','DMG','CRIT','BLAST','RANGE','MAG','ARMOR','WT','AMMO']
const WEAPON_KEYS = ['rel','rof','damage','crit','blast','range','mag','armor','weight','spentAmmo']

const CONDITIONS = [
  { key: 'starving',      label: 'Starving' },
  { key: 'dehydrated',    label: 'Dehydrated' },
  { key: 'sleepDeprived', label: 'Sleep Deprived' },
  { key: 'hypothermic',   label: 'Hypothermic' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title }) {
  return <div className="cs-section-header">{title}</div>
}

function ViewVal({ value, placeholder = '—' }) {
  return <span className="cs-val">{value || placeholder}</span>
}

function Field({ label, value, editable, onChange, type = 'text', placeholder = '' }) {
  return (
    <div className="cs-field">
      <span className="cs-field-label">{label}</span>
      {editable
        ? <input className="cs-input" type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
        : <ViewVal value={value} />
      }
    </div>
  )
}

// Rank picker for v2: D–A ranks map to D6–D12. Skills can be left untrained.
// Legacy values that don't map to a rank are shown as a hint so nothing is lost.
function RatingDie({ label, attr, data, editable, onChange, advanced = false, untrainedLabel = '—', highlight = false }) {
  const rank = rankOf(data)
  const legacy = !rank && (data?.rating || data?.die) ? [data.rating, data.die].filter(Boolean).join(' / ') : ''
  return (
    <div className={`cs-rating-die ${highlight ? 'cs-rating-die--key' : ''}`} title={legacy ? `Old value: ${legacy}` : undefined}>
      <span className="cs-skill-name">
        {label}
        {attr && <span className="cs-attr-tag">({attr})</span>}
        {advanced && <span className="cs-adv-tag" title="Advanced skill: cannot be used or used to assist when untrained">A</span>}
      </span>
      <div className="cs-rd-inputs">
        {editable ? (
          <select
            className="cs-input cs-rank-select"
            value={rank}
            onChange={e => {
              const r = e.target.value
              onChange({ ...data, rating: r, die: RANK_DIE[r] || '' })
            }}
          >
            <option value="">{legacy ? `(${legacy})` : untrainedLabel}</option>
            {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        ) : (
          <span className="cs-val cs-val--sm">{rank || legacy || untrainedLabel}</span>
        )}
        <span className="cs-val cs-val--sm cs-val--die">{rank ? RANK_DIE[rank] : ''}</span>
      </div>
    </div>
  )
}

function DerivedStat({ label, value, formula, fallback, editable, onChange }) {
  if (!value) return <Field label={label} value={fallback} editable={editable} onChange={onChange} />
  return (
    <div className="cs-field" title={formula}>
      <span className="cs-field-label">{label} <span className="cs-auto-tag">auto</span></span>
      <span className="cs-val">{value}</span>
    </div>
  )
}

function CreationCheck({ character }) {
  const a = attributeBudget(character.attributes)
  const s = skillBudget(character.skills)
  return (
    <details className="cs-creation-check">
      <summary>
        Character creation check
        <span className={`cs-cc-badge ${a.ok && s.ok ? 'cs-cc-badge--ok' : ''}`}>{a.ok && s.ok ? 'Starting build OK' : 'Review'}</span>
      </summary>
      <ul>
        <li className={a.ok ? 'cs-cc-ok' : 'cs-cc-warn'}>{a.msg} All start at C; three one-step increases; you may drop one attribute to D for a fourth.</li>
        <li className={s.ok ? 'cs-cc-ok' : 'cs-cc-warn'}>{s.msg}</li>
        <li>Starting talents: one Icon, one Group, and one of your choice.</li>
        <li>After creation, attributes can’t be raised. Skill XP: D {SKILL_XP.D} · C {SKILL_XP.C} · B {SKILL_XP.B} · A {SKILL_XP.A}. A new talent costs {TALENT_XP} XP. You must succeed with a skill before you raise it.</li>
      </ul>
    </details>
  )
}

// Collapsible talent pill: shows the name; click to expand the full
// description/mechanics. In edit mode an × removes it.
function TalentPill({ talent, editable, onRemove }) {
  const [open, setOpen] = useState(false)
  const meta = [talent.type, talent.source].filter(Boolean).join(' · ')
  return (
    <div className={`cs-talent-pill ${open ? 'cs-talent-pill--open' : ''}`}>
      <div className="cs-talent-pill-head">
        <button type="button" className="cs-talent-pill-name" onClick={() => setOpen(o => !o)} title="Show details">
          <span className="cs-talent-pill-caret">{open ? '▾' : '▸'}</span>
          {talent.name}
        </button>
        {editable && <button type="button" className="cs-remove-btn" onClick={onRemove} title="Remove talent">×</button>}
      </div>
      {open && (
        <div className="cs-talent-pill-body">
          {meta && <p className="cs-talent-pill-meta">{meta}</p>}
          {talent.effect && <p className="cs-talent-pill-effect">{talent.effect}</p>}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CharacterSheet({ character, editable = false, onChange }) {
  // Functional updates so multiple updates fired in one tick (e.g. an inventory
  // change + an armor-rating bump from installing a mod) compose instead of
  // clobbering each other through a stale `character` closure.
  function set(path, value) {
    if (!onChange) return
    const keys = path.split('.')
    onChange(prev => {
      if (keys.length === 1) return { ...prev, [keys[0]]: value }
      if (keys.length === 2) return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } }
      return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: { ...prev[keys[0]][keys[1]], [keys[2]]: value } } }
    })
  }

  function setWeapon(index, field, value) {
    if (!onChange) return
    const arr = character.weapons.map((w, i) => i === index ? { ...w, [field]: value } : w)
    onChange({ ...character, weapons: arr })
  }

  function addWeaponRow() {
    if (!onChange) return
    onChange({
      ...character,
      weapons: [...character.weapons, { name: '', rel: '', rof: '', damage: '', crit: '', blast: '', range: '', mag: '', armor: '', weight: '', spentAmmo: '' }],
    })
  }

  function removeWeaponRow(index) {
    if (!onChange) return
    onChange({ ...character, weapons: character.weapons.filter((_, i) => i !== index) })
  }

  function removeTalent(index) {
    if (!onChange) return
    onChange({ ...character, talentList: (character.talentList ?? []).filter((_, i) => i !== index) })
  }

  function toggleCondition(key) {
    if (!onChange) return
    onChange({
      ...character,
      conditions: { ...character.conditions, [key]: !character.conditions[key] },
    })
  }

  const c = character
  const arch = ARCHETYPE_BY_KEY[c.archetype]
  const keySkills = new Set(arch ? [...arch.skills, ...(arch.subs[c.archetypeSub] || [])] : [])
  const hitAuto    = capacity(c.attributes.str, c.attributes.agi)
  const stressAuto = capacity(c.attributes.wit, c.attributes.emp)

  function setArchetype(key) {
    if (!onChange) return
    const next = ARCHETYPE_BY_KEY[key]
    onChange(prev => {
      const prevDefault = ARCHETYPE_BY_KEY[prev.archetype]?.cuf
      const keepCuf = prev.coolnessUnderFire && prev.coolnessUnderFire !== prevDefault
      return {
        ...prev,
        archetype: key,
        archetypeSub: '',
        coolnessUnderFire: keepCuf ? prev.coolnessUnderFire : (next?.cuf ?? prev.coolnessUnderFire),
      }
    })
  }

  return (
    <div className="cs-sheet">

      {/* ── Identity ── */}
      <SectionHeader title="Identity" />
      <div className="cs-identity-grid">
        <Field label="Name"                   value={c.name}           editable={editable} onChange={v => set('name', v)} />
        <Field label="Personal Problem"        value={c.personalProblem} editable={editable} onChange={v => set('personalProblem', v)} />
        <Field label="Icon"                   value={c.icon}           editable={editable} onChange={v => set('icon', v)} />
        <Field label="Group Concept & Talent" value={c.groupConcept}   editable={editable} onChange={v => set('groupConcept', v)} />
        <div className="cs-field">
          <span className="cs-field-label">Archetype</span>
          {editable ? (
            <select className="cs-input" value={c.archetype} onChange={e => setArchetype(e.target.value)}>
              <option value="">—</option>
              {ARCHETYPES.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
            </select>
          ) : <ViewVal value={arch?.label} />}
        </div>
        <div className="cs-field">
          <span className="cs-field-label">Sub-type</span>
          {editable ? (
            <select className="cs-input" value={c.archetypeSub} onChange={e => set('archetypeSub', e.target.value)} disabled={!arch}>
              <option value="">—</option>
              {arch && Object.keys(arch.subs).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          ) : <ViewVal value={c.archetypeSub} />}
        </div>
      </div>
      {arch && (
        <p className="cs-arch-hint">
          Key attribute: <strong>{arch.attr}</strong> · Key skills: {arch.skills.join(', ')}
          {c.archetypeSub && arch.subs[c.archetypeSub] ? ` · ${c.archetypeSub}: ${arch.subs[c.archetypeSub].join(', ')}` : ''}
          {' '}· Coolness Under Fire {arch.cuf}
        </p>
      )}

      {/* ── Attributes ── */}
      <SectionHeader title="Attributes" />
      <div className="cs-attributes">
        {[
          { key: 'str', label: 'STRENGTH' },
          { key: 'agi', label: 'AGILITY' },
          { key: 'wit', label: 'WITS' },
          { key: 'emp', label: 'EMPATHY' },
        ].map(({ key, label }) => (
          <RatingDie
            key={key}
            label={label}
            data={c.attributes[key]}
            editable={editable}
            onChange={v => set(`attributes.${key}`, v)}
          />
        ))}
      </div>

      {/* ── Skills ── */}
      <SectionHeader title="Skills" />
      <div className="cs-skills-grid">
        {SKILL_COLUMNS.map((col, ci) => (
          <div key={ci} className="cs-skills-col">
            {col.map(({ key, label, attr }) => (
              <RatingDie
                key={key}
                label={label}
                attr={attr}
                data={c.skills[key]}
                editable={editable}
                advanced={ADVANCED_SKILLS.has(key)}
                untrainedLabel="F"
                highlight={keySkills.has(label)}
                onChange={v => set(`skills.${key}`, v)}
              />
            ))}
          </div>
        ))}
      </div>

      {editable && <CreationCheck character={c} />}

      {/* ── Talents ── */}
      <SectionHeader title="Talents" />
      <div className="cs-talents">
        {(c.talentList ?? []).length > 0 && (
          <div className="cs-talent-pills">
            {c.talentList.map((t, i) => (
              <TalentPill key={`${t.name}-${i}`} talent={t} editable={editable} onRemove={() => removeTalent(i)} />
            ))}
          </div>
        )}
        <span className="cs-field-label cs-talents-notes-label">Other talents / notes</span>
        {editable
          ? <textarea className="cs-textarea" rows={3} value={c.talents} onChange={e => set('talents', e.target.value)} placeholder="Add talents from the Talents tab, or jot notes here…" />
          : <p className="cs-text-block">{c.talents || <span className="cs-empty">{(c.talentList ?? []).length > 0 ? '' : '—'}</span>}</p>
        }
      </div>

      {/* ── Combat ── */}
      <SectionHeader title="Combat" />
      <div className="cs-combat">
        <div className="cs-combat-stats">
          <DerivedStat label="Hit Capacity"    value={hitAuto}    formula="(STR die + AGI die) ÷ 4, round up" fallback={c.hitCapacity}    editable={editable} onChange={v => set('hitCapacity', v)} />
          <DerivedStat label="Stress Capacity" value={stressAuto} formula="(WIT die + EMP die) ÷ 4, round up" fallback={c.stressCapacity} editable={editable} onChange={v => set('stressCapacity', v)} />
          <div className="cs-field">
            <span className="cs-field-label">Coolness Under Fire</span>
            {editable ? (
              <select className="cs-input" value={rankOf({ rating: c.coolnessUnderFire })} onChange={e => set('coolnessUnderFire', e.target.value)}>
                <option value="">{c.coolnessUnderFire && !rankOf({ rating: c.coolnessUnderFire }) ? `(${c.coolnessUnderFire})` : '—'}</option>
                {RANKS.map(r => <option key={r} value={r}>{r} ({RANK_DIE[r]})</option>)}
              </select>
            ) : <ViewVal value={c.coolnessUnderFire && rankOf({ rating: c.coolnessUnderFire }) ? `${rankOf({ rating: c.coolnessUnderFire })} (${RANK_DIE[rankOf({ rating: c.coolnessUnderFire })]})` : c.coolnessUnderFire} />}
          </div>
          <Field label="Unit Morale"        value={c.unitMorale}        editable={editable} onChange={v => set('unitMorale', v)} />
        </div>

        <div className="cs-combat-right">
          <div className="cs-field">
            <span className="cs-field-label">Critical Injuries</span>
            {editable
              ? <textarea className="cs-textarea cs-textarea--sm" rows={3} value={c.criticalInjuries} onChange={e => set('criticalInjuries', e.target.value)} placeholder="List critical injuries…" />
              : <p className="cs-text-block">{c.criticalInjuries || <span className="cs-empty">—</span>}</p>
            }
          </div>
          <Field label="Current Stress"     value={c.stress}    editable={editable} onChange={v => set('stress', v)} />
          <Field label="Radiation / Effects" value={c.radiation} editable={editable} onChange={v => set('radiation', v)} />
        </div>
      </div>

      {/* Armor + Conditions */}
      <div className="cs-armor-cond">
        <div className="cs-armor">
          <span className="cs-field-label">Armor Rating</span>
          <div className="cs-armor-locs">
            {['head','arms','torso','legs'].map(loc => (
              <div key={loc} className="cs-armor-loc">
                <span className="cs-loc-label">{loc.charAt(0).toUpperCase() + loc.slice(1)}</span>
                {editable
                  ? <input className="cs-input cs-input--sm" value={c.armor[loc]} onChange={e => set(`armor.${loc}`, e.target.value)} />
                  : <span className="cs-val">{c.armor[loc] || '—'}</span>
                }
              </div>
            ))}
          </div>
        </div>

        <div className="cs-conditions">
          <span className="cs-field-label">Conditions</span>
          <div className="cs-cond-list">
            {CONDITIONS.map(({ key, label }) => (
              <label key={key} className={`cs-condition ${c.conditions[key] ? 'cs-condition--active' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!c.conditions[key]}
                  onChange={() => toggleCondition(key)}
                  disabled={!editable}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Inventory & Encumbrance (replaces the old gear-slot lists) ── */}
      <SectionHeader title="Inventory & Encumbrance" />
      <InventoryGrid
        character={c}
        value={c.inventory}
        editable={editable}
        onChange={v => set('inventory', v)}
        onArmorBonus={(coverage, delta) => {
          if (!onChange) return
          onChange(prev => {
            const next = { ...prev.armor }
            for (const loc of coverage) {
              const val = Math.max(0, (parseInt(next[loc], 10) || 0) + delta)
              next[loc] = val === 0 ? '' : String(val)
            }
            return { ...prev, armor: next }
          })
        }}
      />

      {/* ── Weapons ── */}
      <SectionHeader title="Weapons" />
      <div className="cs-weapons-wrap">
        <table className="cs-weapons-table">
          <thead>
            <tr>
              <th className="cs-wth cs-wth--name">Weapon</th>
              {WEAPON_COLS.map(col => <th key={col} className="cs-wth">{col}</th>)}
              {editable && <th className="cs-wth cs-wth--del" />}
            </tr>
          </thead>
          <tbody>
            {c.weapons.map((w, i) => (
              <tr key={i}>
                <td>
                  {editable
                    ? <input className="cs-input cs-input--weapon" value={w.name} onChange={e => setWeapon(i, 'name', e.target.value)} placeholder="Name…" />
                    : <span className="cs-val">{w.name || '—'}</span>
                  }
                </td>
                {WEAPON_KEYS.map(fk => (
                  <td key={fk}>
                    {editable
                      ? <input className="cs-input cs-input--weapon-stat" value={w[fk]} onChange={e => setWeapon(i, fk, e.target.value)} />
                      : <span className="cs-val cs-val--center">{w[fk] || '—'}</span>
                    }
                  </td>
                ))}
                {editable && (
                  <td className="cs-wt-del-cell">
                    <button className="cs-remove-btn" onClick={() => removeWeaponRow(i)} title="Remove weapon">×</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {editable && (
          <button className="cs-add-row-btn cs-add-row-btn--weapons" onClick={addWeaponRow}>+ Add Weapon Row</button>
        )}
      </div>

    </div>
  )
}
