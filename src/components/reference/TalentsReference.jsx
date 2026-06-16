import { useState } from 'react'
import { TALENT_CATEGORIES, TALENTS } from '../../data/talents'

function TalentCard({ talent, showType }) {
  return (
    <div className="wref-card">
      <div className="wref-card-top">
        <div className="wref-card-identity">
          <span className="wref-card-name">{talent.name}</span>
          {/* type only adds info in Cyberware & Bioware (Body / Accessory); elsewhere it
              just echoes the category, so it's hidden there */}
          {showType && talent.type && <span className="wref-card-type">{talent.type}</span>}
          {talent.source && <span className="wref-card-ammo">{talent.source}</span>}
        </div>
      </div>
      <p className="talent-effect">{talent.effect}</p>
    </div>
  )
}

export default function TalentsReference() {
  const [activeCat, setActiveCat] = useState('general')
  const [search,    setSearch]    = useState('')

  const showType    = activeCat === 'cyber_bio'
  const items       = TALENTS[activeCat] ?? []
  const searchLower = search.toLowerCase()
  const filtered    = search
    ? items.filter(t =>
        t.name.toLowerCase().includes(searchLower) ||
        (t.type   ?? '').toLowerCase().includes(searchLower) ||
        (t.source ?? '').toLowerCase().includes(searchLower) ||
        (t.effect ?? '').toLowerCase().includes(searchLower)
      )
    : items

  return (
    <div className="wref-root">
      {/* Category tabs */}
      <div className="wref-cats">
        {TALENT_CATEGORIES.map(c => (
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
          placeholder="Search by name, source, or effect…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="wref-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="hint" style={{ padding: '1.5rem' }}>No talents match your search.</p>
      ) : (
        <div className="wref-list">
          {filtered.map((t, i) => (
            <TalentCard key={i} talent={t} showType={showType} />
          ))}
        </div>
      )}
    </div>
  )
}
