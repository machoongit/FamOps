import { useNavigate } from 'react-router-dom'
// pages/ParentPage.jsx
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Input, Select, Modal, ModalTitle, Toast, SectionTitle, Badge, Empty, AddUserModal, StrikeDots } from '../components'
import { todayKey, weekKey, COLORS, STRIKE_CONSEQUENCES, DEFAULT_SCHEDULE, DEFAULT_SPECIAL_DAYS, DEFAULT_WEEKEND_ACTIVITIES, DEFAULT_REWARDS, BADGES, HP_HOUSES, formatDate } from '../constants'

// ── Rule Sets Tab ─────────────────────────────────────────────────────────
const RULE_FIELDS = [
  { key: 'signupStart',     label: 'Signup Start',       type: 'hour' },
  { key: 'signupEnd',       label: 'Signup End',         type: 'hour' },
  { key: 'quizPassScore',   label: 'Quiz Pass Score',    type: 'select', opts: [1,2,3,4,5].map(n=>({v:n,l:`${n}/5`})) },
  { key: 'quizRetryHours',  label: 'Quiz Retry Lockout', type: 'select', opts: [1,2,4,8,12,24,48].map(h=>({v:h,l:`${h}h`})) },
  { key: 'readingMinutes',  label: 'Reading Minimum',    type: 'select', opts: [10,15,20,30,45,60].map(m=>({v:m,l:`${m}min`})) },
  { key: 'writingMinWords', label: 'Writing Min Words',  type: 'select', opts: [10,20,30,50,75,100,150].map(w=>({v:w,l:`${w} words`})) },
  { key: 'readingPoints',   label: 'Reading Points',     type: 'select', opts: [0,5,10,15,20,25,30,50].map(n=>({v:n,l:n===0?'No pts':`+${n}pts`})) },
  { key: 'writingPoints',   label: 'Writing Points',     type: 'select', opts: [0,5,10,15,20,25,30,50].map(n=>({v:n,l:n===0?'No pts':`+${n}pts`})) },
  { key: 'strikeLimit',     label: 'Strike Limit',       type: 'select', opts: [1,2,3,4,5].map(n=>({v:n,l:`${n} strikes`})) },
]

