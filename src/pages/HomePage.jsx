// pages/HomePage.jsx — Family Dashboard
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Badge, ProgressBar, Toast, Modal, ModalTitle, Input, Select, Empty, RankBadge, PointsPill, StrikeDots } from '../components'
import { getRank, getNextRank, REQUEST_TYPES, todayKey, weekKey, monthKey, daysAgo, isWorkday, getDayName, formatDate, BADGES } from '../constants'

const StatBox = ({ icon, label, val, color }) => (
  <div style={{ background:'#141414', borderRadius:12, padding:'12px 10px', textAlign:'center' }}>
    <div style={{ fontSize:'1.3rem', marginBottom:4 }}>{icon}</div>
    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.3rem', color }}>{val}</div>
    <div style={{ fontSize:'.64rem', color:'#555', fontWeight:700 }}>{label}</div>
  </div>
)

export default function HomePage() {
  const {
    currentUser, users, kids, isParent, isKid,
    points, badges, strikes, weekendStatus,
    punishments, requests, saveRequests,
    announcements, weekendActs, specialDays,
    schedule, saveSchedule,
    chores, signups, completions,
    learnProgress, readingLog, writingLog,
    calendars, settings,
    profileVisibility,
    addPoints, awardBadge,
  } = useAuth()

  const [modal, setModal]     = useState(null) // 'request' | 'profile:{uid}' | 'weekly' | 'monthly'
  const [profileUid, setProfileUid] = useState(null)
  const [reqType, setReqType] = useState(REQUEST_TYPES[0].id)
  const [reqNote, setReqNote] = useState('')
  const [reqDate, setReqDate] = useState('')
  const [toast, setToast]     = useState(null)
  const [rTime, setRTime]     = useState('')
  const [rLabel, setRLabel]   = useState('')
  const [rNote, setRNote]     = useState('')
  const [rIcon, setRIcon]     = useState('📋')
  const [rEditId, setREditId] = useState(null)
  const navigate = useNavigate()

  const color    = settings?.primaryColor || '#f5a623'
  const appName  = settings?.appName || 'FamOps'
  const today    = todayKey()
  const wk       = weekKey()
  const workday  = isWorkday()
  const dayName  = getDayName()

  const myPoints  = points?.[currentUser.id] || 0
  const myRank    = getRank(myPoints)
  const nextRank  = getNextRank(myPoints)
  const myStrikes = strikes?.[currentUser.id]?.[wk] || 0
  const lostWknd  = weekendStatus?.[currentUser.id]?.[wk] === 'lost'
  const myPunishments = punishments.filter(p => p.kidId === currentUser.id && !p.resolved)
  const myRequests    = requests.filter(r => r.kidId === currentUser.id).slice(-3).reverse()
  const special       = specialDays?.find(s => s.day === dayName)

  const showToast = (msg, bg) => { setToast({ msg, bg: bg||color }); setTimeout(()=>setToast(null),2800) }

  // Today's chore progress for a user
  const todaySU = signups?.[today] || {}
  const userChores = (uid) => chores.filter(c => todaySU[c.id] === uid)
  const userDone   = (uid) => userChores(uid).filter(c => completions?.[uid]?.[c.id]?.date === today && completions[uid][c.id].status === 'approved').length
  const userPct    = (uid) => { const t = userChores(uid).length; return t > 0 ? Math.round((userDone(uid)/t)*100) : 0 }

  // Upcoming calendar events (next 3)
  const allEvents = Object.values(calendars||{}).flat()
  const upcoming = allEvents
    .filter(ev => {
      if (ev.date < today) return false
      if (isParent) return true
      return ev.visibility === 'all' || ev.ownerId === currentUser.id
    })
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(0, 4)

  // Weekly stats for a user
  const weeklyStats = (uid) => {
    const choresDone = Object.values(completions?.[uid]||{}).filter(c=>c.date>=wk&&c.status==='approved').length
    const lessonsD   = Object.keys(learnProgress?.[uid]||{}).filter(k=>k!=='_customSubjects'&&learnProgress[uid][k]?.completedAt>=wk).length
    const readDays   = Object.keys(readingLog?.[uid]||{}).filter(d=>d>=wk).length
    const writeDays  = Object.keys(writingLog?.[uid]||{}).filter(d=>d>=wk).length
    const strikesW   = strikes?.[uid]?.[wk] || 0
    return { choresDone, lessonsD, readDays, writeDays, strikesW }
  }

  // Monthly stats
  const monthlyStats = (uid) => {
    const mo = monthKey()
    const choresM  = Object.values(completions?.[uid]||{}).filter(c=>c.date&&c.date.startsWith(mo)&&c.status==='approved').length
    const lessonsM = Object.keys(learnProgress?.[uid]||{}).filter(k=>k!=='_customSubjects'&&learnProgress[uid][k]?.completedAt?.startsWith(mo)).length
    const readM    = Object.keys(readingLog?.[uid]||{}).filter(d=>d.startsWith(mo)).length
    const writeM   = Object.keys(writingLog?.[uid]||{}).filter(d=>d.startsWith(mo)).length
    const ptsEarned= points?.[uid]||0
    return { choresM, lessonsM, readM, writeM, ptsEarned }
  }

  const submitRequest = () => {
    if (!reqNote.trim()) { showToast('Add a note!','#e53935'); return }
    const type = REQUEST_TYPES.find(r=>r.id===reqType)
    saveRequests([...requests, { id:'req'+Date.now(), kidId:currentUser.id, kidName:currentUser.name, kidAvatar:currentUser.avatar, kidColor:currentUser.color, type:reqType, typeLabel:type?.label, typeIcon:type?.icon, note:reqNote.trim(), date:reqDate||null, status:'pending', parentNote:'', submittedAt:new Date().toISOString() }])
    setReqNote(''); setReqDate(''); setModal(null)
    showToast('Request sent! ✨')
  }

  const openRoutineEdit = (item) => {
    if (item) { setRTime(item.time||''); setRLabel(item.label||''); setRNote(item.note||''); setRIcon(item.icon||'📋'); setREditId(item.id) }
    else { setRTime(''); setRLabel(''); setRNote(''); setRIcon('📋'); setREditId(null) }
    setModal('routine')
  }
  const saveRoutine = () => {
    if (!rLabel.trim()) { showToast('Add a label!','#e53935'); return }
    if (rEditId) {
      saveSchedule(schedule.map(s => s.id===rEditId ? { ...s, time:rTime.trim(), label:rLabel.trim(), note:rNote.trim(), icon:rIcon } : s))
      showToast('Routine updated!')
    } else {
      saveSchedule([...schedule, { id:'sc'+Date.now(), time:rTime.trim(), label:rLabel.trim(), note:rNote.trim(), icon:rIcon, visible:'all' }])
      showToast('Added to routine!')
    }
    setModal(null)
  }
  const deleteRoutine = (id) => { saveSchedule(schedule.filter(s=>s.id!==id)); showToast('Removed') }

  const pendingApprovals = isParent ? (() => { let c=0; kids.forEach(kid=>Object.values(completions?.[kid.id]||{}).forEach(comp=>{ if(comp.date===today&&comp.status==='pending') c++ })); return c })() : 0
  const pendingRequests  = isParent ? requests.filter(r=>r.status==='pending').length : 0

  const profileUser = profileUid ? users.find(u=>u.id===profileUid) : null

  return (
    <PageWrap>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.6rem', color }}>{appName}</div>
          <div style={{ fontSize:'.72rem', color:'#555', fontWeight:700 }}>{dayName} · {workday?'Work Day':'Weekend'}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", color:currentUser.color }}>{currentUser.avatar} {currentUser.name}</div>
          <div style={{ fontSize:'.7rem', color:myRank.color, fontWeight:800 }}>{myRank.icon} {myRank.name}</div>
        </div>
      </div>

      {/* Special day */}
      {special && (
        <div style={{ background:'rgba(74,144,226,.1)', border:'1.5px solid rgba(74,144,226,.2)', borderRadius:14, padding:'10px 14px', marginBottom:12, display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ fontSize:'1.5rem' }}>{special.icon}</div>
          <div style={{ fontWeight:800, color:'#4a90e2', fontSize:'.88rem' }}>Today — {special.event}</div>
        </div>
      )}

      {/* Announcements */}
      {announcements.filter(a=>a.visible!=='parent').map(a=>(
        <div key={a.id} style={{ background:a.urgent?'rgba(229,57,53,.1)':'rgba(245,166,35,.08)', border:`1.5px solid ${a.urgent?'rgba(229,57,53,.3)':'rgba(245,166,35,.2)'}`, borderRadius:14, padding:'10px 14px', marginBottom:10, display:'flex', gap:10 }}>
          <div style={{ fontSize:'1.3rem' }}>{a.urgent?'🚨':'📢'}</div>
          <div>
            <div style={{ fontWeight:800, color:a.urgent?'#e53935':color, fontSize:'.88rem' }}>{a.title}</div>
            {a.body&&<div style={{ fontSize:'.8rem', color:'#888', marginTop:2, fontWeight:600 }}>{a.body}</div>}
          </div>
        </div>
      ))}

      {/* ── FAMILY ROSTER (tappable avatars) ─────────────────────────────── */}
      <div style={{ marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.85rem', color:'#555', letterSpacing:.5, textTransform:'uppercase' }}>The Family</div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn sm variant='ghost' onClick={()=>setModal('weekly')}>📊 This Week</Btn>
            <Btn sm variant='ghost' onClick={()=>setModal('monthly')}>📈 Month</Btn>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
          {users.map(u => {
            const uPts    = points?.[u.id]||0
            const uRank   = getRank(uPts)
            const uStrikes= strikes?.[u.id]?.[wk]||0
            const uPct    = userPct(u.id)
            const uChores = userChores(u.id)
            return (
              <div key={u.id} onClick={()=>{ setProfileUid(u.id); setModal('profile') }}
                style={{ flexShrink:0, width:90, background:'#1c1c1c', borderRadius:16, padding:'12px 8px', textAlign:'center', cursor:'pointer', border:`2px solid ${u.id===currentUser.id?u.color+'66':'rgba(255,255,255,.07)'}` }}>
                <div style={{ width:44, height:44, borderRadius:13, background:u.color+'22', border:`2px solid ${u.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', margin:'0 auto 6px' }}>{u.avatar}</div>
                <div style={{ fontFamily:"'Fredoka One',cursive", color:u.color, fontSize:'.82rem', marginBottom:2, lineHeight:1.2 }}>{u.name.split(' ')[0]}</div>
                <div style={{ fontSize:'.65rem', color:'#555', fontWeight:700 }}>{uRank.icon} {uRank.name}</div>
                <div style={{ fontSize:'.7rem', color:color, fontWeight:800, marginTop:3 }}>⭐ {uPts}</div>
                {u.role==='kid'&&uChores.length>0&&(
                  <div style={{ marginTop:4 }}>
                    <ProgressBar pct={uPct} color={u.color} height={3} />
                    <div style={{ fontSize:'.6rem', color:'#555', marginTop:2, fontWeight:600 }}>{userDone(u.id)}/{uChores.length} chores</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── TODAY: ROUTINE + CALENDAR COMBINED ─────────────────────────────── */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.85rem', color:'#555', letterSpacing:.5, textTransform:'uppercase' }}>Today's Schedule</div>
          <div style={{ display:'flex', gap:6 }}>
            {isParent && <Btn sm variant='ghost' onClick={()=>openRoutineEdit(null)}>+ Routine</Btn>}
            <Btn sm variant='ghost' onClick={()=>navigate('/calendar')}>Calendar</Btn>
          </div>
        </div>

        {/* Daily routine timeline */}
        {schedule.map(s => (
          <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8, borderLeft:`3px solid ${color}` }}>
            <div style={{ fontSize:'1.3rem', flexShrink:0 }}>{s.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {s.time && <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.78rem', color }}>{s.time}</span>}
                <span style={{ fontWeight:800, fontSize:'.88rem' }}>{s.label}</span>
              </div>
              {s.note && <div style={{ fontSize:'.72rem', color:'#555', fontWeight:600, marginTop:2 }}>{s.note}</div>}
            </div>
            {isParent && (
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={()=>openRoutineEdit(s)} style={{ background:'transparent', border:'none', color:'#666', cursor:'pointer', fontSize:'.9rem', padding:4 }}>✏️</button>
                <button onClick={()=>deleteRoutine(s.id)} style={{ background:'transparent', border:'none', color:'#e53935', cursor:'pointer', fontSize:'.9rem', padding:4 }}>✕</button>
              </div>
            )}
          </div>
        ))}

        {/* Calendar events mixed in */}
        {upcoming.length > 0 && (
          <>
            <div style={{ fontSize:'.72rem', color:'#555', fontWeight:800, letterSpacing:.5, textTransform:'uppercase', margin:'14px 0 8px' }}>📅 Coming Up</div>
            {upcoming.map(ev=>(
              <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8, borderLeft:`3px solid ${ev.color}` }}>
                <div style={{ minWidth:44, textAlign:'center' }}>
                  <div style={{ fontSize:'.65rem', color:'#555', fontWeight:800, textTransform:'uppercase' }}>{new Date(ev.date+'T00:00:00').toLocaleDateString('en-US',{month:'short'})}</div>
                  <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.3rem', color:ev.color, lineHeight:1 }}>{new Date(ev.date+'T00:00:00').getDate()}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:'.88rem' }}>{ev.title}</div>
                  <div style={{ fontSize:'.72rem', color:'#555', fontWeight:600 }}>{ev.date===today?'Today':formatDate(ev.date)}{ev.time?` · ${ev.time}`:''}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── TODAY'S CHORES (family view) ──────────────────────────────────── */}
      {workday && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.85rem', color:'#555', letterSpacing:.5, textTransform:'uppercase', marginBottom:10 }}>Today's Assignments</div>
          {users.filter(u=>u.role==='kid').map(kid=>{
            const kc = userChores(kid.id)
            if (kc.length===0) return null
            return (
              <div key={kid.id} style={{ background:'#1c1c1c', borderRadius:12, padding:'10px 14px', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ fontSize:'1.1rem' }}>{kid.avatar}</div>
                  <div style={{ fontWeight:800, color:kid.color, fontSize:'.85rem', flex:1 }}>{kid.name}</div>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:userPct(kid.id)===100?'#43a047':color }}>{userDone(kid.id)}/{kc.length}</div>
                </div>
                <ProgressBar pct={userPct(kid.id)} color={kid.color} height={4} />
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:6 }}>
                  {kc.map(c=>{
                    const st = completions?.[kid.id]?.[c.id]?.date===today?completions[kid.id][c.id].status:'open'
                    return (
                      <div key={c.id} style={{ fontSize:'.65rem', fontWeight:700, padding:'2px 8px', borderRadius:999, background:st==='approved'?'rgba(67,160,71,.15)':st==='pending'?'rgba(245,166,35,.15)':'rgba(255,255,255,.05)', color:st==='approved'?'#43a047':st==='pending'?color:'#555' }}>
                        {st==='approved'?'✓ ':st==='pending'?'⏳ ':''}{c.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── KID: Personal status ─────────────────────────────────────────── */}
      {isKid && (
        <>
          {lostWknd ? (
            <div style={{ background:'rgba(229,57,53,.1)', border:'1.5px solid rgba(229,57,53,.3)', borderRadius:14, padding:'12px 16px', marginBottom:14 }}>
              <div style={{ fontWeight:800, color:'#e53935' }}>❌ Weekend Lost — 3 strikes this week</div>
            </div>
          ) : (
            <div style={{ background:'rgba(67,160,71,.08)', border:'1.5px solid rgba(67,160,71,.2)', borderRadius:14, padding:'10px 16px', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontWeight:800, color:'#43a047', fontSize:'.88rem' }}>✅ Weekend Earned · {3-myStrikes} strikes left</div>
              <StrikeDots count={myStrikes} />
            </div>
          )}

          {myPunishments.map(p=>(
            <div key={p.id} style={{ background:'rgba(229,57,53,.08)', border:'1.5px solid rgba(229,57,53,.2)', borderRadius:12, padding:'10px 14px', marginBottom:10, display:'flex', gap:10 }}>
              <div style={{ fontSize:'1.2rem' }}>⚠️</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, color:'#e53935', fontSize:'.85rem' }}>Punishment Active</div>
                <div style={{ fontSize:'.82rem', fontWeight:600, marginTop:2 }}>{p.desc}</div>
                {p.buyoutTask&&<div style={{ fontSize:'.75rem', color:color, marginTop:4, fontWeight:700 }}>💪 Buyout: {p.buyoutTask}</div>}
              </div>
            </div>
          ))}

          {/* My rank/points card */}
          <Card style={{ marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <RankBadge xp={myPoints} />
              <PointsPill points={myPoints} color={color} />
            </div>
            {nextRank&&(
              <>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.72rem', color:'#555', fontWeight:700, marginBottom:4 }}>
                  <span>To {nextRank.name}</span><span>{myPoints}/{nextRank.minXP} XP</span>
                </div>
                <ProgressBar pct={Math.round((myPoints/nextRank.minXP)*100)} color={nextRank.color} />
              </>
            )}
          </Card>

          {/* Recent requests */}
          {myRequests.length>0&&(
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.85rem', color:'#555', letterSpacing:.5, textTransform:'uppercase', marginBottom:8 }}>My Requests</div>
              {myRequests.map(r=>(
                <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8, borderLeft:`3px solid ${r.status==='approved'?'#43a047':r.status==='denied'?'#e53935':r.status==='counter'?color:'#555'}` }}>
                  <div style={{ fontSize:'1.2rem' }}>{r.typeIcon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:'.85rem' }}>{r.typeLabel}</div>
                    {r.parentNote&&<div style={{ fontSize:'.75rem', color:color, marginTop:2, fontWeight:600 }}>"{r.parentNote}"</div>}
                  </div>
                  <Badge color={r.status==='approved'?'#43a047':r.status==='denied'?'#e53935':r.status==='counter'?color:'#888'} bg='rgba(255,255,255,.05)'>{r.status==='counter'?'Counter':r.status}</Badge>
                </div>
              ))}
            </div>
          )}

          <Btn full variant='dark' onClick={()=>setModal('request')}>✨ Make a Request</Btn>
        </>
      )}

      {/* ── PARENT: Quick stats ───────────────────────────────────────────── */}
      {isParent&&(
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:8 }}>
          {[
            { label:'Approvals', val:pendingApprovals, icon:'⏳', action:()=>navigate('/parent') },
            { label:'Requests', val:pendingRequests, icon:'✨', action:()=>navigate('/parent') },
            { label:'Kids', val:kids.length, icon:'👧', action:()=>navigate('/parent?tab=accounts') },
          ].map(s=>(
            <div key={s.label} onClick={s.action} style={{ background:'#1c1c1c', borderRadius:14, padding:'14px 10px', textAlign:'center', cursor:'pointer', border:s.val>0?`1.5px solid ${color}44`:'1.5px solid rgba(255,255,255,.07)' }}>
              <div style={{ fontSize:'1.4rem', marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.3rem', color:s.val>0?color:'#fff' }}>{s.val}</div>
              <div style={{ fontSize:'.65rem', color:'#555', fontWeight:700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODALS ─────────────────────────────────────────────────────────── */}

      {/* Family member profile modal */}
      {modal==='profile'&&profileUser&&(() => {
        const pv = profileVisibility || {}
        const viewingSelf = profileUser.id === currentUser.id
        // Parents see everything. Others see based on visibility setting ('all' = everyone, 'parents' = parents only)
        const canSee = (key) => isParent || viewingSelf || pv[key] !== 'parents'
        const pPts = points?.[profileUser.id]||0
        const pRank = getRank(pPts)
        const pNext = getNextRank(pPts)
        const pBadges = badges?.[profileUser.id]||[]
        const pLessons = Object.keys(learnProgress?.[profileUser.id]||{}).filter(k=>k!=='_customSubjects').length
        const pReadWk = Object.keys(readingLog?.[profileUser.id]||{}).filter(d=>d>=wk).length
        const pWriteWk = Object.keys(writingLog?.[profileUser.id]||{}).filter(d=>d>=wk).length
        const pChoresWk = Object.values(completions?.[profileUser.id]||{}).filter(c=>c.date>=wk&&c.status==='approved').length
        return (
          <Modal onClose={()=>setModal(null)} maxWidth={480}>
            {/* Header */}
            <div style={{ textAlign:'center', marginBottom:18 }}>
              <div style={{ width:80, height:80, borderRadius:22, background:profileUser.color+'22', border:`3px solid ${profileUser.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'0 auto 10px' }}>{profileUser.avatar}</div>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.5rem', color:profileUser.color }}>{profileUser.name}</div>
              {profileUser.role==='parent'
                ? <Badge color='#9c27b0' bg='rgba(156,39,176,.15)'>PARENT</Badge>
                : canSee('rank') && <div style={{ fontSize:'.8rem', color:pRank.color, fontWeight:800, marginTop:2 }}>{pRank.icon} {pRank.name}</div>
              }
            </div>

            {profileUser.role==='kid' && (
              <>
                {/* Points + rank progress */}
                {canSee('points') && (
                  <div style={{ background:'#141414', borderRadius:14, padding:'14px', marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: pNext?10:0 }}>
                      <span style={{ fontWeight:800, fontSize:'.9rem' }}>⭐ {pPts} points</span>
                      {pNext && canSee('rank') && <span style={{ fontSize:'.72rem', color:'#666', fontWeight:700 }}>{pNext.minXP-pPts} to {pNext.name}</span>}
                    </div>
                    {pNext && canSee('rank') && <ProgressBar pct={Math.round((pPts/pNext.minXP)*100)} color={pNext.color} />}
                  </div>
                )}

                {/* Week stats grid */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginBottom:12 }}>
                  {canSee('chores') && <StatBox icon='✅' label='Chores this week' val={pChoresWk} color='#43a047' />}
                  {canSee('lessons') && <StatBox icon='📚' label='Lessons done' val={pLessons} color='#4a90e2' />}
                  {canSee('reading') && <StatBox icon='📖' label='Reading days' val={pReadWk} color='#9c27b0' />}
                  {canSee('writing') && <StatBox icon='✏️' label='Writing days' val={pWriteWk} color='#e91e8c' />}
                </div>

                {/* Today's chores */}
                {canSee('chores') && (
                  <>
                    <div style={{ fontWeight:800, fontSize:'.8rem', color:'#888', marginBottom:8, letterSpacing:.5 }}>TODAY'S CHORES</div>
                    {userChores(profileUser.id).length===0
                      ? <div style={{ fontSize:'.83rem', color:'#555', fontWeight:600, marginBottom:12 }}>No chores assigned today</div>
                      : <div style={{ marginBottom:12 }}>{userChores(profileUser.id).map(c=>{
                          const st = completions?.[profileUser.id]?.[c.id]?.date===today?completions[profileUser.id][c.id].status:'open'
                          return (
                            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'#141414', borderRadius:10, marginBottom:6 }}>
                              <div>{st==='approved'?'✅':st==='pending'?'⏳':'⬜'}</div>
                              <div style={{ flex:1, fontWeight:600, fontSize:'.85rem' }}>{c.label}</div>
                              <Badge color={st==='approved'?'#43a047':st==='pending'?color:'#555'} bg='rgba(255,255,255,.05)'>{st==='approved'?'Done':st==='pending'?'Pending':'To Do'}</Badge>
                            </div>
                          )
                        })}</div>
                    }
                  </>
                )}

                {/* Badges */}
                {canSee('badges') && pBadges.length>0 && (
                  <>
                    <div style={{ fontWeight:800, fontSize:'.8rem', color:'#888', marginBottom:8, letterSpacing:.5 }}>BADGES EARNED</div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                      {pBadges.map(bid=>{ const b=BADGES.find(x=>x.id===bid); return b?(
                        <div key={bid} title={b.desc} style={{ background:'#141414', borderRadius:10, padding:'6px 10px', fontSize:'.78rem', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>{b.icon} {b.label}</div>
                      ):null })}
                    </div>
                  </>
                )}

                {/* Strikes — visibility controlled */}
                {canSee('strikes') && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'#141414', borderRadius:10, marginBottom:10 }}>
                    <div style={{ fontWeight:700, fontSize:'.85rem' }}>Strikes this week</div>
                    <StrikeDots count={strikes?.[profileUser.id]?.[wk]||0} />
                  </div>
                )}

                {/* Punishments — visibility controlled */}
                {canSee('punishments') && punishments.filter(p=>p.kidId===profileUser.id&&!p.resolved).length>0 && (
                  <>
                    <div style={{ fontWeight:800, fontSize:'.8rem', color:'#e53935', marginBottom:8, letterSpacing:.5 }}>ACTIVE PUNISHMENTS</div>
                    {punishments.filter(p=>p.kidId===profileUser.id&&!p.resolved).map(p=>(
                      <div key={p.id} style={{ padding:'8px 12px', background:'rgba(229,57,53,.08)', borderRadius:10, marginBottom:6, fontSize:'.83rem', fontWeight:600, color:'#e53935' }}>⚠️ {p.desc}</div>
                    ))}
                  </>
                )}
              </>
            )}
            <Btn full variant='ghost' style={{ marginTop:8 }} onClick={()=>setModal(null)}>Close</Btn>
          </Modal>
        )
      })()}

      {/* Request modal */}
      {modal==='routine'&&(
        <Modal onClose={()=>setModal(null)}>
          <ModalTitle>{rEditId?'Edit Routine Item':'Add to Routine'} 🕐</ModalTitle>
          <div style={{ marginBottom:6, fontSize:'.8rem', color:'#666', fontWeight:700 }}>Icon</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
            {['📋','🍳','🧹','🍔','👕','📖','✏️','📚','🌤️','🚿','🍽️','🍦','🌙','⏰','🎮','💪','🦷','🛏️'].map(ic=>(
              <button key={ic} onClick={()=>setRIcon(ic)} style={{ fontSize:'1.3rem', padding:5, borderRadius:9, border:rIcon===ic?`2px solid ${color}`:'2px solid transparent', background:'#141414', cursor:'pointer' }}>{ic}</button>
            ))}
          </div>
          <Input value={rTime} onChange={e=>setRTime(e.target.value)} placeholder='Time (e.g. 0800–1000)' style={{ marginBottom:10 }} />
          <Input value={rLabel} onChange={e=>setRLabel(e.target.value)} placeholder='What is it? (e.g. Chore Time)' style={{ marginBottom:10 }} autoFocus />
          <Input value={rNote} onChange={e=>setRNote(e.target.value)} placeholder='Note (optional)' rows={2} style={{ marginBottom:18 }} />
          <div style={{ display:'flex', gap:10 }}>
            <Btn style={{ flex:1 }} onClick={saveRoutine}>{rEditId?'Save':'Add'}</Btn>
            <Btn variant='ghost' onClick={()=>setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal==='request'&&(
        <Modal onClose={()=>setModal(null)}>
          <ModalTitle>Make a Request ✨</ModalTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
            {REQUEST_TYPES.map(rt=>(
              <button key={rt.id} onClick={()=>setReqType(rt.id)} style={{ padding:'10px 4px', borderRadius:12, border:reqType===rt.id?`2px solid ${color}`:'2px solid rgba(255,255,255,.07)', background:reqType===rt.id?color+'22':'#141414', cursor:'pointer', textAlign:'center' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:4 }}>{rt.icon}</div>
                <div style={{ fontSize:'.6rem', fontWeight:800, color:reqType===rt.id?color:'#888' }}>{rt.label}</div>
              </button>
            ))}
          </div>
          <Input value={reqDate} onChange={e=>setReqDate(e.target.value)} type='date' style={{ marginBottom:10 }} />
          <Input value={reqNote} onChange={e=>setReqNote(e.target.value)} placeholder='Tell us about it — who, what, where...' rows={3} style={{ marginBottom:18 }} autoFocus />
          <div style={{ display:'flex', gap:10 }}>
            <Btn style={{ flex:1 }} onClick={submitRequest}>Send Request</Btn>
            <Btn variant='ghost' onClick={()=>setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Weekly breakdown */}
      {modal==='weekly'&&(
        <Modal onClose={()=>setModal(null)} maxWidth={520}>
          <ModalTitle>📊 This Week</ModalTitle>
          {users.map(u=>{
            const s = weeklyStats(u.id)
            return (
              <div key={u.id} style={{ marginBottom:18 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <div style={{ fontSize:'1.2rem' }}>{u.avatar}</div>
                  <div style={{ fontFamily:"'Fredoka One',cursive", color:u.color }}>{u.name}</div>
                  <PointsPill points={points?.[u.id]||0} color={u.color} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {[
                    { label:'Chores', val:s.choresDone, icon:'✅', color:'#43a047' },
                    { label:'Lessons', val:s.lessonsD, icon:'📚', color:'#4a90e2' },
                    { label:'Reading', val:s.readDays+'d', icon:'📖', color:'#9c27b0' },
                    { label:'Writing', val:s.writeDays+'d', icon:'✏️', color:'#e91e8c' },
                  ].map(st=>(
                    <div key={st.label} style={{ background:'#141414', borderRadius:10, padding:'10px 6px', textAlign:'center' }}>
                      <div style={{ fontSize:'1.1rem', marginBottom:4 }}>{st.icon}</div>
                      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.1rem', color:st.color }}>{st.val}</div>
                      <div style={{ fontSize:'.62rem', color:'#555', fontWeight:700 }}>{st.label}</div>
                    </div>
                  ))}
                </div>
                {u.role==='kid'&&s.strikesW>0&&<div style={{ fontSize:'.78rem', color:'#e53935', fontWeight:700, marginTop:6 }}>⚠️ {s.strikesW} strike{s.strikesW>1?'s':''} this week</div>}
              </div>
            )
          })}
          <Btn full variant='ghost' onClick={()=>setModal(null)}>Close</Btn>
        </Modal>
      )}

      {/* Monthly report */}
      {modal==='monthly'&&(
        <Modal onClose={()=>setModal(null)} maxWidth={520}>
          <ModalTitle>📈 {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})} Report</ModalTitle>
          {users.map(u=>{
            const s = monthlyStats(u.id)
            const rank = getRank(s.ptsEarned)
            return (
              <div key={u.id} style={{ marginBottom:20, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:13, background:u.color+'22', border:`2px solid ${u.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>{u.avatar}</div>
                  <div>
                    <div style={{ fontFamily:"'Fredoka One',cursive", color:u.color }}>{u.name}</div>
                    <div style={{ fontSize:'.72rem', color:'#666', fontWeight:700 }}>{rank.icon} {rank.name} · {s.ptsEarned} pts total</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {[
                    { label:'Chores', val:s.choresM, icon:'✅', color:'#43a047' },
                    { label:'Lessons', val:s.lessonsM, icon:'📚', color:'#4a90e2' },
                    { label:'Read Days', val:s.readM, icon:'📖', color:'#9c27b0' },
                    { label:'Write Days', val:s.writeM, icon:'✏️', color:'#e91e8c' },
                  ].map(st=>(
                    <div key={st.label} style={{ background:'#141414', borderRadius:10, padding:'10px 6px', textAlign:'center' }}>
                      <div style={{ fontSize:'1.1rem', marginBottom:4 }}>{st.icon}</div>
                      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.1rem', color:st.color }}>{st.val}</div>
                      <div style={{ fontSize:'.62rem', color:'#555', fontWeight:700 }}>{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          <Btn full variant='ghost' onClick={()=>setModal(null)}>Close</Btn>
        </Modal>
      )}

      <Toast toast={toast} />
    </PageWrap>
  )
}
