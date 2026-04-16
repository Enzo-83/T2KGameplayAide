import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlayerId } from '../hooks/usePlayerIdentity'
import { loadCharacter, saveCharacter, EMPTY_CHARACTER } from '../firebase/characterService'
import CharacterSheet from '../components/character/CharacterSheet'

export default function CharacterPage() {
  const navigate  = useNavigate()
  const playerId  = getPlayerId()

  const [character, setCharacter] = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    loadCharacter(playerId)
      .then(setCharacter)
      .catch(() => setCharacter({ ...EMPTY_CHARACTER }))
  }, [playerId])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await saveCharacter(playerId, character)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error('saveCharacter error:', e)
      setError(`Save failed: ${e?.message ?? e}`)
    } finally {
      setSaving(false)
    }
  }

  if (!character) return <div className="loading">Loading character…</div>

  return (
    <div className="char-page">
      <header className="char-page-header">
        <button className="btn-text" onClick={() => navigate('/')}>← Back</button>
        <h1 className="char-page-title">My Character Sheet</h1>
        <div className="char-page-actions">
          {saved  && <span className="char-saved-msg">Saved!</span>}
          {error  && <span className="error-msg">{error}</span>}
          <button className="btn btn-primary char-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </header>

      <main className="char-page-body">
        <CharacterSheet
          character={character}
          editable={true}
          onChange={setCharacter}
        />
      </main>
    </div>
  )
}
