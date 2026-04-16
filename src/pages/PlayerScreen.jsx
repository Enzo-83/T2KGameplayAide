import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import {
  subscribeToSession,
  togglePlayerAction,
  toggleCombatAwareness,
} from '../firebase/sessionService'
import { getPlayerId, getPlayerName } from '../hooks/usePlayerIdentity'
import { loadCharacter, saveCharacter, EMPTY_CHARACTER } from '../firebase/characterService'
import TurnTracker from '../components/initiative/TurnTracker'
import CharacterSheet from '../components/character/CharacterSheet'

export default function PlayerScreen() {
  const { sessionId } = useParams()
  const { state }     = useLocation()

  // Prefer navigation state; fall back to localStorage so refresh works
  const playerId   = state?.playerId   ?? getPlayerId()
  const playerName = state?.name       ?? getPlayerName()

  const [session,     setSession]     = useState(null)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [activeTab,   setActiveTab]   = useState('initiative')

  // Character sheet state
  const [character, setCharacter]     = useState(null)
  const [sheetEdit, setSheetEdit]     = useState(false)
  const [saving,    setSaving]        = useState(false)
  const [saved,     setSaved]         = useState(false)
  const [sheetErr,  setSheetErr]      = useState('')

  useEffect(() => {
    const unsub = subscribeToSession(sessionId, setSession)
    return unsub
  }, [sessionId])

  // Load character sheet when switching to sheet tab
  useEffect(() => {
    if (activeTab === 'sheet' && !character) {
      loadCharacter(playerId)
        .then(setCharacter)
        .catch(() => setCharacter({ ...EMPTY_CHARACTER }))
    }
  }, [activeTab, playerId]) // eslint-disable-line react-hooks/exhaustive-deps

  const myCard = session?.combatants?.find(c => c.id === playerId)?.card ?? null
  useEffect(() => {
    if (myCard != null && !cardFlipped) {
      const t = setTimeout(() => setCardFlipped(true), 50)
      return () => clearTimeout(t)
    }
  }, [myCard]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSaveSheet() {
    if (!character) return
    setSaving(true)
    setSaved(false)
    setSheetErr('')
    try {
      await saveCharacter(playerId, character)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setSheetErr('Could not save — check your connection.')
    } finally {
      setSaving(false)
    }
  }

  if (!session) return <div className="loading">Connecting to session…</div>

  if (session.status === 'ended') {
    return (
      <div className="session-ended">
        <h2>Session Closed</h2>
        <p>The Referee has closed this session.</p>
        <a href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none', textAlign: 'center' }}>
          Back to Home
        </a>
      </div>
    )
  }

  const combatants        = session.combatants ?? []
  const myCombatant       = combatants.find(c => c.id === playerId)
  const visibleCombatants = combatants.filter(c => c.type === 'player' || c.visible)
  const actingCombatant   = combatants.find(c => c.card === session.currentTurn)
  const isMyTurn          = myCombatant?.card === session.currentTurn

  return (
    <div className="player-screen">
      <header className="player-header">
        <h1>{playerName}</h1>
        <span className="session-badge">Session: <strong>{sessionId}</strong></span>
        {session.status === 'combat' && (
          <span className="round-badge">Round {session.round}</span>
        )}
      </header>

      {/* Tab bar */}
      <nav className="screen-tabs">
        <button
          className={`screen-tab ${activeTab === 'initiative' ? 'screen-tab--active' : ''}`}
          onClick={() => setActiveTab('initiative')}
        >
          Initiative
        </button>
        <button
          className={`screen-tab ${activeTab === 'sheet' ? 'screen-tab--active' : ''}`}
          onClick={() => setActiveTab('sheet')}
        >
          My Sheet
        </button>
      </nav>

      {/* ── INITIATIVE TAB ── */}
      {activeTab === 'initiative' && (
        <div className="player-initiative-tab">
          {session.status === 'lobby' && (
            <div className="lobby-msg">
              <p>Waiting for Referee to start combat…</p>
              {playerId && (
                <div className="ca-player-toggle">
                  <button
                    className={`ca-toggle ca-toggle--large ${(session.combatAwareness ?? []).includes(playerId) ? 'ca-toggle--active' : ''}`}
                    onClick={() => toggleCombatAwareness(sessionId, playerId)}
                  >
                    Combat Awareness {(session.combatAwareness ?? []).includes(playerId) ? '✓ ON' : 'OFF'}
                  </button>
                  <p className="hint">When ON, you draw 2 initiative cards and keep the higher one.</p>
                </div>
              )}
            </div>
          )}

          {session.status === 'combat' && (
            <section className="my-card-section">
              <div className={`my-card-flip-wrapper ${isMyTurn ? 'my-card-flip-wrapper--active' : ''}`}>
                <div className={`my-card-flip-inner ${cardFlipped ? 'my-card-flip-inner--flipped' : ''}`}>
                  <div className="my-card-face my-card-face--back">
                    <span className="my-card-face-symbol">?</span>
                    <p className="my-card-label">Initiative</p>
                  </div>
                  <div className="my-card-face my-card-face--front">
                    <p className="my-card-label">Your Initiative</p>
                    <span className="my-card-number">{myCard ?? '?'}</span>
                    {myCombatant && (
                      <div className="my-card-actions">
                        <button
                          className={`action-toggle-btn ${myCombatant.actions?.fast ? 'action-toggle-btn--used' : ''}`}
                          onClick={() => togglePlayerAction(sessionId, playerId, 'fast')}
                        >
                          Fast {myCombatant.actions?.fast ? '✓' : '○'}
                        </button>
                        <button
                          className={`action-toggle-btn ${myCombatant.actions?.slow ? 'action-toggle-btn--used' : ''}`}
                          onClick={() => togglePlayerAction(sessionId, playerId, 'slow')}
                        >
                          Slow {myCombatant.actions?.slow ? '✓' : '○'}
                        </button>
                      </div>
                    )}
                    {isMyTurn && <p className="your-turn-banner">YOUR TURN</p>}
                  </div>
                </div>
              </div>

              {!session.hiddenInitiative && actingCombatant && !isMyTurn && (
                <p className="acting-now">Acting now: <strong>{actingCombatant.name}</strong></p>
              )}
              {session.hiddenInitiative && !isMyTurn && (
                <p className="acting-now">Referee is calling numbers… wait for yours.</p>
              )}
            </section>
          )}

          {!session.hiddenInitiative && (
            <section className="player-tracker-section">
              <h2>Turn Order</h2>
              <TurnTracker
                combatants={visibleCombatants}
                currentTurn={session.currentTurn}
                showNPCs={true}
                showControls={false}
              />
            </section>
          )}
        </div>
      )}

      {/* ── MY SHEET TAB ── */}
      {activeTab === 'sheet' && (
        <div className="player-sheet-tab">
          <div className="player-sheet-toolbar">
            <div className="player-sheet-edit-toggle">
              <button
                className={`btn ${sheetEdit ? 'btn-danger' : 'btn-secondary'} player-sheet-mode-btn`}
                onClick={() => { setSheetEdit(x => !x); setSaved(false); setSheetErr('') }}
              >
                {sheetEdit ? 'Cancel Edit' : 'Edit Sheet'}
              </button>
              {sheetEdit && (
                <button className="btn btn-primary player-sheet-mode-btn" onClick={handleSaveSheet} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              )}
            </div>
            {saved    && <span className="char-saved-msg">Saved!</span>}
            {sheetErr && <span className="error-msg">{sheetErr}</span>}
          </div>

          {!character
            ? <div className="loading" style={{ height: '60px' }}>Loading sheet…</div>
            : <CharacterSheet character={character} editable={sheetEdit} onChange={setCharacter} />
          }
        </div>
      )}
    </div>
  )
}
