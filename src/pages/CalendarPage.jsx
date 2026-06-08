// pages/CalendarPage.jsx
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Input, Select, Modal, ModalTitle, Toast, SectionTitle, Empty, Badge } from '../components'
import { todayKey, formatDate } from '../constants'

const CALENDAR_COLORS = ['#f5a623','#4a90e2','#43a047','#e53935','#9c27b0','#e91e8c','#ff6b35','#00bcd4']
const VISIBILITY_OPTS = [
  { value: 'all',    label: '👨‍👩‍👧 Everyone' },
  { value: 'parents',label: '👨‍👧 Parents Only' },
  { value: 'me',     label: '🔒 Just Me' },
]

export default function CalendarPage() {
  const { currentUser, isParent, isKid, users, calendars, saveCalendars, settings } = useAuth()
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [view, setView] = useState('upcoming') // upcoming | month

  // Event form
  const [evTitle, setEvTitle]     = useState('')
  const [evDate, setEvDate]       = useState('')
  const [evTime, setEvTime]       = useState('')
  const [evNote, setEvNote]       = useState('')
  const [evColor, setEvColor]     = useState('#f5a623')
  const [evVis, setEvVis]         = useState('all')
  const [evOwner, setEvOwner]     = useState(currentUser.id)

  const color   = settings?.primaryColor || '#f5a623'
  const showToast = (msg, bg) => { setToast({ msg, bg: bg || color }); setTimeout(() => setToast(null), 2600) }

  // Get visible events for current user
  const allEvents = Object.values(calendars || {}).flat()
  const visibleEvents = allEvents.filter(ev => {
    if (isParent) return true // parents see everything
    if (ev.visibility === 'all') return true
    if (ev.visibility === 'me' && ev.ownerId === currentUser.id) return true
    return false
  }).sort((a, b) => a.date.localeCompare(b.date))

  const upcomingEvents = visibleEvents.filter(ev => ev.date >= todayKey())
  const pastEvents     = visibleEvents.filter(ev => ev.date < todayKey())

  const addEvent = () => {
    if (!evTitle.trim() || !evDate) { showToast('Add a title and date!', '#e53935'); return }
    const ev = {
      id: 'ev' + Date.now(),
      title: evTitle.trim(),
      date: evDate,
      time: evTime || null,
      note: evNote.trim() || null,
      color: evColor,
      visibility: isParent ? evVis : 'all',
      ownerId: evOwner || currentUser.id,
      ownerName: users.find(u => u.id === evOwner)?.name || currentUser.name,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    }
    const ownerEvents = [...(calendars[evOwner] || []), ev]
    saveCalendars({ ...calendars, [evOwner]: ownerEvents })
    setEvTitle(''); setEvDate(''); setEvTime(''); setEvNote(''); setModal(null)
    showToast('Event added! 📅')
  }

  const deleteEvent = (ownerId, evId) => {
    const updated = (calendars[ownerId] || []).filter(e => e.id !== evId)
    saveCalendars({ ...calendars, [ownerId]: updated })
    showToast('Removed')
  }

  const canDelete = (ev) => isParent || ev.ownerId === currentUser.id

  const getVisibilityLabel = (vis) => VISIBILITY_OPTS.find(v => v.value === vis)?.label || vis

  // Group upcoming by date
  const grouped = {}
  upcomingEvents.forEach(ev => {
    if (!grouped[ev.date]) grouped[ev.date] = []
    grouped[ev.date].push(ev)
  })

  return (
    <PageWrap>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: '1.5rem', color }}>📅 Calendar</div>
        <Btn sm onClick={() => setModal('add')}>+ Add Event</Btn>
      </div>

      {upcomingEvents.length === 0 ? (
        <Empty icon='📅' text='No upcoming events' sub='Add something to look forward to!' />
      ) : (
        Object.entries(grouped).map(([date, events]) => (
          <div key={date} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: '.78rem', fontWeight: 800, color: date === todayKey() ? color : '#666', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              {date === todayKey() ? '⭐ TODAY' : formatDate(date)}
            </div>
            {events.map(ev => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: '#1c1c1c', borderRadius: 12, marginBottom: 8, borderLeft: `3px solid ${ev.color}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '.92rem' }}>{ev.title}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    {ev.time && <span style={{ fontSize: '.72rem', color: '#666', fontWeight: 600 }}>🕐 {ev.time}</span>}
                    {ev.ownerName && <span style={{ fontSize: '.72rem', color: '#666', fontWeight: 600 }}>👤 {ev.ownerName}</span>}
                    {isParent && <Badge color='#555' bg='rgba(255,255,255,.05)'>{getVisibilityLabel(ev.visibility)}</Badge>}
                  </div>
                  {ev.note && <div style={{ fontSize: '.8rem', color: '#888', marginTop: 5, fontWeight: 600 }}>{ev.note}</div>}
                </div>
                {canDelete(ev) && (
                  <button onClick={() => deleteEvent(ev.ownerId, ev.id)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '1rem', padding: 4 }}>✕</button>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      {pastEvents.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SectionTitle>Past Events</SectionTitle>
          {pastEvents.slice(-5).reverse().map(ev => (
            <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#141414', borderRadius: 10, marginBottom: 7, opacity: .6, borderLeft: `2px solid ${ev.color}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{ev.title}</div>
                <div style={{ fontSize: '.72rem', color: '#555', fontWeight: 600 }}>{formatDate(ev.date)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {modal === 'add' && (
        <Modal onClose={() => setModal(null)}>
          <ModalTitle>Add Event 📅</ModalTitle>

          {isParent && (
            <>
              <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>For who?</div>
              <Select value={evOwner} onChange={e => setEvOwner(e.target.value)} style={{ marginBottom: 12 }}>
                {users.map(u => <option key={u.id} value={u.id}>{u.avatar} {u.name} ({u.role})</option>)}
              </Select>
              <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>Who can see it?</div>
              <Select value={evVis} onChange={e => setEvVis(e.target.value)} style={{ marginBottom: 12 }}>
                {VISIBILITY_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </>
          )}

          <Input value={evTitle} onChange={e => setEvTitle(e.target.value)} placeholder='Event name' style={{ marginBottom: 10 }} autoFocus />
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <Input value={evDate} onChange={e => setEvDate(e.target.value)} type='date' style={{ flex: 1 }} />
            <Input value={evTime} onChange={e => setEvTime(e.target.value)} type='time' style={{ flex: 1 }} />
          </div>
          <Input value={evNote} onChange={e => setEvNote(e.target.value)} placeholder='Notes (optional)' rows={2} style={{ marginBottom: 12 }} />

          <div style={{ marginBottom: 6, fontSize: '.8rem', color: '#666', fontWeight: 700 }}>Color</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {CALENDAR_COLORS.map(c => (
              <button key={c} onClick={() => setEvColor(c)} style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: evColor === c ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Btn style={{ flex: 1 }} onClick={addEvent}>Add Event</Btn>
            <Btn variant='ghost' onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </PageWrap>
  )
}
