// components.jsx — FamOps shared UI
import { useState } from 'react'
import { AVATARS, COLORS, RANKS, getRank } from './constants'

// ── Layout ────────────────────────────────────────────────────────────────
export const PageWrap = ({ children }) => (
  <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px 14px 90px' }}>
    {children}
  </div>
)

// ── Typography ─────────────────────────────────────────────────────────────
export const AppLogo = ({ name = 'FamOps', color = '#f5a623' }) => (
  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '1.8rem', color, letterSpacing: 1 }}>
    {name}
  </div>
)

export const SectionTitle = ({ children, style }) => (
  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '.95rem', color: '#666', letterSpacing: .5, marginBottom: 12, textTransform: 'uppercase', ...style }}>
    {children}
  </div>
)

// ── Cards ──────────────────────────────────────────────────────────────────
export const Card = ({ children, style, onClick, color }) => (
  <div onClick={onClick} style={{
    background: '#1c1c1c', borderRadius: 16, padding: 18, marginBottom: 14,
    border: `1.5px solid ${color || 'rgba(255,255,255,.07)'}`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all .2s', ...style
  }}>
    {children}
  </div>
)

// ── Buttons ────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  gold:   { background: '#f5a623', color: '#000' },
  ghost:  { background: 'transparent', color: '#888', border: '1.5px solid rgba(255,255,255,.1)' },
  green:  { background: '#43a047', color: '#fff' },
  red:    { background: '#e53935', color: '#fff' },
  purple: { background: '#9c27b0', color: '#fff' },
  blue:   { background: '#4a90e2', color: '#fff' },
  pink:   { background: '#e91e8c', color: '#fff' },
  dark:   { background: '#2a2a2a', color: '#fff', border: '1.5px solid rgba(255,255,255,.1)' },
}

export const Btn = ({ children, variant = 'gold', sm, full, style, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: sm ? '6px 14px' : '10px 22px',
    borderRadius: sm ? 8 : 12,
    border: 'none',
    fontFamily: 'Nunito,sans-serif',
    fontWeight: 800,
    fontSize: sm ? '.78rem' : '.9rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all .15s',
    width: full ? '100%' : 'auto',
    opacity: disabled ? .4 : 1,
    ...(BTN_VARIANTS[variant] || BTN_VARIANTS.gold),
    ...style
  }}>
    {children}
  </button>
)

// ── Inputs ─────────────────────────────────────────────────────────────────
export const Input = ({ value, onChange, placeholder, type, maxLength, style, autoFocus, rows, name }) => {
  const base = {
    background: '#141414', border: '1.5px solid rgba(255,255,255,.1)',
    borderRadius: 10, padding: '10px 14px', color: '#fff',
    fontFamily: 'Nunito,sans-serif', fontWeight: 600, fontSize: '.92rem',
    outline: 'none', width: '100%', transition: 'border-color .2s', ...style
  }
  if (rows) return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...base, resize: 'vertical' }} autoFocus={autoFocus} />
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type || 'text'} maxLength={maxLength} style={base} autoFocus={autoFocus} name={name} />
}

export const Select = ({ value, onChange, children, style }) => (
  <select value={value} onChange={onChange} style={{
    background: '#141414', border: '1.5px solid rgba(255,255,255,.1)',
    borderRadius: 10, padding: '10px 14px', color: '#fff',
    fontFamily: 'Nunito,sans-serif', fontWeight: 600, fontSize: '.92rem',
    outline: 'none', width: '100%', ...style
  }}>
    {children}
  </select>
)

