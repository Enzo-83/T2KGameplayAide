const ID_KEY   = 't2k_player_id'
const NAME_KEY = 't2k_player_name'

function getOrCreateId() {
  let id = localStorage.getItem(ID_KEY)
  if (!id) {
    id = 'char_' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
    localStorage.setItem(ID_KEY, id)
  }
  return id
}

export function getPlayerId() {
  return getOrCreateId()
}

export function getPlayerName() {
  return localStorage.getItem(NAME_KEY) ?? ''
}

export function savePlayerName(name) {
  localStorage.setItem(NAME_KEY, name)
}
