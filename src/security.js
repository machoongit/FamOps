const normalizePin = (pin) => String(pin ?? '').trim()

export const hashPin = async (pin) => {
  const value = normalizePin(pin)
  if (!value) return ''
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const verifyPin = async (user, candidate) => {
  const value = normalizePin(candidate)
  if (!value || !user) return false
  if (user.pin === value) return true
  if (user.pinHash) return (await hashPin(value)) === user.pinHash
  return false
}