// ── Progress ───────────────────────────────────────────────────────────────
export const ProgressBar = ({ pct, color, height }) => (
  <div style={{ height: height || 7, borderRadius: 999, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
    <div style={{ height: '100%', borderRadius: 999, width: Math.min(pct, 100) + '%', background: color || 'linear-gradient(90deg,#43a047,#f5a623)', transition: 'width .4s' }} />
  </div>
)

// ── Badge ──────────────────────────────────────────────────────────────────
export const Badge = ({ children, color, bg }) => (
  <span style={{
    fontSize: '.68rem', fontWeight: 800, padding: '3px 9px', borderRadius: 999,
    letterSpacing: .4, textTransform: 'uppercase', whiteSpace: 'nowrap',
    color: color || '#888', background: bg || 'rgba(255,255,255,.07)'
  }}>
    {children}
  </span>
)

// ── Toast ──────────────────────────────────────────────────────────────────
export const Toast = ({ toast }) => toast ? (
  <div style={{
    position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
    fontWeight: 800, padding: '11px 26px', borderRadius: 999, fontSize: '.88rem',
    animation: 'fadeUp .3s ease', zIndex: 999, color: '#000',
    background: toast.bg || '#f5a623', whiteSpace: 'nowrap', maxWidth: '90vw',
    boxShadow: '0 4px 20px rgba(0,0,0,.4)',
  }}>
    {toast.msg}
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
  </div>
) : null

// ── Modal ──────────────────────────────────────────────────────────────────
export const Modal = ({ children, onClose, maxWidth }) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, padding: 16,
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      background: '#1c1c1c', borderRadius: 20, padding: 24,
      width: '100%', maxWidth: maxWidth || 460,
      border: '1.5px solid rgba(255,255,255,.1)',
      maxHeight: '90vh', overflowY: 'auto',
    }}>
      {children}
    </div>
  </div>
)

export const ModalTitle = ({ children }) => (
  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '1.3rem', marginBottom: 18 }}>
    {children}
  </div>
)

