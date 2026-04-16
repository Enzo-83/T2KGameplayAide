import { doc, updateDoc } from 'firebase/firestore'
import { db } from './config'

// FOW data is stored inside the session document under the `fogOfWar` key.
// The GM screen already subscribes to the session via subscribeToSession,
// so no separate subscription is needed — just read session.fogOfWar.

export const EMPTY_FOW = {
  npcs:       [],   // { id, name, location, floor, status, cover, overwatch, notes }
  killZones:  [],   // { id, location, coveredBy }
  locations:  [],   // { id, name, state }  state: 'open' | 'blocked' | 'breached'
  boobyTraps: [],   // { id, location, notes }
}

export async function saveFOW(sessionId, fow) {
  await updateDoc(doc(db, 't2k_sessions', sessionId), { fogOfWar: fow })
}
