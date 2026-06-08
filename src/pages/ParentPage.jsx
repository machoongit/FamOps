// pages/ParentPage.jsx
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Input, Select, Modal, ModalTitle, Toast, SectionTitle, Badge, Empty, AddUserModal, StrikeDots } from '../components'
import { todayKey, weekKey, COLORS, STRIKE_CONSEQUENCES, DEFAULT_SCHEDULE, DEFAULT_SPECIAL_DAYS, DEFAULT_WEEKEND_ACTIVITIES, DEFAULT_REWARDS, BADGES, formatDate } from '../constants'

export default function ParentPage() {
  const {
    currentUser, users, kids, isParent,
    addUser, updateUser, removeUser,
    settings, updateSettings,
    schedule, saveSchedule,
    specialDays, saveSpecialDays,
    weekendActs, saveWeekendActs,
    rewards, saveRewards,
    rules, saveRules,
    announcements, saveAnnouncements,
    strikes, saveStrikes,
    weekendStatus, saveWeekendStatus,
    punishments, savePunishments,
    requests, saveRequests,
    points, savePoints,
    badges, saveBadges, awardBadge,
    completions,
    learnProgress, saveLearnProgress,
    readingLog, writingLog,
    profileVisibility, saveProfileVisibility,
  } = useAuth()

  const [tab, setTab]   = useState('requests')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)

  // Custom badges (editable by parents)
  const [customBadges, setCustomBadgesState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fo_customBadges')||'[]') } catch { return [] }
  })
  const saveCustomBadges = (v) => { setCustomBadgesState(v); localStorage.setItem('fo_customBadges', JSON.stringify(v)) }
  const [fBadgeLabel2, setFBadgeLabel2] = useState('')
  const [fBadgeIcon2, setFBadgeIcon2]   = useState('🌟')
  const [fBadgeDesc2, setFBadgeDesc2]   = useState('')
  const allBadges = [...BADGES, ...customBadges]

  // Form states
  const [fPunishKid, setFPunishKid]   = useState(kids[0]?.id || '')
  const [fPunishDesc, setFPunishDesc] = useState('')
  const [fPunishBuyout, setFPunishBuyout] = useState('')
  const [fRuleText, setFRuleText]     = useState('')
  const [fRuleIcon, setFRuleIcon]     = useState('📋')
  const [fAnnTitle, setFAnnTitle]     = useState('')
  const [fAnnBody, setFAnnBody]       = useState('')
  const [fAnnUrgent, setFAnnUrgent]   = useState(false)
  const [fRewardLabel, setFRewardLabel] = useState('')
  const [fRewardIcon, setFRewardIcon] = useState('🎁')
  const [fRewardCost, setFRewardCost] = useState(100)
  const [fSchedTime, setFSchedTime]   = useState('')
  const [fSchedLabel, setFSchedLabel] = useState('')
  const [fSchedNote, setFSchedNote]   = useState('')
  const [fSchedIcon, setFSchedIcon]   = useState('📋')
  const [fWALabel, setFWALabel]       = useState('')
  const [fWAIcon, setFWAIcon]         = useState('🎉')
  const [fBonusKid, setFBonusKid]     = useState(kids[0]?.id || '')
  const [fBonusPts, setFBonusPts]     = useState(50)
  const [fBonusReason, setFBonusReason] = useState('')
  const [fBadgeKid, setFBadgeKid]     = useState(kids[0]?.id || '')
  const [fBadgeId, setFBadgeId]       = useState(BADGES[0]?.id || '')
  const [requestReply, setRequestReply] = useState({})
  const [appColor, setAppColor]       = useState(settings?.primaryColor || '#f5a623')
  const [appName, setAppName]         = useState(settings?.appName || 'FamOps')
  const [showAddUser, setShowAddUser] = useState(false)

  const color = settings?.primaryColor || '#f5a623'
  const showToast = (msg, bg) => { setToast({ msg, bg: bg || color }); setTimeout(() => setToast(null), 2800) }
  const wk = weekKey()
  const today = todayKey()

  if (!isParent) return <PageWrap><div style={{ textAlign: 'center', padding: 40, color: '#555', fontWeight: 700 }}>Parent access only.</div></PageWrap>

  // ── Strikes ───────────────────────────────────────────────────────────────
  const getStrikes = (uid) => strikes?.[uid]?.[wk] || 0
  const hasLostWeekend = (uid) => weekendStatus?.[uid]?.[wk] === 'lost'

  const addStrike = (uid) => {
    const cur = getStrikes(uid)
    const next = cur + 1
    saveStrikes({ ...strikes, [uid]: { ...(strikes[uid] || {}), [wk]: next } })
    if (next >= 3) {
      saveWeekendStatus({ ...weekendStatus, [uid]: { ...(weekendStatus[uid] || {}), [wk]: 'lost' } })
      showToast((users.find(u => u.id === uid)?.name || '') + ' has 3 strikes — weekend LOST! 🚨', '#e53935')
    } else showToast('Strike ' + next + '/3 issued ⚠️', '#ff6b35')
  }

  const clearStrikes = (uid) => {
    saveStrikes({ ...strikes, [uid]: { ...(strikes[uid] || {}), [wk]: 0 } })
    saveWeekendStatus({ ...weekendStatus, [uid]: { ...(weekendStatus[uid] || {}), [wk]: 'earned' } })
    showToast('Strikes cleared! ✅')
  }

  const restoreWeekend = (uid) => {
    saveWeekendStatus({ ...weekendStatus, [uid]: { ...(weekendStatus[uid] || {}), [wk]: 'earned' } })
    showToast('Weekend restored!')
  }

  // ── Punishments ───────────────────────────────────────────────────────────
  const addPunishment = () => {
    if (!fPunishKid || !fPunishDesc.trim()) return
    const kid = users.find(u => u.id === fPunishKid)
    savePunishments([...punishments, { id: 'p' + Date.now(), kidId: fPunishKid, kidName: kid?.name || '', kidAvatar: kid?.avatar || '👤', kidColor: kid?.color || '#fff', desc: fPunishDesc.trim(), buyoutTask: fPunishBuyout.trim() || null, date: today, resolved: false }])
    setFPunishDesc(''); setFPunishBuyout(''); setModal(null)
    showToast('Punishment assigned ⚠️', '#e53935')
  }

  const resolvePunishment = (id) => { savePunishments(punishments.map(p => p.id === id ? { ...p, resolved: true } : p)); showToast('Resolved! ✅') }
  const removePunishment  = (id) => savePunishments(punishments.filter(p => p.id !== id))

  // ── Requests ──────────────────────────────────────────────────────────────
  const respondToRequest = (reqId, status, note) => {
    saveRequests(requests.map(r => r.id === reqId ? { ...r, status, parentNote: note || '' } : r))
    showToast(status === 'approved' ? '✅ Approved!' : status === 'denied' ? '❌ Denied' : '🔄 Counter sent')
    setRequestReply(prev => ({ ...prev, [reqId]: '' }))
  }

  // ── Bonus points ──────────────────────────────────────────────────────────
  const giveBonus = () => {
    if (!fBonusKid || !fBonusPts) return
    savePoints({ ...points, [fBonusKid]: (points[fBonusKid] || 0) + Number(fBonusPts) })
    showToast(`+${fBonusPts} bonus points awarded! ⭐`)
    setFBonusPts(50); setFBonusReason(''); setModal(null)
  }

  const giveBadge = () => {
    if (!fBadgeKid || !fBadgeId) return
    const userBadges = badges[fBadgeKid] || []
    if (!userBadges.includes(fBadgeId)) saveBadges({ ...badges, [fBadgeKid]: [...userBadges, fBadgeId] })
    showToast('Badge awarded! 🏅')
    setModal(null)
  }

  const forceRedoLesson = (uid, lessonId) => {
    const up = { ...learnProgress, [uid]: { ...(learnProgress[uid] || {}) } }
    delete up[uid][lessonId]
    saveLearnProgress(up)
    showToast('Lesson reset — they need to redo it')
  }

  // ── Rules ─────────────────────────────────────────────────────────────────
  const addRule = () => {
    if (!fRuleText.trim()) return
    saveRules([...rules, { id: 'r' + Date.now(), text: fRuleText.trim(), icon: fRuleIcon }])
    setFRuleText(''); setModal(null); showToast('Rule added!')
  }

  // ── Announcements ─────────────────────────────────────────────────────────
  const addAnnouncement = () => {
    if (!fAnnTitle.trim()) return
    saveAnnouncements([...announcements, { id: 'a' + Date.now(), title: fAnnTitle.trim(), body: fAnnBody.trim(), urgent: fAnnUrgent, visible: 'all', date: today }])
    setFAnnTitle(''); setFAnnBody(''); setFAnnUrgent(false); setModal(null); showToast('Announcement posted!')
  }

  const RULE_ICONS = ['📋','🚫','✅','⚠️','🏠','📱','🎮','🍽️','🛏️','🧹','💬','🕐','💪','📚','🐕']

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const handledRequests = requests.filter(r => r.status !== 'pending')

  const TABS = [
    { k: 'requests',      l: 'Requests' + (pendingRequests.length > 0 ? ` (${pendingRequests.length})` : '') },
    { k: 'strikes',       l: 'Strikes' },
    { k: 'punishments',   l: 'Punish' },
    { k: 'rewards',       l: 'Rewards' },
    { k: 'rules',         l: 'Rules' },
    { k: 'announcements', l: 'Announce' },
    { k: 'accounts',      l: 'Accounts' },
    { k: 'settings',      l: 'Settings' },
  ]

  return (
    <PageWrap>
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '1.5rem', color, marginBottom: 18 }}>⚙️ Control Center</div>

      {/* Tab scroll */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ padding: '7px 14px', borderRadius: 999, border: 'none', background: tab === t.k ? color : '#1c1c1c', color: tab === t.k ? '#000' : '#666', fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ── REQUESTS ── */}
      {tab === 'requests' && (
        <div>
          {pendingRequests.length === 0 ? <Empty icon='✨' text='No pending requests' /> : (
            pendingRequests.map(req => (
              <Card key={req.id} style={{ borderColor: 'rgba(245,166,35,.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: '1.8rem' }}>{req.typeIcon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: req.kidColor }}>{req.kidName}</div>
                    <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{req.typeLabel}</div>
                    {req.date && <div style={{ fontSize: '.72rem', color: '#666', fontWeight: 600 }}>{formatDate(req.date)}</div>}
                  </div>
                </div>
                <div style={{ background: '#141414', borderRadius: 10, padding: '10px 12px', marginBottom: 12, fontSize: '.85rem', fontWeight: 600, color: '#ccc' }}>{req.note}</div>
                <Input value={requestReply[req.id] || ''} onChange={e => setRequestReply(prev => ({ ...prev, [req.id]: e.target.value }))} placeholder='Add a note back (optional)...' style={{ marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn sm variant='green' style={{ flex: 1 }} onClick={() => respondToRequest(req.id, 'approved', requestReply[req.id])}>✓ Approve</Btn>
                  <Btn sm variant='red' style={{ flex: 1 }} onClick={() => respondToRequest(req.id, 'denied', requestReply[req.id])}>✗ Deny</Btn>
                  <Btn sm variant='dark' style={{ flex: 1 }} onClick={() => respondToRequest(req.id, 'counter', requestReply[req.id])}>🔄 Counter</Btn>
                </div>
              </Card>
            ))
          )}
          {handledRequests.length > 0 && (
            <>
              <SectionTitle style={{ marginTop: 16 }}>Handled</SectionTitle>
              {handledRequests.slice(-10).reverse().map(req => (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 8, opacity: .7 }}>
                  <div style={{ fontSize: '1.3rem' }}>{req.typeIcon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '.85rem', color: req.kidColor }}>{req.kidName} — {req.typeLabel}</div>
                    {req.parentNote && <div style={{ fontSize: '.72rem', color: '#666', fontWeight: 600 }}>"{req.parentNote}"</div>}
                  </div>
                  <Badge color={req.status === 'approved' ? '#43a047' : req.status === 'denied' ? '#e53935' : '#f5a623'} bg='rgba(255,255,255,.05)'>{req.status}</Badge>
                  <button onClick={() => saveRequests(requests.filter(r => r.id !== req.id))} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── STRIKES ── */}
      {tab === 'strikes' && (
        <div>
          {kids.map(kid => {
            const strk = getStrikes(kid.id)
            const lost = hasLostWeekend(kid.id)
            return (
              <Card key={kid.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: kid.color + '22', border: `2px solid ${kid.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{kid.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Fredoka One',cursive", color: kid.color }}>{kid.name}</div>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, color: lost ? '#e53935' : '#43a047' }}>{lost ? '❌ Weekend Lost' : '✅ Weekend Earned'}</div>
                  </div>
                  <StrikeDots count={strk} />
                </div>
                {strk > 0 && strk < 3 && (
                  <div style={{ fontSize: '.78rem', color: '#666', fontWeight: 600, marginBottom: 10 }}>
                    Active consequences: {STRIKE_CONSEQUENCES.filter(c => c.strike <= strk).map(c => c.label).join(' · ')}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Btn sm variant='red' onClick={() => addStrike(kid.id)} disabled={strk >= 3}>+ Strike</Btn>
                  <Btn sm variant='ghost' onClick={() => clearStrikes(kid.id)}>Clear All</Btn>
                  {lost && <Btn sm variant='green' onClick={() => restoreWeekend(kid.id)}>Restore Weekend</Btn>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* ── PUNISHMENTS ── */}
      {tab === 'punishments' && (
        <div>
          {punishments.filter(p => !p.resolved).length === 0 ? <Empty icon='🎉' text='No active punishments' /> : (
            punishments.filter(p => !p.resolved).map(p => (
              <Card key={p.id} style={{ borderColor: 'rgba(229,57,53,.25)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: '1.4rem' }}>{p.kidAvatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: p.kidColor }}>{p.kidName}</div>
                    <div style={{ fontWeight: 600, fontSize: '.88rem', marginTop: 3 }}>{p.desc}</div>
                    {p.buyoutTask && <div style={{ fontSize: '.78rem', color: '#f5a623', marginTop: 4, fontWeight: 700 }}>💪 Buyout: {p.buyoutTask}</div>}
                    <div style={{ fontSize: '.7rem', color: '#555', marginTop: 4 }}>{p.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn sm variant='green' onClick={() => resolvePunishment(p.id)}>✓ Resolved</Btn>
                  <Btn sm variant='ghost' onClick={() => removePunishment(p.id)}>Delete</Btn>
                </div>
              </Card>
            ))
          )}
          {punishments.filter(p => p.resolved).length > 0 && (
            <>
              <SectionTitle style={{ marginTop: 16 }}>Resolved</SectionTitle>
              {punishments.filter(p => p.resolved).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 8, opacity: .55 }}>
                  <div style={{ fontSize: '1.2rem' }}>{p.kidAvatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '.85rem' }}>{p.kidName} — {p.desc}</div>
                  </div>
                  <button onClick={() => removePunishment(p.id)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                </div>
              ))}
            </>
          )}
          <Btn full variant='red' style={{ marginTop: 8 }} onClick={() => { setFPunishKid(kids[0]?.id || ''); setFPunishDesc(''); setFPunishBuyout(''); setModal('punish') }}>
            ⚠️ Assign Punishment
          </Btn>
          <Btn full variant='dark' style={{ marginTop: 8 }} onClick={() => { setFBonusKid(kids[0]?.id || ''); setModal('bonus') }}>
            ⭐ Give Bonus Points
          </Btn>
          <Btn full variant='dark' style={{ marginTop: 8 }} onClick={() => { setFBadgeKid(kids[0]?.id || ''); setModal('badge') }}>
            🏅 Award Badge
          </Btn>
        </div>
      )}

      {/* ── REWARDS ── */}
      {tab === 'rewards' && (
        <div>
          <SectionTitle>Prizes / Rewards</SectionTitle>
          {rewards.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 9 }}>
              <div style={{ fontSize: '1.4rem' }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{r.label}</div>
                <div style={{ fontSize: '.72rem', color: '#f5a623', fontWeight: 700 }}>⭐ {r.cost} points</div>
              </div>
              <button onClick={() => saveRewards(rewards.filter(x => x.id !== r.id))} style={{ background: 'transparent', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
          ))}
          <Btn full style={{ marginTop: 8 }} onClick={() => { setFRewardLabel(''); setFRewardCost(100); setModal('reward') }}>
            + Add Prize
          </Btn>

          <SectionTitle style={{ marginTop: 20 }}>Badges</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10, marginBottom: 14 }}>
            {allBadges.map(b => (
              <div key={b.id} style={{ background: '#1c1c1c', borderRadius: 12, padding: '12px 8px', textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: '1.5rem', marginBottom:5 }}>{b.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '.75rem', marginBottom: 2 }}>{b.label}</div>
                <div style={{ fontSize: '.62rem', color: '#555', fontWeight: 600 }}>{b.desc}</div>
                {customBadges.find(cb=>cb.id===b.id) && (
                  <button onClick={()=>saveCustomBadges(customBadges.filter(cb=>cb.id!==b.id))} style={{ position:'absolute', top:4, right:4, background:'transparent', border:'none', color:'#e53935', cursor:'pointer', fontSize:'.85rem' }}>✕</button>
                )}
              </div>
            ))}
          </div>
          <Btn full variant='dark' onClick={() => { setFBadgeLabel2(''); setFBadgeIcon2('🌟'); setFBadgeDesc2(''); setModal('newBadge') }}>
            + Create Badge
          </Btn>
        </div>
      )}

      {/* ── RULES ── */}
      {tab === 'rules' && (
        <div>
          {rules.length === 0 && <Empty icon='📋' text='No rules posted yet' />}
          {rules.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 9 }}>
              <div style={{ fontSize: '1.3rem' }}>{r.icon}</div>
              <div style={{ flex: 1, fontWeight: 600, fontSize: '.9rem' }}>{r.text}</div>
              <button onClick={() => saveRules(rules.filter(x => x.id !== r.id))} style={{ background: 'transparent', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
          ))}
          <Btn full style={{ marginTop: 8 }} onClick={() => { setFRuleText(''); setModal('rule') }}>+ Add Rule</Btn>
        </div>
      )}

      {/* ── ANNOUNCEMENTS ── */}
      {tab === 'announcements' && (
        <div>
          {announcements.length === 0 && <Empty icon='📢' text='No announcements yet' />}
          {[...announcements].reverse().map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 9, borderLeft: `3px solid ${a.urgent ? '#e53935' : color}` }}>
              <div style={{ fontSize: '1.3rem' }}>{a.urgent ? '🚨' : '📢'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '.9rem', color: a.urgent ? '#e53935' : color }}>{a.title}</div>
                {a.body && <div style={{ fontSize: '.82rem', color: '#888', marginTop: 3, fontWeight: 600 }}>{a.body}</div>}
                <div style={{ fontSize: '.7rem', color: '#555', marginTop: 4 }}>{a.date}</div>
              </div>
              <button onClick={() => saveAnnouncements(announcements.filter(x => x.id !== a.id))} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
          ))}
          <Btn full style={{ marginTop: 8 }} onClick={() => { setFAnnTitle(''); setFAnnBody(''); setFAnnUrgent(false); setModal('announce') }}>
            📢 Post Announcement
          </Btn>
        </div>
      )}

      {/* ── ACCOUNTS ── */}
      {tab === 'accounts' && (
        <div>
          {users.map(u => (
            <Card key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: u.color + '22', border: `2px solid ${u.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{u.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: u.color }}>{u.name}</div>
                <div style={{ fontSize: '.72rem', color: '#555', fontWeight: 600 }}>{u.role} · PIN: {u.pin} · {points?.[u.id] || 0} pts</div>
              </div>
              <Btn sm variant='ghost' onClick={() => removeUser(u.id)}>Remove</Btn>
            </Card>
          ))}
          <Btn full style={{ marginTop: 8 }} onClick={() => setShowAddUser(true)}>+ Add Person</Btn>
          {showAddUser && <AddUserModal onAdd={(u) => { addUser(u); setShowAddUser(false); showToast(u.name + ' added!') }} onClose={() => setShowAddUser(false)} />}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab === 'settings' && (
        <div>
          <Card>
            <SectionTitle>App Name</SectionTitle>
            <Input value={appName} onChange={e => setAppName(e.target.value)} placeholder='App name' style={{ marginBottom: 14 }} />
            <SectionTitle>Primary Color</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setAppColor(c)} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: appColor === c ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>
            <Btn full onClick={() => { updateSettings({ primaryColor: appColor, appName }); showToast('Settings saved!') }}>
              Save Settings
            </Btn>
          </Card>

          <Card>
            <SectionTitle>Profile Visibility</SectionTitle>
            <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:14 }}>
              Control what kids can see about each other when they tap a family member. Parents always see everything.
            </div>
            {[
              { key:'points', label:'⭐ Points' },
              { key:'rank', label:'🎖️ Rank' },
              { key:'badges', label:'🏅 Badges' },
              { key:'chores', label:'✅ Chores' },
              { key:'lessons', label:'📚 Lessons' },
              { key:'reading', label:'📖 Reading' },
              { key:'writing', label:'✏️ Writing' },
              { key:'strikes', label:'⚠️ Strikes' },
              { key:'punishments', label:'🚫 Punishments' },
            ].map(item => {
              const cur = (profileVisibility||{})[item.key] || 'all'
              return (
                <div key={item.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                  <div style={{ flex:1, fontWeight:700, fontSize:'.85rem' }}>{item.label}</div>
                  <button onClick={() => saveProfileVisibility({ ...(profileVisibility||{}), [item.key]: cur==='all'?'parents':'all' })}
                    style={{ padding:'5px 14px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:800, fontSize:'.72rem',
                      background: cur==='all'?'rgba(67,160,71,.15)':'rgba(156,39,176,.15)',
                      color: cur==='all'?'#43a047':'#9c27b0' }}>
                    {cur==='all'?'👨‍👩‍👧 Everyone':'👨‍👧 Parents Only'}
                  </button>
                </div>
              )
            })}
          </Card>

          <Card>
            <SectionTitle>Weekend Activities</SectionTitle>
            {weekendActs.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < weekendActs.length - 1 ? '1px solid rgba(255,255,255,.05)' : '' }}>
                <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '.88rem' }}>{a.label}</span>
                <button onClick={() => saveWeekendActs(weekendActs.filter(x => x.id !== a.id))} style={{ background: 'transparent', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
            ))}
            <Btn sm style={{ marginTop: 12 }} onClick={() => setModal('weekendAct')}>+ Add Activity</Btn>
          </Card>

          <Card>
            <SectionTitle>Schedule</SectionTitle>
            {schedule.map((s, i) => (
              <div key={s.id || i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i < schedule.length - 1 ? '1px solid rgba(255,255,255,.05)' : '' }}>
                <span>{s.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '.8rem', color: color, minWidth: 80 }}>{s.time}</span>
                <span style={{ flex: 1, fontSize: '.85rem', fontWeight: 600 }}>{s.label}</span>
                <button onClick={() => saveSchedule(schedule.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
            ))}
            <Btn sm style={{ marginTop: 12 }} onClick={() => { setFSchedTime(''); setFSchedLabel(''); setFSchedNote(''); setModal('sched') }}>+ Add Schedule Item</Btn>
          </Card>
        </div>
      )}

      {/* ── MODALS ── */}
      {modal === 'punish' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Assign Punishment ⚠️</ModalTitle>
          <Select value={fPunishKid} onChange={e => setFPunishKid(e.target.value)} style={{ marginBottom: 12 }}>
            {kids.map(k => <option key={k.id} value={k.id}>{k.avatar} {k.name}</option>)}
          </Select>
          <Input value={fPunishDesc} onChange={e => setFPunishDesc(e.target.value)} placeholder='Punishment description' style={{ marginBottom: 10 }} autoFocus />
          <Input value={fPunishBuyout} onChange={e => setFPunishBuyout(e.target.value)} placeholder='Buyout task (optional — e.g. "Write a 1-page apology")' style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant='red' style={{ flex: 1 }} onClick={addPunishment}>Assign</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'bonus' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Give Bonus Points ⭐</ModalTitle>
          <Select value={fBonusKid} onChange={e => setFBonusKid(e.target.value)} style={{ marginBottom: 12 }}>
            {kids.map(k => <option key={k.id} value={k.id}>{k.avatar} {k.name}</option>)}
          </Select>
          <Input value={fBonusPts} onChange={e => setFBonusPts(e.target.value)} type='number' placeholder='Points to give' style={{ marginBottom: 10 }} />
          <Input value={fBonusReason} onChange={e => setFBonusReason(e.target.value)} placeholder='Reason (optional)' style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={giveBonus}>Give Points</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'badge' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Award Badge 🏅</ModalTitle>
          <Select value={fBadgeKid} onChange={e => setFBadgeKid(e.target.value)} style={{ marginBottom: 12 }}>
            {kids.map(k => <option key={k.id} value={k.id}>{k.avatar} {k.name}</option>)}
          </Select>
          <Select value={fBadgeId} onChange={e => setFBadgeId(e.target.value)} style={{ marginBottom: 18 }}>
            {BADGES.map(b => <option key={b.id} value={b.id}>{b.icon} {b.label}</option>)}
          </Select>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={giveBadge}>Award</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'rule' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add House Rule 📋</ModalTitle>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {RULE_ICONS.map(ic => (
              <button key={ic} onClick={() => setFRuleIcon(ic)} style={{ fontSize: '1.3rem', padding: 5, borderRadius: 9, border: fRuleIcon === ic ? '2px solid #f5a623' : '2px solid transparent', background: '#141414', cursor: 'pointer' }}>{ic}</button>
            ))}
          </div>
          <Input value={fRuleText} onChange={e => setFRuleText(e.target.value)} placeholder='Rule text' style={{ marginBottom: 18 }} autoFocus />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={addRule}>Add Rule</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'announce' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Post Announcement 📢</ModalTitle>
          <Input value={fAnnTitle} onChange={e => setFAnnTitle(e.target.value)} placeholder='Title' style={{ marginBottom: 10 }} autoFocus />
          <Input value={fAnnBody} onChange={e => setFAnnBody(e.target.value)} placeholder='Details (optional)' rows={2} style={{ marginBottom: 12 }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: '.85rem', marginBottom: 18, cursor: 'pointer' }}>
            <input type='checkbox' checked={fAnnUrgent} onChange={e => setFAnnUrgent(e.target.checked)} />
            🚨 Mark as urgent
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={addAnnouncement}>Post</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'reward' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add Reward 🎁</ModalTitle>
          <Input value={fRewardLabel} onChange={e => setFRewardLabel(e.target.value)} placeholder='Reward name' style={{ marginBottom: 10 }} autoFocus />
          <Input value={fRewardIcon} onChange={e => setFRewardIcon(e.target.value)} placeholder='Emoji icon' style={{ marginBottom: 10 }} />
          <Input value={fRewardCost} onChange={e => setFRewardCost(e.target.value)} type='number' placeholder='Points cost' style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={() => { if (!fRewardLabel.trim()) return; saveRewards([...rewards, { id: 'rew' + Date.now(), label: fRewardLabel, icon: fRewardIcon, cost: Number(fRewardCost) }]); setModal(null); showToast('Reward added!') }}>Add</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'weekendAct' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add Weekend Activity 🎉</ModalTitle>
          <Input value={fWAIcon} onChange={e => setFWAIcon(e.target.value)} placeholder='Emoji' style={{ marginBottom: 10 }} />
          <Input value={fWALabel} onChange={e => setFWALabel(e.target.value)} placeholder='Activity name' style={{ marginBottom: 18 }} autoFocus />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={() => { if (!fWALabel.trim()) return; saveWeekendActs([...weekendActs, { id: 'wa' + Date.now(), label: fWALabel, icon: fWAIcon }]); setModal(null); showToast('Activity added!') }}>Add</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'sched' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add Schedule Item 🕐</ModalTitle>
          <Input value={fSchedIcon} onChange={e => setFSchedIcon(e.target.value)} placeholder='Emoji' style={{ marginBottom: 10 }} />
          <Input value={fSchedTime} onChange={e => setFSchedTime(e.target.value)} placeholder='Time (e.g. 0800–0900)' style={{ marginBottom: 10 }} />
          <Input value={fSchedLabel} onChange={e => setFSchedLabel(e.target.value)} placeholder='Label' style={{ marginBottom: 10 }} autoFocus />
          <Input value={fSchedNote} onChange={e => setFSchedNote(e.target.value)} placeholder='Note (optional)' style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={() => { if (!fSchedLabel.trim()) return; saveSchedule([...schedule, { id: 'sc' + Date.now(), time: fSchedTime, label: fSchedLabel, note: fSchedNote, icon: fSchedIcon, visible: 'all' }]); setModal(null); showToast('Added!') }}>Add</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'newBadge' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Create Badge 🏅</ModalTitle>
          <Input value={fBadgeIcon2} onChange={e => setFBadgeIcon2(e.target.value)} placeholder='Emoji icon' style={{ marginBottom: 10 }} />
          <Input value={fBadgeLabel2} onChange={e => setFBadgeLabel2(e.target.value)} placeholder='Badge name' style={{ marginBottom: 10 }} autoFocus />
          <Input value={fBadgeDesc2} onChange={e => setFBadgeDesc2(e.target.value)} placeholder='How to earn it' style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={() => {
              if (!fBadgeLabel2.trim()) return
              saveCustomBadges([...customBadges, { id: 'cb'+Date.now(), label: fBadgeLabel2.trim(), icon: fBadgeIcon2, desc: fBadgeDesc2.trim() }])
              setModal(null); showToast('Badge created! 🏅')
            }}>Create</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </PageWrap>
  )
}