// ── PIN Screen ─────────────────────────────────────────────────────────────
export const PinScreen = ({ user, onSuccess, onBack }) => {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)

  const handle = (k) => {
    if (k === 'del') { setPin(p => p.slice(0, -1)); setErr(false); return }
    const next = pin + k
    setPin(next)
    if (next.length === 4) {
      if (user.pin === next) { onSuccess(user) }
      else { setErr(true); setTimeout(() => { setPin(''); setErr(false) }, 700) }
    }
  }

  const rank = getRank(0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 20, background: '#0a0a0a' }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: user.color + '22', border: `3px solid ${user.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{user.avatar}</div>
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '1.6rem', color: user.color }}>{user.name}</div>
      <div style={{ color: '#666', fontWeight: 700, fontSize: '.82rem' }}>Enter your PIN</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', transition: 'all .15s', background: pin.length > i ? (err ? '#e53935' : user.color) : 'rgba(255,255,255,.15)' }} />
        ))}
      </div>
      {err && <div style={{ color: '#e53935', fontWeight: 800, fontSize: '.82rem' }}>Wrong PIN — try again</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, maxWidth: 220 }}>
        {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, i) => (
          <button key={i} onClick={() => k && handle(k)} style={{
            visibility: k === '' ? 'hidden' : 'visible',
            padding: 16, borderRadius: 12, border: 'none',
            background: '#1c1c1c', color: k === 'del' ? '#e53935' : '#fff',
            fontFamily: "'Fredoka One',cursive", fontSize: '1.3rem',
            cursor: 'pointer', transition: 'all .15s',
          }}>
            {k === 'del' ? '⌫' : k}
          </button>
        ))}
      </div>
      <Btn variant='ghost' sm onClick={onBack}>← Back</Btn>
    </div>
  )
}

// ── Add User Modal ─────────────────────────────────────────────────────────
export const AddUserModal = ({ onAdd, onClose }) => {
  const [name,   setName]   = useState('')
  const [avatar, setAvatar] = useState('🦁')
  const [color,  setColor]  = useState('#f5a623')
  const [role,   setRole]   = useState('kid')
  const [pin,    setPin]    = useState('')
  const [pin2,   setPin2]   = useState('')
  const [err,    setErr]    = useState('')

  const submit = () => {
    if (!name.trim()) { setErr('Enter a name'); return }
    if (pin.length < 4) { setErr('PIN must be 4 digits'); return }
    if (pin !== pin2) { setErr("PINs don't match"); return }
    onAdd({ id: 'u' + Date.now(), name: name.trim(), avatar, color, role, pin, joinedDate: new Date().toISOString().slice(0, 10) })
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Add Family Member</ModalTitle>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <Btn sm variant={role === 'kid' ? 'gold' : 'ghost'} onClick={() => setRole('kid')}>Kid</Btn>
        <Btn sm variant={role === 'parent' ? 'purple' : 'ghost'} onClick={() => setRole('parent')}>Parent</Btn>
      </div>
      <Input value={name} onChange={e => setName(e.target.value)} placeholder='Name' style={{ marginBottom: 12 }} autoFocus />

      <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>Pick Avatar</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, maxHeight: 120, overflowY: 'auto' }}>
        {AVATARS.map((a, i) => (
          <button key={i} onClick={() => setAvatar(a)} style={{
            fontSize: '1.4rem', padding: 5, borderRadius: 9,
            border: avatar === a ? '2px solid #f5a623' : '2px solid transparent',
            background: '#141414', cursor: 'pointer'
          }}>{a}</button>
        ))}
      </div>

      <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>Pick Color</div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)} style={{
            width: 28, height: 28, borderRadius: '50%', background: c,
            border: color === c ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer'
          }} />
        ))}
      </div>

      <Input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} placeholder='4-digit PIN' type='password' maxLength={4} style={{ marginBottom: 10 }} />
      <Input value={pin2} onChange={e => setPin2(e.target.value.replace(/\D/g, ''))} placeholder='Confirm PIN' type='password' maxLength={4} style={{ marginBottom: err ? 10 : 18 }} />
      {err && <div style={{ color: '#e53935', fontWeight: 800, fontSize: '.82rem', marginBottom: 14 }}>{err}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <Btn variant={role === 'parent' ? 'purple' : 'gold'} style={{ flex: 1 }} onClick={submit}>Add {role === 'parent' ? 'Parent' : 'Kid'}</Btn>
        <Btn variant='ghost' onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  )
}

// ── User Card (for login screen) ───────────────────────────────────────────
export const UserCard = ({ user, xp, onClick }) => {
  const rank = getRank(xp || 0)
  return (
    <div onClick={onClick} style={{
      background: '#1c1c1c', borderRadius: 16, padding: '20px 14px',
      textAlign: 'center', cursor: 'pointer',
      border: `2px solid ${user.color}33`,
      transition: 'all .2s',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: user.color + '22', border: `2px solid ${user.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 10px' }}>
        {user.avatar}
      </div>
      <div style={{ fontFamily: "'Fredoka One',cursive", color: user.color, fontSize: '1rem', marginBottom: 2 }}>{user.name}</div>
      <div style={{ fontSize: '.7rem', color: '#666', fontWeight: 700 }}>{rank.icon} {rank.name}</div>
      {user.role === 'parent' && <div style={{ fontSize: '.65rem', color: '#9c27b0', fontWeight: 800, marginTop: 2 }}>PARENT</div>}
    </div>
  )
}

// ── Rank Display ──────────────────────────────────────────────────────────
export const RankBadge = ({ xp, compact }) => {
  const rank = getRank(xp || 0)
  if (compact) return (
    <span style={{ fontSize: '.75rem', fontWeight: 800, color: rank.color }}>
      {rank.icon} {rank.name}
    </span>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141414', borderRadius: 10, padding: '8px 14px' }}>
      <span style={{ fontSize: '1.4rem' }}>{rank.icon}</span>
      <div>
        <div style={{ fontWeight: 800, color: rank.color, fontSize: '.9rem' }}>{rank.name}</div>
        <div style={{ fontSize: '.7rem', color: '#666', fontWeight: 600 }}>{xp || 0} XP total</div>
      </div>
    </div>
  )
}

