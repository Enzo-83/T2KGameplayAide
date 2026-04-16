import { useState } from 'react'

// ── Skill definitions matching Version 2 of the Coriolis/T2K sheet ──────────
// Three columns of six, left-to-right as on the paper sheet
const SKILL_COLUMNS = [
  [
    { key: 'force',        label: 'Force',         attr: 'STR' },
    { key: 'heavyWeapons', label: 'Heavy Weapons',  attr: 'STR' },
    { key: 'meleeCombat',  label: 'Melee Combat',   attr: 'STR' },
    { key: 'stamina',      label: 'Stamina',        attr: 'STR' },
    { key: 'dexterity',    label: 'Dexterity',      attr: 'AGI' },
    { key: 'infiltration', label: 'Infiltration',   attr: 'AGI' },
  ],
  [
    { key: 'pilot',        label: 'Pilot',          attr: 'AGI' },
    { key: 'rangedCombat', label: 'Ranged Combat',  attr: 'AGI' },
    { key: 'dataDjinn',    label: 'Data Djinn',     attr: 'WITS' },
    { key: 'medicalAid',   label: 'Medical Aid',    attr: 'WITS' },
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

function RatingDie({ label, attr, data, editable, onChange }) {
  return (
    <div className="cs-rating-die">
      <span className="cs-skill-name">{label}{attr && <span className="cs-attr-tag">({attr})</span>}</span>
      <div className="cs-rd-inputs">
        {editable ? (
          <>
            <input className="cs-input cs-input--sm" value={data.rating} placeholder="Rtg" onChange={e => onChange({ ...data, rating: e.target.value })} />
            <input className="cs-input cs-input--sm" value={data.die}    placeholder="Die" onChange={e => onChange({ ...data, die: e.target.value })} />
          </>
        ) : (
          <>
            <span className="cs-val cs-val--sm">{data.rating || '—'}</span>
            <span className="cs-val cs-val--sm cs-val--die">{data.die || '—'}</span>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CharacterSheet({ character, editable = false, onChange }) {
  function set(path, value) {
    if (!onChange) return
    const keys = path.split('.')
    if (keys.length === 1) {
      onChange({ ...character, [keys[0]]: value })
    } else if (keys.length === 2) {
      onChange({ ...character, [keys[0]]: { ...character[keys[0]], [keys[1]]: value } })
    } else if (keys.length === 3) {
      onChange({
        ...character,
        [keys[0]]: {
          ...character[keys[0]],
          [keys[1]]: { ...character[keys[0]][keys[1]], [keys[2]]: value },
        },
      })
    }
  }

  function setGear(listKey, index, value) {
    if (!onChange) return
    const arr = [...(character[listKey] ?? [])]
    arr[index] = value
    onChange({ ...character, [listKey]: arr })
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

  function addGearSlot(listKey) {
    if (!onChange) return
    onChange({ ...character, [listKey]: [...(character[listKey] ?? []), ''] })
  }

  function removeGearSlot(listKey, index) {
    if (!onChange) return
    onChange({ ...character, [listKey]: (character[listKey] ?? []).filter((_, i) => i !== index) })
  }

  function toggleCondition(key) {
    if (!onChange) return
    onChange({
      ...character,
      conditions: { ...character.conditions, [key]: !character.conditions[key] },
    })
  }

  const c = character

  return (
    <div className="cs-sheet">

      {/* ── Identity ── */}
      <SectionHeader title="Identity" />
      <div className="cs-identity-grid">
        <Field label="Name"                   value={c.name}           editable={editable} onChange={v => set('name', v)} />
        <Field label="Personal Problem"        value={c.personalProblem} editable={editable} onChange={v => set('personalProblem', v)} />
        <Field label="Icon"                   value={c.icon}           editable={editable} onChange={v => set('icon', v)} />
        <Field label="Group Concept & Talent" value={c.groupConcept}   editable={editable} onChange={v => set('groupConcept', v)} />
      </div>

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
                onChange={v => set(`skills.${key}`, v)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Talents ── */}
      <SectionHeader title="Talents" />
      <div className="cs-talents">
        {editable
          ? <textarea className="cs-textarea" rows={3} value={c.talents} onChange={e => set('talents', e.target.value)} placeholder="List talents here…" />
          : <p className="cs-text-block">{c.talents || <span className="cs-empty">—</span>}</p>
        }
      </div>

      {/* ── Combat ── */}
      <SectionHeader title="Combat" />
      <div className="cs-combat">
        <div className="cs-combat-stats">
          <Field label="Hit Capacity"       value={c.hitCapacity}       editable={editable} onChange={v => set('hitCapacity', v)} />
          <Field label="Stress Capacity"    value={c.stressCapacity}    editable={editable} onChange={v => set('stressCapacity', v)} />
          <Field label="Coolness Under Fire" value={c.coolnessUnderFire} editable={editable} onChange={v => set('coolnessUnderFire', v)} />
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

      {/* ── Gear ── */}
      <SectionHeader title="Gear" />
      <div className="cs-gear">
        <div className="cs-gear-list">
          <span className="cs-field-label">Combat Gear</span>
          <div className="cs-gear-slots">
            {c.combatGear.map((item, i) => (
              <div key={i} className="cs-gear-slot">
                <span className="cs-slot-num">{i + 1}</span>
                {editable
                  ? <input className="cs-input cs-input--gear" value={item} onChange={e => setGear('combatGear', i, e.target.value)} />
                  : <span className="cs-val">{item || <span className="cs-empty">—</span>}</span>
                }
                {editable && (
                  <button className="cs-remove-btn" onClick={() => removeGearSlot('combatGear', i)} title="Remove slot">×</button>
                )}
              </div>
            ))}
          </div>
          {editable && (
            <button className="cs-add-row-btn" onClick={() => addGearSlot('combatGear')}>+ Add Slot</button>
          )}
        </div>

        <div className="cs-gear-list">
          <span className="cs-field-label">Backpack</span>
          <div className="cs-gear-slots">
            {c.backpack.map((item, i) => (
              <div key={i} className="cs-gear-slot">
                <span className="cs-slot-num">{i + 1}</span>
                {editable
                  ? <input className="cs-input cs-input--gear" value={item} onChange={e => setGear('backpack', i, e.target.value)} />
                  : <span className="cs-val">{item || <span className="cs-empty">—</span>}</span>
                }
                {editable && (
                  <button className="cs-remove-btn" onClick={() => removeGearSlot('backpack', i)} title="Remove slot">×</button>
                )}
              </div>
            ))}
          </div>
          {editable && (
            <button className="cs-add-row-btn" onClick={() => addGearSlot('backpack')}>+ Add Slot</button>
          )}
        </div>
      </div>

      <div className="cs-gear-extras">
        <Field label="Tiny Items"    value={c.tinyItems}    editable={editable} onChange={v => set('tinyItems', v)} />
        <Field label="Cabin Storage" value={c.cabinStorage} editable={editable} onChange={v => set('cabinStorage', v)} />
      </div>

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
