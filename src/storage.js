// storage.js — localStorage wrapper with Firebase sync
import { db, isFirebaseConfigured } from './firebase'
import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const STORAGE_PREFIX = 'fo_'
const FIRESTORE_DOC = 'famops-state'

const storageDoc = () => (isFirebaseConfigured && db ? doc(db, 'famops', FIRESTORE_DOC) : null)
const canUseRemote = () => Boolean(isFirebaseConfigured && db && typeof navigator !== 'undefined' && navigator.onLine)

const writeRemote = async (key, val) => {
  if (!canUseRemote()) return
  const ref = storageDoc()
  if (!ref) return
  try {
    await setDoc(ref, { [STORAGE_PREFIX + key]: val }, { merge: true })
  } catch (error) {
    console.error('Firebase sync write failed:', error)
  }
}

const removeRemote = async (key) => {
  if (!canUseRemote()) return
  const ref = storageDoc()
  if (!ref) return
  try {
    await updateDoc(ref, { [STORAGE_PREFIX + key]: deleteField() })
  } catch (error) {
    console.error('Firebase sync remove failed:', error)
  }
}

export const storage = {
  get: (key) => {
    try {
      const v = localStorage.getItem(STORAGE_PREFIX + key)
      return v ? JSON.parse(v) : null
    } catch {
      return null
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val))
      void writeRemote(key, val)
    } catch (error) {
      console.error(error)
    }
  },
  remove: (key) => {
    localStorage.removeItem(STORAGE_PREFIX + key)
    void removeRemote(key)
  },
  clear: () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))

    if (!canUseRemote()) return

    const ref = storageDoc()
    if (!ref) return

    void getDoc(ref)
      .then((snap) => {
        if (!snap.exists()) return
        const data = snap.data() || {}
        const keysToDelete = Object.keys(data).filter((k) => k.startsWith(STORAGE_PREFIX))
        if (!keysToDelete.length) return
        updateDoc(ref, Object.fromEntries(keysToDelete.map((k) => [k, deleteField()])))
      })
      .catch((error) => console.error('Firebase sync clear failed:', error))
  },
  // Write to localStorage only — used by live sync to avoid re-triggering Firebase writes
  setLocal: (key, val) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val))
    } catch (error) {
      console.error('setLocal error:', error)
    }
  },
  hydrateFromFirebase: async () => {
    if (!canUseRemote()) return
    const ref = storageDoc()
    if (!ref) return

    try {
      const snap = await getDoc(ref)
      if (!snap.exists()) return

      const data = snap.data() || {}
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
    } catch (error) {
      console.error('Firebase hydration failed:', error)
    }
  },
}
