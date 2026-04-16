import { useState } from 'react'
import { GEAR_CATEGORIES, GEAR } from '../../data/gear'

function StatPill({ label, value }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <span className="wref-stat">
      <span className="wref-stat-label">{label}</span>
      <span className="wref-stat-value">{value}</span>
    </span>
  )
}

function GearCard({ item, onAddToSheet }) {
  // Note-only rows (like the comms range note) — render as a plain hint
  if (item.price === null && item.weight === null && item.name.startsWith('—')) {
    return <p className="gear-note">{item.effect}</p>
  }

  return (
    <div className="wref-card">
      <div className="wref-card-top">
        <div className="wref-card-identity">
          <span className="wref-card-name">{item.name}</span>
          {item.sub && <span className="wref-card-type">{item.sub}</span>}
        </div>
        {onAddToSheet && (
          <div className="gear-add-btns">
            <button className="wref-add-btn gear-add-btn--cg"  onClick={() => onAddToSheet(item, 'combatGear')} title="Add to Combat Gear">+ CG</button>
            <button className="wref-add-btn gear-add-btn--bp"  onClick={() => onAddToSheet(item, 'backpack')}   title="Add to Backpack">+ BP</button>
          </div>
        )}
      </div>

      <div className="wref-stats">
        <StatPill label="WT"    value={item.weight} />
        <StatPill label="₴"     value={item.price}  />
        <StatPill label="REL"   value={item.rel}    />
        <StatPill label="RANGE" value={item.range ? `${item.range} km` : null} />
      </div>

      <p className="gear-card-effect">{item.effect}</p>
    </div>
  )
}

export default function GearReference({ onAddToSheet }) {
  const [activeCat, setActiveCat] = useState('weapons_gear')
  const [search,    setSearch]    = useState('')

  const items       = GEAR[activeCat] ?? []
  const searchLower = search.toLowerCase()
  const filtered    = search
    ? items.filter(g =>
        g.name.toLowerCase().includes(searchLower) ||
        (g.sub  ?? '').toLowerCase().includes(searchLower) ||
        (g.effect ?? '').toLowerCase().includes(searchLower)
      )
    : items

  return (
    <div className="wref-root">
      {/* Category tabs */}
      <div className="wref-cats">
        {GEAR_CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`wref-cat-btn ${activeCat === c.id ? 'wref-cat-btn--active' : ''}`}
            onClick={() => { setActiveCat(c.id); setSearch('') }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="wref-search-row">
        <input
          className="wref-search"
          type="text"
          placeholder="Search by name or effect…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="wref-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Player hint */}
      {onAddToSheet && (
        <p className="hint" style={{ padding: '0 1rem 0.25rem', fontSize: '0.75rem' }}>
          <strong>CG</strong> = Combat Gear slot &nbsp;·&nbsp; <strong>BP</strong> = Backpack slot
        </p>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="hint" style={{ padding: '1.5rem' }}>No items match your search.</p>
      ) : (
        <div className="wref-list">
          {filtered.map((g, i) => (
            <GearCard key={i} item={g} onAddToSheet={onAddToSheet} />
          ))}
        </div>
      )}
    </div>
  )
}
