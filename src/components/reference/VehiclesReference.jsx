import { useState } from 'react'
import { VEHICLE_CATEGORIES, VEHICLES } from '../../data/vehicles'

const AMPHIBIOUS_LABEL = {
  prep:   '★ Amphibious (prep)',
  always: '★★ Amphibious',
}

function VehicleCard({ v }) {
  const hasArmor   = v.armorF !== null
  const hasFuel    = v.fuelType !== null
  const hasWeapon  = v.mainWeapon || v.secWeapon
  const modeLabel  = v.combatSpeed.includes('T') ? 'Tracked' : v.combatSpeed.includes('W') ? 'Wheeled' : 'Water'

  return (
    <div className="vcl-card">
      {/* Header */}
      <div className="vcl-header">
        <div className="vcl-title-row">
          <span className="vcl-name">{v.name}</span>
          <span className="wref-card-type">{v.type}</span>
          <span className="wref-card-type vcl-mode">{modeLabel}</span>
          {v.rel !== null && <span className="wref-card-type">REL {v.rel}</span>}
          {v.amphibious && <span className="vcl-amph-badge">{AMPHIBIOUS_LABEL[v.amphibious]}</span>}
        </div>
      </div>

      {/* Speed & Armor */}
      <div className="vcl-stat-rows">
        <div className="vcl-stat-group">
          <span className="vcl-stat-title">Speed (on/off)</span>
          <div className="vcl-stat-pair">
            <span className="wref-stat"><span className="wref-stat-label">Combat</span><span className="wref-stat-value">{v.combatSpeed.replace(/ [WT]$/, '')}</span></span>
            <span className="wref-stat"><span className="wref-stat-label">Travel</span><span className="wref-stat-value">{v.travelSpeed}</span></span>
          </div>
        </div>

        {hasArmor && (
          <div className="vcl-stat-group">
            <span className="vcl-stat-title">Armor</span>
            <div className="vcl-stat-pair">
              <span className="wref-stat"><span className="wref-stat-label">Front</span><span className="wref-stat-value">{v.armorF}</span></span>
              <span className="wref-stat"><span className="wref-stat-label">Side</span><span className="wref-stat-value">{v.armorS}</span></span>
              <span className="wref-stat"><span className="wref-stat-label">Rear</span><span className="wref-stat-value">{v.armorR}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* Logistics */}
      <div className="vcl-stat-rows">
        {hasFuel && (
          <div className="vcl-stat-group">
            <span className="vcl-stat-title">Fuel</span>
            <div className="vcl-stat-pair">
              <span className="wref-stat"><span className="wref-stat-label">Type</span><span className="wref-stat-value">{v.fuelType}</span></span>
              <span className="wref-stat"><span className="wref-stat-label">Cap (L)</span><span className="wref-stat-value">{v.fuelCap}</span></span>
              <span className="wref-stat"><span className="wref-stat-label">Cons</span><span className="wref-stat-value">{v.fuelCons} L/hex</span></span>
            </div>
          </div>
        )}
        <div className="vcl-stat-group">
          <span className="vcl-stat-title">Capacity</span>
          <div className="vcl-stat-pair">
            <span className="wref-stat"><span className="wref-stat-label">Crew</span><span className="wref-stat-value">{v.crew}</span></span>
            <span className="wref-stat"><span className="wref-stat-label">Cargo</span><span className="wref-stat-value">{v.cargo} enc</span></span>
            <span className="wref-stat"><span className="wref-stat-label">₴</span><span className="wref-stat-value">{v.price.toLocaleString()}</span></span>
          </div>
        </div>
      </div>

      {/* Weapons */}
      {hasWeapon && (
        <div className="vcl-weapons">
          {v.mainWeapon && <p className="vcl-weapon-line"><span className="vcl-weapon-label">Main:</span> {v.mainWeapon}</p>}
          {v.secWeapon  && <p className="vcl-weapon-line"><span className="vcl-weapon-label">Sec:</span>  {v.secWeapon}</p>}
        </div>
      )}

      {/* Notes */}
      {v.notes && <p className="wref-card-notes">{v.notes}</p>}
    </div>
  )
}

export default function VehiclesReference() {
  const [activeCat, setActiveCat] = useState('civilian')
  const [search,    setSearch]    = useState('')

  const vehicles    = VEHICLES[activeCat] ?? []
  const searchLower = search.toLowerCase()
  const filtered    = search
    ? vehicles.filter(v =>
        v.name.toLowerCase().includes(searchLower) ||
        v.type.toLowerCase().includes(searchLower)
      )
    : vehicles

  return (
    <div className="wref-root">
      <div className="wref-cats">
        {VEHICLE_CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`wref-cat-btn ${activeCat === c.id ? 'wref-cat-btn--active' : ''}`}
            onClick={() => { setActiveCat(c.id); setSearch('') }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="wref-search-row">
        <input
          className="wref-search"
          type="text"
          placeholder="Search by name or type…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="wref-search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      {filtered.length === 0 ? (
        <p className="hint" style={{ padding: '1.5rem' }}>No vehicles match your search.</p>
      ) : (
        <div className="vcl-list">
          {filtered.map(v => <VehicleCard key={v.name} v={v} />)}
        </div>
      )}
    </div>
  )
}
