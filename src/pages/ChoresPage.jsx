import { useNavigate } from 'react-router-dom'
// pages/ChoresPage.jsx
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Input, Select, SectionTitle, Badge, ProgressBar, Toast, Modal, ModalTitle, ChoreRow, StrikeDots, Empty } from '../components'
import { todayKey, daysAgo, weekKey, isWorkday, getDayName, isSignupOpen } from '../constants'

export default function ChoresPage() {
  const navigate = useNavigate()
  const {
    currentUser, users, kids, isParent, isKid,
    chores, saveChores,
    signups, saveSignups,
    completions, saveCompletions,
    strikes, saveStrikes,
    weekendStatus, saveWeekendStatus,
    schedule, specialDays,
    addPoints, awardBadge,
    logActivity,
    settings,
    getEffectiveRules,
    choreCategories,
  } = useAuth()

  const [tab, setTab]       = useState(isKid ? 'signup' : 'overview')
  const [modal, setModal]   = useState(null)
  const [toast, setToast]   = useState(null)
  const [filter, setFilter] = useState('All')

  // Chore form
  const [chLabel, setChLabel]   = useState('')
  const [chCat, setChCat]       = useState('Morning')
  const [chMand, setChMand]     = useState(false)
  const [chPts, setChPts]       = useState(10)
  const [editId, setEditId]     = useState(null)

  const color        = settings?.primaryColor || '#f5a623'
  const effectiveRules = getEffectiveRules ? getEffectiveRules(currentUser.id) : settings
  const workday      = isWorkday(effectiveRules)
  const dayName = getDayName()
  const today   = todayKey()
  const wk      = weekKey()

  const showToast = (msg, bg) => { setToast({ msg, bg: bg || color }); setTimeout(() => setToast(null), 2600) }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const todaySU = signups?.[today] || {}

  const getStatus = (uid, choreId) => {
    const rec = completions?.[uid]?.[choreId]
    return rec?.date === today ? (rec.status || 'open') : 'open'
  }

  const isStreakLocked = (uid, choreId) => {
    const hist = completions?.[uid]?.[choreId]?.history || []
    return hist.includes(daysAgo(1)) && hist.includes(daysAgo(2))
  }

  const choreSignedBy = (choreId) => {
    const uid = todaySU[choreId]
    return uid ? users.find(u => u.id === uid) : null
  }

  const signUp = (choreId) => {
    if (!isWorkday(effectiveRules)) { showToast("It's the weekend — rest up! 🎉", '#43a047'); return }
    if (!isSignupOpen(effectiveRules)) { showToast(`Signup opens ${effectiveRules?.signupStart ?? 8}am and closes ${effectiveRules?.signupEnd ?? 10}am`, '#e53935'); return }
    if (isStreakLocked(currentUser.id, choreId)) { showToast('You did this 2 days in a row — give someone else a turn!', '#e53935'); return }
    const taken = todaySU[choreId]
    if (taken && taken !== currentUser.id) { showToast('Already taken!', '#e53935'); return }
    if (taken === currentUser.id) {
      const u = { ...signups, [today]: { ...todaySU } }; delete u[today][choreId]; saveSignups(u); return
    }
    saveSignups({ ...signups, [today]: { ...todaySU, [choreId]: currentUser.id } })
    showToast('Signed up! ✅')
  }

  const markDone = (choreId) => {
    if (todaySU[choreId] !== currentUser.id) { showToast("That's not your chore today!", '#e53935'); return }
    const cur = getStatus(currentUser.id, choreId)
    if (cur === 'approved') return
    const next = cur === 'pending' ? 'open' : 'pending'
    const ex = completions?.[currentUser.id]?.[choreId] || {}
    saveCompletions({ ...completions, [currentUser.id]: { ...(completions[currentUser.id] || {}), [choreId]: next === 'open' ? { history: ex.history || [] } : { date: today, status: 'pending', history: ex.history || [] } } })
    if (next === 'pending') showToast('Marked done — waiting for approval ⏳', color)
  }

  const approveChore = (uid, choreId, approve) => {
    const ex = completions?.[uid]?.[choreId] || {}
    const hist = approve ? [...new Set([...(ex.history || []), today])] : (ex.history || [])
    const chore = chores.find(c => c.id === choreId)
    saveCompletions({ ...completions, [uid]: { ...(completions[uid] || {}), [choreId]: approve ? { date: today, status: 'approved', history: hist } : { history: hist } } })
    if (approve && chore?.points) { addPoints(uid, chore.points); logActivity(uid, 'chore', `Completed: ${chore.label}`, chore.points) }
    showToast(approve ? '✅ Approved! Points added.' : '❌ Sent back')
  }

  // Pending list for parent
  const pendingList = () => {
    const out = []
    kids.forEach(kid => {
      chores.forEach(ch => {
        if (todaySU[ch.id] === kid.id && getStatus(kid.id, ch.id) === 'pending') {
          out.push({ kid, chore: ch })
        }
      })
    })
    return out
  }

  // My signed-up chores
  const myChores = chores.filter(c => todaySU[c.id] === currentUser.id)
  const myDone   = myChores.filter(c => getStatus(currentUser.id, c.id) === 'approved').length
  const myPct    = myChores.length > 0 ? Math.round((myDone / myChores.length) * 100) : 0

  // Chore management
  const saveChore = () => {
    if (!chLabel.trim()) return
    if (editId) {
      saveChores(chores.map(c => c.id === editId ? { ...c, label: chLabel, category: chCat, mandatory: chMand, points: Number(chPts) } : c))
      showToast('Chore updated!')
    } else {
      saveChores([...chores, { id: 'ch' + Date.now(), label: chLabel, category: chCat, mandatory: chMand, points: Number(chPts) }])
      showToast('Chore added!')
    }
    setChLabel(''); setChCat('Morning'); setChMand(false); setChPts(10); setEditId(null); setModal(null)
  }

  const deleteChore = (id) => { saveChores(chores.filter(c => c.id !== id)); showToast('Removed') }

  const editChore = (c) => { setChLabel(c.label); setChCat(c.category); setChMand(c.mandatory); setChPts(c.points); setEditId(c.id); setModal('choreForm') }

  const categories = ["All", ...(choreCategories || [])]
  const filteredChores = filter === 'All' ? chores : chores.filter(c => c.category === filter)

  const pending = pendingList()
  const special = specialDays?.find(s => s.day === dayName)

  return (
    <PageWrap>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}><button onClick={()=>navigate('/home')} style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#fff', fontWeight:800, fontSize:'.82rem', padding:'7px 14px', borderRadius:999, cursor:'pointer' }}>← Home</button><div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.5rem', color, flex:1 }}>✅ Chores</div></div>
        <div style={{ fontSize: '.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: workday ? 'rgba(74,144,226,.15)' : 'rgba(67,160,71,.15)', color: workday ? '#4a90e2' : '#43a047' }}>
          {dayName} · {workday ? 'Work Day' : 'Weekend'}
        </div>
      </div>

      {/* Special day */}
      {special && (
        <div style={{ background: 'rgba(74,144,226,.1)', border: '1.5px solid rgba(74,144,226,.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: '.88rem', fontWeight: 700, color: '#4a90e2' }}>
          {special.icon} Today: {special.event}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, background: '#141414', borderRadius: 12, padding: 3, marginBottom: 18 }}>
        {(isKid
          ? [{ k:'signup', l:'Sign Up' + (isSignupOpen(effectiveRules) ? ' 🟢' : '') }, { k:'mychores', l:'My Chores' }, { k:'schedule', l:'Routine' }]
          : [{ k:'overview', l:'Overview' }, { k:'approvals', l:'Approvals' + (pending.length > 0 ? ` (${pending.length})` : '') }, { k:'manage', l:'Manage' }, { k:'schedule', l:'Routine' }]
        ).map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: '9px 4px', border: 'none', borderRadius: 9, background: tab === t.k ? '#1c1c1c' : 'transparent', color: tab === t.k ? '#fff' : '#555', fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: '.72rem', cursor: 'pointer', transition: 'all .2s', textAlign: 'center' }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ── KID: SIGN UP ── */}
      {tab === 'signup' && isKid && (
        <div>
          {!workday ? <Empty icon='🎉' text="It's the weekend!" sub='No chore signup today — you earned it.' /> : (
            <>
              <div style={{ background: 'rgba(245,166,35,.08)', border: '1.5px solid rgba(245,166,35,.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center', fontSize: '.85rem', fontWeight: 700 }}>
                <span style={{ fontSize: '1.2rem' }}>🕐</span>
                <div>
                  {isSignupOpen(effectiveRules) ? <span style={{ color }}>Signup is OPEN until ${effectiveRules?.signupEnd ?? 10}:00!</span> : `Signup opens ${effectiveRules?.signupStart ?? 8}am, closes ${effectiveRules?.signupEnd ?? 10}am.`}
                  <div style={{ fontSize: '.72rem', color: '#666', marginTop: 2 }}>First come first picks. No phones during chore time.</div>
                </div>
              </div>

              {/* Category filter */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '5px 13px', borderRadius: 999, border: 'none', background: filter === cat ? color : '#1c1c1c', color: filter === cat ? '#000' : '#666', fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {cat}
                  </button>
                ))}
              </div>

              {filteredChores.map(ch => {
                const takenBy = choreSignedBy(ch.id)
                const mine    = takenBy?.id === currentUser.id
                const locked  = isStreakLocked(currentUser.id, ch.id)
                return (
                  <ChoreRow key={ch.id} label={ch.label} mandatory={ch.mandatory} points={ch.points}
                    isLocked={locked} isTaken={!!takenBy && !mine} takenBy={takenBy} status={mine ? 'signed' : 'open'}
                    onCheck={() => signUp(ch.id)}
                  />
                )
              })}
            </>
          )}
        </div>
      )}

      {/* ── KID: MY CHORES ── */}
      {tab === 'mychores' && isKid && (
        <div>
          {!workday ? <Empty icon='🎉' text='Weekend vibes only!' /> : myChores.length === 0 ? (
            <Empty icon='📋' text='No chores signed up yet' sub='Go to Sign Up tab to grab some!' />
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', fontWeight: 700, color: '#666', marginBottom: 6 }}>
                  <span>Progress</span><span>{myDone}/{myChores.length} approved</span>
                </div>
                <ProgressBar pct={myPct} />
                {myPct === 100 && <div style={{ textAlign: 'center', marginTop: 10, fontWeight: 800, color: '#43a047', fontSize: '.95rem' }}>🌟 All done! Amazing work!</div>}
              </div>
              {myChores.map(ch => (
                <ChoreRow key={ch.id} label={ch.label} mandatory={ch.mandatory} points={ch.points}
                  status={getStatus(currentUser.id, ch.id)}
                  onCheck={() => markDone(ch.id)}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* ── PARENT: OVERVIEW ── */}
      {tab === 'overview' && isParent && (
        <div>
          {kids.map(kid => {
            const kidChores = chores.filter(c => todaySU[c.id] === kid.id)
            const kidDone = kidChores.filter(c => getStatus(kid.id, c.id) === 'approved').length
            const pct = kidChores.length > 0 ? Math.round((kidDone / kidChores.length) * 100) : 0
            return (
              <Card key={kid.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: kid.color + '22', border: `2px solid ${kid.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{kid.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Fredoka One',cursive", color: kid.color }}>{kid.name}</div>
                    <div style={{ fontSize: '.72rem', color: '#555', fontWeight: 700 }}>{kidDone}/{kidChores.length} chores approved</div>
                  </div>
                  <ProgressBar pct={pct} />
                </div>
                {kidChores.map(ch => (
                  <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#141414', borderRadius: 9, marginBottom: 6 }}>
                    <div style={{ flex: 1, fontSize: '.85rem', fontWeight: 600 }}>{ch.label}</div>
                    <Badge
                      color={getStatus(kid.id, ch.id) === 'approved' ? '#43a047' : getStatus(kid.id, ch.id) === 'pending' ? color : '#555'}
                      bg={getStatus(kid.id, ch.id) === 'approved' ? 'rgba(67,160,71,.1)' : getStatus(kid.id, ch.id) === 'pending' ? `rgba(245,166,35,.1)` : 'rgba(255,255,255,.05)'}>
                      {getStatus(kid.id, ch.id) === 'approved' ? '✓ Done' : getStatus(kid.id, ch.id) === 'pending' ? '⏳ Pending' : '—'}
                    </Badge>
                    {getStatus(kid.id, ch.id) === 'pending' && (
                      <div style={{ display: 'flex', gap: 5 }}>
                        <Btn sm variant='green' onClick={() => approveChore(kid.id, ch.id, true)}>✓</Btn>
                        <Btn sm variant='red' onClick={() => approveChore(kid.id, ch.id, false)}>✗</Btn>
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            )
          })}
          {kids.length === 0 && <Empty icon='👧' text='No kids added yet' sub='Go to Control → Accounts' />}
        </div>
      )}

      {/* ── PARENT: APPROVALS ── */}
      {tab === 'approvals' && isParent && (
        <div>
          {pending.length === 0 ? <Empty icon='✅' text='No pending approvals' sub='All caught up!' /> : (
            pending.map(({ kid, chore }) => (
              <div key={kid.id + chore.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 10 }}>
                <div style={{ fontSize: '1.4rem' }}>{kid.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: kid.color }}>{kid.name}</div>
                  <div style={{ fontSize: '.83rem', color: '#888', fontWeight: 600 }}>{chore.label}</div>
                  {chore.points > 0 && <div style={{ fontSize: '.72rem', color: '#f5a623', fontWeight: 700 }}>+{chore.points} points</div>}
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <Btn sm variant='green' onClick={() => approveChore(kid.id, chore.id, true)}>✓ Yes</Btn>
                  <Btn sm variant='red' onClick={() => approveChore(kid.id, chore.id, false)}>✗ No</Btn>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── PARENT: MANAGE CHORES ── */}
      {tab === 'manage' && isParent && (
        <div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '5px 13px', borderRadius: 999, border: 'none', background: filter === cat ? color : '#1c1c1c', color: filter === cat ? '#000' : '#666', fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {cat}
              </button>
            ))}
          </div>
          {filteredChores.map(ch => (
            <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 9 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{ch.label}</div>
                <div style={{ fontSize: '.72rem', color: '#555', fontWeight: 600, marginTop: 2 }}>{ch.category} · {ch.mandatory ? '⚠️ Required' : 'Optional'} · +{ch.points}pts</div>
              </div>
              <Btn sm variant='dark' onClick={() => editChore(ch)}>Edit</Btn>
              <button onClick={() => deleteChore(ch.id)} style={{ background: 'transparent', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '1.1rem', padding: 4 }}>✕</button>
            </div>
          ))}
          <Btn full style={{ marginTop: 8 }} onClick={() => { setChLabel(''); setChCat('Morning'); setChMand(false); setChPts(10); setEditId(null); setModal('choreForm') }}>
            + Add Chore
          </Btn>
        </div>
      )}

      {/* ── SCHEDULE TAB ── */}
      {tab === 'schedule' && (
        <div>
          {schedule.map((s, i) => (
            <div key={s.id || i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 9 }}>
              <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '.9rem', color }}>{s.time}</div>
                <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{s.label}</div>
                {s.note && <div style={{ fontSize: '.75rem', color: '#555', marginTop: 2, fontWeight: 600 }}>{s.note}</div>}
              </div>
            </div>
          ))}
          {specialDays?.map((s, i) => (
            <div key={s.id || i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 9, borderLeft: `3px solid #4a90e2` }}>
              <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '.9rem', color: '#4a90e2' }}>{s.day}</div>
                <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{s.event}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chore Form Modal */}
      {modal === 'choreForm' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>{editId ? 'Edit Chore' : 'Add Chore'}</ModalTitle>
          <Input value={chLabel} onChange={e => setChLabel(e.target.value)} placeholder='Chore name' style={{ marginBottom: 10 }} />
          <Select value={chCat} onChange={e => setChCat(e.target.value)} style={{ marginBottom: 10 }}>
            {( choreCategories || []).map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <label style={{ fontWeight: 700, fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type='checkbox' checked={chMand} onChange={e => setChMand(e.target.checked)} /> Mandatory
            </label>
            <div style={{ flex: 1 }}>
              <Input value={chPts} onChange={e => setChPts(e.target.value)} type='number' placeholder='Points' />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={saveChore}>{editId ? 'Save' : 'Add'}</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </PageWrap>
  )
}
