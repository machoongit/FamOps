// pages/LoginPage.jsx
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { PinScreen, AddUserModal, Btn, UserCard } from '../components'

export default function LoginPage() {
  const { users, currentUser, login, addUser, points, settings, effectiveRanks } = useAuth()
  const [pinTarget, setPinTarget] = useState(null)
  const [showAdd, setShowAdd]     = useState(false)
  const navigate = useNavigate()
  const color   = settings?.primaryColor || '#f5a623'
  const appName = settings?.appName || 'FamOps'

  if (currentUser) return <Navigate to='/home' replace />

  if (pinTarget) return (
    <PinScreen
      user={pinTarget}
      onSuccess={(u) => { login(u); navigate('/home') }}
      onBack={() => setPinTarget(null)}
    />
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, padding:20, background:'linear-gradient(180deg,#0c0e24,#08091a)' }}>
      <div style={{ textAlign:'center', marginBottom:8 }}>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'3rem', background:`linear-gradient(135deg,${color},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:2, marginBottom:4 }}>{appName}</div>
        <div style={{ color:'#555', fontWeight:700, fontSize:'.82rem', letterSpacing:1 }}>FAMILY OPERATING SYSTEM</div>
      </div>

      {users.length === 0 ? (
        <div style={{ textAlign:'center' }}>
          <div style={{ color:'#666', fontSize:'.9rem', fontWeight:600, marginBottom:20, maxWidth:280 }}>Welcome! Set up your family to get started.</div>
          <Btn onClick={()=>setShowAdd(true)}>+ Setup Family</Btn>
        </div>
      ) : (
        <>
          <div style={{ color:'#555', fontWeight:700, fontSize:'.82rem', letterSpacing:1 }}>WHO ARE YOU?</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:12, width:'100%', maxWidth:560 }}>
            {users.map(u=>(
              <UserCard key={u.id} user={u} xp={points?.[u.id]||0} onClick={()=>setPinTarget(u)} ranks={effectiveRanks} />
            ))}
          </div>
          <Btn variant='ghost' sm onClick={()=>setShowAdd(true)}>+ Add Person</Btn>
        </>
      )}

      {showAdd && (
        <AddUserModal
          onAdd={(u)=>{ addUser(u); setShowAdd(false) }}
          onClose={()=>setShowAdd(false)}
          existingParents={users.filter(u=>u.role==='parent')}
          isParentSession={false}
        />
      )}
    </div>
  )
}
