import { useState } from 'react'
import { ARMOR_CATEGORIES, ARMOR } from '../../data/armor'

// Stat pill shown on each armor card. Keeps '–' (means "no armor rating") visible,
// only hiding genuinely empty cells.
function Stat({ label, value }) {
  if (value === '' || value === null || value === undefined) return null
  return (
    <span className="wref-stat">
      <span className="wref-stat-label">{label}</span>
      <span className="wref-stat-value">{value}</span>
    </span>
  )
}

function ArmorCard({ item, isMod, onAddToSheet }) {
  return (
    <div className="wref-card">
      <div className="wref-card-top">
        <div className="wref-card-identity">
          <span className="wref-card-name">{item.name}</span>
          {isMod
            ? <span className="wref-card-type">Modification</span>
            : item.tech && <span className="wref-card-type">{item.tech}</span>}
        </div>
        {/* modifications aren't standalone carried items, so no add button there */}
        {onAddToSheet && !isMod && (
          <button className="wref-add-btn" onClick={() => onAddToSheet(item)} title="Add to my sheet">
            + Sheet
          </button>
        )}
      </div>

      <div className="wref-stats">
        {isMod ? (
          <>
            {/* mod weight is a delta (e.g. "-½") and cost a % surcharge */}
            <Stat label="WT"   value={item.weight} />
            <Stat label="Cost" value={item.cost}   />
          </>
        ) : (
          <>
            <Stat label="Rating" value={item.rating} />
            <Stat label="Slots"  value={item.slots}  />
            <Stat label="WT"     value={item.weight} />
            <Stat label="₴"      value={item.cost}   />
          </>
        )}
      </div>

      {item.features && <p className="wref-card-notes">{item.features}</p>}
    </div>
  )
}

export default function ArmorReference({ onAddToSheet }) {
  const [activeCat, setActiveCat] = useState('body')
  const [search,    setSearch]    = useState('')

  const isMod       = activeCat === 'mods'
  const items       = ARMOR[activeCat] ?? []
  const searchLower = search.toLowerCase()
  const filtered    = search
    ? items.filter(a =>
        a.name.toLowerCase().includes(searchLower) ||
        (a.features ?? '').toLowerCase().includes(searchLower) ||
        (a.tech ?? '').toLowerCase().includes(searchLower)
      )
    : items

  return (
    <div className="wref-root">
      {/* Category tabs */}
      <div className="wref-cats">
        {ARMOR_CATEGORIES.map(c => (
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
          placeholder="Search by name or feature…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="wref-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {isMod && (
        <p className="hint" style={{ padding: '0 1rem 0.25rem', fontSize: '0.75rem' }}>
          Modifications are bought as add-ons to an armor. <strong>WT</strong> adjusts the
          armor's weight; <strong>Cost</strong> is a percentage of the base armor price.
        </p>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="hint" style={{ padding: '1.5rem' }}>No armor matches your search.</p>
      ) : (
        <div className="wref-list">
          {filtered.map((a, i) => (
            <ArmorCard key={i} item={a} isMod={isMod} onAddToSheet={onAddToSheet} />
          ))}
        </div>
      )}
    </div>
  )
}
