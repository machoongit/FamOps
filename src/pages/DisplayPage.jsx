// pages/DisplayPage.jsx — Portal/TV family hub display mode
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { getRank, todayKey, weekKey, getDayName, isWorkday, formatDate } from '../constants'

export default function DisplayPage() {
  const {
    users, kids, points, strikes, weekendStatus,
    chores, signups, completions,
    calendars, schedule, specialDays,
    announcements, photos, savePhotos,
    settings, isParent, effectiveRanks,
  } = useAuth()

  const [photoIdx, setPhotoIdx]   = useState(0)
  const [showAdd, setShowAdd]     = useState(false)
  const [newUrl, setNewUrl]       = useState('')
  const [newCap, setNewCap]       = useState('')
  const [clock, setClock]         = useState(new Date())
  const navigate = useNavigate()

  const color   = settings?.primaryColor || '#f5a623'
  const appName = settings?.appName || 'FamOps'
  const today   = todayKey()
  const wk      = weekKey()
  const workday = isWorkday(settings)
  const dayName = getDayName()

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Photo slideshow
  useEffect(() => {
    if (!photos?.length) return
    const t = setInterval(() => setPhotoIdx(i => (i + 1) % photos.length), 8000)
    return () => clearInterval(t)
  }, [photos?.length])

  const timeStr = clock.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true })
  const dateStr = clock.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })

  const allEvents = Object.values(calendars||{}).flat()
  const upcomingEvs = allEvents.filter(ev=>ev.date>=today&&ev.visibility==='all').sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4)
  const special = specialDays?.find(s=>s.day===dayName)
  const todaySU = signups?.[today] || {}

  const addPhoto = () => {
    if (!newUrl.trim()) return
    savePhotos([...(photos||[]), { id:'ph'+Date.now(), url:newUrl.trim(), caption:newCap.trim(), addedAt:new Date().toISOString() }])
    setNewUrl(''); setNewCap(''); setShowAdd(false)
  }

  const currentPhoto = photos?.[photoIdx]

  return (
    <div style={{ width:'100vw', height:'100dvh', background:'#08091a', overflow:'hidden', position:'relative', fontFamily:'Nunito,sans-serif' }}>

      {/* ── Background photo — uses img tag to avoid CORS blocks ── */}
      {currentPhoto ? (
        <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption||''}
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(.32)', transition:'opacity .8s' }}
            onError={e=>{ e.target.style.display='none' }}
          />
        </div>
      ) : (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0c0e24,#0f0f28)' }} />
      )}

      {/* ── Content overlay ──────────────────────────────────────── */}
      <div style={{ position:'relative', zIndex:1, width:'100%', height:'100%', display:'grid', gridTemplateColumns:'1fr 360px', gridTemplateRows:'auto 1fr auto', gap:0, padding:24 }}>

        {/* Top left — clock + date */}
        <div style={{ gridColumn:'1', gridRow:'1', paddingBottom:16 }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'clamp(2.5rem,6vw,5rem)', background:`linear-gradient(135deg,#fff,${color})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>{timeStr}</div>
          <div style={{ fontSize:'clamp(.9rem,2vw,1.2rem)', color:'rgba(255,255,255,.6)', fontWeight:700, marginTop:4 }}>{dateStr}</div>
          {special && <div style={{ marginTop:8, fontSize:'clamp(.8rem,1.8vw,1rem)', color:'#4a90e2', fontWeight:800 }}>{special.icon} {special.event}</div>}
        </div>

        {/* Top right — app name + controls */}
        <div style={{ gridColumn:'2', gridRow:'1', textAlign:'right', paddingBottom:16, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.6rem', color }}>{appName}</div>
          <div style={{ display:'flex', gap:8 }}>
            {isParent && <button onClick={()=>setShowAdd(true)} style={{ background:'rgba(255,255,255,.1)', border:'none', color:'#fff', fontWeight:800, fontSize:'.75rem', padding:'6px 14px', borderRadius:999, cursor:'pointer' }}>+ Photo</button>}
            <button onClick={()=>navigate('/home')} style={{ background:'rgba(255,255,255,.1)', border:'none', color:'#fff', fontWeight:800, fontSize:'.75rem', padding:'6px 14px', borderRadius:999, cursor:'pointer' }}>← App</button>
          </div>
          {currentPhoto?.caption && <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.5)', fontWeight:600, maxWidth:200, textAlign:'right' }}>{currentPhoto.caption}</div>}
          {photos?.length > 1 && (
            <div style={{ display:'flex', gap:4 }}>
              {photos.map((_,i)=><div key={i} style={{ width:6, height:6, borderRadius:'50%', background:i===photoIdx?color:'rgba(255,255,255,.2)', transition:'all .3s' }} />)}
            </div>
          )}
        </div>

        {/* Center left — announcements + today schedule */}
        <div style={{ gridColumn:'1', gridRow:'2', overflowY:'auto', paddingRight:20 }}>
          {announcements.filter(a=>a.visible!=='parent').length > 0 && (
            <div style={{ marginBottom:20 }}>
              {announcements.filter(a=>a.visible!=='parent').map(a=>(
                <div key={a.id} style={{ background:a.urgent?'rgba(229,57,53,.15)':'rgba(245,166,35,.1)', border:`1px solid ${a.urgent?'rgba(229,57,53,.3)':'rgba(245,166,35,.25)'}`, borderRadius:14, padding:'12px 16px', marginBottom:8, display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:'1.4rem' }}>{a.urgent?'🚨':'📢'}</span>
                  <div><div style={{ fontWeight:800, color:a.urgent?'#e53935':color, fontSize:'.95rem' }}>{a.title}</div>{a.body&&<div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.6)', marginTop:2 }}>{a.body}</div>}</div>
                </div>
              ))}
            </div>
          )}

          {/* Today's schedule */}
          {schedule?.length > 0 && (
            <div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.35)', fontWeight:800, letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Today's Routine</div>
              {schedule.slice(0,6).map(s=>(
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'rgba(255,255,255,.05)', borderRadius:10, marginBottom:6 }}>
                  <span style={{ fontSize:'1.2rem' }}>{s.icon}</span>
                  <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.78rem', color, minWidth:80 }}>{s.time}</span>
                  <span style={{ fontWeight:700, fontSize:'.88rem' }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side — family status + upcoming */}
        <div style={{ gridColumn:'2', gridRow:'2', overflowY:'auto', display:'flex', flexDirection:'column', gap:12 }}>
          {/* Family status */}
          <div>
            <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.35)', fontWeight:800, letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Family Status</div>
            {users.filter(u=>u.role==='kid').map(kid=>{
              const kidChores=chores.filter(c=>todaySU[c.id]===kid.id)
              const kidDone=kidChores.filter(c=>completions?.[kid.id]?.[c.id]?.date===today&&completions[kid.id][c.id].status==='approved').length
              const pct=kidChores.length>0?Math.round((kidDone/kidChores.length)*100):0
              const kPts=points?.[kid.id]||0, kRank=getRank(kPts, effectiveRanks)
              const kStrikes=strikes?.[kid.id]?.[wk]||0
              const kLost=weekendStatus?.[kid.id]?.[wk]==='lost'
              return (
                <div key={kid.id} style={{ background:'rgba(255,255,255,.06)', borderRadius:14, padding:'12px', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:pct>0?8:0 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:kid.color+'22', border:`2px solid ${kid.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{kid.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Fredoka One',cursive", color:kid.color, fontSize:'.95rem' }}>{kid.name}</div>
                      <div style={{ fontSize:'.68rem', color:'rgba(255,255,255,.4)', fontWeight:700 }}>{kRank.icon} {kRank.name} · {kPts} pts</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      {kLost
                        ? <div style={{ fontSize:'.65rem', fontWeight:800, color:'#e53935' }}>❌ Lost</div>
                        : <div style={{ fontSize:'.65rem', fontWeight:800, color:'#22c55e' }}>⚡ {(settings?.strikeLimit??3)-kStrikes} left</div>
                      }
                      {kidChores.length>0&&<div style={{ fontSize:'.65rem', color:'rgba(255,255,255,.4)', fontWeight:700 }}>{kidDone}/{kidChores.length} chores</div>}
                    </div>
                  </div>
                  {kidChores.length>0&&<div style={{ height:4, borderRadius:999, background:'rgba(255,255,255,.1)', overflow:'hidden' }}><div style={{ height:'100%', width:pct+'%', background:kid.color, borderRadius:999, transition:'width .4s' }} /></div>}
                </div>
              )
            })}
          </div>

          {/* Upcoming events */}
          {upcomingEvs.length > 0 && (
            <div>
              <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.35)', fontWeight:800, letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>Coming Up</div>
              {upcomingEvs.map(ev=>(
                <div key={ev.id} style={{ display:'flex', gap:10, padding:'9px 12px', background:'rgba(255,255,255,.05)', borderRadius:12, marginBottom:7, borderLeft:`3px solid ${ev.color}` }}>
                  <div style={{ minWidth:36, textAlign:'center' }}>
                    <div style={{ fontSize:'.55rem', color:'rgba(255,255,255,.4)', fontWeight:800, textTransform:'uppercase' }}>{new Date(ev.date+'T00:00:00').toLocaleDateString('en-US',{month:'short'})}</div>
                    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.2rem', color:ev.color, lineHeight:1 }}>{new Date(ev.date+'T00:00:00').getDate()}</div>
                  </div>
                  <div><div style={{ fontWeight:800, fontSize:'.85rem' }}>{ev.title}</div>{ev.time&&<div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.4)' }}>{ev.time}</div>}</div>
                </div>
              ))}
            </div>
          )}

          {/* No photos yet prompt */}
          {!photos?.length && isParent && (
            <div onClick={()=>setShowAdd(true)} style={{ background:'rgba(255,255,255,.05)', borderRadius:14, padding:'16px', textAlign:'center', cursor:'pointer', border:'1.5px dashed rgba(255,255,255,.15)' }}>
              <div style={{ fontSize:'1.8rem', marginBottom:6 }}>🖼️</div>
              <div style={{ fontWeight:700, fontSize:'.85rem', color:'rgba(255,255,255,.5)' }}>Add family photos</div>
              <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', marginTop:3 }}>They'll slide in the background</div>
            </div>
          )}
        </div>

        {/* Bottom — photo caption strip */}
        {photos?.length > 0 && (
          <div style={{ gridColumn:'1 / 3', gridRow:'3', paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.3)', fontWeight:700 }}>
              {isParent && <span style={{ cursor:'pointer', marginRight:12 }} onClick={()=>savePhotos((photos||[]).filter((_,i)=>i!==photoIdx))}>🗑️ Remove photo</span>}
              Photo {photoIdx+1} of {photos.length}
            </div>
            <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.25)', fontWeight:700 }}>Tap ← App to go back</div>
          </div>
        )}
      </div>

      {/* ── Add photo modal ────────────────────────────────────────── */}
      {showAdd && (
        <div onClick={()=>setShowAdd(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#1c1c3a', borderRadius:24, padding:24, width:'100%', maxWidth:440, border:'1.5px solid rgba(255,255,255,.1)' }}>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.3rem', marginBottom:16 }}>Add a Photo 🖼️</div>
            <div style={{ fontSize:'.8rem', color:'#666', fontWeight:600, marginBottom:12 }}>
              Paste a direct image URL ending in .jpg, .png, or .webp.<br/>
              <strong style={{ color:'#f5a623' }}>Google Photos:</strong> Open photo → Share → Create link → Copy.<br/>
              <strong style={{ color:'#4a90e2' }}>iCloud:</strong> Use iCloud.com → share → copy link.<br/>
              <strong style={{ color:'#43a047' }}>Easiest:</strong> Upload to <a href="https://imgur.com" target="_blank" style={{ color:'#43a047' }}>imgur.com</a> (free), right-click image → Copy image address.
            </div>
            <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder='https://... (image URL)' style={{ background:'rgba(255,255,255,.06)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:12, padding:'10px 14px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, width:'100%', marginBottom:10, fontSize:'.9rem' }} />
            <input value={newCap} onChange={e=>setNewCap(e.target.value)} placeholder='Caption (optional)' style={{ background:'rgba(255,255,255,.06)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:12, padding:'10px 14px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, width:'100%', marginBottom:18, fontSize:'.9rem' }} />
            {newUrl && (
              <div style={{ width:'100%', height:160, borderRadius:12, overflow:'hidden', marginBottom:14, border:'1.5px solid rgba(255,255,255,.1)', background:'rgba(255,255,255,.04)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src={newUrl} alt='preview' style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{ e.target.style.display='none'; e.target.parentNode.innerHTML='<div style="color:#e53935;font-weight:700;font-size:.82rem;padding:16px">⚠️ Image not loading — check the URL</div>' }} />
              </div>
            )}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={addPhoto} style={{ flex:1, padding:'12px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${color},#ff6b35)`, color:'#000', fontWeight:800, cursor:'pointer' }}>Add Photo</button>
              <button onClick={()=>setShowAdd(false)} style={{ padding:'12px 18px', borderRadius:14, border:'none', background:'rgba(255,255,255,.07)', color:'#888', fontWeight:800, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
