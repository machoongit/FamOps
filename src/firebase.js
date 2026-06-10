import { getApp, getApps, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

const hasRequiredConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId)
const app = hasRequiredConfig ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

export const isFirebaseConfigured = Boolean(app && firebaseConfig.projectId && firebaseConfig.apiKey)

export const createFirebaseAccount = async (email, password) => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured')
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signInFirebaseAccount = async (email, password) => {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured')
  return signInWithEmailAndPassword(auth, email, password)
}

export const signOutFirebaseAccount = async () => {
  if (!isFirebaseConfigured) return
  return signOut(auth)
}
