import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  subscribeToSession,
  startCombat,
  updateCombatants,
  advanceTurn,
  reshuffleDeck,
  closeSession,
  exchangeInitiative,
  toggleCombatAwareness,
} from '../firebase/sessionService'
import { subscribeToCharacter, EMPTY_CHARACTER } from '../firebase/characterService'
import { EMPTY_FOW } from '../firebase/fogOfWarService'
import TurnTracker from '../components/initiative/TurnTracker'
import FogOfWarTracker from '../components/fogofwar/FogOfWarTracker'
import CharacterSheet from '../components/character/CharacterSheet'

export default function GMScreen() {
  const { sessionId } = useParams()
  const { state }     = useLocation()
  const navigate      = useNavigate()
  const gmName        = state?.name ?? 'Referee'

  const [session,         setSession]         = useState(null)
  const [activeTab,       setActiveTab]       = useState('initiative')
  const [confirmClose,    setConfirmClose]    = useState(false)
  const [npcName,         setNpcName]         = useState('')
  const [npcVisible,      setNpcVisible]      = useState(true)
  const [npcGroups,       setNpcGroups]       = useState([])
  const [surpriseId,      setSurpriseId]      = useState('')
  const [hiddenInitiative,setHiddenInitiative]= useState(false)
  const [exchangeA,       setExchangeA]       = useState('')
  const [exchangeB,       setExchangeB]       = useState('')

  // Roster: subscribe to each player's character sheet
  const [rosterSheets,   setRosterSheets]   = useState({}) // { playerId: character }
  const [rosterPlayerId, setRosterPlayerId] = useState(null)

  useEffect(() => {
    const unsub = subscribeToSession(sessionId, setSession)
    return unsub
  }, [sessionId])

  // Subscribe to character sheets for all players in the session
  useEffect(() => {
    if (!session) return
    const players = session.players ?? []
    const unsubs = players.map(p =>
      subscribeToCharacter(p.id, sheet => {
        setRosterSheets(prev => ({ ...prev, [p.id]: sheet }))
      })
    )
    return () => unsubs.forEach(u => u())
  }, [session?.players?.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!session) return <div className="loading">Loading session…</div>

  const combatants = session.combatants ?? []
  const players    = session.players    ?? []
  const inCombat   = session.status === 'combat'
  const fow        = session.fogOfWar   ?? EMPTY_FOW

  const allForExchange = inCombat ? combatants : [
    ...players.map(p => ({ id: p.id, name: p.name })),
    ...npcGroups,
  ]

  function handleAddNpc() {
    if (!npcName.trim()) return
    const id = `npc_${Date.now()}`
    setNpcGroups(prev => [...prev, { id, name: npcName.trim(), type: 'npc', visible: npcVisible }])
    setNpcName('')
  }

  function handleRemoveNpc(id) {
    setNpcGroups(prev => prev.filter(n => n.id !== id))
  }

  function handleStartCombat() {
    startCombat(sessionId, npcGroups, surpriseId || null, hiddenInitiative)
    setSurpriseId('')
  }

  function handleActionToggle(combatantId, actionType) {
    const updated = combatants.map(c =>
      c.id !== combatantId ? c : { ...c, actions: { ...c.actions, [actionType]: !c.actions[actionType] } }
    )
    updateCombatants(sessionId, updated)
  }

  function handleToggleVisible(combatantId) {
    const updated = combatants.map(c => c.id === combatantId ? { ...c, visible: !c.visible } : c)
    updateCombatants(sessionId, updated)
  }

  function handleAdvanceTurn() {
    advanceTurn(sessionId, combatants, session.currentTurn, session.round, session.hiddenInitiative)
  }

  function handleEndCombat() {
    setNpcGroups([])
    reshuffleDeck(sessionId)
  }

  async function handleCloseSession() {
    await closeSession(sessionId)
    navigate('/')
  }

  function handleExchange() {
    if (!exchangeA || !exchangeB || exchangeA === exchangeB) return
    exchangeInitiative(sessionId, combatants, exchangeA, exchangeB)
    setExchangeA('')
    setExchangeB('')
  }

  // ── Roster view — selected player sheet ──────────────────────────────────
  const rosterPlayer = players.find(p => p.id === rosterPlayerId)
  const rosterSheet  = rosterPlayerId ? (rosterSheets[rosterPlayerId] ?? EMPTY_CHARACTER) : null

  return (
    <div className="gm-screen">
      <header className="gm-header">
        <div>
          <h1>Referee Screen</h1>
          <span className="session-badge">Code: <strong>{sessionId}</strong></span>
        </div>
        <div className="gm-header-meta">
          {inCombat && <span>Round <strong>{session.round}</strong></span>}
          <span>Players: <strong>{players.length}</strong></span>
          {!confirmClose ? (
            <button className="btn-close-session" onClick={() => setConfirmClose(true)}>Close Session</button>
          ) : (
            <div className="close-confirm">
              <span>End session for everyone?</span>
              <button className="btn-close-session btn-close-session--confirm" onClick={handleCloseSession}>Yes, close</button>
              <button className="btn-close-session btn-close-session--cancel"  onClick={() => setConfirmClose(false)}>Cancel</button>
            </div>
          )}
        </div>
      </header>

      {/* Tab bar */}
      <nav className="screen-tabs">
        {[
          { id: 'initiative', label: 'Initiative' },
          { id: 'fogOfWar',   label: 'Fog of War' },
          { id: 'roster',     label: 'Player Roster' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`screen-tab ${activeTab === tab.id ? 'screen-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── INITIATIVE TAB ── */}
      {activeTab === 'initiative' && (
        <div className="gm-layout">
          <aside className="gm-controls">

            <section className="control-section">
              <h3>Players in Session</h3>
              {players.length === 0
                ? <p className="hint">Share code <strong>{sessionId}</strong> — waiting for players…</p>
                : <ul className="combatant-list">
                    {players.map(p => (
                      <li key={p.id} className="combatant-list-item">
                        <span className="combatant-list-name">{p.name}</span>
                        {inCombat
                          ? <span className="combatant-list-card">#{combatants.find(c => c.id === p.id)?.card ?? '—'}</span>
                          : (
                            <button
                              className={`ca-toggle ${(session.combatAwareness ?? []).includes(p.id) ? 'ca-toggle--active' : ''}`}
                              title="Combat Awareness: draw 2 cards, keep higher"
                              onClick={() => toggleCombatAwareness(sessionId, p.id)}
                            >
                              CA
                            </button>
                          )
                        }
                      </li>
                    ))}
                  </ul>
              }
              {!inCombat && players.length > 0 && (
                <p className="hint" style={{ marginTop: '0.5rem' }}>
                  Toggle <strong>CA</strong> for players with Combat Awareness.
                </p>
              )}
            </section>

            {!inCombat && (
              <section className="control-section">
                <h3>NPC Groups</h3>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Group name (e.g. Squad Alpha)"
                    value={npcName}
                    onChange={e => setNpcName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNpc()}
                  />
                </div>
                <label className="form-row">
                  <input type="checkbox" checked={npcVisible} onChange={e => setNpcVisible(e.target.checked)} />
                  Visible to players
                </label>
                <button className="btn btn-secondary" onClick={handleAddNpc}>Add NPC Group</button>
                {npcGroups.length > 0 && (
                  <ul className="combatant-list" style={{ marginTop: '0.75rem' }}>
                    {npcGroups.map(n => (
                      <li key={n.id} className="combatant-list-item">
                        <span className="combatant-list-name">{n.name}</span>
                        <span className="combatant-list-card">{n.visible ? '👁' : '🙈'}</span>
                        <button className="icon-btn icon-btn--danger" onClick={() => handleRemoveNpc(n.id)}>✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {!inCombat && (
              <section className="control-section">
                <h3>Initiative Mode</h3>
                <label className="form-row" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={hiddenInitiative} onChange={e => setHiddenInitiative(e.target.checked)} />
                  Hidden Initiative
                </label>
                {hiddenInitiative && (
                  <p className="hint">Cards are kept secret. Redrawn every round.</p>
                )}
              </section>
            )}

            {!inCombat && !hiddenInitiative && (players.length > 0 || npcGroups.length > 0) && (
              <section className="control-section">
                <h3>Surprise</h3>
                <p className="hint">Give a combatant card #1 automatically.</p>
                <select value={surpriseId} onChange={e => setSurpriseId(e.target.value)}>
                  <option value="">— None —</option>
                  {players.map(p =>    <option key={p.id}  value={p.id}>{p.name}</option>)}
                  {npcGroups.map(n => <option key={n.id}  value={n.id}>{n.name}</option>)}
                </select>
              </section>
            )}

            <section className="control-section">
              {!inCombat ? (
                <button
                  className="btn btn-primary"
                  onClick={handleStartCombat}
                  disabled={players.length === 0 && npcGroups.length === 0}
                >
                  Start Combat &amp; Deal Cards
                </button>
              ) : (
                <button className="btn btn-danger" onClick={handleEndCombat}>End Combat / Reshuffle</button>
              )}
            </section>

            {inCombat && combatants.filter(c => c.type === 'npc').length > 0 && (
              <section className="control-section">
                <h3>NPC Visibility</h3>
                <ul className="combatant-list">
                  {combatants.filter(c => c.type === 'npc').map(c => (
                    <li key={c.id} className="combatant-list-item">
                      <span className="combatant-list-name">{c.name}</span>
                      <button
                        className={`icon-btn ${c.visible ? 'icon-btn--active' : ''}`}
                        onClick={() => handleToggleVisible(c.id)}
                      >
                        {c.visible ? '👁' : '🙈'}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {inCombat && combatants.length >= 2 && (
              <section className="control-section">
                <h3>Exchange Initiative</h3>
                <p className="hint">Swap cards between two willing combatants.</p>
                <select value={exchangeA} onChange={e => setExchangeA(e.target.value)}>
                  <option value="">— Select A —</option>
                  {combatants.map(c => <option key={c.id} value={c.id}>{c.name} (#{c.card})</option>)}
                </select>
                <select value={exchangeB} onChange={e => setExchangeB(e.target.value)} style={{ marginTop: '0.4rem' }}>
                  <option value="">— Select B —</option>
                  {combatants.map(c => <option key={c.id} value={c.id}>{c.name} (#{c.card})</option>)}
                </select>
                <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={handleExchange}>Swap</button>
              </section>
            )}
          </aside>

          <main className="gm-main">
            <div className="gm-turn-header">
              <div>
                <h2>{inCombat ? 'Turn Order' : 'Waiting for Combat'}</h2>
                {inCombat && session.hiddenInitiative && (
                  <span className="hidden-initiative-badge">Hidden Initiative — redraws each round</span>
                )}
              </div>
              {inCombat && (
                <button className="btn btn-primary" onClick={handleAdvanceTurn}>Next Turn →</button>
              )}
            </div>
            {!inCombat && (
              <p className="hint">Add any NPC groups, then click <strong>Start Combat &amp; Deal Cards</strong>.</p>
            )}
            <TurnTracker
              combatants={combatants}
              currentTurn={session.currentTurn}
              showNPCs={true}
              showControls={inCombat}
              onActionToggle={handleActionToggle}
            />
          </main>
        </div>
      )}

      {/* ── FOG OF WAR TAB ── */}
      {activeTab === 'fogOfWar' && (
        <div className="gm-fullwidth">
          <FogOfWarTracker sessionId={sessionId} fow={fow} />
        </div>
      )}

      {/* ── ROSTER TAB ── */}
      {activeTab === 'roster' && (
        <div className="gm-fullwidth">
          {players.length === 0 ? (
            <p className="hint" style={{ padding: '2rem' }}>No players have joined yet.</p>
          ) : (
            <div className="roster-layout">
              <aside className="roster-sidebar">
                <h3 className="roster-sidebar-title">Players</h3>
                <ul className="roster-player-list">
                  {players.map(p => (
                    <li key={p.id}>
                      <button
                        className={`roster-player-btn ${rosterPlayerId === p.id ? 'roster-player-btn--active' : ''}`}
                        onClick={() => setRosterPlayerId(p.id)}
                      >
                        {p.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="roster-sheet-area">
                {!rosterSheet ? (
                  <p className="hint" style={{ padding: '2rem' }}>Select a player to view their sheet.</p>
                ) : (
                  <>
                    <div className="roster-sheet-header">
                      <span className="roster-viewing">Viewing: <strong>{rosterPlayer?.name}</strong></span>
                    </div>
                    <CharacterSheet character={rosterSheet} editable={false} />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
