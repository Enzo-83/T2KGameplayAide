import { useState } from 'react'
import { saveFOW } from '../../firebase/fogOfWarService'

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['active', 'suppressed', 'incapacitated', 'down']
const STATUS_LABELS  = { active: 'Active', suppressed: 'Suppressed', incapacitated: 'Incapacitated', down: 'Down' }
const FLOOR_OPTIONS  = ['ground', 'upper', 'rooftop']
const COVER_OPTIONS  = ['none', 'partial', 'full']
const LOC_STATES     = ['open', 'blocked', 'breached']

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

// ── CUF Roll Tool ─────────────────────────────────────────────────────────────

function CufRollTool() {
  const [numDice, setNumDice] = useState(3)
  const [result, setResult]   = useState(null)
  const [isFake, setIsFake]   = useState(false)

  function roll(fake = false) {
    // Ammo dice: each die rolls 1–6. A hit (✓) is a 6.
    const rolls = Array.from({ length: numDice }, () => Math.ceil(Math.random() * 6))
    const hits  = rolls.filter(r => r === 6).length
    setResult({ rolls, hits, fake })
    setIsFake(fake)
  }

  return (
    <div className="fow-section">
      <h3 className="fow-section-title">Secret CUF Roll</h3>
      <p className="fow-hint">Roll ammo dice for suppression / blind fire. Result stays on your screen only.</p>

      <div className="fow-cuf-controls">
        <label className="fow-label">Ammo dice</label>
        <div className="fow-cuf-row">
          {[1,2,3,4,5,6].map(n => (
            <button
              key={n}
              className={`fow-dice-btn ${numDice === n ? 'fow-dice-btn--active' : ''}`}
              onClick={() => setNumDice(n)}
            >{n}</button>
          ))}
        </div>
        <div className="fow-cuf-actions">
          <button className="btn btn-secondary fow-btn" onClick={() => roll(false)}>Roll</button>
          <button className="btn fow-btn fow-btn--fake" onClick={() => roll(true)} title="Log a fake roll — for fog of war when no enemy is present">Fake Roll</button>
        </div>
      </div>

      {result && (
        <div className={`fow-cuf-result ${result.hits > 0 ? 'fow-cuf-result--hit' : ''} ${result.fake ? 'fow-cuf-result--fake' : ''}`}>
          {result.fake && <span className="fow-fake-badge">FAKE</span>}
          <div className="fow-dice-results">
            {result.rolls.map((r, i) => (
              <span key={i} className={`fow-die ${r === 6 ? 'fow-die--hit' : ''}`}>{r}</span>
            ))}
          </div>
          <div className="fow-cuf-summary">
            {result.hits > 0
              ? <><strong>{result.hits} hit{result.hits > 1 ? 's' : ''}</strong> — all fighters in target hex must make CUF roll</>
              : <span className="fow-no-hit">No hits — suppression attempt fails</span>
            }
          </div>
        </div>
      )}
    </div>
  )
}

// ── NPC Card ──────────────────────────────────────────────────────────────────

