import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadCharacter, saveCharacter, EMPTY_CHARACTER } from '../firebase/characterService'
import { exportCharacter, parseImportedCharacter } from '../firebase/characterIO'
import {
  listCharacters, getActiveId, setActiveId,
  createCharacter, deleteCharacter, touchCharacter, importToLibrary,
} from '../hooks/characterLibrary'
import CharacterSheet from '../components/character/CharacterSheet'

export default function CharacterPage() {
  const navigate = useNavigate()

  const [chars,     setChars]     = useState(() => listCharacters())
  const [activeId,  setActive]    = useState(() => getActiveId())
  const [character, setCharacter] = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState('')
  const fileRef = useRef(null)

  // (Re)load whenever the active character changes
  useEffect(() => {
    setCharacter(null)
    loadCharacter(activeId)
      .then(setCharacter)
      .catch(() => setCharacter({ ...EMPTY_CHARACTER }))
  }, [activeId])

  const refreshList = () => setChars(listCharacters())
  function switchTo(id) { setActiveId(id); setActive(id); setSaved(false); setError('') }

  async function handleSave() {
    setSaving(true); setSaved(false); setError('')
    try {
      await saveCharacter(activeId, character)
      touchCharacter(activeId, character.name)
      refreshList()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error('saveCharacter error:', e)
      setError(`Save failed: ${e?.message ?? e}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleNew() {
    setError('')
    try {
      const id = await createCharacter('')
      refreshList()
      switchTo(id)
    } catch (e) {
      setError(`Could not create character: ${e?.message ?? e}`)
    }
  }

  function handleExport() {
    if (character) exportCharacter(character)
  }

  async function handleImportFile(e) {
    setError('')
    const file = e.target.files?.[0]
    e.target.value = '' // let the same file be re-imported later
    if (!file) return
    try {
      const char = parseImportedCharacter(await file.text())
      const id = await importToLibrary(char)
      refreshList()
      switchTo(id)
    } catch (err) {
      setError(err?.message ?? 'Import failed.')
    }
  }

  async function handleDelete() {
    if (chars.length <= 1) { setError('Can’t delete your only character.'); return }
    const label = character?.name || 'this character'
    if (!window.confirm(`Remove "${label}" from this device? Its data stays in the cloud but won’t be listed here.`)) return
    const next = deleteCharacter(activeId)
    refreshList()
    switchTo(next)
  }

  return (
    <div className="char-page">
      <header className="char-page-header">
        <button className="btn-text" onClick={() => navigate('/')}>← Back</button>
        <h1 className="char-page-title">My Character Sheet</h1>
        <div className="char-page-actions">
          {saved && <span className="char-saved-msg">Saved!</span>}
          {error && <span className="error-msg">{error}</span>}
          <button className="btn btn-primary char-save-btn" onClick={handleSave} disabled={saving || !character}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Character library toolbar */}
      <div className="char-lib-toolbar">
        <label className="char-lib-select">
          <span className="char-lib-label">Character</span>
          <select value={activeId} onChange={e => switchTo(e.target.value)}>
            {chars.map(c => <option key={c.id} value={c.id}>{c.name || 'Unnamed'}</option>)}
          </select>
        </label>
        <div className="char-lib-btns">
          <button className="btn btn-secondary" onClick={handleNew}>+ New</button>
          <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>Import</button>
          <button className="btn btn-secondary" onClick={handleExport} disabled={!character}>Export</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={chars.length <= 1}>Delete</button>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleImportFile} style={{ display: 'none' }} />
      </div>

      <main className="char-page-body">
        {!character
          ? <div className="loading">Loading character…</div>
          : <CharacterSheet character={character} editable={true} onChange={setCharacter} />
        }
      </main>
    </div>
  )
}