// ── Points Display ─────────────────────────────────────────────────────────
export const PointsPill = ({ points, color }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(245,166,35,.15)', borderRadius: 999, padding: '4px 12px', fontWeight: 800, fontSize: '.82rem', color: color || '#f5a623' }}>
    ⭐ {points || 0} pts
  </div>
)

// ── Tab Bar ────────────────────────────────────────────────────────────────
export const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: 'flex', background: '#141414', borderRadius: 12, padding: 3, marginBottom: 20, gap: 0 }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        flex: 1, padding: '9px 4px', border: 'none', borderRadius: 9,
        background: active === t.key ? '#1c1c1c' : 'transparent',
        color: active === t.key ? '#fff' : '#666',
        fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: '.74rem',
        cursor: 'pointer', transition: 'all .2s', textAlign: 'center',
      }}>
        {t.label}
      </button>
    ))}
  </div>
)

// ── Chore Row ──────────────────────────────────────────────────────────────
export const ChoreRow = ({ label, status, isLocked, isTaken, takenBy, mandatory, points, onCheck }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', borderRadius: 12, background: '#141414', marginBottom: 9 }}>
    <button onClick={onCheck} style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '.9rem', cursor: isLocked || isTaken ? 'not-allowed' : 'pointer',
      border: 'none', transition: 'all .15s',
      background: status === 'approved' ? '#43a047' : status === 'pending' ? '#f5a623' : isLocked ? 'rgba(229,57,53,.15)' : isTaken ? 'rgba(74,144,226,.15)' : 'rgba(255,255,255,.08)',
      color: status === 'approved' ? '#fff' : status === 'pending' ? '#000' : isLocked ? '#e53935' : isTaken ? '#4a90e2' : '#666',
    }}>
      {status === 'approved' ? '✓' : status === 'pending' ? '⏳' : isLocked ? '🔒' : isTaken ? '👤' : ''}
    </button>
    <div style={{ flex: 1, fontWeight: 600, fontSize: '.9rem', color: isLocked || isTaken ? '#555' : '#fff', fontStyle: isLocked ? 'italic' : 'normal' }}>{label}</div>
    {mandatory && <Badge color='#9c27b0' bg='rgba(156,39,176,.12)'>Required</Badge>}
    {points > 0 && <Badge color='#f5a623' bg='rgba(245,166,35,.1)'>+{points}pts</Badge>}
    {isLocked && <Badge color='#e53935' bg='rgba(229,57,53,.1)'>Locked</Badge>}
    {isTaken && takenBy && <Badge color='#4a90e2' bg='rgba(74,144,226,.1)'>{takenBy.name}</Badge>}
    {status === 'approved' && <Badge color='#43a047' bg='rgba(67,160,71,.1)'>Done</Badge>}
    {status === 'pending' && <Badge color='#f5a623' bg='rgba(245,166,35,.1)'>Pending</Badge>}
  </div>
)

// ── Strike Dots ────────────────────────────────────────────────────────────
export const StrikeDots = ({ count, max = 3 }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {Array.from({ length: max }).map((_, i) => (
      <div key={i} style={{
        width: 20, height: 20, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '.65rem', fontWeight: 800,
        background: i < count ? '#e53935' : 'rgba(255,255,255,.08)',
        color: i < count ? '#fff' : '#555',
      }}>{i + 1}</div>
    ))}
  </div>
)

// ── Empty State ─────────────────────────────────────────────────────────────
export const Empty = ({ icon, text, sub }) => (
  <div style={{ textAlign: 'center', padding: '32px 16px', color: '#555' }}>
    {icon && <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{icon}</div>}
    <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: sub ? 4 : 0 }}>{text}</div>
    {sub && <div style={{ fontSize: '.8rem', marginTop: 4 }}>{sub}</div>}
  </div>
)