function NpcCard({ npc, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false)

  function upd(field, value) {
    onUpdate(npc.id, field, value)
  }

  return (
    <div className={`fow-npc-card fow-npc-card--${npc.status}`}>
      {/* Header row — always visible */}
      <div className="fow-npc-header">
        <div className="fow-npc-top">
          <input
            className="fow-input fow-input--name"
            value={npc.name}
            placeholder="NPC / Group name"
            onChange={e => upd('name', e.target.value)}
          />
          <span className={`fow-status-badge fow-status-badge--${npc.status}`}>
            {STATUS_LABELS[npc.status]}
          </span>
          <button className="fow-expand-btn" onClick={() => setExpanded(x => !x)}>
            {expanded ? '▲' : '▼'}
          </button>
          <button className="icon-btn icon-btn--danger" onClick={() => onRemove(npc.id)}>✕</button>
        </div>

        {/* Quick status row */}
        <div className="fow-status-row">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              className={`fow-status-btn fow-status-btn--${s} ${npc.status === s ? 'fow-status-btn--active' : ''}`}
              onClick={() => upd('status', s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="fow-npc-detail">
          <div className="fow-npc-row">
            <label className="fow-label">Location</label>
            <input className="fow-input" value={npc.location} placeholder="e.g. Sector A, ground floor" onChange={e => upd('location', e.target.value)} />
          </div>

          <div className="fow-npc-row fow-npc-row--inline">
            <div>
              <label className="fow-label">Floor</label>
              <select className="fow-select" value={npc.floor} onChange={e => upd('floor', e.target.value)}>
                {FLOOR_OPTIONS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="fow-label">Cover</label>
              <select className="fow-select" value={npc.cover} onChange={e => upd('cover', e.target.value)}>
                {COVER_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="fow-npc-row">
            <label className="fow-label">Overwatch target</label>
            <input className="fow-input" value={npc.overwatch} placeholder="e.g. Door to Sector B (none if not on overwatch)" onChange={e => upd('overwatch', e.target.value)} />
          </div>

          <div className="fow-npc-row">
            <label className="fow-label">Notes</label>
            <textarea className="fow-textarea" rows={2} value={npc.notes} onChange={e => upd('notes', e.target.value)} placeholder="Weapons, special orders, etc." />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FogOfWarTracker({ sessionId, fow }) {
  // Work from a local copy; persist to Firebase on every change
  const [data, setData] = useState({
    npcs:       fow?.npcs       ?? [],
    killZones:  fow?.killZones  ?? [],
    locations:  fow?.locations  ?? [],
    boobyTraps: fow?.boobyTraps ?? [],
  })

  function persist(next) {
    setData(next)
    saveFOW(sessionId, next).catch(console.error)
  }

  // ── NPC operations ──
  function addNpc() {
    persist({
      ...data,
      npcs: [...data.npcs, {
        id: uid(), name: '', location: '', floor: 'ground',
        status: 'active', cover: 'none', overwatch: '', notes: '',
      }],
    })
  }

  function updateNpc(id, field, value) {
    persist({ ...data, npcs: data.npcs.map(n => n.id === id ? { ...n, [field]: value } : n) })
  }

  function removeNpc(id) {
    persist({ ...data, npcs: data.npcs.filter(n => n.id !== id) })
  }

  // ── Kill zone operations ──
  function addKillZone() {
    persist({ ...data, killZones: [...data.killZones, { id: uid(), location: '', coveredBy: '' }] })
  }
  function updateKZ(id, field, value) {
    persist({ ...data, killZones: data.killZones.map(k => k.id === id ? { ...k, [field]: value } : k) })
  }
  function removeKZ(id) {
    persist({ ...data, killZones: data.killZones.filter(k => k.id !== id) })
  }

  // ── Location state operations ──
  function addLocation() {
    persist({ ...data, locations: [...data.locations, { id: uid(), name: '', state: 'open' }] })
  }
  function updateLoc(id, field, value) {
    persist({ ...data, locations: data.locations.map(l => l.id === id ? { ...l, [field]: value } : l) })
  }
  function removeLoc(id) {
    persist({ ...data, locations: data.locations.filter(l => l.id !== id) })
  }

  // ── Booby trap operations ──
  function addTrap() {
    persist({ ...data, boobyTraps: [...data.boobyTraps, { id: uid(), location: '', notes: '' }] })
  }
  function updateTrap(id, field, value) {
    persist({ ...data, boobyTraps: data.boobyTraps.map(t => t.id === id ? { ...t, [field]: value } : t) })
  }
  function removeTrap(id) {
    persist({ ...data, boobyTraps: data.boobyTraps.filter(t => t.id !== id) })
  }

  return (
    <div className="fow-tracker">

      {/* ── NPC / Enemy Groups ── */}
      <div className="fow-column fow-column--npcs">
        <div className="fow-section">
          <div className="fow-section-head">
            <h3 className="fow-section-title">Enemy Groups & NPCs</h3>
            <button className="btn btn-secondary fow-add-btn" onClick={addNpc}>+ Add NPC</button>
          </div>
          <p className="fow-hint">Hidden from players. Expand a card to set location, floor, cover, and overwatch.</p>

          {data.npcs.length === 0 && (
            <p className="fow-empty">No NPCs added yet.</p>
          )}

          <div className="fow-npc-list">
            {data.npcs.map(npc => (
              <NpcCard key={npc.id} npc={npc} onUpdate={updateNpc} onRemove={removeNpc} />
            ))}
          </div>
        </div>

        {/* ── CUF Roll Tool ── */}
        <CufRollTool />
      </div>

      {/* ── Environment ── */}
      <div className="fow-column fow-column--env">

        {/* Kill Zones */}
        <div className="fow-section">
          <div className="fow-section-head">
            <h3 className="fow-section-title">Kill Zones</h3>
            <button className="btn btn-secondary fow-add-btn" onClick={addKillZone}>+</button>
          </div>
          <p className="fow-hint">Hexes/apertures covered by overwatch. Mark on referee map before combat.</p>
          {data.killZones.length === 0 && <p className="fow-empty">No kill zones.</p>}
          {data.killZones.map(kz => (
            <div key={kz.id} className="fow-env-row">
              <input className="fow-input" value={kz.location}  placeholder="Location (hex / aperture)" onChange={e => updateKZ(kz.id, 'location', e.target.value)} />
              <input className="fow-input" value={kz.coveredBy} placeholder="Covered by (NPC name)"    onChange={e => updateKZ(kz.id, 'coveredBy', e.target.value)} />
              <button className="icon-btn icon-btn--danger" onClick={() => removeKZ(kz.id)}>✕</button>
            </div>
          ))}
        </div>

        {/* Blocked / Breached Locations */}
        <div className="fow-section">
          <div className="fow-section-head">
            <h3 className="fow-section-title">Blocked / Breached Locations</h3>
            <button className="btn btn-secondary fow-add-btn" onClick={addLocation}>+</button>
          </div>
          <p className="fow-hint">Doors, windows, hex walls. Cycle state as the fight progresses.</p>
          {data.locations.length === 0 && <p className="fow-empty">No locations tracked.</p>}
          {data.locations.map(loc => (
            <div key={loc.id} className="fow-env-row">
              <input className="fow-input" value={loc.name} placeholder="Door / hex / wall description" onChange={e => updateLoc(loc.id, 'name', e.target.value)} />
              <div className="fow-loc-states">
                {LOC_STATES.map(s => (
                  <button
                    key={s}
                    className={`fow-loc-btn fow-loc-btn--${s} ${loc.state === s ? 'fow-loc-btn--active' : ''}`}
                    onClick={() => updateLoc(loc.id, 'state', s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <button className="icon-btn icon-btn--danger" onClick={() => removeLoc(loc.id)}>✕</button>
            </div>
          ))}
        </div>

        {/* Booby Traps */}
        <div className="fow-section">
          <div className="fow-section-head">
            <h3 className="fow-section-title">Booby Traps</h3>
            <button className="btn btn-secondary fow-add-btn" onClick={addTrap}>+</button>
          </div>
          <p className="fow-hint">Secret. Failing RECON when entering the location triggers detonation.</p>
          {data.boobyTraps.length === 0 && <p className="fow-empty">No booby traps placed.</p>}
          {data.boobyTraps.map(trap => (
            <div key={trap.id} className="fow-env-row fow-env-row--trap">
              <input className="fow-input" value={trap.location} placeholder="Location (door / window / staircase)" onChange={e => updateTrap(trap.id, 'location', e.target.value)} />
              <input className="fow-input" value={trap.notes}    placeholder="Device / blast power / notes"          onChange={e => updateTrap(trap.id, 'notes', e.target.value)} />
              <button className="icon-btn icon-btn--danger" onClick={() => removeTrap(trap.id)}>✕</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
