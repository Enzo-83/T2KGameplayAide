import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { subscribeToSession, togglePlayerAction, toggleCombatAwareness } from '../firebase/sessionService'
import TurnTracker from '../components/initiative/TurnTracker'

export default function PlayerScreen() {
  const { sessionId } = useParams()
  const { state } = useLocation()
  const playerName = state?.name ?? 'Player'
  const playerId = state?.playerId ?? null

  const [session, setSession] = useState(null)
  const [cardFlipped, setCardFlipped] = useState(false)

  useEffect(() => {
    const unsub = subscribeToSession(sessionId, setSession)
    return unsub
  }, [sessionId])

  // Trigger big card flip when our card is first assigned
  const myCard = session?.combatants?.find(c => c.id === playerId)?.card ?? null
  useEffect(() => {
    if (myCard != null && !cardFlipped) {
      const t = setTimeout(() => setCardFlipped(true), 50)
      return () => clearTimeout(t)
    }
  }, [myCard]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const combatants = session.combatants ?? []
  const myCombatant = playerId ? combatants.find(c => c.id === playerId) : null
  const visibleCombatants = combatants.filter(c => c.type === 'player' || c.visible)
  const actingCombatant = combatants.find(c => c.card === session.currentTurn)
  const isMyTurn = myCombatant?.card === session.currentTurn

  return (
    <div className="player-screen">
      <header className="player-header">
        <h1>{playerName}</h1>
        <span className="session-badge">Session: <strong>{sessionId}</strong></span>
        {session.status === 'combat' && (
          <span className="round-badge">Round {session.round}</span>
        )}
      </header>

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
          {/* Large personal initiative card with flip animation */}
          <div className={`my-card-flip-wrapper ${isMyTurn ? 'my-card-flip-wrapper--active' : ''}`}>
            <div className={`my-card-flip-inner ${cardFlipped ? 'my-card-flip-inner--flipped' : ''}`}>
              {/* Back face */}
              <div className="my-card-face my-card-face--back">
                <span className="my-card-face-symbol">?</span>
                <p className="my-card-label">Initiative</p>
              </div>
              {/* Front face */}
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

          {actingCombatant && !isMyTurn && (
            <p className="acting-now">
              Acting now: <strong>{actingCombatant.name}</strong>
            </p>
          )}
        </section>
      )}

      <section className="player-tracker-section">
        <h2>Turn Order</h2>
        <TurnTracker
          combatants={visibleCombatants}
          currentTurn={session.currentTurn}
          showNPCs={true}
          showControls={false}
        />
      </section>
    </div>
  )
}
