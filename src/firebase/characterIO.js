// Character JSON export / import — a portable, browser-independent backup so a
// character can be carried between devices and games. Export downloads the
// character object as a .json file; import parses one back, normalised through
// mergeWithEmpty so every key exists and unknown junk is dropped.

import { mergeWithEmpty } from './characterService'

function safeFilename(name) {
  const base = (name || 'character').trim().replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '')
  return (base || 'character') + '-t2k.json'
}

// Trigger a download of the character as pretty-printed JSON.
export function exportCharacter(character) {
  const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = safeFilename(character?.name)
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Parse a previously-exported file's text into a full character object.
// Throws on invalid JSON (callers surface the message to the user).
export function parseImportedCharacter(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Not a valid character file (could not parse JSON).')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Not a valid character file.')
  }
  // strip Firestore bookkeeping that shouldn't ride along into a new slot
  const { updatedAt, ...rest } = data // eslint-disable-line no-unused-vars
  return mergeWithEmpty(rest)
}
