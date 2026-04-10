import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession, joinSession, getSession, reopenSession } from '../firebase/sessionService'

export default function Home() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [gmName, setGmName] = useState('')
  const [rejoinCode, setRejoinCode] = useState('')
  const [showRejoin, setShowRejoin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreateSession() {
    if (!gmName.trim()) return setError('Enter your name to create a session.')
    setLoading(true)
    setError('')
    try {
      const sessionId = await createSession(gmName.trim())
      navigate(`/gm/${sessionId}`, { state: { name: gmName.trim() } })
    } catch (e) {
      console.error('createSession error:', e)
      setError(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleRejoinSession() {
    if (!rejoinCode.trim()) return setError('Enter your session code.')
    setLoading(true)
    setError('')
    try {
      const code = rejoinCode.trim().toUpperCase()
      const data = await getSession(code)
      // If the session was closed, offer to reopen it
      if (data.status === 'ended') {
        await reopenSession(code)
      }
      navigate(`/gm/${code}`, { state: { name: data.gmName } })
    } catch (e) {
      setError(e.message || 'Could not find session. Check the code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoinSession() {
    if (!playerName.trim()) return setError('Enter your name.')
    if (!joinCode.trim()) return setError('Enter a session code.')
    setLoading(true)
    setError('')
    try {
      const { code, playerId } = await joinSession(joinCode.trim().toUpperCase(), playerName.trim())
      navigate(`/player/${code}`, { state: { name: playerName.trim(), playerId } })
    } catch (e) {
      setError(e.message || 'Could not join session. Check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">T2K Gameplay Aide</h1>
        <p className="home-subtitle">Twilight 2000 — Table Reference</p>
      </header>

      <main className="home-panels">
        {/* GM Panel */}
        <section className="panel panel-gm">
          <h2>Referee</h2>

          {!showRejoin ? (
            <>
              <p>Create a new session. Players will join using your session code.</p>
              <div className="form-group">
                <label htmlFor="gm-name">Your name</label>
                <input
                  id="gm-name"
                  type="text"
                  placeholder="Referee name"
                  value={gmName}
                  onChange={e => setGmName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateSession()}
                />
              </div>
              <button className="btn btn-primary" onClick={handleCreateSession} disabled={loading}>
                {loading ? 'Creating…' : 'Create Session'}
              </button>
              <button className="btn-text" onClick={() => { setShowRejoin(true); setError('') }}>
                Rejoin an existing session →
              </button>
            </>
          ) : (
            <>
              <p>Enter a previous session code to reopen or continue it.</p>
              <div className="form-group">
                <label htmlFor="rejoin-code">Session code</label>
                <input
                  id="rejoin-code"
                  type="text"
                  placeholder="e.g. A3F7"
                  maxLength={4}
                  value={rejoinCode}
                  onChange={e => setRejoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleRejoinSession()}
                  className="code-input"
                />
              </div>
              <button className="btn btn-primary" onClick={handleRejoinSession} disabled={loading}>
                {loading ? 'Loading…' : 'Rejoin Session'}
              </button>
              <button className="btn-text" onClick={() => { setShowRejoin(false); setError('') }}>
                ← Create a new session instead
              </button>
            </>
          )}
        </section>

        <div className="panel-divider">or</div>

        {/* Player Panel */}
        <section className="panel panel-player">
          <h2>Player</h2>
          <p>Enter the session code shown on the Referee's screen to join.</p>
          <div className="form-group">
            <label htmlFor="player-name">Your name</label>
            <input
              id="player-name"
              type="text"
              placeholder="Character name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="join-code">Session code</label>
            <input
              id="join-code"
              type="text"
              placeholder="e.g. A3F7"
              maxLength={4}
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoinSession()}
              className="code-input"
            />
          </div>
          <button className="btn btn-secondary" onClick={handleJoinSession} disabled={loading}>
            {loading ? 'Joining…' : 'Join Session'}
          </button>
        </section>
      </main>

      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
