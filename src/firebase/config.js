import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Replace with your full Firebase config from:
// Firebase Console > Project Settings > Your apps > SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyDoZ0ZqAEYAVyYZnuf6EoFSCJfC-24F-QE",
  authDomain: "electronic-grimoire.firebaseapp.com",
  projectId: "electronic-grimoire",
  storageBucket: "electronic-grimoire.appspot.com",
  messagingSenderId: "1032950336095",
  appId: "1:1032950336095:web:d3e39e35efb90a640429ea"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
