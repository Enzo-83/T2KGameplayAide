import { useState } from 'react'
import { WEAPON_CATEGORIES, WEAPONS } from '../../data/weapons'

// Stat pill shown on each weapon card
function Stat({ label, value }) {
  if (value === '' || value === null || value === undefined || value === '–') return null
  return (
    <span className="wref-stat">
      <span className="wref-stat-label">{label}</span>
      <span className="wref-stat-value">{value}</span>
    </span>
  )
}

function WeaponCard({ weapon, onAddToSheet }) {
  const hasFireStats = weapon.rof !== '' || weapon.mag !== '' || weapon.blast !== '–'

  return (
    <div className="wref-card">
      <div className="wref-card-top">
        <div className="wref-card-identity">
          <span className="wref-card-name">{weapon.name}</span>
          <span className="wref-card-type">{weapon.type}</span>
          {weapon.ammo && <span className="wref-card-ammo">{weapon.ammo}</span>}
        </div>
        {onAddToSheet && (
          <button className="wref-add-btn" onClick={() => onAddToSheet(weapon)} title="Add to my sheet">
            + Sheet
          </button>
        )}
      </div>

      <div className="wref-stats">
        <Stat label="REL"   value={weapon.rel}    />
        {hasFireStats && <Stat label="ROF"   value={weapon.rof}    />}
        <Stat label="DMG"   value={weapon.damage}  />
        <Stat label="CRIT"  value={weapon.crit}    />
        {weapon.blast !== '–' && <Stat label="BLAST" value={weapon.blast}  />}
        {weapon.range !== '' && <Stat label="RANGE"  value={weapon.range}  />}
        {weapon.mag !== ''   && <Stat label="MAG"    value={weapon.mag}    />}
        <Stat label="ARMOR" value={weapon.armor}   />
        <Stat label="WT"    value={weapon.weight}  />
        {weapon.price !== '–' && weapon.price !== '' && <Stat label="₴" value={weapon.price} />}
      </div>

      {weapon.notes && (
        <p className="wref-card-notes">{weapon.notes}</p>
      )}
    </div>
  )
}

export default function WeaponsReference({ onAddToSheet }) {
  const [activeCat, setActiveCat] = useState('us_military')
  const [search,    setSearch]    = useState('')

  const weapons      = WEAPONS[activeCat] ?? []
  const searchLower  = search.toLowerCase()
  const filtered     = search
    ? weapons.filter(w =>
        w.name.toLowerCase().includes(searchLower) ||
        w.type.toLowerCase().includes(searchLower) ||
        (w.ammo ?? '').toLowerCase().includes(searchLower)
      )
    : weapons

  const catHasData   = WEAPON_CATEGORIES.filter(c => (WEAPONS[c.id] ?? []).length > 0)
  const catEmpty     = WEAPON_CATEGORIES.filter(c => (WEAPONS[c.id] ?? []).length === 0)

  return (
    <div className="wref-root">
      {/* Category tabs */}
      <div className="wref-cats">
        {catHasData.map(c => (
          <button
            key={c.id}
            className={`wref-cat-btn ${activeCat === c.id ? 'wref-cat-btn--active' : ''}`}
            onClick={() => { setActiveCat(c.id); setSearch('') }}
          >
            {c.label}
          </button>
        ))}
        {catEmpty.length > 0 && (
          <span className="wref-cat-placeholder">
            {catEmpty.map(c => c.label).join(', ')} — coming soon
          </span>
        )}
      </div>

      {/* Search */}
      <div className="wref-search-row">
        <input
          className="wref-search"
          type="text"
          placeholder="Search by name, type, or ammo…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="wref-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="hint" style={{ padding: '1.5rem' }}>
          {search ? 'No weapons match your search.' : 'No data yet for this category.'}
        </p>
      ) : (
        <div className="wref-list">
          {filtered.map(w => (
            <WeaponCard
              key={w.name}
              weapon={w}
              onAddToSheet={onAddToSheet}
            />
          ))}
        </div>
      )}
    </div>
  )
}
