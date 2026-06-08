// storage.js — localStorage wrapper, Firebase-ready architecture
// All keys namespaced under "fo_" (FamOps)
// To upgrade to Firebase: replace get/set/remove with Firestore calls

export const storage = {
  get: (key) => {
    try { const v = localStorage.getItem('fo_' + key); return v ? JSON.parse(v) : null } catch { return null }
  },
  set: (key, val) => {
    try { localStorage.setItem('fo_' + key, JSON.stringify(val)) } catch(e) { console.error(e) }
  },
  remove: (key) => { localStorage.removeItem('fo_' + key) },
  clear: () => {
    Object.keys(localStorage).filter(k => k.startsWith('fo_')).forEach(k => localStorage.removeItem(k))
  }
}
