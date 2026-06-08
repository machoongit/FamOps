// pages/LearnPage.jsx — PowerPoint-style lessons
import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { PageWrap, Card, Btn, Input, SectionTitle, ProgressBar, Toast, Modal, ModalTitle, Badge, Empty } from '../components'
import { SUBJECTS } from '../data/curriculum'
import { todayKey, getRank } from '../constants'

const QUIZ_PASS  = 4
const RETRY_HRS  = 24

// Slide background themes
const SLIDE_THEMES = {
  cover:     { bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', accent: '#f5a623' },
  fact:      { bg: 'linear-gradient(135deg,#0d1117,#161b22)', accent: '#4a90e2' },
  list:      { bg: 'linear-gradient(135deg,#0f0f0f,#1a1a1a)', accent: '#43a047' },
  tip:       { bg: 'linear-gradient(135deg,#1a1500,#2a2000)', accent: '#f5a623' },
  funfact:   { bg: 'linear-gradient(135deg,#0a1628,#0d1f3c)', accent: '#00bcd4' },
  challenge: { bg: 'linear-gradient(135deg,#1a0a00,#2a1200)', accent: '#ff6b35' },
}

function SlideView({ lesson, subject, onDone, onBack, uid, quizHistory, saveQuizHistory, learnProgress, completeLesson, addPoints, isParent, showToast, color }) {
  const [slide, setSlide]           = useState(0)
  const [phase, setPhase]           = useState('slides') // slides | quiz
  const [answers, setAnswers]       = useState({})
  const [submitted, setSubmitted]   = useState(false)

  const slides   = lesson.slides || []
  const quiz     = lesson.quiz || []
  const isDone   = !!learnProgress?.[uid]?.[lesson.id]
  const hist     = quizHistory?.[uid]?.[lesson.id]
  const hoursLeft = hist?.lastFailed ? RETRY_HRS - ((Date.now() - new Date(hist.lastFailed).getTime()) / 36e5) : 0
  const canRetry  = hoursLeft <= 0

  const cur     = slides[slide] || {}
  const theme   = SLIDE_THEMES[cur.type] || SLIDE_THEMES.fact
  const isLast  = slide === slides.length - 1
  const total   = slides.length

  const submitQuiz = () => {
    let correct = 0
    quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++ })
    const passed = correct >= QUIZ_PASS
    const newHist = { ...(hist || {}), attempts: ((hist?.attempts) || 0) + 1, lastScore: correct, lastAttempt: new Date().toISOString() }
    if (!passed) newHist.lastFailed = new Date().toISOString()
    saveQuizHistory({ ...quizHistory, [uid]: { ...(quizHistory[uid] || {}), [lesson.id]: newHist } })
    setSubmitted(true)
    if (passed) {
      completeLesson(lesson.id, lesson.xp)
      addPoints(uid, lesson.xp)
      showToast(`${correct}/${quiz.length} — Passed! +${lesson.xp} XP 🎉`)
    } else {
      showToast(`${correct}/${quiz.length} — Need ${QUIZ_PASS}/${quiz.length}. Retry in ${RETRY_HRS}hrs`, '#e53935')
    }
  }

  // ── QUIZ PHASE ──────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const allAnswered = Object.keys(answers).length === quiz.length
    return (
      <div style={{ minHeight:'100vh', background:'#0a0a0a', padding:'16px 14px 90px' }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <button onClick={() => setPhase('slides')} style={{ background:'#1c1c1c', border:'none', color:'#888', padding:'8px 14px', borderRadius:10, cursor:'pointer', fontWeight:800, fontSize:'.85rem' }}>← Back to Lesson</button>
            <div style={{ flex:1, fontFamily:"'Fredoka One',cursive", fontSize:'1.1rem' }}>Knowledge Check</div>
          </div>

          <div style={{ background:'rgba(245,166,35,.08)', border:'1.5px solid rgba(245,166,35,.2)', borderRadius:14, padding:'12px 16px', marginBottom:18 }}>
            <div style={{ fontWeight:800, color:'#f5a623', fontSize:'.9rem' }}>Answer all {quiz.length} questions</div>
            <div style={{ fontSize:'.78rem', color:'#888', marginTop:3, fontWeight:600 }}>You need {QUIZ_PASS}/{quiz.length} correct to pass and unlock the next lesson.</div>
          </div>

          {!canRetry && !submitted && (
            <div style={{ textAlign:'center', padding:'32px 0', color:'#e53935', fontWeight:800 }}>
              ⏳ Retry unlocks in {Math.ceil(hoursLeft)}h
              {hist && <div style={{ fontSize:'.78rem', color:'#666', marginTop:6, fontWeight:600 }}>Last score: {hist.lastScore}/{quiz.length}</div>}
            </div>
          )}

          {(canRetry || submitted) && quiz.map((q, qi) => (
            <div key={qi} style={{ background:'#1c1c1c', borderRadius:14, padding:'16px', marginBottom:14 }}>
              <div style={{ fontWeight:800, fontSize:'.92rem', marginBottom:12, lineHeight:1.5 }}>{qi+1}. {q.q}</div>
              {q.options.map((opt, oi) => {
                let bg = '#141414', border = 'rgba(255,255,255,.07)', col = '#ccc'
                if (submitted) {
                  if (oi === q.answer) { bg = 'rgba(67,160,71,.15)'; border = '#43a047'; col = '#43a047' }
                  else if (answers[qi] === oi) { bg = 'rgba(229,57,53,.12)'; border = '#e53935'; col = '#e53935' }
                } else if (answers[qi] === oi) { bg = color+'22'; border = color; col = color }
                return (
                  <div key={oi} onClick={() => { if (!submitted && canRetry) setAnswers(p => ({...p,[qi]:oi})) }}
                    style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:10, padding:'11px 14px', marginBottom:8, cursor:submitted?'default':'pointer', fontWeight:600, fontSize:'.88rem', color:col, transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', flexShrink:0, background: submitted && oi === q.answer ? '#43a047' : submitted && answers[qi] === oi ? '#e53935' : answers[qi] === oi ? color : 'transparent', color:'#fff' }}>
                      {submitted && oi === q.answer ? '✓' : submitted && answers[qi] === oi ? '✗' : answers[qi] === oi ? '●' : ''}
                    </div>
                    {opt}
                  </div>
                )
              })}
            </div>
          ))}

          {canRetry && !submitted && (
            <Btn full onClick={submitQuiz} disabled={!allAnswered} style={{ marginTop:8 }}>
              {allAnswered ? `Submit (${Object.keys(answers).length}/${quiz.length} answered)` : `Answer all questions first (${Object.keys(answers).length}/${quiz.length})`}
            </Btn>
          )}

          {submitted && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              {isDone
                ? <div style={{ fontWeight:800, color:'#43a047', fontSize:'1.05rem' }}>✅ Lesson Complete! You earned {lesson.xp} XP!</div>
                : <div><div style={{ fontWeight:800, color:'#e53935', fontSize:'.95rem' }}>Not quite — review the lesson and try again in {RETRY_HRS} hours.</div><Btn variant='dark' style={{ marginTop:12 }} onClick={() => setPhase('slides')}>Review Lesson</Btn></div>
              }
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── SLIDES PHASE ─────────────────────────────────────────────────────────
  const renderBody = (body) => body.split('\n').map((line, i) => (
    <div key={i} style={{ fontSize: cur.type === 'cover' ? '1rem' : '.92rem', color: 'rgba(255,255,255,.85)', fontWeight:600, lineHeight:1.7, marginBottom: line === '' ? 8 : 2 }}>
      {line || '\u00A0'}
    </div>
  ))

  return (
    <div style={{ minHeight:'100vh', background: theme.bg, display:'flex', flexDirection:'column', padding:'16px 14px 90px', position:'relative' }}>
      {/* Top bar */}
      <div style={{ maxWidth:600, margin:'0 auto', width:'100%' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <button onClick={onBack} style={{ background:'rgba(255,255,255,.08)', border:'none', color:'#aaa', padding:'8px 14px', borderRadius:10, cursor:'pointer', fontWeight:800, fontSize:'.82rem' }}>← Back</button>
          <div style={{ display:'flex', gap:5 }}>
            {slides.map((_,i) => (
              <div key={i} style={{ width: i === slide ? 20 : 7, height:7, borderRadius:999, background: i <= slide ? theme.accent : 'rgba(255,255,255,.15)', transition:'all .3s' }} />
            ))}
          </div>
          <div style={{ fontSize:'.78rem', fontWeight:800, color:'rgba(255,255,255,.4)' }}>{slide+1}/{total}</div>
        </div>

        {/* Slide card */}
        <div style={{ background:'rgba(255,255,255,.04)', border:`1.5px solid ${theme.accent}33`, borderRadius:24, padding:'28px 22px', marginBottom:20, minHeight:320, display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontSize: cur.type === 'cover' ? '4rem' : '3rem', marginBottom:16, textAlign:'center' }}>{cur.emoji}</div>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize: cur.type === 'cover' ? '1.8rem' : '1.3rem', color:theme.accent, marginBottom:14, textAlign: cur.type === 'cover' ? 'center' : 'left', lineHeight:1.3 }}>{cur.title}</div>
          <div style={{ textAlign: cur.type === 'cover' ? 'center' : 'left' }}>{renderBody(cur.body)}</div>
        </div>

        {/* Type label */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <div style={{ fontSize:'.7rem', fontWeight:800, color:theme.accent, background:theme.accent+'15', padding:'4px 12px', borderRadius:999, letterSpacing:.5, textTransform:'uppercase' }}>
            {cur.type === 'cover' ? '📖 Lesson Intro' : cur.type === 'tip' ? '💡 Pro Tip' : cur.type === 'funfact' ? '🌟 Fun Fact' : cur.type === 'challenge' ? '🔥 Challenge' : cur.type === 'list' ? '📋 Key Info' : '💡 Concept'}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {slide > 0 && (
            <Btn variant='ghost' style={{ flex:1 }} onClick={() => setSlide(s => s-1)}>← Prev</Btn>
          )}
          {!isLast ? (
            <Btn style={{ flex:2, background:theme.accent, color:'#000' }} onClick={() => setSlide(s => s+1)}>Next →</Btn>
          ) : (
            isDone ? (
              <div style={{ flex:1, textAlign:'center', fontWeight:800, color:'#43a047' }}>✅ Already Completed!</div>
            ) : lesson.inPerson ? (
              <div style={{ flex:1, textAlign:'center', fontWeight:700, color:'#9c27b0', fontSize:'.85rem' }}>🏫 Awaiting parent sign-off</div>
            ) : quiz.length > 0 ? (
              <Btn style={{ flex:2, background:theme.accent, color:'#000' }} onClick={() => setPhase('quiz')}>Take the Quiz →</Btn>
            ) : (
              <Btn style={{ flex:2 }} onClick={() => { completeLesson(lesson.id, lesson.xp); addPoints(uid, lesson.xp); showToast('Lesson complete! +'+lesson.xp+' XP 🎉') }}>Mark Complete ✓</Btn>
            )
          )}
        </div>

        {/* Subject/lesson info at bottom */}
        <div style={{ textAlign:'center', marginTop:16, fontSize:'.72rem', color:'rgba(255,255,255,.3)', fontWeight:600 }}>
          {subject.name} · {lesson.title} · +{lesson.xp} XP
        </div>
      </div>
    </div>
  )
}

export default function LearnPage() {
  const {
    currentUser, users, isParent, isKid,
    learnProgress, saveLearnProgress,
    quizHistory, saveQuizHistory,
    readingLog, saveReadingLog,
    writingLog, saveWritingLog,
    points, addPoints, awardBadge,
    settings,
  } = useAuth()

  const [view, setView]                   = useState('subjects')
  const [activeSubject, setActiveSubject] = useState(null)
  const [activeLesson, setActiveLesson]   = useState(null)
  const [readingSeconds, setReadingSeconds] = useState(0)
  const [readingSummary, setReadingSummary] = useState('')
  const [writingText, setWritingText]     = useState('')
  const [writingSubject, setWritingSubject] = useState('')
  const [timerInterval, setTimerInterval] = useState(null)
  const [modal, setModal]                 = useState(null)
  const [clTitle, setClTitle]             = useState('')
  const [clSubject, setClSubject]         = useState('')
  const [clContent, setClContent]         = useState('')
  const [clInPerson, setClInPerson]       = useState(false)
  const [toast, setToast]                 = useState(null)

  const color     = settings?.primaryColor || '#f5a623'
  const uid       = currentUser.id
  const showToast = (msg, bg) => { setToast({ msg, bg: bg||color }); setTimeout(()=>setToast(null),3000) }

  const isLessonDone    = (lid) => !!learnProgress?.[uid]?.[lid]
  const isLessonLocked  = (subj, idx) => { if (idx===0) return false; return !isLessonDone(subj.lessons[idx-1]?.id) }
  const getRetryHours   = (lid) => { const h=quizHistory?.[uid]?.[lid]; if(!h?.lastFailed) return 0; return Math.max(0, RETRY_HRS - ((Date.now()-new Date(h.lastFailed).getTime())/36e5)) }
  const subjectPct      = (subj) => { if(!subj.lessons.length) return 0; return Math.round((subj.lessons.filter(l=>isLessonDone(l.id)).length/subj.lessons.length)*100) }
  const getXP           = (userId) => Object.values(learnProgress?.[userId]||{}).reduce((t,v)=>t+(v?.xp||0),0)

  const customSubjects  = learnProgress?._customSubjects || []
  const allSubjects     = [...SUBJECTS, ...customSubjects]

  const completeLesson = (lid, xp) => {
    saveLearnProgress({ ...learnProgress, [uid]: { ...(learnProgress[uid]||{}), [lid]: { completedAt: new Date().toISOString(), xp } } })
  }

  const parentMarkComplete = (userId, lid, xp) => {
    saveLearnProgress({ ...learnProgress, [userId]: { ...(learnProgress[userId]||{}), [lid]: { completedAt: new Date().toISOString(), xp, parentVerified:true } } })
    addPoints(userId, xp)
    showToast('Marked complete!')
  }

  const parentReset = (userId, lid) => {
    const up = { ...learnProgress, [userId]: { ...(learnProgress[userId]||{}) } }
    delete up[userId][lid]
    saveLearnProgress(up)
    showToast('Lesson reset')
  }

  const saveCustomLesson = () => {
    if (!clTitle.trim() || !clContent.trim()) return
    const lesson = {
      id: 'cl'+Date.now(), title: clTitle.trim(), xp: 25, sub: clInPerson ? 'In-person class' : 'Self-study',
      inPerson: clInPerson, slides: [
        { type:'cover', emoji:'📝', title:clTitle.trim(), body:'Custom lesson created by your parent.' },
        ...clContent.trim().split('\n\n').filter(Boolean).map((para,i)=>({ type:'fact', emoji:'💡', title:`Part ${i+1}`, body:para })),
        { type:'challenge', emoji:'🔥', title:'Complete This Lesson', body:clInPerson ? 'Attend the in-person class. Your parent will mark this complete.' : 'Review the material. Take the quiz when ready.' }
      ], quiz: null,
    }
    const subjectId = 'custom_'+clSubject.trim().toLowerCase().replace(/\s+/g,'_')
    let existing = [...customSubjects]
    let subj = existing.find(s=>s.id===subjectId)
    if (!subj) { subj = { id:subjectId, name:clSubject.trim()||'Custom Lessons', icon:'📝', color:'#9c27b0', ageNote:'All ages', desc:'Parent-created lessons', lessons:[] }; existing.push(subj) }
    subj.lessons.push(lesson)
    saveLearnProgress({ ...learnProgress, _customSubjects: existing })
    setClTitle(''); setClContent(''); setClSubject(''); setClInPerson(false); setModal(null)
    showToast('Lesson created!')
  }

  // Reading/Writing
  const startReading = () => { const iv = setInterval(()=>setReadingSeconds(s=>s+1),1000); setTimerInterval(iv) }
  const stopReading  = () => { if(timerInterval){ clearInterval(timerInterval); setTimerInterval(null) } }
  const logReading   = () => {
    if (readingSeconds < 60) { showToast('Read at least 1 minute!','#e53935'); return }
    saveReadingLog({ ...readingLog, [uid]: { ...(readingLog[uid]||{}), [todayKey()]: { date:todayKey(), seconds:readingSeconds, summary:readingSummary.trim(), loggedAt:new Date().toISOString() } } })
    stopReading(); setReadingSeconds(0); setReadingSummary(''); showToast('Reading logged! ✅')
  }
  const logWriting = () => {
    const wc = writingText.trim().split(/\s+/).filter(Boolean).length
    if (wc < 30) { showToast('Write at least 30 words!','#e53935'); return }
    saveWritingLog({ ...writingLog, [uid]: { ...(writingLog[uid]||{}), [todayKey()]: { date:todayKey(), text:writingText.trim(), subject:writingSubject.trim(), wordCount:wc, loggedAt:new Date().toISOString() } } })
    setWritingText(''); setWritingSubject(''); showToast('Writing submitted! ✅')
  }

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`
  const todayReading = readingLog?.[uid]?.[todayKey()]
  const todayWriting = writingLog?.[uid]?.[todayKey()]

  // ── Slide view ────────────────────────────────────────────────────────────
  if (view === 'lesson' && activeLesson && activeSubject) {
    return <SlideView
      lesson={activeLesson} subject={activeSubject}
      onBack={() => setView('subject')}
      onDone={() => setView('subject')}
      uid={uid} quizHistory={quizHistory} saveQuizHistory={saveQuizHistory}
      learnProgress={learnProgress} completeLesson={completeLesson} addPoints={addPoints}
      isParent={isParent} showToast={showToast} color={color}
    />
  }

  // ── Reading view ──────────────────────────────────────────────────────────
  if (view === 'reading') return (
    <PageWrap>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>setView('subjects')} style={{ background:'#1c1c1c', border:'none', color:'#888', padding:'8px 12px', borderRadius:10, cursor:'pointer', fontWeight:800 }}>← Back</button>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.3rem' }}>📖 Reading Log</div>
      </div>
      {todayReading ? (
        <div style={{ background:'rgba(67,160,71,.1)', border:'1.5px solid rgba(67,160,71,.3)', borderRadius:14, padding:'16px', marginBottom:14 }}>
          <div style={{ fontWeight:800, color:'#43a047' }}>✅ Reading done today!</div>
          <div style={{ fontSize:'.82rem', color:'#888', marginTop:4, fontWeight:600 }}>Time: {fmt(todayReading.seconds)}</div>
          {todayReading.summary && <div style={{ fontSize:'.82rem', color:'#ccc', marginTop:6, fontWeight:600 }}>"{todayReading.summary}"</div>}
        </div>
      ) : (
        <Card>
          <div style={{ fontWeight:800, marginBottom:4 }}>📖 30-Minute Reading</div>
          <div style={{ fontSize:'.8rem', color:'#666', fontWeight:600, marginBottom:16 }}>Start the timer when you begin. Stop when done.</div>
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'3rem', color: readingSeconds>=1800?'#43a047':color }}>{fmt(readingSeconds)}</div>
            <div style={{ fontSize:'.72rem', color:'#555', fontWeight:700, marginBottom:8 }}>Goal: 30:00</div>
            <ProgressBar pct={Math.min(Math.round((readingSeconds/1800)*100),100)} color='#43a047' height={6} />
          </div>
          <div style={{ display:'flex', gap:10, marginBottom:14 }}>
            {!timerInterval ? <Btn full onClick={startReading}>▶ Start Timer</Btn> : <Btn full variant='red' onClick={stopReading}>⏸ Pause</Btn>}
          </div>
          <Input value={readingSummary} onChange={e=>setReadingSummary(e.target.value)} placeholder='Brief summary of what you read...' rows={2} style={{ marginBottom:12 }} />
          <Btn full variant='green' onClick={logReading} disabled={readingSeconds<60}>✅ Log Reading Session</Btn>
        </Card>
      )}
      <SectionTitle style={{ marginTop:16 }}>History</SectionTitle>
      {Object.entries(readingLog?.[uid]||{}).slice(-7).reverse().map(([date,e])=>(
        <div key={date} style={{ display:'flex', gap:12, padding:'10px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8 }}>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'#666', minWidth:70 }}>{date}</div>
          <div><div style={{ fontWeight:700, fontSize:'.85rem', color:'#43a047' }}>{fmt(e.seconds)}</div>{e.summary&&<div style={{ fontSize:'.75rem', color:'#888', marginTop:2, fontWeight:600 }}>"{e.summary}"</div>}</div>
        </div>
      ))}
      <Toast toast={toast} />
    </PageWrap>
  )

  // ── Writing view ──────────────────────────────────────────────────────────
  if (view === 'writing') return (
    <PageWrap>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>setView('subjects')} style={{ background:'#1c1c1c', border:'none', color:'#888', padding:'8px 12px', borderRadius:10, cursor:'pointer', fontWeight:800 }}>← Back</button>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.3rem' }}>✏️ Writing Log</div>
      </div>
      {todayWriting ? (
        <div style={{ background:'rgba(156,39,176,.1)', border:'1.5px solid rgba(156,39,176,.3)', borderRadius:14, padding:'16px', marginBottom:14 }}>
          <div style={{ fontWeight:800, color:'#9c27b0' }}>✅ Writing done today!</div>
          <div style={{ fontSize:'.82rem', color:'#888', marginTop:4, fontWeight:600 }}>{todayWriting.wordCount} words{todayWriting.subject?` · Topic: ${todayWriting.subject}`:''}</div>
        </div>
      ) : (
        <Card>
          <div style={{ fontWeight:800, marginBottom:4 }}>✏️ Daily Writing</div>
          <div style={{ fontSize:'.8rem', color:'#666', fontWeight:600, marginBottom:14 }}>1–2 paragraphs minimum. Be thoughtful and creative.</div>
          <Input value={writingSubject} onChange={e=>setWritingSubject(e.target.value)} placeholder='Topic or subject (optional)' style={{ marginBottom:10 }} />
          <Input value={writingText} onChange={e=>setWritingText(e.target.value)} placeholder='Write your paragraphs here...' rows={8} style={{ marginBottom:10 }} />
          <div style={{ fontSize:'.75rem', color:writingText.trim().split(/\s+/).filter(Boolean).length>=30?'#43a047':'#666', fontWeight:700, marginBottom:14 }}>
            {writingText.trim().split(/\s+/).filter(Boolean).length} words {writingText.trim().split(/\s+/).filter(Boolean).length>=30?'✓':'(need at least 30)'}
          </div>
          <Btn full variant='green' onClick={logWriting}>Submit Writing</Btn>
        </Card>
      )}
      <SectionTitle style={{ marginTop:16 }}>History</SectionTitle>
      {Object.entries(writingLog?.[uid]||{}).slice(-7).reverse().map(([date,e])=>(
        <div key={date} style={{ display:'flex', gap:12, padding:'10px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8 }}>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'#666', minWidth:70 }}>{date}</div>
          <div><div style={{ fontWeight:700, fontSize:'.85rem', color:'#9c27b0' }}>{e.wordCount} words</div>{e.subject&&<div style={{ fontSize:'.75rem', color:'#888', marginTop:2, fontWeight:600 }}>Topic: {e.subject}</div>}</div>
        </div>
      ))}
      <Toast toast={toast} />
    </PageWrap>
  )

  // ── Subject lessons list ──────────────────────────────────────────────────
  if (view === 'subject' && activeSubject) {
    const done = activeSubject.lessons.filter(l=>isLessonDone(l.id)).length
    return (
      <PageWrap>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={()=>setView('subjects')} style={{ background:'#1c1c1c', border:'none', color:'#888', padding:'8px 12px', borderRadius:10, cursor:'pointer', fontWeight:800 }}>← Back</button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.2rem' }}>{activeSubject.icon} {activeSubject.name}</div>
            <div style={{ fontSize:'.72rem', color:'#666', fontWeight:600 }}>{activeSubject.ageNote} · {activeSubject.desc}</div>
          </div>
        </div>
        <div style={{ background:'#1c1c1c', borderRadius:12, padding:'12px 14px', marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', fontWeight:700, color:'#666', marginBottom:5 }}>
            <span>Progress</span><span>{done}/{activeSubject.lessons.length} lessons</span>
          </div>
          <ProgressBar pct={subjectPct(activeSubject)} color={activeSubject.color} />
        </div>
        {activeSubject.lessons.map((lesson,i) => {
          const isDone   = isLessonDone(lesson.id)
          const locked   = isLessonLocked(activeSubject, i)
          const retryHrs = getRetryHours(lesson.id)
          const hist     = quizHistory?.[uid]?.[lesson.id]
          return (
            <div key={lesson.id} onClick={()=>{ if(!locked){ setActiveLesson(lesson); setView('lesson') } }}
              style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, background:'#1c1c1c', marginBottom:10, cursor:locked?'not-allowed':'pointer', border:`1.5px solid ${isDone?activeSubject.color+'55':'rgba(255,255,255,.05)'}`, opacity:locked?.45:1 }}>
              <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'.9rem', flexShrink:0, background:isDone?activeSubject.color+'33':lesson.inPerson?'rgba(156,39,176,.15)':'rgba(255,255,255,.06)', color:isDone?activeSubject.color:lesson.inPerson?'#9c27b0':'#555' }}>
                {locked?'🔒':isDone?'✓':i+1}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:'.9rem', marginBottom:2 }}>{lesson.title}</div>
                <div style={{ fontSize:'.72rem', color:'#555', fontWeight:600 }}>{lesson.sub} · {lesson.slides?.length||0} slides · +{lesson.xp} XP {lesson.inPerson?'· 🏫 In-Person':''}</div>
                {retryHrs > 0 && !isDone && <div style={{ fontSize:'.7rem', color:'#e53935', fontWeight:700, marginTop:2 }}>⏳ Retry in {Math.ceil(retryHrs)}h</div>}
                {hist && !isDone && <div style={{ fontSize:'.7rem', color:'#666', marginTop:2 }}>Last score: {hist.lastScore}/{lesson.quiz?.length||0}</div>}
              </div>
              <div style={{ fontSize:'1.2rem', color:isDone?'#43a047':'#333' }}>{isDone?'✅':'→'}</div>
            </div>
          )
        })}
        {isParent && (
          <div style={{ marginTop:16 }}>
            <SectionTitle>Parent Controls</SectionTitle>
            {users.filter(u=>u.role==='kid').map(kid=>(
              <div key={kid.id} style={{ marginBottom:14 }}>
                <div style={{ fontWeight:800, color:kid.color, marginBottom:8, fontSize:'.85rem' }}>{kid.avatar} {kid.name}</div>
                {activeSubject.lessons.map(lesson=>(
                  <div key={lesson.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'#1c1c1c', borderRadius:10, marginBottom:6 }}>
                    <div style={{ flex:1, fontSize:'.83rem', fontWeight:600 }}>{lesson.title}</div>
                    {isLessonDone(lesson.id) && <Badge color='#43a047' bg='rgba(67,160,71,.1)'>✓ Done</Badge>}
                    {lesson.inPerson && !learnProgress?.[kid.id]?.[lesson.id] && <Btn sm variant='purple' onClick={()=>parentMarkComplete(kid.id,lesson.id,lesson.xp)}>Mark Complete</Btn>}
                    <Btn sm variant='ghost' onClick={()=>parentReset(kid.id,lesson.id)}>Reset</Btn>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <Toast toast={toast} />
      </PageWrap>
    )
  }

  // ── Main subjects grid ────────────────────────────────────────────────────
  const lb = [...users].map(u=>({...u, xp:getXP(u.id)})).sort((a,b)=>b.xp-a.xp)
  const myXP = getXP(uid)

  return (
    <PageWrap>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1.5rem', color }}>📚 Learn</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(245,166,35,.12)', borderRadius:999, padding:'4px 12px', fontWeight:800, fontSize:'.82rem', color }}>{myXP} XP</div>
      </div>

      {/* Daily tasks */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
        <div onClick={()=>setView('reading')} style={{ background:todayReading?'rgba(67,160,71,.1)':'#1c1c1c', borderRadius:14, padding:'14px 12px', cursor:'pointer', border:`1.5px solid ${todayReading?'rgba(67,160,71,.3)':'rgba(255,255,255,.07)'}`, textAlign:'center' }}>
          <div style={{ fontSize:'1.6rem', marginBottom:6 }}>📖</div>
          <div style={{ fontWeight:800, fontSize:'.85rem', color:todayReading?'#43a047':'#fff' }}>{todayReading?'✅ Done':'Daily Reading'}</div>
          <div style={{ fontSize:'.7rem', color:'#555', marginTop:2, fontWeight:600 }}>30 min</div>
        </div>
        <div onClick={()=>setView('writing')} style={{ background:todayWriting?'rgba(156,39,176,.1)':'#1c1c1c', borderRadius:14, padding:'14px 12px', cursor:'pointer', border:`1.5px solid ${todayWriting?'rgba(156,39,176,.3)':'rgba(255,255,255,.07)'}`, textAlign:'center' }}>
          <div style={{ fontSize:'1.6rem', marginBottom:6 }}>✏️</div>
          <div style={{ fontWeight:800, fontSize:'.85rem', color:todayWriting?'#9c27b0':'#fff' }}>{todayWriting?'✅ Done':'Daily Writing'}</div>
          <div style={{ fontSize:'.7rem', color:'#555', marginTop:2, fontWeight:600 }}>1-2 paragraphs</div>
        </div>
      </div>

      <SectionTitle>Subjects</SectionTitle>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))', gap:12, marginBottom:22 }}>
        {allSubjects.map(subj=>{
          const pct  = subjectPct(subj)
          const done = subj.lessons.filter(l=>isLessonDone(l.id)).length
          return (
            <div key={subj.id} onClick={()=>{ setActiveSubject(subj); setView('subject') }}
              style={{ background:subj.color+'12', borderRadius:16, padding:'16px 12px', cursor:'pointer', border:`2px solid ${pct===100?subj.color+'66':'rgba(255,255,255,.06)'}`, position:'relative', overflow:'hidden' }}>
              <div style={{ fontSize:'2rem', marginBottom:8 }}>{subj.icon}</div>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'.95rem', color:subj.color, marginBottom:3 }}>{subj.name}</div>
              <div style={{ fontSize:'.68rem', fontWeight:700, color:'#555' }}>{done}/{subj.lessons.length} · {subj.ageNote}</div>
              <div style={{ position:'absolute', bottom:0, left:0, height:3, width:pct+'%', background:subj.color, transition:'width .4s' }} />
            </div>
          )
        })}
      </div>

      {/* Leaderboard */}
      <SectionTitle>XP Leaderboard</SectionTitle>
      {lb.filter(u=>getXP(u.id)>0).slice(0,6).map((u,i)=>(
        <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'#1c1c1c', borderRadius:12, marginBottom:8, borderLeft:u.id===uid?`3px solid ${u.color}`:'3px solid transparent' }}>
          <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:'1rem', minWidth:24, color:i===0?'#f5a623':i===1?'#888':i===2?'#ff6b35':'#555' }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
          <div style={{ fontSize:'1.3rem' }}>{u.avatar}</div>
          <div style={{ flex:1 }}><div style={{ fontWeight:800, color:u.color }}>{u.name}</div><div style={{ fontSize:'.72rem', color:'#555', fontWeight:600 }}>{getXP(u.id)} XP · {getRank(getXP(u.id)).name}</div></div>
          {u.id===uid&&<Badge color={color} bg={color+'22'}>You</Badge>}
        </div>
      ))}
      {lb.filter(u=>getXP(u.id)>0).length===0&&<Empty icon='🌱' text='No XP yet' sub='Start a lesson to get on the board!' />}

      {isParent&&<Btn full variant='purple' style={{ marginTop:16 }} onClick={()=>setModal('create')}>+ Create Custom Lesson</Btn>}

      {modal==='create'&&(
        <Modal onClose={()=>setModal(null)}>
          <ModalTitle>Create a Lesson 📝</ModalTitle>
          <Input value={clTitle} onChange={e=>setClTitle(e.target.value)} placeholder='Lesson title' style={{ marginBottom:10 }} autoFocus />
          <Input value={clSubject} onChange={e=>setClSubject(e.target.value)} placeholder='Subject name (e.g. Life Skills)' style={{ marginBottom:10 }} />
          <Input value={clContent} onChange={e=>setClContent(e.target.value)} placeholder='Lesson content... (use double line breaks to split into slides)' rows={6} style={{ marginBottom:12 }} />
          <label style={{ display:'flex', alignItems:'center', gap:10, fontWeight:700, fontSize:'.85rem', marginBottom:18, cursor:'pointer' }}>
            <input type='checkbox' checked={clInPerson} onChange={e=>setClInPerson(e.target.checked)} /> 🏫 In-person class
          </label>
          <div style={{ display:'flex', gap:10 }}>
            <Btn variant='purple' style={{ flex:1 }} onClick={saveCustomLesson}>Create</Btn>
            <Btn variant='ghost' onClick={()=>setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </PageWrap>
  )
}
