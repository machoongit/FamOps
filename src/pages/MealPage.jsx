// pages/MealPage.jsx — Chow Hall: family meal planning + kid requests
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Input, Modal, ModalTitle, Toast, SectionTitle, Badge, Empty } from '../components'
import { MEAL_SLOTS, todayKey } from '../constants'
import { BackBtn } from '../App'

export default function MealPage() {
  const {
    currentUser, isParent, isKid,
    menu, saveMenu,
    mealRequests, saveMealRequests,
    settings,
  } = useAuth()

  const color = settings?.primaryColor || '#f5a623'
  const [selDate, setSelDate]       = useState(todayKey())
  const [editSlot, setEditSlot]     = useState(null)  // { key, label, icon, current }
  const [editVal, setEditVal]       = useState('')
  const [reqSlot, setReqSlot]       = useState(null)  // { key, label, icon }
  const [reqText, setReqText]       = useState('')
  const [toast, setToast]           = useState(null)

  const showToast = (msg, bg) => { setToast({ msg, bg: bg||color }); setTimeout(()=>setToast(null), 2800) }

  const dayMenu  = menu?.[selDate] || {}
  const today    = todayKey()
  const isToday  = selDate === today

  const changeDay = (delta) => {
    const d = new Date(selDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setSelDate(d.toISOString().slice(0, 10))
  }

  const dayLabel = () => {
    const d = new Date(selDate + 'T12:00:00')
    if (selDate === today) return 'Today'
    const yest = new Date(); yest.setDate(yest.getDate()-1)
    if (selDate === yest.toISOString().slice(0,10)) return 'Yesterday'
    const tom = new Date(); tom.setDate(tom.getDate()+1)
    if (selDate === tom.toISOString().slice(0,10)) return 'Tomorrow'
    return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })
  }

  const saveSlot = () => {
    if (!editSlot) return
    saveMenu({ ...menu, [selDate]: { ...(dayMenu), [editSlot.key]: editVal.trim() } })
    setEditSlot(null); setEditVal('')
    showToast('Menu updated ✓')
  }

  const clearSlot = (key) => {
    const updated = { ...(dayMenu) }
    delete updated[key]
    saveMenu({ ...menu, [selDate]: updated })
    showToast('Cleared')
  }

  const submitRequest = () => {
    if (!reqText.trim() || !reqSlot) return
    const already = mealRequests.some(r => r.userId===currentUser.id && r.slot===reqSlot.key && r.date===selDate && r.status==='pending')
    if (already) { showToast('You already requested this slot today', '#e53935'); return }
    saveMealRequests([...mealRequests, {
      id: 'mr'+Date.now(),
      userId: currentUser.id, userName: currentUser.name,
      userAvatar: currentUser.avatar, userColor: currentUser.color,
      slot: reqSlot.key, slotLabel: reqSlot.label, slotIcon: reqSlot.icon,
      suggestion: reqText.trim(), date: selDate, status: 'pending',
      submittedAt: new Date().toISOString(),
    }])
    setReqSlot(null); setReqText('')
    showToast('Request sent! 📨')
  }

  const pendingToday = mealRequests.filter(r => r.date===selDate && r.status==='pending')

  return (
    <PageWrap>
      {toast && <Toast msg={toast.msg} bg={toast.bg} />}
      <BackBtn />

      {/* Header */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.8rem', background:`linear-gradient(135deg,${color},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          🍽️ Chow Hall
        </div>
        <div style={{ fontSize:'.75rem', color:'#555', fontWeight:700, letterSpacing:1 }}>DAILY MENU</div>
      </div>

      {/* Date nav */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, background:'#1a1a1a', borderRadius:14, padding:'10px 14px' }}>
        <button onClick={()=>changeDay(-1)} style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#888', fontWeight:800, fontSize:'1rem', width:34, height:34, borderRadius:10, cursor:'pointer' }}>‹</button>
        <div style={{ flex:1, textAlign:'center' }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", color, fontSize:'1.1rem' }}>{dayLabel()}</div>
          <div style={{ fontSize:'.7rem', color:'#555', fontWeight:600 }}>{new Date(selDate+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
        </div>
        <button onClick={()=>changeDay(1)} style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#888', fontWeight:800, fontSize:'1rem', width:34, height:34, borderRadius:10, cursor:'pointer' }}>›</button>
      </div>

      {/* Meal slots */}
      {MEAL_SLOTS.map(slot => {
        const meal = dayMenu[slot.key]
        const myPendingReq = mealRequests.find(r => r.userId===currentUser.id && r.slot===slot.key && r.date===selDate && r.status==='pending')
        return (
          <div key={slot.key} style={{ background:'#1a1a1a', borderRadius:14, padding:'13px 14px', marginBottom:10, border:`1.5px solid ${meal ? color+'33' : 'rgba(255,255,255,.05)'}` }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
              <div style={{ fontSize:'1.5rem', lineHeight:1.2, minWidth:32, textAlign:'center' }}>{slot.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                  <div style={{ fontFamily:"'Fredoka One',cursive", color, fontSize:'.9rem' }}>{slot.label}</div>
                  <div style={{ fontSize:'.65rem', color:'#555', fontWeight:700 }}>{slot.time}</div>
                </div>
                {meal
                  ? <div style={{ fontWeight:700, fontSize:'.9rem', color:'#ddd' }}>{meal}</div>
                  : <div style={{ fontWeight:600, fontSize:'.82rem', color:'#444', fontStyle:'italic' }}>Nothing planned</div>
                }
                {myPendingReq && <div style={{ fontSize:'.7rem', color:'#f5a623', fontWeight:700, marginTop:4 }}>⏳ Your request: "{myPendingReq.suggestion}"</div>}
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                {isParent && (
                  <>
                    <button onClick={()=>{ setEditSlot(slot); setEditVal(meal||'') }}
                      style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#888', fontSize:'.78rem', fontWeight:800, padding:'5px 10px', borderRadius:8, cursor:'pointer' }}>
                      ✏️
                    </button>
                    {meal && <button onClick={()=>clearSlot(slot.key)}
                      style={{ background:'transparent', border:'none', color:'#e53935', fontSize:'.9rem', cursor:'pointer', padding:'5px' }}>✕</button>}
                  </>
                )}
                {isKid && !myPendingReq && (
                  <button onClick={()=>{ setReqSlot(slot); setReqText('') }}
                    style={{ background:`${color}22`, border:`1.5px solid ${color}44`, color, fontSize:'.72rem', fontWeight:800, padding:'5px 10px', borderRadius:8, cursor:'pointer' }}>
                    Request
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Parent: pending requests for this day */}
      {isParent && pendingToday.length > 0 && (
        <>
          <SectionTitle style={{ marginTop:16 }}>Meal Requests — {dayLabel()}</SectionTitle>
          {pendingToday.map(r => (
            <Card key={r.id} style={{ borderColor:'rgba(245,166,35,.2)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ fontSize:'1.3rem' }}>{r.slotIcon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, color:r.userColor, fontSize:'.9rem' }}>{r.userName}</div>
                  <div style={{ fontSize:'.8rem', fontWeight:600 }}>{r.slotLabel}: "{r.suggestion}"</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn sm variant='green' style={{ flex:1 }} onClick={()=>{
                  saveMenu({ ...menu, [r.date]: { ...(menu[r.date]||{}), [r.slot]: r.suggestion } })
                  saveMealRequests(mealRequests.map(x=>x.id===r.id?{...x,status:'approved'}:x))
                  showToast(`✅ Set ${r.slotLabel} to "${r.suggestion}"`)
                }}>✓ Add to Menu</Btn>
                <Btn sm variant='red' style={{ flex:1 }} onClick={()=>{
                  saveMealRequests(mealRequests.map(x=>x.id===r.id?{...x,status:'denied'}:x))
                  showToast('Denied')
                }}>✗ Deny</Btn>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* Parent quick tip on empty day */}
      {isParent && !MEAL_SLOTS.some(s => dayMenu[s.key]) && (
        <div style={{ background:'rgba(255,255,255,.03)', borderRadius:12, padding:'12px 14px', textAlign:'center', marginTop:8 }}>
          <div style={{ fontSize:'.78rem', color:'#555', fontWeight:600 }}>Tap ✏️ on any meal slot to set what's on the menu</div>
        </div>
      )}

      {/* Edit modal (parent) */}
      {editSlot && (
        <Modal onClose={()=>setEditSlot(null)}>
          <ModalTitle>{editSlot.icon} Set {editSlot.label}</ModalTitle>
          <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:10 }}>
            {dayLabel()} · {new Date(selDate+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric'})}
          </div>
          <Input
            value={editVal}
            onChange={e=>setEditVal(e.target.value)}
            placeholder={`What's for ${editSlot.label.toLowerCase()}?`}
           
            style={{ marginBottom:16 }}
            onKeyDown={e=>e.key==='Enter'&&saveSlot()}
          />
          <div style={{ display:'flex', gap:10 }}>
            <Btn style={{ flex:1 }} onClick={saveSlot}>Save</Btn>
            <Btn variant='ghost' onClick={()=>setEditSlot(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Request modal (kid) */}
      {reqSlot && (
        <Modal onClose={()=>setReqSlot(null)}>
          <ModalTitle>{reqSlot.icon} Request {reqSlot.label}</ModalTitle>
          <div style={{ fontSize:'.82rem', color:'#888', fontWeight:600, marginBottom:12 }}>
            What would you like for {reqSlot.label.toLowerCase()} on {dayLabel()}?
          </div>
          <Input
            value={reqText}
            onChange={e=>setReqText(e.target.value)}
            placeholder='What are you craving?'
           
            style={{ marginBottom:16 }}
            onKeyDown={e=>e.key==='Enter'&&submitRequest()}
          />
          <div style={{ display:'flex', gap:10 }}>
            <Btn style={{ flex:1 }} onClick={submitRequest}>Send Request 📨</Btn>
            <Btn variant='ghost' onClick={()=>setReqSlot(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </PageWrap>
  )
}
