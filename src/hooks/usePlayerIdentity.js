import { getActiveId } from './characterLibrary'

const NAME_KEY = 't2k_player_name'

// The player's identity is the active character in their library. getActiveId()
// always returns an id (migrating a pre-library character or creating a slot),
// so sessions and character docs key off whichever character is selected.
export function getPlayerId() {
  return getActiveId()
}

export function getPlayerName() {
  return localStorage.getItem(NAME_KEY) ?? ''
}

export function savePlayerName(name) {
  localStorage.setItem(NAME_KEY, name)
}
