// AuthContext.jsx — FamOps family data hub
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storage } from './storage'
import { DEFAULT_CHORES, DEFAULT_SCHEDULE, DEFAULT_SPECIAL_DAYS, DEFAULT_WEEKEND_ACTIVITIES, DEFAULT_REWARDS, todayKey, weekKey } from './constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // Auth
  const [users, setUsers]               = useState([])
  const [currentUser, setCurrentUser]   = useState(null)

  // Family data
  const [chores, setChores]             = useState(DEFAULT_CHORES)
  const [schedule, setSchedule]         = useState(DEFAULT_SCHEDULE)
  const [specialDays, setSpecialDays]   = useState(DEFAULT_SPECIAL_DAYS)
  const [weekendActs, setWeekendActs]   = useState(DEFAULT_WEEKEND_ACTIVITIES)
  const [rewards, setRewards]           = useState(DEFAULT_REWARDS)
  const [rules, setRules]               = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [settings, setSettings]         = useState({ primaryColor: '#f5a623', accentColor: '#4a90e2', bgColor: '#0a0a0a', appName: 'FamOps' })

  // Activity data
  const [signups, setSignups]           = useState({})
  const [completions, setCompletions]   = useState({})
  const [strikes, setStrikes]           = useState({})
  const [weekendStatus, setWeekendStatus] = useState({})
  const [punishments, setPunishments]   = useState([])
  const [requests, setRequests]         = useState([])
  const [learnProgress, setLearnProgress] = useState({})
  const [quizHistory, setQuizHistory]   = useState({})
  const [readingLog, setReadingLog]     = useState({})
  const [writingLog, setWritingLog]     = useState({})
  const [points, setPoints]             = useState({})
  const [badges, setBadges]             = useState({})
  const [calendars, setCalendars]       = useState({})
  const [profileVisibility, setProfileVisibility] = useState({
    points: 'all', rank: 'all', badges: 'all', chores: 'all',
    lessons: 'all', reading: 'all', writing: 'all',
    punishments: 'parents', strikes: 'parents'
  })

  useEffect(() => {
    const load = (key, setter) => { const v = storage.get(key); if (v !== null) setter(v) }
    load('users', setUsers)
    load('settings', setSettings)
    load('chores', setChores)
    load('schedule', setSchedule)
    load('specialDays', setSpecialDays)
    load('weekendActs', setWeekendActs)
    load('rewards', setRewards)
    load('rules', setRules)
    load('announcements', setAnnouncements)
    load('signups', setSignups)
    load('completions', setCompletions)
    load('strikes', setStrikes)
    load('weekendStatus', setWeekendStatus)
    load('punishments', setPunishments)
    load('requests', setRequests)
    load('learnProgress', setLearnProgress)
    load('quizHistory', setQuizHistory)
    load('readingLog', setReadingLog)
    load('writingLog', setWritingLog)
    load('points', setPoints)
    load('badges', setBadges)
    load('calendars', setCalendars)
    load('profileVisibility', setProfileVisibility)
    const cu = storage.get('session'); if (cu) setCurrentUser(cu)
  }, [])

  const persist = useCallback((key, val, setter) => { setter(val); storage.set(key, val) }, [])

  // Auth
  const login  = (user) => { setCurrentUser(user); storage.set('session', user) }
  const logout = () => { setCurrentUser(null); storage.remove('session') }
  const addUser = (user) => { const u = [...users, user]; persist('users', u, setUsers) }
  const updateUser = (id, updates) => { const u = users.map(x => x.id===id?{...x,...updates}:x); persist('users', u, setUsers); if (currentUser?.id===id) { const updated={...currentUser,...updates}; setCurrentUser(updated); storage.set('session',updated) } }
  const removeUser = (id) => { persist('users', users.filter(u=>u.id!==id), setUsers) }

  // Settings
  const updateSettings = (s) => persist('settings', {...settings,...s}, setSettings)

  // Chores
  const saveChores = (v) => persist('chores', v, setChores)

  // Schedule
  const saveSchedule = (v) => persist('schedule', v, setSchedule)
  const saveSpecialDays = (v) => persist('specialDays', v, setSpecialDays)
  const saveWeekendActs = (v) => persist('weekendActs', v, setWeekendActs)

  // Rewards & rules
  const saveRewards = (v) => persist('rewards', v, setRewards)
  const saveRules = (v) => persist('rules', v, setRules)
  const saveAnnouncements = (v) => persist('announcements', v, setAnnouncements)

  // Signups
  const saveSignups = (v) => persist('signups', v, setSignups)

  // Completions
  const saveCompletions = (v) => persist('completions', v, setCompletions)

  // Strikes
  const saveStrikes = (v) => persist('strikes', v, setStrikes)
  const saveWeekendStatus = (v) => persist('weekendStatus', v, setWeekendStatus)

  // Punishments
  const savePunishments = (v) => persist('punishments', v, setPunishments)

  // Requests
  const saveRequests = (v) => persist('requests', v, setRequests)

  // Learning
  const saveLearnProgress = (v) => persist('learnProgress', v, setLearnProgress)
  const saveQuizHistory = (v) => persist('quizHistory', v, setQuizHistory)

  // Reading/Writing
  const saveReadingLog = (v) => persist('readingLog', v, setReadingLog)
  const saveWritingLog = (v) => persist('writingLog', v, setWritingLog)

  // Points & Badges
  const savePoints = (v) => persist('points', v, setPoints)
  const saveBadges = (v) => persist('badges', v, setBadges)

  const addPoints = (userId, amount) => {
    const updated = { ...points, [userId]: (points[userId]||0) + amount }
    savePoints(updated)
  }

  const spendPoints = (userId, amount) => {
    const cur = points[userId] || 0
    if (cur < amount) return false
    savePoints({ ...points, [userId]: cur - amount })
    return true
  }

  const awardBadge = (userId, badgeId) => {
    const userBadges = badges[userId] || []
    if (userBadges.includes(badgeId)) return
    saveBadges({ ...badges, [userId]: [...userBadges, badgeId] })
  }

  // Calendars
  const saveCalendars = (v) => persist('calendars', v, setCalendars)
  const saveProfileVisibility = (v) => persist('profileVisibility', v, setProfileVisibility)

  const kids = users.filter(u => u.role === 'kid')
  const parents = users.filter(u => u.role === 'parent')
  const isParent = currentUser?.role === 'parent'
  const isKid = currentUser?.role === 'kid'

  return (
    <AuthContext.Provider value={{
      users, currentUser, kids, parents, isParent, isKid,
      login, logout, addUser, updateUser, removeUser,
      settings, updateSettings,
      chores, saveChores,
      schedule, saveSchedule,
      specialDays, saveSpecialDays,
      weekendActs, saveWeekendActs,
      rewards, saveRewards,
      rules, saveRules,
      announcements, saveAnnouncements,
      signups, saveSignups,
      completions, saveCompletions,
      strikes, saveStrikes,
      weekendStatus, saveWeekendStatus,
      punishments, savePunishments,
      requests, saveRequests,
      learnProgress, saveLearnProgress,
      quizHistory, saveQuizHistory,
      readingLog, saveReadingLog,
      writingLog, saveWritingLog,
      points, savePoints, addPoints, spendPoints,
      badges, saveBadges, awardBadge,
      calendars, saveCalendars,
      profileVisibility, saveProfileVisibility,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
