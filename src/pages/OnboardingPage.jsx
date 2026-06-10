// pages/OnboardingPage.jsx — First-time family setup wizard
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { AVATARS, COLORS } from '../constants'
import { hashPin } from '../security'

const STEPS = ['welcome', 'parents', 'kids', 'customize', 'done']

export default function OnboardingPage() {
  const { addUser, updateSettings, saveOnboardingDone, login } = useAuth()
  const [step, setStep]         = useState(0)
  const [appName, setAppName]   = useState('FamOps')
  const [color, setColor]       = useState('#f5a623')
  const [parents, setParents]   = useState([{ name:'', avatar:'👨', color:'#9c27b0', pin:'', pin2:'' }])
  const [kids, setKids]         = useState([{ name:'', avatar:'🦁', color:'#f5a623', pin:'', pin2:'' }])
  const [err, setErr]           = useState('')
  const navigate = useNavigate()

  const cur = STEPS[step]
  const pct = Math.round((step / (STEPS.length - 1)) * 100)

  const updateParent = (i, k, v) => setParents(p => p.map((x,idx)=>idx===i?{...x,[k]:v}:x))
  const updateKid    = (i, k, v) => setKids(p => p.map((x,idx)=>idx===i?{...x,[k]:v}:x))

  const validatePins = (list) => {
    for (const p of list) {
      if (!p.name.trim()) return 'Everyone needs a name'
      if (p.pin.length < 4) return 'PINs must be 4 digits'
      if (p.pin !== p.pin2) return `${p.name}'s PINs don't match`
    }
    return null
  }

  const finish = async () => {
    const e = validatePins([...parents, ...kids])
    if (e) { setErr(e); return }

    const createdUsers = []
    for (const p of parents) {
      const pinHash = await hashPin(p.pin)
      const u = { id:'u'+Date.now()+Math.random(), name:p.name.trim(), avatar:p.avatar, color:p.color, role:'parent', pin: pinHash, pinHash, joinedDate:new Date().toISOString().slice(0,10) }
      addUser(u)
      createdUsers.push(u)
    }
    for (const k of kids) {
      const pinHash = await hashPin(k.pin)
      const u = { id:'u'+Date.now()+Math.random(), name:k.name.trim(), avatar:k.avatar, color:k.color, role:'kid', pin: pinHash, pinHash, joinedDate:new Date().toISOString().slice(0,10) }
      addUser(u)
      createdUsers.push(u)
    }

    updateSettings({ appName, primaryColor: color })
    saveOnboardingDone(true)
    login(createdUsers[0])
    navigate('/home')
  }

  const PersonForm = ({ person, update, role }) => (
    <div style={{ background:'rgba(255,255,255,.05)', borderRadius:16, padding:'16px', marginBottom:12 }}>
      <input value={person.name} onChange={e=>update('name',e.target.value)} placeholder={`${role} name`}
        style={{ background:'rgba(255,255,255,.07)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:10, padding:'9px 12px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, width:'100%', marginBottom:10, fontSize:'.9rem' }} />
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
        {AVATARS.slice(0,20).map((a,i)=>(
          <button key={i} onClick={()=>update('avatar',a)} style={{ fontSize:'1.2rem', padding:4, borderRadius:8, border:person.avatar===a?`2px solid ${color}`:'2px solid transparent', background:'rgba(255,255,255,.06)', cursor:'pointer' }}>{a}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
        {COLORS.slice(0,8).map(c=>(
          <button key={c} onClick={()=>update('color',c)} style={{ width:24, height:24, borderRadius:'50%', background:c, border:person.color===c?'2px solid #fff':'2px solid transparent', cursor:'pointer' }} />
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <input value={person.pin} onChange={e=>update('pin',e.target.value.replace(/\D/g,'').slice(0,4))} placeholder='4-digit PIN' type='password' maxLength={4}
          style={{ background:'rgba(255,255,255,.07)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:10, padding:'9px 12px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, fontSize:'.9rem' }} />
        <input value={person.pin2} onChange={e=>update('pin2',e.target.value.replace(/\D/g,'').slice(0,4))} placeholder='Confirm PIN' type='password' maxLength={4}
          style={{ background:'rgba(255,255,255,.07)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:10, padding:'9px 12px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, fontSize:'.9rem' }} />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#0c0e24,#08091a)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px 16px', fontFamily:'Nunito,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        {/* Progress */}
        <div style={{ marginBottom:24 }}>
          <div style={{ height:4, background:'rgba(255,255,255,.08)', borderRadius:999, overflow:'hidden' }}>
            <div style={{ height:'100%', width:pct+'%', background:`linear-gradient(90deg,${color},#ff6b35)`, borderRadius:999, transition:'width .4s' }} />
          </div>
          <div style={{ fontSize:'.7rem', color:'#555', fontWeight:700, marginTop:6, textAlign:'right' }}>Step {step+1} of {STEPS.length}</div>
        </div>

        {cur === 'welcome' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'4rem', marginBottom:12 }}>🏠</div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'2rem', background:`linear-gradient(135deg,${color},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:8 }}>Welcome to FamOps</div>
            <div style={{ color:'rgba(255,255,255,.6)', fontWeight:600, marginBottom:28, lineHeight:1.7 }}>The family operating system. Set up takes 2 minutes and you'll be running a tighter ship by tonight.</div>
            <button onClick={()=>setStep(1)} style={{ width:'100%', padding:'14px', borderRadius:16, border:'none', background:`linear-gradient(135deg,${color},#ff6b35)`, color:'#000', fontWeight:800, fontSize:'1rem', cursor:'pointer' }}>Let's Set Up Your Family →</button>
          </div>
        )}

        {cur === 'parents' && (
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.6rem', marginBottom:6 }}>👨‍👩 Parents</div>
            <div style={{ color:'rgba(255,255,255,.5)', fontSize:'.85rem', fontWeight:600, marginBottom:16 }}>Add yourself and your co-parent. You'll have full control over the app.</div>
            {parents.map((p,i) => <PersonForm key={i} person={p} update={(k,v)=>updateParent(i,k,v)} role='Parent' />)}
            <button onClick={()=>setParents(p=>[...p,{name:'',avatar:'👩',color:'#e91e8c',pin:'',pin2:''}])} style={{ background:'rgba(255,255,255,.06)', border:'1.5px dashed rgba(255,255,255,.15)', borderRadius:12, padding:'10px', width:'100%', color:'#666', fontWeight:700, cursor:'pointer', marginBottom:16 }}>+ Add Another Parent</button>
            {err&&<div style={{ color:'#e53935', fontWeight:700, fontSize:'.82rem', marginBottom:10 }}>{err}</div>}
            <button onClick={()=>{ const e=validatePins(parents); if(e){setErr(e);return}; setErr(''); setStep(2) }} style={{ width:'100%', padding:'13px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${color},#ff6b35)`, color:'#000', fontWeight:800, cursor:'pointer' }}>Next →</button>
          </div>
        )}

        {cur === 'kids' && (
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.6rem', marginBottom:6 }}>👧 Kids</div>
            <div style={{ color:'rgba(255,255,255,.5)', fontSize:'.85rem', fontWeight:600, marginBottom:16 }}>Add your kids. You can add more later from Control Center.</div>
            {kids.map((k,i) => <PersonForm key={i} person={k} update={(kk,v)=>updateKid(i,kk,v)} role='Kid' />)}
            <button onClick={()=>setKids(k=>[...k,{name:'',avatar:'🐯',color:'#4a90e2',pin:'',pin2:''}])} style={{ background:'rgba(255,255,255,.06)', border:'1.5px dashed rgba(255,255,255,.15)', borderRadius:12, padding:'10px', width:'100%', color:'#666', fontWeight:700, cursor:'pointer', marginBottom:16 }}>+ Add Another Kid</button>
            {err&&<div style={{ color:'#e53935', fontWeight:700, fontSize:'.82rem', marginBottom:10 }}>{err}</div>}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setStep(1)} style={{ padding:'13px 20px', borderRadius:14, border:'none', background:'rgba(255,255,255,.07)', color:'#888', fontWeight:800, cursor:'pointer' }}>← Back</button>
              <button onClick={()=>{ const e=validatePins(kids); if(e){setErr(e);return}; setErr(''); setStep(3) }} style={{ flex:1, padding:'13px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${color},#ff6b35)`, color:'#000', fontWeight:800, cursor:'pointer' }}>Next →</button>
            </div>
          </div>
        )}

        {cur === 'customize' && (
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.6rem', marginBottom:6 }}>🎨 Make It Yours</div>
            <div style={{ color:'rgba(255,255,255,.5)', fontSize:'.85rem', fontWeight:600, marginBottom:20 }}>Give your family's app a name and pick your color. You can change this anytime.</div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:'.8rem', color:'#666', fontWeight:700, marginBottom:6 }}>App Name</div>
              <input value={appName} onChange={e=>setAppName(e.target.value)} placeholder='FamOps'
                style={{ background:'rgba(255,255,255,.07)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:12, padding:'11px 14px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, width:'100%', fontSize:'1rem' }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:'.8rem', color:'#666', fontWeight:700, marginBottom:10 }}>Primary Color</div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setColor(c)} style={{ width:36, height:36, borderRadius:'50%', background:c, border:color===c?'3px solid #fff':'3px solid transparent', cursor:'pointer', transition:'all .15s' }} />
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,.05)', borderRadius:16, padding:'16px', marginBottom:20, textAlign:'center' }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.8rem', background:`linear-gradient(135deg,${color},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{appName||'FamOps'}</div>
              <div style={{ fontSize:'.75rem', color:'#555', fontWeight:600 }}>Preview</div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setStep(2)} style={{ padding:'13px 20px', borderRadius:14, border:'none', background:'rgba(255,255,255,.07)', color:'#888', fontWeight:800, cursor:'pointer' }}>← Back</button>
              <button onClick={()=>setStep(4)} style={{ flex:1, padding:'13px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${color},#ff6b35)`, color:'#000', fontWeight:800, cursor:'pointer' }}>Almost Done →</button>
            </div>
          </div>
        )}

        {cur === 'done' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'4rem', marginBottom:12 }}>🎉</div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.8rem', color, marginBottom:8 }}>{appName} is ready!</div>
            <div style={{ color:'rgba(255,255,255,.6)', fontWeight:600, marginBottom:10, lineHeight:1.7 }}>
              {parents.length} parent{parents.length>1?'s':''} · {kids.length} kid{kids.length>1?'s':''} · All set up and ready to go.
            </div>
            <div style={{ background:'rgba(255,255,255,.05)', borderRadius:14, padding:'14px', marginBottom:24, textAlign:'left' }}>
              <div style={{ fontWeight:800, color, marginBottom:8, fontSize:'.9rem' }}>Quick start tips:</div>
              {['Go to Control Center to set up chores and the schedule','Each kid logs in with their PIN from the login screen','Sign up for chores opens at 8am (you can change this in Settings)','Use Display Mode on your Portal as the family hub screen'].map((t,i)=>(
                <div key={i} style={{ fontSize:'.8rem', color:'rgba(255,255,255,.6)', fontWeight:600, marginBottom:5, display:'flex', gap:8 }}>
                  <span style={{ color, fontWeight:800 }}>{i+1}.</span>{t}
                </div>
              ))}
            </div>
            <button onClick={finish} style={{ width:'100%', padding:'14px', borderRadius:16, border:'none', background:`linear-gradient(135deg,${color},#ff6b35)`, color:'#000', fontWeight:800, fontSize:'1rem', cursor:'pointer' }}>Enter {appName} 🚀</button>
          </div>
        )}
      </div>
    </div>
  )
}
