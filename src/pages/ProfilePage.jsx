// pages/ProfilePage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Input, Modal, ModalTitle, Toast, SectionTitle, Badge, ProgressBar, RankBadge, PointsPill, Empty } from '../components'
import { AVATARS, COLORS, getRank, getNextRank, BADGES, todayKey, weekKey, monthKey } from '../constants'

export default function ProfilePage() {
  const navigate = useNavigate()
  const {
    currentUser, updateUser, logout,
    points, badges, strikes, weekendStatus,
    completions, learnProgress, readingLog, writingLog,
    rewards,
    redemptions, saveRedemptions, logActivity,
    activityLog,
    punishments, settings, effectiveRanks,
  } = useAuth()

  const [modal, setModal] = useState(null)
  const [newAvatar, setNewAvatar] = useState(currentUser.avatar)
  const [newColor,  setNewColor]  = useState(currentUser.color)
  const [newName,   setNewName]   = useState(currentUser.name)
  const [toast, setToast]         = useState(null)
  const color = settings?.primaryColor || '#f5a623'

  const myPoints  = points?.[currentUser.id] || 0
  const myBadges  = badges?.[currentUser.id] || []
  const myRank    = getRank(myPoints, effectiveRanks)
  const nextRank  = getNextRank(myPoints, effectiveRanks)
  const allRanks  = effectiveRanks

  const showToast = (msg, bg) => { setToast({ msg, bg: bg || color }); setTimeout(() => setToast(null), 2600) }

  const saveProfile = () => {
    updateUser(currentUser.id, { avatar: newAvatar, color: newColor, name: newName })
    setModal(null)
    showToast('Profile updated!')
  }

  // Stats
  const today = todayKey()
  const week  = weekKey()
  const month = monthKey()

  const choresThisWeek = Object.entries(completions?.[currentUser.id] || {}).filter(([,v]) => v.date >= week && v.status === 'approved').length
  const lessonsTotal = Object.keys(learnProgress?.[currentUser.id] || {}).length
  const readingDays = Object.keys(readingLog?.[currentUser.id] || {}).filter(d => d >= week).length
  const writingDays = Object.keys(writingLog?.[currentUser.id] || {}).filter(d => d >= week).length
  const strikesThisWeek = strikes?.[currentUser.id]?.[week] || 0

  const redeemReward = (r) => {
    if (myPoints < r.cost) { showToast('Not enough points!', '#e53935'); return }
    // Check if already pending
    const already = redemptions.some(rd => rd.rewardId === r.id && rd.userId === currentUser.id && rd.status === 'pending')
    if (already) { showToast('Already requested — waiting for approval', '#ff6b35'); return }
    // Check quantity limit
    if (r.limit > 0) {
      const used = redemptions.filter(rd => rd.rewardId === r.id && rd.userId === currentUser.id && rd.status === 'approved').length
      if (used >= r.limit) { showToast('You\'ve hit the limit for this reward!', '#e53935'); return }
    }
    saveRedemptions([...redemptions, { id:'rd'+Date.now(), userId:currentUser.id, userName:currentUser.name, userAvatar:currentUser.avatar, userColor:currentUser.color, rewardId:r.id, rewardLabel:r.label, rewardIcon:r.icon, cost:r.cost, status:'pending', submittedAt:new Date().toISOString() }])
    logActivity(currentUser.id, 'redemption', `Requested: ${r.label}`, 0)
    showToast(`Request sent! Waiting for parent approval 📨`)
  }

  return (
    <PageWrap>
      {/* Profile header */}
      <button onClick={() => navigate('/home')} style={{ background:'rgba(255,255,255,.07)', border:'none', color:'#fff', fontWeight:800, fontSize:'.82rem', padding:'7px 14px', borderRadius:999, cursor:'pointer', marginBottom:16 }}>← Home</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
        <div onClick={() => setModal('editProfile')} style={{ width: 72, height: 72, borderRadius: 20, background: currentUser.color + '22', border: `3px solid ${currentUser.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', cursor: 'pointer', flexShrink: 0 }}>
          {currentUser.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '1.5rem', color: currentUser.color }}>{currentUser.name}</div>
          <RankBadge xp={myPoints} compact ranks={effectiveRanks} />
          <div style={{ marginTop: 4 }}><PointsPill points={myPoints} color={color} /></div>
        </div>
        <Btn sm variant='ghost' onClick={() => setModal('editProfile')}>Edit</Btn>
      </div>

      {/* Rank progress */}
      {nextRank && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', fontWeight: 700, color: '#666', marginBottom: 8 }}>
            <span style={{ color: myRank.color }}>{myRank.icon} {myRank.name}</span>
            <span style={{ color: nextRank.color }}>{nextRank.icon} {nextRank.name}</span>
          </div>
          <ProgressBar pct={Math.round((myPoints / nextRank.minXP) * 100)} color={nextRank.color} height={10} />
          <div style={{ fontSize: '.72rem', color: '#555', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>
            {nextRank.minXP - myPoints} more XP to reach {nextRank.name}
          </div>
        </Card>
      )}

      {/* This week stats */}
      <SectionTitle>This Week</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
        {[
          { label: 'Chores', val: choresThisWeek, icon: '✅', color: '#43a047' },
          { label: 'Reading', val: readingDays + 'd', icon: '📖', color: '#4a90e2' },
          { label: 'Writing', val: writingDays + 'd', icon: '✏️', color: '#9c27b0' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1c1c1c', borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '1.3rem', color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '.68rem', color: '#555', fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rank ladder */}
      <SectionTitle>Rank Ladder</SectionTitle>
      <Card style={{ marginBottom: 18 }}>
        {allRanks.map((r, i) => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < allRanks.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none', opacity: myPoints >= r.minXP ? 1 : .35 }}>
            <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '.88rem', color: myPoints >= r.minXP ? r.color : '#555' }}>{r.name}</div>
              <div style={{ fontSize: '.7rem', color: '#555', fontWeight: 600 }}>{r.minXP} XP</div>
            </div>
            {myPoints >= r.minXP && <Badge color={r.color} bg={r.color + '22'}>✓ Achieved</Badge>}
            {myRank.name === r.name && <Badge color='#f5a623' bg='rgba(245,166,35,.15)'>Current</Badge>}
          </div>
        ))}
      </Card>

      {/* Badges */}
      <SectionTitle>Badges</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10, marginBottom: 18 }}>
        {BADGES.map(b => {
          const earned = myBadges.includes(b.id)
          return (
            <div key={b.id} style={{ background: '#1c1c1c', borderRadius: 12, padding: '12px 10px', textAlign: 'center', opacity: earned ? 1 : .3, border: earned ? `1.5px solid ${color}33` : '1.5px solid rgba(255,255,255,.05)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '.78rem', marginBottom: 3 }}>{b.label}</div>
              <div style={{ fontSize: '.65rem', color: '#555', fontWeight: 600 }}>{b.desc}</div>
            </div>
          )
        })}
      </div>

      {/* Rewards shop */}
      <SectionTitle>Rewards Shop</SectionTitle>
      {rewards.length === 0 ? <Empty icon='🎁' text='No rewards set up yet' sub='Ask a parent to add some!' /> : (
        rewards.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 9 }}>
            <div style={{ fontSize: '1.5rem' }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '.9rem' }}>{r.label}</div>
              <div style={{ fontSize: '.72rem', color: '#f5a623', fontWeight: 700 }}>⭐ {r.cost} points</div>
            </div>
            <Btn sm variant={myPoints >= r.cost ? 'gold' : 'ghost'} onClick={() => redeemReward(r)} disabled={myPoints < r.cost || redemptions.some(rd=>rd.rewardId===r.id&&rd.userId===currentUser.id&&rd.status==='pending')}>
              {redemptions.some(rd=>rd.rewardId===r.id&&rd.userId===currentUser.id&&rd.status==='pending') ? '⏳ Pending' : myPoints >= r.cost ? 'Request' : 'Need more'}
            </Btn>
          </div>
        ))
      )}

      {/* All lessons progress */}
      <SectionTitle style={{ marginTop: 8 }}>Learning Progress</SectionTitle>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 700 }}>Lessons Completed</span>
          <span style={{ fontWeight: 800, color }}>{lessonsTotal}</span>
        </div>
        <ProgressBar pct={Math.min(Math.round((lessonsTotal / 80) * 100), 100)} />
      </Card>

      {/* Activity History */}
      {(activityLog?.[currentUser.id]||[]).length > 0 && (
        <>
          <SectionTitle style={{ marginTop: 8 }}>Recent Activity</SectionTitle>
          <Card>
            {[...(activityLog?.[currentUser.id]||[])].reverse().slice(0,15).map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                <div style={{ fontSize:'.8rem', flex:1, fontWeight:600 }}>{a.desc}</div>
                <div style={{ fontSize:'.7rem', color:'#555', fontWeight:600 }}>{new Date(a.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                {a.pts > 0 && <div style={{ fontSize:'.72rem', fontWeight:800, color }}> +{a.pts}pts</div>}
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Pending redemptions */}
      {redemptions.filter(r=>r.userId===currentUser.id).length > 0 && (
        <>
          <SectionTitle style={{ marginTop: 8 }}>Reward Requests</SectionTitle>
          {redemptions.filter(r=>r.userId===currentUser.id).slice(-5).reverse().map(r => (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8, borderLeft:`3px solid ${r.status==='approved'?'#22c55e':r.status==='denied'?'#e53935':'#f5a623'}` }}>
              <div style={{ fontSize:'1.3rem' }}>{r.rewardIcon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:'.85rem' }}>{r.rewardLabel}</div>
                <div style={{ fontSize:'.7rem', color:'#555', fontWeight:600 }}>⭐ {r.cost} pts</div>
              </div>
              <Badge color={r.status==='approved'?'#22c55e':r.status==='denied'?'#e53935':'#f5a623'} bg='rgba(255,255,255,.05)'>
                {r.status==='approved'?'✓ Approved':r.status==='denied'?'✗ Denied':'⏳ Pending'}
              </Badge>
            </div>
          ))}
        </>
      )}

      {/* Sign out */}
      <Btn full variant='ghost' style={{ marginTop: 8 }} onClick={() => { logout(); navigate('/') }}>
        Sign Out
      </Btn>

      {/* Edit Profile Modal */}
      {modal === 'editProfile' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Edit Profile</ModalTitle>
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder='Name' style={{ marginBottom: 14 }} />
          <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>Avatar</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, maxHeight: 130, overflowY: 'auto' }}>
            {AVATARS.map((a, i) => (
              <button key={i} onClick={() => setNewAvatar(a)} style={{ fontSize: '1.4rem', padding: 5, borderRadius: 9, border: newAvatar === a ? '2px solid #f5a623' : '2px solid transparent', background: '#141414', cursor: 'pointer' }}>{a}</button>
            ))}
          </div>
          <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>Color</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => setNewColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: newColor === c ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={saveProfile}>Save</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </PageWrap>
  )
}