const hourLabel = (h) => h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h-12}pm`

function RuleField({ fieldKey, type, opts, value, onChange, placeholder }) {
  if (type === 'hour') return (
    <select value={value ?? ''} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      style={{ background:'#141414', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:8, padding:'6px 10px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, fontSize:'.8rem' }}>
      <option value=''>Global default</option>
      {Array.from({length:24},(_,i)=><option key={i} value={i}>{hourLabel(i)}</option>)}
    </select>
  )
  if (type === 'select') return (
    <select value={value ?? ''} onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      style={{ background:'#141414', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:8, padding:'6px 10px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, fontSize:'.8rem' }}>
      <option value=''>Global default</option>
      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  )
  return null
}

function RuleSetsTab({ kids, users, settings, ruleGroups, saveRuleGroups, userRules, saveUserRules, updateUser, color, showToast }) {
  const [view, setView]       = useState('list') // list | group | user
  const [editGroup, setEditGroup] = useState(null)
  const [editUser, setEditUser]   = useState(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupColor, setNewGroupColor] = useState('#f5a623')

  const createGroup = () => {
    if (!newGroupName.trim()) return
    const g = { id: 'grp'+Date.now(), name: newGroupName.trim(), color: newGroupColor, rules: {} }
    saveRuleGroups([...ruleGroups, g])
    setNewGroupName(''); showToast('Group created!')
  }

  const updateGroupRule = (groupId, key, val) => {
    const updated = ruleGroups.map(g => {
      if (g.id !== groupId) return g
      const rules = { ...g.rules }
      if (val === undefined) delete rules[key]; else rules[key] = val
      return { ...g, rules }
    })
    saveRuleGroups(updated)
  }

  const updateUserRule = (userId, key, val) => {
    const cur = { ...(userRules[userId] || {}) }
    if (val === undefined) delete cur[key]; else cur[key] = val
    saveUserRules({ ...userRules, [userId]: Object.keys(cur).length > 0 ? cur : undefined })
    showToast('Saved!')
  }

  const assignGroup = (userId, groupId) => {
    updateUser(userId, { groupId: groupId || null })
    showToast(groupId ? 'Group assigned!' : 'Removed from group')
  }

  return (
    <div>
      {/* Groups section */}
      <SectionTitle>Groups</SectionTitle>
      <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:12 }}>
        Create groups (Boys, Girls, Older Kids, etc.) and set rules for the whole group at once.
      </div>

      {ruleGroups.map(g => (
        <Card key={g.id}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:g.color, flexShrink:0 }} />
            <div style={{ fontFamily:"'Fredoka One',cursive", color:g.color, flex:1 }}>{g.name}</div>
            <span style={{ fontSize:'.72rem', color:'#555', fontWeight:700 }}>
              {kids.filter(k=>k.groupId===g.id).length} member{kids.filter(k=>k.groupId===g.id).length!==1?'s':''}
            </span>
            <button onClick={()=>saveRuleGroups(ruleGroups.filter(x=>x.id!==g.id))} style={{ background:'transparent', border:'none', color:'#e53935', cursor:'pointer', fontSize:'1rem' }}>✕</button>
          </div>

          {/* Group members */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
            {kids.map(k => (
              <button key={k.id} onClick={()=>assignGroup(k.id, k.groupId===g.id ? null : g.id)}
                style={{ padding:'4px 12px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:700, fontSize:'.75rem',
                  background: k.groupId===g.id ? g.color : 'rgba(255,255,255,.07)',
                  color: k.groupId===g.id ? '#000' : '#666' }}>
                {k.avatar} {k.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Group rule overrides */}
          <div style={{ fontSize:'.72rem', color:'#666', fontWeight:700, marginBottom:8 }}>Override rules for this group:</div>
          {RULE_FIELDS.map(f => (
            <div key={f.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
              <div style={{ flex:1, fontWeight:600, fontSize:'.82rem' }}>{f.label}</div>
              <RuleField fieldKey={f.key} type={f.type} opts={f.opts}
                value={g.rules?.[f.key]}
                onChange={val => updateGroupRule(g.id, f.key, val)} />
            </div>
          ))}
        </Card>
      ))}

      {/* Create group */}
      <div style={{ display:'flex', gap:8, marginBottom:24, alignItems:'center' }}>
        <input value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} placeholder='New group name...'
          style={{ flex:1, background:'#141414', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:10, padding:'9px 12px', color:'#fff', fontFamily:'Nunito,sans-serif', fontWeight:600, fontSize:'.88rem' }} />
        <div style={{ display:'flex', gap:5 }}>
          {['#f5a623','#e91e8c','#4a90e2','#43a047','#9c27b0','#ff6b35'].map(c=>(
            <button key={c} onClick={()=>setNewGroupColor(c)} style={{ width:22, height:22, borderRadius:'50%', background:c, border:newGroupColor===c?'2px solid #fff':'2px solid transparent', cursor:'pointer' }} />
          ))}
        </div>
        <Btn sm onClick={createGroup}>+ Add</Btn>
      </div>

      {/* Per-person overrides */}
      <SectionTitle>Individual Overrides</SectionTitle>
      <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:12 }}>
        Set specific rules for one person that override everything else.
      </div>
      {kids.map(kid => {
        const kidGroup = ruleGroups.find(g=>g.id===kid.groupId)
        const overrides = userRules[kid.id] || {}
        const hasOverrides = Object.keys(overrides).length > 0
        return (
          <Card key={kid.id}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: hasOverrides ? 12 : 0 }}>
              <div style={{ fontSize:'1.3rem' }}>{kid.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Fredoka One',cursive", color:kid.color }}>{kid.name}</div>
                <div style={{ fontSize:'.7rem', color:'#555', fontWeight:600 }}>
                  {kidGroup ? <span style={{ color:kidGroup.color }}>Group: {kidGroup.name}</span> : 'No group'} · {hasOverrides ? Object.keys(overrides).length+' overrides' : 'Using global/group rules'}
                </div>
              </div>
            </div>
            {RULE_FIELDS.map(f => (
              <div key={f.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                <div style={{ flex:1, fontWeight:600, fontSize:'.82rem' }}>{f.label}</div>
                <RuleField fieldKey={f.key} type={f.type} opts={f.opts}
                  value={overrides[f.key]}
                  onChange={val => updateUserRule(kid.id, f.key, val)} />
              </div>
            ))}
          </Card>
        )
      })}
    </div>
  )
}

export default function ParentPage() {
  const navigate = useNavigate()
  const {
    currentUser, users, kids, parents, isParent,
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
    ruleGroups, saveRuleGroups,
    userRules, saveUserRules,
    choreCategories, saveChoreCategories,
    customRequestTypes, saveCustomRequestTypes,
    customRanks, saveCustomRanks, effectiveRanks,
    customBadges, saveCustomBadges,
    redemptions, saveRedemptions,
    parentNotes, saveParentNotes,
    doWeeklyReset, weeklyResetDate,
    lessonResetLog, saveLessonResetLog,
    logActivity,
    menu, saveMenu, mealRequests, saveMealRequests,
  } = useAuth()

  const [tab, setTab]   = useState('requests')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)

  // Custom badges now come from context (synced via Firebase)
  const [fBadgeLabel2, setFBadgeLabel2] = useState('')
  const [fBadgeIcon2, setFBadgeIcon2]   = useState('🌟')
  const [fBadgeDesc2, setFBadgeDesc2]   = useState('')
  const [fNewCat, setFNewCat]           = useState('')
  const [fNewReqIcon, setFNewReqIcon]   = useState('✨')
  const [fNewReqLabel, setFNewReqLabel] = useState('')
  const [noteInputs, setNoteInputs]     = useState({})
  const allBadges = [...BADGES, ...customBadges]

  // Form states
  const [fPunishKid, setFPunishKid]   = useState(kids[0]?.id || '')
  const [fPunishDesc, setFPunishDesc] = useState('')
  const [fPunishBuyout, setFPunishBuyout] = useState('')
  const [fPunishExpiry, setFPunishExpiry] = useState(0)
  const [fRuleText, setFRuleText]     = useState('')
  const [fRuleIcon, setFRuleIcon]     = useState('📋')
  const [fAnnTitle, setFAnnTitle]     = useState('')
  const [fAnnBody, setFAnnBody]       = useState('')
  const [fAnnUrgent, setFAnnUrgent]   = useState(false)
  const [fRewardLabel, setFRewardLabel] = useState('')
  const [fRewardIcon, setFRewardIcon] = useState('🎁')
  const [fRewardCost, setFRewardCost] = useState(100)
  const [fRewardLimit, setFRewardLimit] = useState(0)
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
  const [fBadgePts, setFBadgePts]     = useState(25)
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
    const limit = settings?.strikeLimit ?? 3
    const cur = getStrikes(uid)
    const next = cur + 1
    saveStrikes({ ...strikes, [uid]: { ...(strikes[uid] || {}), [wk]: next } })
    if (next >= limit) {
      saveWeekendStatus({ ...weekendStatus, [uid]: { ...(weekendStatus[uid] || {}), [wk]: 'lost' } })
      showToast((users.find(u => u.id === uid)?.name || '') + ` has ${limit} strikes — weekend LOST! 🚨`, '#e53935')
    } else showToast(`Strike ${next}/${limit} issued ⚠️`, '#ff6b35')
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
    const expiryDate = fPunishExpiry > 0 ? new Date(Date.now() + fPunishExpiry * 86400000).toISOString().slice(0,10) : null
    savePunishments([...punishments, { id: 'p' + Date.now(), kidId: fPunishKid, kidName: kid?.name || '', kidAvatar: kid?.avatar || '👤', kidColor: kid?.color || '#fff', desc: fPunishDesc.trim(), buyoutTask: fPunishBuyout.trim() || null, date: today, expiryDate, resolved: false }])
    setFPunishDesc(''); setFPunishBuyout(''); setFPunishExpiry(0); setModal(null)
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
    if (fBadgePts > 0) savePoints({ ...points, [fBadgeKid]: (points[fBadgeKid]||0) + Number(fBadgePts) })
    showToast(`Badge awarded! +${fBadgePts} pts 🏅`)
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
    { k: 'redemptions',   l: 'Rewards' + (redemptions.filter(r=>r.status==='pending').length > 0 ? ` (${redemptions.filter(r=>r.status==='pending').length})` : '') },
    { k: 'menu',          l: 'Menu' + (mealRequests?.filter(r=>r.status==='pending').length > 0 ? ` (${mealRequests.filter(r=>r.status==='pending').length})` : '') },
    { k: 'strikes',       l: 'Strikes' },
    { k: 'punishments',   l: 'Punish' },
    { k: 'notes',         l: 'Notes' },
    { k: 'rewardsmgr',   l: 'Prizes' },
    { k: 'rules',         l: 'Rules' },
    { k: 'rulesets',      l: 'Rule Sets' },
    { k: 'announcements', l: 'Announce' },
    { k: 'accounts',      l: 'Accounts' },
    { k: 'settings',      l: 'Settings' },
  ]

  return (
    <PageWrap>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}><button onClick={()=>navigate("/home")} style={{ background:"rgba(255,255,255,.07)", border:"none", color:"#fff", fontWeight:800, fontSize:".82rem", padding:"7px 14px", borderRadius:999, cursor:"pointer" }}>← Home</button><div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.5rem", color, flex:1 }}>⚙️ Control Center</div></div>

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
      {/* ── MENU MANAGEMENT ── */}
      {tab === 'menu' && (
        <div>
          <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:14 }}>
            Review and respond to meal requests from your crew. You can also edit the menu directly from the Chow Hall page.
          </div>

          {/* Pending requests */}
          {(mealRequests||[]).filter(r=>r.status==='pending').length === 0
            ? <Empty icon='🍽️' text='No pending meal requests' />
            : (mealRequests||[]).filter(r=>r.status==='pending').map(r=>(
              <Card key={r.id} style={{ borderColor:'rgba(245,166,35,.2)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <div style={{ fontSize:'1.4rem' }}>{r.slotIcon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, color:r.userColor, fontSize:'.88rem' }}>{r.userName}</div>
                    <div style={{ fontWeight:700, fontSize:'.82rem' }}>{r.slotLabel} · {r.date}</div>
                    <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.6)', marginTop:2 }}>"{r.suggestion}"</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn sm variant='green' style={{ flex:1 }} onClick={()=>{
                    saveMenu({ ...menu, [r.date]: { ...(menu[r.date]||{}), [r.slot]: r.suggestion } })
                    saveMealRequests(mealRequests.map(x=>x.id===r.id?{...x,status:'approved'}:x))
                    showToast(`✅ Added "${r.suggestion}" to menu`)
                  }}>✓ Add to Menu</Btn>
                  <Btn sm variant='red' style={{ flex:1 }} onClick={()=>{
                    saveMealRequests(mealRequests.map(x=>x.id===r.id?{...x,status:'denied'}:x))
                    showToast('Denied')
                  }}>✗ Deny</Btn>
                </div>
              </Card>
            ))
          }

          {/* History */}
          {(mealRequests||[]).filter(r=>r.status!=='pending').length > 0 && (
            <>
              <SectionTitle style={{ marginTop:16 }}>History</SectionTitle>
              {(mealRequests||[]).filter(r=>r.status!=='pending').slice(-10).reverse().map(r=>(
                <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'#1c1c1c', borderRadius:12, marginBottom:8, opacity:.7 }}>
                  <div>{r.slotIcon}</div>
                  <div style={{ flex:1, fontSize:'.8rem', fontWeight:700, color:r.userColor }}>{r.userName} — {r.slotLabel}: "{r.suggestion}"</div>
                  <Badge color={r.status==='approved'?'#22c55e':'#e53935'} bg='rgba(255,255,255,.05)'>{r.status}</Badge>
                  <button onClick={()=>saveMealRequests(mealRequests.filter(x=>x.id!==r.id))} style={{ background:'transparent',border:'none',color:'#444',cursor:'pointer',fontSize:'.9rem' }}>✕</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

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
                  <Btn sm variant='red' onClick={() => addStrike(kid.id)} disabled={strk >= (settings?.strikeLimit ?? 3)}>+ Strike</Btn>
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

      {/* ── REDEMPTION APPROVALS ── */}
      {tab === 'redemptions' && (
        <div>
          {redemptions.filter(r=>r.status==='pending').length === 0
            ? <Empty icon='🎁' text='No pending reward requests' />
            : redemptions.filter(r=>r.status==='pending').map(r => (
              <Card key={r.id} style={{ borderColor:'rgba(245,166,35,.2)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <div style={{ fontSize:'1.8rem' }}>{r.rewardIcon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, color:r.userColor }}>{r.userName}</div>
                    <div style={{ fontWeight:700, fontSize:'.9rem' }}>{r.rewardLabel}</div>
                    <div style={{ fontSize:'.72rem', color:'#f5a623', fontWeight:700 }}>⭐ {r.cost} points</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn sm variant='green' style={{ flex:1 }} onClick={()=>{
                    saveRedemptions(redemptions.map(x=>x.id===r.id?{...x,status:'approved'}:x))
                    // deduct points on approval
                    savePoints({ ...points, [r.userId]: Math.max(0,(points[r.userId]||0)-r.cost) })
                    logActivity(r.userId, 'redemption_approved', `Reward approved: ${r.rewardLabel}`, -r.cost)
                    showToast(`✅ Approved! ${r.cost} pts deducted`)
                  }}>✓ Approve</Btn>
                  <Btn sm variant='red' style={{ flex:1 }} onClick={()=>{
                    saveRedemptions(redemptions.map(x=>x.id===r.id?{...x,status:'denied'}:x))
                    showToast('❌ Denied')
                  }}>✗ Deny</Btn>
                </div>
              </Card>
            ))
          }
          {redemptions.filter(r=>r.status!=='pending').length > 0 && (
            <>
              <SectionTitle style={{ marginTop:16 }}>History</SectionTitle>
              {redemptions.filter(r=>r.status!=='pending').slice(-10).reverse().map(r=>(
                <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8, opacity:.7 }}>
                  <div style={{ fontSize:'1.2rem' }}>{r.rewardIcon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:'.85rem', color:r.userColor }}>{r.userName} — {r.rewardLabel}</div>
                  </div>
                  <Badge color={r.status==='approved'?'#22c55e':'#e53935'} bg='rgba(255,255,255,.05)'>{r.status}</Badge>
                  <button onClick={()=>saveRedemptions(redemptions.filter(x=>x.id!==r.id))} style={{ background:'transparent', border:'none', color:'#444', cursor:'pointer', fontSize:'1rem' }}>✕</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── PRIZES / REWARDS MANAGER ── */}
      {tab === 'rewardsmgr' && (
        <div>
          <SectionTitle>Prizes</SectionTitle>
          {rewards.map(r => (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:9 }}>
              <div style={{ fontSize:'1.4rem' }}>{r.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700 }}>{r.label}</div>
                <div style={{ fontSize:'.72rem', color:'#f5a623', fontWeight:700 }}>⭐ {r.cost} pts{r.limit>0?` · Limit: ${r.limit}x`:' · Unlimited'}</div>
              </div>
              <button onClick={() => saveRewards(rewards.filter(x => x.id !== r.id))} style={{ background:'transparent', border:'none', color:'#e53935', cursor:'pointer', fontSize:'1rem' }}>✕</button>
            </div>
          ))}
          <Btn full style={{ marginTop:8 }} onClick={() => { setFRewardLabel(''); setFRewardCost(100); setModal('reward') }}>
            + Add Prize
          </Btn>
        </div>
      )}

      {/* ── PARENT NOTES ── */}
      {tab === 'notes' && (
        <div>
          <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:14 }}>Leave a note for a specific kid. They'll see it when they log in until they dismiss it.</div>
          {kids.map(kid => {
            const kidNotes = (parentNotes[kid.id]||[]).filter(n=>!n.read)
            return (
              <Card key={kid.id}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <div style={{ fontSize:'1.3rem' }}>{kid.avatar}</div>
                  <div style={{ fontFamily:"'Fredoka One',cursive", color:kid.color, flex:1 }}>{kid.name}</div>
                  {kidNotes.length>0&&<Badge color='#f5a623' bg='rgba(245,166,35,.15)'>{kidNotes.length} active</Badge>}
                </div>
                {kidNotes.map(n=>(
                  <div key={n.id} style={{ background:'rgba(245,166,35,.08)', border:'1.5px solid rgba(245,166,35,.2)', borderRadius:10, padding:'9px 12px', marginBottom:8, display:'flex', gap:8 }}>
                    <div style={{ flex:1, fontSize:'.85rem', fontWeight:600 }}>{n.msg}</div>
                    <button onClick={()=>saveParentNotes({...parentNotes,[kid.id]:(parentNotes[kid.id]||[]).filter(x=>x.id!==n.id)})} style={{ background:'transparent', border:'none', color:'#e53935', cursor:'pointer', fontSize:'.9rem' }}>✕</button>
                  </div>
                ))}
                <div style={{ display:'flex', gap:8, marginTop:4 }}>
                  <Input
                    value={noteInputs[kid.id]||''}
                    onChange={e=>setNoteInputs(n=>({...n,[kid.id]:e.target.value}))}
                    placeholder={`Leave a note for ${kid.name}...`}
                    style={{ flex:1 }}
                  />
                  <Btn sm onClick={()=>{
                    const msg=(noteInputs[kid.id]||'').trim()
                    if(!msg) return
                    const note={id:'n'+Date.now(),msg,from:currentUser.name,date:new Date().toISOString(),read:false}
                    saveParentNotes({...parentNotes,[kid.id]:[...(parentNotes[kid.id]||[]),note]})
                    setNoteInputs(n=>({...n,[kid.id]:''}))
                    showToast(`Note sent to ${kid.name}!`)
                  }}>Send</Btn>
                </div>
              </Card>
            )
          })}
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
      {/* ── RULE SETS ── */}
      {tab === 'rulesets' && (
        <RuleSetsTab
          kids={kids} users={users}
          settings={settings}
          ruleGroups={ruleGroups} saveRuleGroups={saveRuleGroups}
          userRules={userRules} saveUserRules={saveUserRules}
          updateUser={updateUser}
          color={color} showToast={showToast}
        />
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
          {showAddUser && <AddUserModal onAdd={(u) => { addUser(u); setShowAddUser(false); showToast(u.name + ' added!') }} onClose={() => setShowAddUser(false)} existingParents={parents} isParentSession={true} />}
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

          {/* Harry Potter Theme */}
          <Card style={{ borderColor:'rgba(174,0,1,.25)', background:'linear-gradient(135deg,#0e0e1a,#1a0a0a)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ fontSize:'1.8rem' }}>⚡</div>
              <div>
                <SectionTitle style={{ marginBottom:2 }}>Harry Potter Mode</SectionTitle>
                <div style={{ fontSize:'.72rem', color:'#666', fontWeight:600 }}>Transform FamOps into a Hogwarts experience</div>
              </div>
              <button onClick={()=>updateSettings({ hpMode: !settings?.hpMode })}
                style={{ marginLeft:'auto', padding:'6px 16px', borderRadius:999, border:'none', cursor:'pointer', fontWeight:800, fontSize:'.8rem',
                  background: settings?.hpMode ? '#ae0001' : 'rgba(255,255,255,.08)',
                  color: settings?.hpMode ? '#d3a625' : '#666' }}>
                {settings?.hpMode ? '⚡ On' : 'Off'}
              </button>
            </div>

            {settings?.hpMode && (
              <>
                <div style={{ fontSize:'.8rem', color:'#d3a625', fontWeight:700, marginBottom:10 }}>Choose Your House</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                  {HP_HOUSES.map(h=>(
                    <button key={h.id} onClick={()=>updateSettings({ hpHouse: h.id })}
                      style={{ padding:'12px 10px', borderRadius:14, border:`2px solid ${settings?.hpHouse===h.id?h.accent:'rgba(255,255,255,.08)'}`,
                        background: settings?.hpHouse===h.id ? h.color+'33' : 'rgba(255,255,255,.04)', cursor:'pointer', textAlign:'left' }}>
                      <div style={{ fontSize:'1.4rem', marginBottom:4 }}>{h.emoji}</div>
                      <div style={{ fontFamily:"'Fredoka One',cursive", color:settings?.hpHouse===h.id?h.accent:'#888', fontSize:'.9rem' }}>{h.name}</div>
                      <div style={{ fontSize:'.65rem', color:'#555', fontWeight:600, marginTop:2 }}>{h.desc}</div>
                    </button>
                  ))}
                </div>
                <div style={{ background:'rgba(211,166,37,.1)', border:'1.5px solid rgba(211,166,37,.2)', borderRadius:12, padding:'10px 14px', fontSize:'.8rem', fontWeight:600, color:'#d3a625' }}>
                  🧙 Ranks become Hogwarts years (First Year → Dumbledore), app colors follow your house. House points = XP. Your Sorting begins now.
                </div>
              </>
            )}
          </Card>
          {/* Kid Controls */}
          <Card>
            <SectionTitle>🔒 Kid Controls</SectionTitle>
            <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:16 }}>
              Toggle which sections kids can access. Turning one off removes the tile and blocks the route for all kids instantly.
            </div>
            {[
              { key:'learn',    icon:'📚', label:'Learn',        desc:'Lessons, quizzes, reading and writing' },
              { key:'calendar', icon:'📅', label:'Calendar',     desc:'Family schedule and events' },
              { key:'meals',    icon:'🍽', label:'Chow Hall',    desc:'Daily menu and meal requests' },
              { key:'rewards',  icon:'🎁', label:'Reward Shop',  desc:'Points redemption in Profile' },
              { key:'requests', icon:'✨', label:'Make Request', desc:'General requests to parents' },
            ].map(ctrl => {
              const on = settings?.kidControls?.[ctrl.key] !== false
              return (
                <div key={ctrl.key} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                  <div style={{ fontSize:'1.2rem' }}>{ctrl.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:'.88rem' }}>{ctrl.label}</div>
                    <div style={{ fontSize:'.7rem', color:'#555', fontWeight:600 }}>{ctrl.desc}</div>
                  </div>
                  <button onClick={()=>{
                    const cur = { learn:true, calendar:true, meals:true, rewards:true, requests:true, ...(settings?.kidControls||{}) }
                    updateSettings({ kidControls: { ...cur, [ctrl.key]: !on } })
                  }} style={{
                    width:48, height:26, borderRadius:13, border:'none', cursor:'pointer', position:'relative', transition:'background .2s',
                    background: on ? color : 'rgba(255,255,255,.1)',
                  }}>
                    <div style={{ position:'absolute', top:3, left: on ? 25 : 3, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left .2s' }} />
                  </button>
                </div>
              )
            })}
          </Card>

          <Card style={{ borderColor:'rgba(229,57,53,.2)' }}>
            <SectionTitle>🔄 Weekly Reset</SectionTitle>
            <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:14 }}>
              Clears all chore signups, completions, strikes and weekend status for a fresh week. Use this every Monday or whenever you want to start fresh.
            </div>
            {weeklyResetDate && <div style={{ fontSize:'.75rem', color:'#555', fontWeight:600, marginBottom:10 }}>Last reset: {weeklyResetDate}</div>}
            <Btn full variant='red' onClick={()=>setModal('weeklyReset')}>Reset the Week</Btn>
          </Card>

          {/* Rank Editor */}
          <Card>
            <SectionTitle>🎖️ Rank Editor</SectionTitle>
            <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:14 }}>
              Customize rank names, icons, and XP thresholds. Leave blank to use defaults.
            </div>
            {effectiveRanks.map((r, i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                <Input value={(customRanks||[])[i]?.icon ?? r.icon} onChange={e=>{ const nr=[...(customRanks||effectiveRanks)]; if(!nr[i])nr[i]={...r}; nr[i].icon=e.target.value; saveCustomRanks(nr) }} style={{ width:50 }} />
                <Input value={(customRanks||[])[i]?.name ?? r.name} onChange={e=>{ const nr=[...(customRanks||effectiveRanks)]; if(!nr[i])nr[i]={...r}; nr[i].name=e.target.value; saveCustomRanks(nr) }} style={{ flex:1 }} />
                <Input value={(customRanks||[])[i]?.minXP ?? r.minXP} type='number' onChange={e=>{ const nr=[...(customRanks||effectiveRanks)]; if(!nr[i])nr[i]={...r}; nr[i].minXP=Number(e.target.value); saveCustomRanks(nr) }} style={{ width:80 }} />
                <div style={{ fontSize:'.65rem', color:'#555', fontWeight:700, minWidth:20 }}>XP</div>
              </div>
            ))}
            <Btn sm variant='ghost' style={{ marginTop:10 }} onClick={()=>{ saveCustomRanks(null); showToast('Reset to defaults') }}>Reset to Defaults</Btn>
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
            <SectionTitle>App Rules</SectionTitle>
            <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:16 }}>
              Change how the app works for your family. Saves automatically.
            </div>

            {/* Signup window */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>🕐 Chore Signup Window</div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'.72rem', color:'#666', fontWeight:700, marginBottom:4 }}>Start (hour)</div>
                  <Select value={settings?.signupStart ?? 8} onChange={e => updateSettings({ signupStart: Number(e.target.value) })}>
                    {Array.from({length:24},(_,i)=><option key={i} value={i}>{i===0?'12am':i<12?`${i}am`:i===12?'12pm':`${i-12}pm`}</option>)}
                  </Select>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'.72rem', color:'#666', fontWeight:700, marginBottom:4 }}>End (hour)</div>
                  <Select value={settings?.signupEnd ?? 10} onChange={e => updateSettings({ signupEnd: Number(e.target.value) })}>
                    {Array.from({length:24},(_,i)=><option key={i} value={i}>{i===0?'12am':i<12?`${i}am`:i===12?'12pm':`${i-12}pm`}</option>)}
                  </Select>
                </div>
              </div>
            </div>

            {/* Signup days */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>📅 Chore Days</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=>{
                  const days = settings?.signupDays ?? [1,2,3,4]
                  const on = days.includes(i)
                  return (
                    <button key={i} onClick={()=>{
                      const cur = settings?.signupDays ?? [1,2,3,4]
                      updateSettings({ signupDays: on ? cur.filter(x=>x!==i) : [...cur,i].sort() })
                    }} style={{ padding:'6px 12px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:800, fontSize:'.78rem', background:on?color:'#1c1c1c', color:on?'#000':'#555' }}>{d}</button>
                  )
                })}
              </div>
            </div>

            {/* Quiz settings */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>📚 Quiz Pass Score</div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <Select value={settings?.quizPassScore ?? 4} onChange={e=>updateSettings({ quizPassScore: Number(e.target.value) })} style={{ flex:1 }}>
                  {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} out of 5 correct</option>)}
                </Select>
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>⏳ Quiz Retry Lockout</div>
              <Select value={settings?.quizRetryHours ?? 24} onChange={e=>updateSettings({ quizRetryHours: Number(e.target.value) })}>
                {[1,2,4,8,12,24,48].map(h=><option key={h} value={h}>{h} hour{h>1?'s':''}</option>)}
              </Select>
            </div>

            {/* Reading/Writing */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>📖 Reading Minimum</div>
              <Select value={settings?.readingMinutes ?? 30} onChange={e=>updateSettings({ readingMinutes: Number(e.target.value) })}>
                {[10,15,20,30,45,60].map(m=><option key={m} value={m}>{m} minutes</option>)}
              </Select>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>✏️ Writing Minimum</div>
              <Select value={settings?.writingMinWords ?? 30} onChange={e=>updateSettings({ writingMinWords: Number(e.target.value) })}>
                {[20,30,50,75,100,150,200].map(w=><option key={w} value={w}>{w} words</option>)}
              </Select>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>📖 Points for Reading</div>
              <Select value={settings?.readingPoints ?? 15} onChange={e=>updateSettings({ readingPoints: Number(e.target.value) })}>
                {[0,5,10,15,20,25,30,50].map(n=><option key={n} value={n}>{n===0?'No points':`+${n} points per session`}</option>)}
              </Select>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>✏️ Points for Writing</div>
              <Select value={settings?.writingPoints ?? 15} onChange={e=>updateSettings({ writingPoints: Number(e.target.value) })}>
                {[0,5,10,15,20,25,30,50].map(n=><option key={n} value={n}>{n===0?'No points':`+${n} points per session`}</option>)}
              </Select>
            </div>

            {/* Strike limit */}
            <div>
              <div style={{ fontWeight:800, fontSize:'.85rem', marginBottom:8 }}>⚠️ Strikes Before Weekend Lost</div>
              <Select value={settings?.strikeLimit ?? 3} onChange={e=>updateSettings({ strikeLimit: Number(e.target.value) })}>
                {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} strike{n>1?'s':''}</option>)}
              </Select>
            </div>
          </Card>

          <Card>
            <SectionTitle>Chore Categories</SectionTitle>
            <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:12 }}>Add, rename, or remove categories used when creating chores.</div>
            {(choreCategories||[]).map((cat, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                <div style={{ flex:1, fontWeight:600, fontSize:'.88rem' }}>{cat}</div>
                <button onClick={() => { saveChoreCategories((choreCategories||[]).filter((_,idx)=>idx!==i)); showToast('Removed') }}
                  style={{ background:'transparent', border:'none', color:'#e53935', cursor:'pointer', fontSize:'1rem' }}>✕</button>
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <Input value={fNewCat} onChange={e=>setFNewCat(e.target.value)} placeholder='New category name' style={{ flex:1 }} />
              <Btn sm onClick={() => {
                if (!fNewCat.trim()) return
                saveChoreCategories([...(choreCategories||[]), fNewCat.trim()])
                setFNewCat(''); showToast('Category added!')
              }}>Add</Btn>
            </div>
          </Card>

          <Card>
            <SectionTitle>Request Types</SectionTitle>
            <div style={{ fontSize:'.78rem', color:'#666', fontWeight:600, marginBottom:12 }}>Kids see these when making a request. Built-in ones can't be removed but you can add your own.</div>
            {(customRequestTypes||[]).map((rt, i) => (
              <div key={rt.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                <span style={{ fontSize:'1.2rem' }}>{rt.icon}</span>
                <div style={{ flex:1, fontWeight:600, fontSize:'.88rem' }}>{rt.label}</div>
                <button onClick={() => saveCustomRequestTypes((customRequestTypes||[]).filter(x=>x.id!==rt.id))}
                  style={{ background:'transparent', border:'none', color:'#e53935', cursor:'pointer', fontSize:'1rem' }}>✕</button>
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <Input value={fNewReqIcon} onChange={e=>setFNewReqIcon(e.target.value)} placeholder='Emoji' style={{ width:60 }} />
              <Input value={fNewReqLabel} onChange={e=>setFNewReqLabel(e.target.value)} placeholder='Request name (e.g. Camp Trip)' style={{ flex:1 }} />
              <Btn sm onClick={() => {
                if (!fNewReqLabel.trim()) return
                saveCustomRequestTypes([...(customRequestTypes||[]), { id:'rt'+Date.now(), label:fNewReqLabel.trim(), icon:fNewReqIcon.trim()||'✨' }])
                setFNewReqIcon('✨'); setFNewReqLabel('')
                showToast('Request type added!')
              }}>Add</Btn>
            </div>
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
          <Input value={fPunishDesc} onChange={e => setFPunishDesc(e.target.value)} placeholder='Punishment description' style={{ marginBottom: 10 }} />
          <Input value={fPunishBuyout} onChange={e => setFPunishBuyout(e.target.value)} placeholder='Buyout task (optional — e.g. "Write a 1-page apology")' style={{ marginBottom: 10 }} />
          <div style={{ marginBottom:6, fontSize:'.8rem', color:'#666', fontWeight:700 }}>Auto-expire after</div>
          <Select value={fPunishExpiry} onChange={e=>setFPunishExpiry(Number(e.target.value))} style={{ marginBottom:18 }}>
            <option value={0}>No expiry</option>
            {[1,2,3,5,7,14].map(d=><option key={d} value={d}>{d} day{d>1?'s':''}</option>)}
          </Select>
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
          <Select value={fBadgeId} onChange={e => setFBadgeId(e.target.value)} style={{ marginBottom: 12 }}>
            {allBadges.map(b => <option key={b.id} value={b.id}>{b.icon} {b.label}</option>)}
          </Select>
          <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>⭐ Points to award with badge</div>
          <Select value={fBadgePts} onChange={e => setFBadgePts(Number(e.target.value))} style={{ marginBottom: 18 }}>
            {[0,10,25,50,75,100,150,200,250,500].map(n => <option key={n} value={n}>{n === 0 ? 'No points' : `+${n} points`}</option>)}
          </Select>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={giveBadge}>Award{fBadgePts > 0 ? ` +${fBadgePts}pts` : ''}</Btn>
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
          <Input value={fRuleText} onChange={e => setFRuleText(e.target.value)} placeholder='Rule text' style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={addRule}>Add Rule</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'announce' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Post Announcement 📢</ModalTitle>
          <Input value={fAnnTitle} onChange={e => setFAnnTitle(e.target.value)} placeholder='Title' style={{ marginBottom: 10 }} />
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
          <ModalTitle>Add Prize 🎁</ModalTitle>
          <Input value={fRewardLabel} onChange={e => setFRewardLabel(e.target.value)} placeholder='Prize name' style={{ marginBottom: 10 }} />
          <Input value={fRewardIcon} onChange={e => setFRewardIcon(e.target.value)} placeholder='Emoji icon' style={{ marginBottom: 10 }} />
          <Input value={fRewardCost} onChange={e => setFRewardCost(e.target.value)} type='number' placeholder='Points cost' style={{ marginBottom: 10 }} />
          <div style={{ marginBottom:6, fontSize:'.8rem', color:'#666', fontWeight:700 }}>Redemption limit per kid</div>
          <Select value={fRewardLimit} onChange={e=>setFRewardLimit(Number(e.target.value))} style={{ marginBottom:18 }}>
            <option value={0}>Unlimited</option>
            {[1,2,3,5,10].map(n=><option key={n} value={n}>{n}x max</option>)}
          </Select>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={() => { if (!fRewardLabel.trim()) return; saveRewards([...rewards, { id: 'rew' + Date.now(), label: fRewardLabel, icon: fRewardIcon, cost: Number(fRewardCost), limit: fRewardLimit }]); setModal(null); showToast('Prize added!') }}>Add</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'weekendAct' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add Weekend Activity 🎉</ModalTitle>
          <Input value={fWAIcon} onChange={e => setFWAIcon(e.target.value)} placeholder='Emoji' style={{ marginBottom: 10 }} />
          <Input value={fWALabel} onChange={e => setFWALabel(e.target.value)} placeholder='Activity name' style={{ marginBottom: 18 }} />
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
          <Input value={fSchedLabel} onChange={e => setFSchedLabel(e.target.value)} placeholder='Label' style={{ marginBottom: 10 }} />
          <Input value={fSchedNote} onChange={e => setFSchedNote(e.target.value)} placeholder='Note (optional)' style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={() => { if (!fSchedLabel.trim()) return; saveSchedule([...schedule, { id: 'sc' + Date.now(), time: fSchedTime, label: fSchedLabel, note: fSchedNote, icon: fSchedIcon, visible: 'all' }]); setModal(null); showToast('Added!') }}>Add</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'weeklyReset' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>🔄 Reset the Week?</ModalTitle>
          <div style={{ fontSize:'.85rem', color:'#888', fontWeight:600, marginBottom:18 }}>
            This will clear all chore signups, completions, strikes, and weekend status for everyone. This cannot be undone. Are you sure?
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn variant='red' style={{ flex:1 }} onClick={()=>{ doWeeklyReset(); setModal(null); showToast('Week reset! Fresh start 🔄') }}>Yes, Reset</Btn>
            <Btn variant='ghost' onClick={()=>setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {modal === 'newBadge' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Create Badge 🏅</ModalTitle>
          <Input value={fBadgeIcon2} onChange={e => setFBadgeIcon2(e.target.value)} placeholder='Emoji icon' style={{ marginBottom: 10 }} />
          <Input value={fBadgeLabel2} onChange={e => setFBadgeLabel2(e.target.value)} placeholder='Badge name' style={{ marginBottom: 10 }} />
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
