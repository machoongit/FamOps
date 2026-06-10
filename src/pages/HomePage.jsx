// pages/HomePage.jsx — True hub, nothing below the fold
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { ProgressBar, Toast, Modal, ModalTitle, StrikeDots, Badge, Btn, Input } from '../components'
import { getRank, getNextRank, REQUEST_TYPES, todayKey, weekKey, isWorkday, getDayName, formatDate, BADGES } from '../constants'

const DAYS_SHORT = ['S','M','T','W','T','F','S']
const DAYS_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function HomeCalendar({ calendars, specialDays, currentUser, isParent, color, today, navigate, allEvents }) {
  const [selDay, setSelDay] = useState(today)
  const [month, setMonth]   = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() } })

  const firstDay = new Date(month.y, month.m, 1).getDay()
  const daysInMo = new Date(month.y, month.m + 1, 0).getDate()
  const pad = n => String(n).padStart(2,'0')
  const ds  = d => `${month.y}-${pad(month.m+1)}-${pad(d)}`

  const eventsOn = dateStr => (allEvents||[]).filter(ev =>
    ev.date === dateStr && (isParent || ev.visibility === 'all' || ev.ownerId === currentUser.id)
  )
  const specialOn = dateStr => {
    const d = new Date(dateStr+'T00:00:00')
    return (specialDays||[]).find(s => s.day === DAYS_FULL[d.getDay()])
  }

  const selEvents  = eventsOn(selDay)
  const selSpecial = specialOn(selDay)
  const selDate    = new Date(selDay+'T00:00:00')
  const monthName  = new Date(month.y, month.m, 1).toLocaleDateString('en-US',{month:'short',year:'numeric'})

  return (
    <div style={{ padding:'0 16px 8px', flexShrink:0 }}>
      <div style={{ background:'rgba(255,255,255,.05)', borderRadius:18, padding:'10px 12px', border:'1.5px solid rgba(255,255,255,.08)' }}>

        {/* Month nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <button onClick={()=>setMonth(p=>{ const d=new Date(p.y,p.m-1,1); return{y:d.getFullYear(),m:d.getMonth()} })}
            style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#fff', width:26, height:26, borderRadius:8, cursor:'pointer', fontWeight:800 }}>‹</button>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.85rem', color }}>{monthName}</div>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={()=>setMonth(p=>{ const d=new Date(p.y,p.m+1,1); return{y:d.getFullYear(),m:d.getMonth()} })}
              style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#fff', width:26, height:26, borderRadius:8, cursor:'pointer', fontWeight:800 }}>›</button>
            <button onClick={()=>navigate('/calendar')} style={{ background:color+'22', border:`1px solid ${color}44`, color, fontWeight:800, fontSize:'.65rem', padding:'4px 10px', borderRadius:8, cursor:'pointer' }}>+ Add</button>
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:3 }}>
          {DAYS_SHORT.map((d,i)=><div key={i} style={{ textAlign:'center', fontSize:'.58rem', color:'#444', fontWeight:800, padding:'2px 0' }}>{d}</div>)}
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
          {Array(firstDay).fill(null).map((_,i)=><div key={'e'+i} />)}
          {Array(daysInMo).fill(null).map((_,i)=>{
            const d=i+1, dateStr=ds(d)
            const evs=eventsOn(dateStr), spec=specialOn(dateStr)
            const isSel=dateStr===selDay, isTod=dateStr===today
            return (
              <div key={d} onClick={()=>setSelDay(dateStr)}
                style={{ borderRadius:7, padding:'3px 1px', textAlign:'center', cursor:'pointer', background:isSel?color:isTod?color+'25':'transparent', border:`1px solid ${isTod&&!isSel?color:'transparent'}`, transition:'all .1s' }}>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.8rem', color:isSel?'#000':isTod?color:'rgba(255,255,255,.75)', lineHeight:1.2 }}>{d}</div>
                <div style={{ display:'flex', justifyContent:'center', gap:1, marginTop:1, minHeight:4 }}>
                  {spec&&<div style={{ width:3, height:3, borderRadius:'50%', background:'#4a90e2' }} />}
                  {evs.slice(0,2).map((ev,ei)=><div key={ei} style={{ width:3, height:3, borderRadius:'50%', background:ev.color }} />)}
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected day events */}
        {(selEvents.length > 0 || selSpecial) && (
          <div style={{ marginTop:8, borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:7 }}>
            <div style={{ fontSize:'.65rem', color:'#555', fontWeight:800, marginBottom:5 }}>
              {selDate.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
              {selDay===today&&<span style={{ color:'#22c55e', marginLeft:6 }}>TODAY</span>}
            </div>
            {selSpecial&&<div style={{ display:'flex', gap:6, alignItems:'center', fontSize:'.75rem', fontWeight:700, color:'#4a90e2', marginBottom:4 }}><span>{selSpecial.icon}</span>{selSpecial.event}</div>}
            {selEvents.map(ev=>(
              <div key={ev.id} style={{ display:'flex', gap:8, alignItems:'center', padding:'4px 8px', background:ev.color+'15', borderRadius:8, marginBottom:4, borderLeft:`2px solid ${ev.color}` }}>
                <div style={{ fontWeight:700, fontSize:'.75rem', flex:1 }}>{ev.title}</div>
                {ev.time&&<div style={{ fontSize:'.65rem', color:'rgba(255,255,255,.4)' }}>{ev.time}</div>}
              </div>
            ))}
          </div>
        )}
        {selEvents.length===0&&!selSpecial&&(
          <div style={{ marginTop:6, borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:6, fontSize:'.68rem', color:'#444', fontWeight:600 }}>
            {selDate.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})} — nothing scheduled
            {selDay===today&&<span style={{ color:'#22c55e', marginLeft:4 }}>• TODAY</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Stat chip ─────────────────────────────────────────────────────────────
const Chip = ({ icon, label, color, bg }) => (
  <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:bg||'rgba(255,255,255,.07)', borderRadius:999, padding:'5px 12px', fontWeight:800, fontSize:'.75rem', color:color||'#fff' }}>
    <span>{icon}</span>{label}
  </div>
)

// ── Big nav tile ──────────────────────────────────────────────────────────
const Tile = ({ icon, label, sub, gradient, onClick, badge, color }) => (
  <div onClick={onClick} style={{
    background: gradient, borderRadius:22, padding:'18px 14px',
    cursor:'pointer', position:'relative', overflow:'hidden',
    border:'1.5px solid rgba(255,255,255,.09)',
    boxShadow:'0 6px 24px rgba(0,0,0,.35)',
    display:'flex', flexDirection:'column', justifyContent:'space-between',
    minHeight:110, transition:'transform .12s',
    WebkitTapHighlightColor:'transparent',
  }}
  onTouchStart={e=>e.currentTarget.style.transform='scale(.96)'}
  onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}
  onMouseDown={e=>e.currentTarget.style.transform='scale(.96)'}
  onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
  >
    {badge && <div style={{ position:'absolute', top:10, right:10, background:'#e53935', color:'#fff', fontWeight:800, fontSize:'.62rem', padding:'2px 7px', borderRadius:999 }}>{badge}</div>}
    <div style={{ fontSize:'2rem' }}>{icon}</div>
    <div>
      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.05rem', color:'#fff', lineHeight:1.2 }}>{label}</div>
      {sub && <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.55)', fontWeight:700, marginTop:2 }}>{sub}</div>}
    </div>
    <div style={{ position:'absolute', bottom:-16, right:-16, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,.06)' }} />
  </div>
)

export default function HomePage() {
  const {
    currentUser, users, kids, isParent, isKid,
    points, badges, strikes, weekendStatus,
    punishments, requests, saveRequests,
    announcements, specialDays,
    chores, signups, completions,
    learnProgress, readingLog, writingLog,
    calendars, schedule,
    settings, profileVisibility,
    customRequestTypes,
    parentNotes, saveParentNotes,
    effectiveRanks, mealRequests,
    logout,
  } = useAuth()

  const [modal, setModal]         = useState(null)
  const [profileUid, setProfileUid] = useState(null)
  const [reqType, setReqType]     = useState(null)
  const [reqNote, setReqNote]     = useState('')
  const [reqDate, setReqDate]     = useState('')
  const [toast, setToast]         = useState(null)
  const navigate = useNavigate()

  const color   = settings?.primaryColor || '#f5a623'
  const appName = settings?.appName || 'FamOps'
  const today   = todayKey()
  const wk      = weekKey()
  const workday = isWorkday(settings)
  const dayName = getDayName()

  const myPoints  = points?.[currentUser.id] || 0
  const myRank    = getRank(myPoints, effectiveRanks)
  const myStrikes = strikes?.[currentUser.id]?.[wk] || 0
  const lostWknd  = weekendStatus?.[currentUser.id]?.[wk] === 'lost'
  const myPunishments = punishments.filter(p=>{
    if (p.kidId!==currentUser.id||p.resolved) return false
    if (p.expiryDate && p.expiryDate < today) return false // expired
    return true
  })
  const todaySU   = signups?.[today] || {}
  const myChores  = chores.filter(c=>todaySU[c.id]===currentUser.id)
  const myDone    = myChores.filter(c=>completions?.[currentUser.id]?.[c.id]?.date===today&&completions[currentUser.id][c.id].status==='approved').length
  const myLessons = Object.keys(learnProgress?.[currentUser.id]||{}).filter(k=>k!=='_customSubjects').length
  const pendingReqs = requests.filter(r=>r.kidId===currentUser.id&&r.status==='pending').length
  const allRequestTypes = [...REQUEST_TYPES, ...(customRequestTypes||[])]

  // Parent stats
  const pendingApprovals = isParent ? (() => { let c=0; kids.forEach(k=>Object.values(completions?.[k.id]||{}).forEach(v=>{ if(v.date===today&&v.status==='pending') c++ })); return c })() : 0
  const pendingRequests  = isParent ? requests.filter(r=>r.status==='pending').length : 0

  // Next calendar event
  const allEvents = Object.values(calendars||{}).flat()
  const upcomingEvs = allEvents.filter(ev=>ev.date>=today&&(isParent||ev.visibility==='all'||ev.ownerId===currentUser.id)).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4)
  const nextEvent = upcomingEvs[0]

  // Today's special
  const special = specialDays?.find(s=>s.day===dayName)

  const showToast = (msg, bg) => { setToast({ msg, bg:bg||color }); setTimeout(()=>setToast(null),2800) }

  const exportFamilyData = async () => {
    const dump = Object.keys(localStorage)
      .filter(k => k.startsWith('fo_'))
      .reduce((acc, key) => ({ ...acc, [key]: JSON.parse(localStorage.getItem(key) || 'null') }), {})

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(JSON.stringify(dump, null, 2))
        showToast('Family data copied to clipboard', '#22c55e')
        return
      }
    } catch (e) {
      console.warn('Clipboard export failed, falling back to download.', e)
    }

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `famops-backup-${today}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Family data downloaded', '#22c55e')
  }

  const submitRequest = () => {
    if (!reqNote.trim()) { showToast('Add a note!','#e53935'); return }
    const rt = allRequestTypes.find(r=>r.id===reqType) || allRequestTypes[0]
    saveRequests([...requests, { id:'req'+Date.now(), kidId:currentUser.id, kidName:currentUser.name, kidAvatar:currentUser.avatar, kidColor:currentUser.color, type:rt.id, typeLabel:rt.label, typeIcon:rt.icon, note:reqNote.trim(), date:reqDate||null, status:'pending', parentNote:'', submittedAt:new Date().toISOString() }])
    setReqNote(''); setReqDate(''); setModal(null); showToast('Request sent! ✨')
  }

  const profileUser = profileUid ? users.find(u=>u.id===profileUid) : null

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div style={{ height:'100dvh', display:'flex', flexDirection:'column', background:'linear-gradient(180deg,#0c0e24 0%,#08091a 100%)', overflow:'hidden' }}>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <div style={{ padding:'14px 16px 10px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* App name */}
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.6rem', background:`linear-gradient(135deg,${color},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>{appName}</div>
            <div style={{ fontSize:'.65rem', color:'#555', fontWeight:700 }}>{dayName} · {workday?'Work Day':'Weekend'}</div>
            <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,.45)', fontWeight:700, marginTop:2 }}>Local family dashboard · backup your data anytime</div>
          </div>

          {/* Avatar + sign out */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={exportFamilyData} style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#fff', fontWeight:800, fontSize:'.72rem', padding:'6px 12px', borderRadius:999, cursor:'pointer' }}>
              Backup
            </button>
            <button onClick={()=>{ logout(); navigate('/') }} style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#888', fontWeight:800, fontSize:'.72rem', padding:'6px 12px', borderRadius:999, cursor:'pointer' }}>
              Sign Out
            </button>
            <div onClick={()=>{ setProfileUid(currentUser.id); setModal('profile') }} style={{ width:44, height:44, borderRadius:14, background:currentUser.color+'22', border:`2px solid ${currentUser.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', cursor:'pointer', flexShrink:0 }}>
              {currentUser.avatar}
            </div>
          </div>
        </div>

        {/* Status strip */}
        <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
          <Chip icon={myRank.icon} label={myRank.name} color={myRank.color} />
          <Chip icon='⭐' label={`${myPoints} pts`} color={color} bg={color+'18'} />
          {isKid && !lostWknd && <Chip icon='✅' label={`${(settings?.strikeLimit??3)-myStrikes} strikes left`} color='#22c55e' bg='rgba(34,197,94,.1)' />}
          {isKid && lostWknd && <Chip icon='❌' label='Weekend Lost' color='#e53935' bg='rgba(229,57,53,.1)' />}
          {nextEvent && <Chip icon='📅' label={nextEvent.title} color='#4a90e2' bg='rgba(74,144,226,.1)' />}
          {special && <Chip icon={special.icon} label={special.event} color='#4a90e2' bg='rgba(74,144,226,.1)' />}
          {isParent && pendingApprovals > 0 && <Chip icon='⏳' label={`${pendingApprovals} approvals`} color={color} bg={color+'18'} />}
          {isParent && pendingRequests > 0 && <Chip icon='✨' label={`${pendingRequests} requests`} color='#9c27b0' bg='rgba(156,39,176,.1)' />}
        </div>

        {/* Announcements (compact) */}
        {announcements.filter(a=>a.visible!=='parent').slice(0,1).map(a=>(
          <div key={a.id} style={{ marginTop:8, background:a.urgent?'rgba(229,57,53,.1)':'rgba(245,166,35,.08)', border:`1px solid ${a.urgent?'rgba(229,57,53,.25)':'rgba(245,166,35,.2)'}`, borderRadius:10, padding:'7px 12px', fontSize:'.78rem', fontWeight:700, color:a.urgent?'#e53935':color, display:'flex', gap:8, alignItems:'center' }}>
            <span>{a.urgent?'🚨':'📢'}</span>{a.title}{a.body&&<span style={{ color:'#666', fontWeight:600 }}>— {a.body}</span>}
          </div>
        ))}

        {/* Parent notes */}
        {isKid && (parentNotes?.[currentUser.id]||[]).filter(n=>!n.read).map(n=>(
          <div key={n.id} style={{ marginTop:8, background:'rgba(74,144,226,.1)', border:'1.5px solid rgba(74,144,226,.25)', borderRadius:10, padding:'7px 12px', fontSize:'.78rem', fontWeight:700, color:'#4a90e2', display:'flex', gap:8, alignItems:'center' }}>
            <span>💬</span>
            <span style={{ flex:1 }}>{n.msg}</span>
            <button onClick={()=>saveParentNotes({...parentNotes,[currentUser.id]:(parentNotes[currentUser.id]||[]).map(x=>x.id===n.id?{...x,read:true}:x)})} style={{ background:'transparent', border:'none', color:'#555', cursor:'pointer', fontSize:'.85rem' }}>✕</button>
          </div>
        ))}

        {/* Active punishment */}
        {isKid && myPunishments.length > 0 && (
          <div style={{ marginTop:8, background:'rgba(229,57,53,.08)', border:'1px solid rgba(229,57,53,.2)', borderRadius:10, padding:'7px 12px', fontSize:'.78rem', fontWeight:700, color:'#e53935', display:'flex', gap:8 }}>
            <span>⚠️</span>{myPunishments[0].desc}{myPunishments[0].buyoutTask&&<span style={{ color:color }}> · Buyout: {myPunishments[0].buyoutTask}</span>}
          </div>
        )}
      </div>

      {/* ── FAMILY STRIP ──────────────────────────────────────────────── */}
      <div style={{ paddingLeft:16, paddingBottom:8, flexShrink:0 }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingRight:16, paddingBottom:2 }}>
          {users.map(u=>{
            const uPts=points?.[u.id]||0, uRank=getRank(uPts, effectiveRanks)
            const uChores=chores.filter(c=>todaySU[c.id]===u.id)
            const uDone=uChores.filter(c=>completions?.[u.id]?.[c.id]?.date===today&&completions[u.id][c.id].status==='approved').length
            return (
              <div key={u.id} onClick={()=>{ setProfileUid(u.id); setModal('profile') }} style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer' }}>
                <div style={{ width:46, height:46, borderRadius:14, background:u.color+'22', border:`2px solid ${u.id===currentUser.id?u.color:u.color+'55'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', position:'relative' }}>
                  {u.avatar}
                  {u.role==='kid'&&uChores.length>0&&uDone===uChores.length&&<div style={{ position:'absolute', bottom:-4, right:-4, width:16, height:16, borderRadius:'50%', background:'#22c55e', border:'2px solid #08091a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.55rem' }}>✓</div>}
                  {u.role==='kid'&&uChores.length>0&&uDone<uChores.length&&<div style={{ position:'absolute', bottom:-4, right:-4, background:u.color, borderRadius:999, padding:'1px 4px', border:'2px solid #08091a', fontSize:'.5rem', fontWeight:800, color:'#000' }}>{uDone}/{uChores.length}</div>}
                </div>
                <div style={{ fontSize:'.6rem', fontWeight:800, color:u.id===currentUser.id?u.color:'#555' }}>{u.name.split(' ')[0]}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── CALENDAR GRID ─────────────────────────────────────────────── */}
      <HomeCalendar
        calendars={calendars} specialDays={specialDays}
        currentUser={currentUser} isParent={isParent}
        color={color} today={today}
        navigate={navigate}
        allEvents={allEvents}
      />

      {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
      <div style={{ flex:1, padding:'0 16px 16px', overflow:'hidden', display:'flex', flexDirection:'column', gap:8 }}>

        {isKid && (
          <>
            {/* Row 1 — chores + learn */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1 }}>
              <Tile icon='✅' label='Chores'
                sub={workday ? `${myDone}/${myChores.length} done` : 'Weekend!'}
                gradient='linear-gradient(135deg,#0d3320,#1a5e3a)'
                onClick={()=>navigate('/chores')} />
              <Tile icon='📚' label='Learn'
                sub={`${myLessons} done total`}
                gradient='linear-gradient(135deg,#0d1545,#1a2880)'
                onClick={()=>navigate('/learn')} />
            </div>

            {/* Row 2 — meals + calendar */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1 }}>
              {settings?.kidControls?.meals !== false && (
                <Tile icon='🍽️' label='Chow Hall'
                  sub="Today's menu"
                  gradient='linear-gradient(135deg,#1a0800,#4d2200)'
                  onClick={()=>navigate('/meals')} />
              )}
              {settings?.kidControls?.calendar !== false && (
                <Tile icon='📅' label='Calendar'
                  sub={nextEvent ? nextEvent.title : 'View schedule'}
                  gradient='linear-gradient(135deg,#1a0535,#4a0f8a)'
                  onClick={()=>navigate('/calendar')} />
              )}
              {/* fill if one is hidden */}
              {settings?.kidControls?.meals === false && settings?.kidControls?.calendar !== false && (
                <Tile icon='👤' label='My Profile'
                  sub={`${myPoints} pts · ${myRank.name}`}
                  gradient='linear-gradient(135deg,#1a1000,#3d2800)'
                  onClick={()=>navigate('/profile')} />
              )}
            </div>

            {/* Row 3 — profile + request */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1 }}>
              <Tile icon='👤' label='My Profile'
                sub={`${myPoints} pts · ${myRank.name}`}
                gradient='linear-gradient(135deg,#1a1000,#3d2800)'
                onClick={()=>navigate('/profile')} />
              {settings?.kidControls?.requests !== false
                ? <Tile icon='✨' label='Make Request'
                    sub={pendingReqs > 0 ? `${pendingReqs} pending` : 'Ask for something'}
                    gradient='linear-gradient(135deg,#200030,#6b0fa8)'
                    onClick={()=>{ setReqType(allRequestTypes[0]?.id); setModal('request') }} />
                : <Tile icon='🖥️' label='Display Mode'
                    sub='Family hub screen'
                    gradient='linear-gradient(135deg,#001a2e,#003d6b)'
                    onClick={()=>navigate('/display')} />
              }
            </div>
          </>
        )}

        {isParent && (
          <>
            {/* Row 1 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1 }}>
              <Tile icon='✅' label='Chores'
                sub={pendingApprovals > 0 ? `${pendingApprovals} need approval` : 'All caught up'}
                gradient='linear-gradient(135deg,#0d3320,#1a5e3a)'
                onClick={()=>navigate('/chores')}
                badge={pendingApprovals > 0 ? pendingApprovals : null} />
              <Tile icon='⚙️' label='Control'
                sub={(pendingApprovals+pendingRequests) > 0 ? `${pendingApprovals+pendingRequests} items` : 'All good'}
                gradient='linear-gradient(135deg,#200030,#6b0fa8)'
                onClick={()=>navigate('/parent')}
                badge={(pendingApprovals+pendingRequests) > 0 ? (pendingApprovals+pendingRequests) : null} />
            </div>

            {/* Row 2 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1 }}>
              <Tile icon='🍽️' label='Chow Hall'
                sub={(() => { const mr = mealRequests?.filter(r=>r.status==='pending').length||0; return mr > 0 ? `${mr} meal request${mr>1?'s':''}` : 'Plan meals' })()}
                gradient='linear-gradient(135deg,#1a0800,#4d2200)'
                onClick={()=>navigate('/meals')}
                badge={mealRequests?.filter(r=>r.status==='pending').length || null} />
              <Tile icon='📚' label='Learn'
                sub='Manage lessons'
                gradient='linear-gradient(135deg,#0d1545,#1a2880)'
                onClick={()=>navigate('/learn')} />
            </div>

            {/* Row 3 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1 }}>
              <Tile icon='📅' label='Calendar'
                sub={nextEvent ? nextEvent.title : 'View & add events'}
                gradient='linear-gradient(135deg,#1a0535,#4a0f8a)'
                onClick={()=>navigate('/calendar')} />
              <Tile icon='👤' label='My Profile'
                sub={`${myPoints} pts · ${myRank.name}`}
                gradient='linear-gradient(135deg,#1a1000,#3d2800)'
                onClick={()=>navigate('/profile')} />
            </div>

            {/* Row 4 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1 }}>
              <Tile icon='🖥️' label='Display Mode'
                sub='Portal family hub'
                gradient='linear-gradient(135deg,#001a2e,#003d6b)'
                onClick={()=>navigate('/display')} />
            </div>
          </>
        )}
      </div>

      {/* ── MODALS ────────────────────────────────────────────────────── */}

      {/* Profile sheet */}
      {modal==='profile'&&profileUser&&(()=>{
        const pv=profileVisibility||{}
        const viewSelf=profileUser.id===currentUser.id
        const canSee=(key)=>isParent||viewSelf||pv[key]!=='parents'
        const pPts=points?.[profileUser.id]||0, pRank=getRank(pPts, effectiveRanks), pNext=getNextRank(pPts, effectiveRanks)
        const pBadges=badges?.[profileUser.id]||[]
        const pLessons=Object.keys(learnProgress?.[profileUser.id]||{}).filter(k=>k!=='_customSubjects').length
        const pReadWk=Object.keys(readingLog?.[profileUser.id]||{}).filter(d=>d>=wk).length
        const pWriteWk=Object.keys(writingLog?.[profileUser.id]||{}).filter(d=>d>=wk).length
        const pChoresWk=Object.values(completions?.[profileUser.id]||{}).filter(c=>c.date>=wk&&c.status==='approved').length
        const pChores=chores.filter(c=>todaySU[c.id]===profileUser.id)
        return (
          <div onClick={()=>setModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200 }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:'linear-gradient(180deg,#1a1a40,#0f0f28)', borderRadius:'28px 28px 0 0', padding:'20px 20px 36px', width:'100%', maxWidth:520, maxHeight:'85vh', overflowY:'auto', border:'1.5px solid rgba(255,255,255,.1)' }}>
              <div style={{ width:36, height:4, borderRadius:999, background:'rgba(255,255,255,.15)', margin:'0 auto 16px' }} />
              <div style={{ textAlign:'center', marginBottom:16 }}>
                <div style={{ width:72, height:72, borderRadius:20, background:profileUser.color+'22', border:`3px solid ${profileUser.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', margin:'0 auto 8px', boxShadow:`0 0 20px ${profileUser.color}44` }}>{profileUser.avatar}</div>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.4rem', color:profileUser.color }}>{profileUser.name}</div>
                {profileUser.role==='parent'
                  ? <span style={{ fontSize:'.72rem', fontWeight:800, color:'#9c27b0', background:'rgba(156,39,176,.15)', padding:'3px 10px', borderRadius:999 }}>PARENT</span>
                  : canSee('rank')&&<div style={{ fontSize:'.78rem', color:pRank.color, fontWeight:800 }}>{pRank.icon} {pRank.name}</div>
                }
              </div>
              {profileUser.role==='kid'&&<>
                {canSee('points')&&<div style={{ background:'rgba(255,255,255,.05)', borderRadius:14, padding:'12px', marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:pNext?8:0 }}>
                    <span style={{ fontWeight:800 }}>⭐ {pPts} points</span>
                    {pNext&&canSee('rank')&&<span style={{ fontSize:'.7rem', color:'#666', fontWeight:700 }}>{pNext.minXP-pPts} to {pNext.name}</span>}
                  </div>
                  {pNext&&canSee('rank')&&<ProgressBar pct={Math.round((pPts/pNext.minXP)*100)} color={pNext.color} />}
                </div>}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:10 }}>
                  {[
                    canSee('chores')&&{icon:'✅',label:'Chores',val:pChoresWk,color:'#22c55e'},
                    canSee('lessons')&&{icon:'📚',label:'Lessons',val:pLessons,color:'#4a90e2'},
                    canSee('reading')&&{icon:'📖',label:'Reading',val:pReadWk+'d',color:'#9c27b0'},
                    canSee('writing')&&{icon:'✏️',label:'Writing',val:pWriteWk+'d',color:'#e91e8c'},
                  ].filter(Boolean).map(s=>(
                    <div key={s.label} style={{ background:'rgba(255,255,255,.05)', borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
                      <div style={{ fontSize:'1rem', marginBottom:2 }}>{s.icon}</div>
                      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.1rem', color:s.color }}>{s.val}</div>
                      <div style={{ fontSize:'.58rem', color:'#555', fontWeight:700 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {canSee('chores')&&pChores.length>0&&<>
                  <div style={{ fontSize:'.68rem', color:'#555', fontWeight:800, letterSpacing:.5, textTransform:'uppercase', marginBottom:6 }}>Today's Chores</div>
                  {pChores.map(c=>{
                    const st=completions?.[profileUser.id]?.[c.id]?.date===today?completions[profileUser.id][c.id].status:'open'
                    return <div key={c.id} style={{ display:'flex', alignItems:'center', gap:9, padding:'7px 10px', background:'rgba(255,255,255,.04)', borderRadius:10, marginBottom:5 }}>
                      <span>{st==='approved'?'✅':st==='pending'?'⏳':'⬜'}</span>
                      <div style={{ flex:1, fontWeight:600, fontSize:'.83rem' }}>{c.label}</div>
                      <span style={{ fontSize:'.68rem', fontWeight:700, color:st==='approved'?'#22c55e':st==='pending'?color:'#555' }}>{st==='approved'?'Done':st==='pending'?'Pending':'To Do'}</span>
                    </div>
                  })}
                </>}
                {canSee('strikes')&&<div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', background:'rgba(255,255,255,.04)', borderRadius:10, marginTop:6 }}>
                  <span style={{ fontWeight:700, fontSize:'.83rem' }}>Strikes this week</span>
                  <StrikeDots count={strikes?.[profileUser.id]?.[wk]||0} max={settings?.strikeLimit??3} />
                </div>}
              </>}
              <button onClick={()=>setModal(null)} style={{ width:'100%', marginTop:14, padding:'11px', borderRadius:14, border:'none', background:'rgba(255,255,255,.07)', color:'#888', fontWeight:800, cursor:'pointer' }}>Close</button>
            </div>
          </div>
        )
      })()}

      {/* Request sheet */}
      {modal==='request'&&(
        <div onClick={()=>setModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'linear-gradient(180deg,#1a1a40,#0f0f28)', borderRadius:'28px 28px 0 0', padding:'20px 20px 36px', width:'100%', maxWidth:520, maxHeight:'80vh', overflowY:'auto', border:'1.5px solid rgba(255,255,255,.1)' }}>
            <div style={{ width:36, height:4, borderRadius:999, background:'rgba(255,255,255,.15)', margin:'0 auto 16px' }} />
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.2rem', marginBottom:14 }}>Make a Request ✨</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
              {allRequestTypes.map(rt=>(
                <button key={rt.id} onClick={()=>setReqType(rt.id)} style={{ padding:'9px 4px', borderRadius:12, border:reqType===rt.id?`2px solid ${color}`:'2px solid rgba(255,255,255,.07)', background:reqType===rt.id?color+'22':'rgba(255,255,255,.04)', cursor:'pointer', textAlign:'center' }}>
                  <div style={{ fontSize:'1.3rem', marginBottom:3 }}>{rt.icon}</div>
                  <div style={{ fontSize:'.58rem', fontWeight:800, color:reqType===rt.id?color:'#888' }}>{rt.label}</div>
                </button>
              ))}
            </div>
            <input value={reqDate} onChange={e=>setReqDate(e.target.value)} type='date' style={{ background:'rgba(255,255,255,.06)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:12, padding:'9px 12px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, width:'100%', marginBottom:9, fontSize:'.88rem' }} />
            <textarea value={reqNote} onChange={e=>setReqNote(e.target.value)} placeholder='Tell us about it...' rows={3} style={{ background:'rgba(255,255,255,.06)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:12, padding:'9px 12px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, width:'100%', marginBottom:14, fontSize:'.88rem', resize:'vertical' }} />
            <button onClick={submitRequest} style={{ width:'100%', padding:'13px', borderRadius:16, border:'none', background:`linear-gradient(135deg,${color},#ff6b35)`, color:'#000', fontWeight:800, fontSize:'1rem', cursor:'pointer' }}>Send Request 🚀</button>
          </div>
        </div>
      )}

      {toast&&<div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', fontWeight:800, padding:'11px 24px', borderRadius:999, fontSize:'.85rem', zIndex:999, color:'#000', background:toast.bg, whiteSpace:'nowrap', boxShadow:'0 4px 20px rgba(0,0,0,.5)', animation:'fadeUp .25s ease' }}>{toast.msg}<style>{`@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style></div>}
    </div>
  )
}
