// AuthContext.jsx — FamOps family data hub
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase'
import { storage } from './storage'
import { DEFAULT_CHORES, DEFAULT_SCHEDULE, DEFAULT_SPECIAL_DAYS, DEFAULT_WEEKEND_ACTIVITIES, DEFAULT_REWARDS, RANKS, HP_RANKS, HP_HOUSES, todayKey, weekKey } from './constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [users, setUsers]               = useState([])
  const [currentUser, setCurrentUser]   = useState(null)
  const [firebaseUser, setFirebaseUser] = useState(null)

  // Family data
  const [chores, setChores]             = useState(DEFAULT_CHORES)
  const [schedule, setSchedule]         = useState(DEFAULT_SCHEDULE)
  const [specialDays, setSpecialDays]   = useState(DEFAULT_SPECIAL_DAYS)
  const [weekendActs, setWeekendActs]   = useState(DEFAULT_WEEKEND_ACTIVITIES)
  const [rewards, setRewards]           = useState(DEFAULT_REWARDS)
  const [rules, setRules]               = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [choreCategories, setChoreCategories] = useState(['Morning','Afternoon','Evening','Weekly','Pet Care','Kitchen','Outdoor'])
  const [customRequestTypes, setCustomRequestTypes] = useState([])
  const [customRanks, setCustomRanks]   = useState(null) // null = use RANKS defaults
  const [customBadges, setCustomBadges] = useState([])
  const [photos, setPhotos]             = useState([])
  const [parentNotes, setParentNotes]   = useState({}) // { userId: [{ id, msg, from, date, read }] }
  const [redemptions, setRedemptions]   = useState([]) // pending reward redemptions
  const [activityLog, setActivityLog]   = useState({}) // { userId: [{ id, type, desc, pts, date }] }
  const [weeklyResetDate, setWeeklyResetDate] = useState(null)
  const [lessonResetLog, setLessonResetLog] = useState([]) // [{ userId, lessonId, reason, date }]
  const [onboardingDone, setOnboardingDone] = useState(false)

  const [settings, setSettings] = useState({
    primaryColor: '#f5a623', accentColor: '#4a90e2', bgColor: '#0a0a0a', appName: 'FamOps',
    signupStart: 8, signupEnd: 10, signupDays: [1,2,3,4],
    quizPassScore: 4, quizRetryHours: 24,
    readingMinutes: 30, writingMinWords: 30, readingPoints: 15, writingPoints: 15,
    strikeLimit: 3,
    hpMode: false, hpHouse: 'gryffindor',
    kidControls: { learn: true, calendar: true, meals: true, rewards: true, requests: true },
  })

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
  const [menu, setMenu]                 = useState({}) // { 'YYYY-MM-DD': { breakfast, lunch, dinner, snacks, midnightChow } }
  const [mealRequests, setMealRequests] = useState([]) // [{ id, userId, userName, slot, suggestion, date, status }]
  const [profileVisibility, setProfileVisibility] = useState({
    points: 'all', rank: 'all', badges: 'all', chores: 'all',
    lessons: 'all', reading: 'all', writing: 'all',
    punishments: 'parents', strikes: 'parents'
  })
  const [ruleGroups, setRuleGroups]     = useState([])
  const [userRules, setUserRules]       = useState({})

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => setFirebaseUser(user))
      return () => unsubscribe()
    }
    setFirebaseUser(null)
    return undefined
  }, [])

  useEffect(() => {
    const load = (key, setter) => { const v = storage.get(key); if (v !== null) setter(v) }

    const hydrate = async () => {
      await storage.hydrateFromFirebase()

      load('users', setUsers)
      load('settings', setSettings)
      load('chores', setChores)
      load('schedule', setSchedule)
      load('specialDays', setSpecialDays)
      load('weekendActs', setWeekendActs)
      load('rewards', setRewards)
      load('rules', setRules)
      load('announcements', setAnnouncements)
      load('choreCategories', setChoreCategories)
      load('customRequestTypes', setCustomRequestTypes)
      load('customRanks', setCustomRanks)
      load('customBadges', setCustomBadges)
      load('photos', setPhotos)
      load('parentNotes', setParentNotes)
      load('redemptions', setRedemptions)
      load('activityLog', setActivityLog)
      load('weeklyResetDate', setWeeklyResetDate)
      load('lessonResetLog', setLessonResetLog)
      load('onboardingDone', setOnboardingDone)
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
      load('menu', setMenu)
      load('mealRequests', setMealRequests)
      load('profileVisibility', setProfileVisibility)
      load('ruleGroups', setRuleGroups)
      load('userRules', setUserRules)

      const cu = storage.get('session'); if (cu) setCurrentUser(cu)
    }

    void hydrate()
  }, [])

  const persist = useCallback((key, val, setter) => { setter(val); storage.set(key, val) }, [])

  // ── Live sync — updates all state instantly when another device changes Firestore ──
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return

    const ref = doc(db, 'famops', 'famops-state')

    // Maps every Firestore key (without fo_ prefix) to its React state setter
    const setterMap = {
      users: setUsers, settings: setSettings, chores: setChores,
      schedule: setSchedule, specialDays: setSpecialDays, weekendActs: setWeekendActs,
      rewards: setRewards, rules: setRules, announcements: setAnnouncements,
      choreCategories: setChoreCategories, customRequestTypes: setCustomRequestTypes,
      customRanks: setCustomRanks, customBadges: setCustomBadges, photos: setPhotos,
      parentNotes: setParentNotes, redemptions: setRedemptions, activityLog: setActivityLog,
      weeklyResetDate: setWeeklyResetDate, lessonResetLog: setLessonResetLog,
      onboardingDone: setOnboardingDone, signups: setSignups, completions: setCompletions,
      strikes: setStrikes, weekendStatus: setWeekendStatus, punishments: setPunishments,
      requests: setRequests, learnProgress: setLearnProgress, quizHistory: setQuizHistory,
      readingLog: setReadingLog, writingLog: setWritingLog, points: setPoints,
      badges: setBadges, calendars: setCalendars, profileVisibility: setProfileVisibility,
      menu: setMenu, mealRequests: setMealRequests,
      ruleGroups: setRuleGroups, userRules: setUserRules,
    }

    const unsubscribe = onSnapshot(ref, (snap) => {
      // hasPendingWrites = true means this is our own write echoing back — skip it
      // to avoid overwriting local state that may already be ahead
      if (!snap.exists() || snap.metadata.hasPendingWrites) return

      const data = snap.data()
      const PREFIX = 'fo_'

      Object.entries(data).forEach(([firestoreKey, value]) => {
        const key = firestoreKey.startsWith(PREFIX) ? firestoreKey.slice(PREFIX.length) : firestoreKey
        const setter = setterMap[key]
        // Never overwrite session — that's device-local login state
        if (key === 'session') return
        if (setter && value !== undefined) {
          setter(value)
          // Keep localStorage in sync without re-triggering a Firestore write
          storage.setLocal(key, value)
        }
      })
    }, (error) => {
      console.error('FamOps live sync error:', error)
    })

    return () => unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auth
  const login  = (user) => { setCurrentUser(user); storage.set('session', user) }
  const logout = () => { setCurrentUser(null); storage.remove('session') }
  const addUser = (user) => persist('users', [...users, user], setUsers)
  const updateUser = (id, updates) => {
    const u = users.map(x => x.id===id?{...x,...updates}:x)
    persist('users', u, setUsers)
    if (currentUser?.id===id) { const updated={...currentUser,...updates}; setCurrentUser(updated); storage.set('session',updated) }
  }
  const removeUser = (id) => persist('users', users.filter(u=>u.id!==id), setUsers)

  // Settings & config
  const updateSettings          = (s) => persist('settings', {...settings,...s}, setSettings)
  const saveChores              = (v) => persist('chores', v, setChores)
  const saveSchedule            = (v) => persist('schedule', v, setSchedule)
  const saveSpecialDays         = (v) => persist('specialDays', v, setSpecialDays)
  const saveWeekendActs         = (v) => persist('weekendActs', v, setWeekendActs)
  const saveRewards             = (v) => persist('rewards', v, setRewards)
  const saveRules               = (v) => persist('rules', v, setRules)
  const saveAnnouncements       = (v) => persist('announcements', v, setAnnouncements)
  const saveChoreCategories     = (v) => persist('choreCategories', v, setChoreCategories)
  const saveCustomRequestTypes  = (v) => persist('customRequestTypes', v, setCustomRequestTypes)
  const saveCustomRanks         = (v) => persist('customRanks', v, setCustomRanks)
  const saveCustomBadges        = (v) => persist('customBadges', v, setCustomBadges)
  const savePhotos              = (v) => persist('photos', v, setPhotos)
  const saveParentNotes         = (v) => persist('parentNotes', v, setParentNotes)
  const saveRedemptions         = (v) => persist('redemptions', v, setRedemptions)
  const saveActivityLog         = (v) => persist('activityLog', v, setActivityLog)
  const saveLessonResetLog      = (v) => persist('lessonResetLog', v, setLessonResetLog)
  const saveOnboardingDone      = (v) => persist('onboardingDone', v, setOnboardingDone)

  // Activity logging
  const logActivity = (userId, type, desc, pts = 0) => {
    const parsedPts = Number(pts)
    if (!userId || !type || !desc || Number.isNaN(parsedPts)) return

    const entry = { id: 'act' + Date.now(), type, desc, pts: parsedPts, date: new Date().toISOString() }

    setActivityLog((prev) => {
      const updated = {
        ...prev,
        [userId]: [...(prev[userId] || []).slice(-199), entry],
      }
      storage.set('activityLog', updated)
      return updated
    })
  }

  // Weekly reset — clears signups, completions, strikes for the week
  const doWeeklyReset = () => {
    persist('signups', {}, setSignups)
    persist('completions', {}, setCompletions)
    persist('strikes', {}, setStrikes)
    persist('weekendStatus', {}, setWeekendStatus)
    persist('weeklyResetDate', todayKey(), setWeeklyResetDate)
  }

  // Activity data
  const saveSignups       = (v) => persist('signups', v, setSignups)
  const saveCompletions   = (v) => persist('completions', v, setCompletions)
  const saveStrikes       = (v) => persist('strikes', v, setStrikes)
  const saveWeekendStatus = (v) => persist('weekendStatus', v, setWeekendStatus)
  const savePunishments   = (v) => persist('punishments', v, setPunishments)
  const saveRequests      = (v) => persist('requests', v, setRequests)
  const saveLearnProgress = (v) => persist('learnProgress', v, setLearnProgress)
  const saveQuizHistory   = (v) => persist('quizHistory', v, setQuizHistory)
  const saveReadingLog    = (v) => persist('readingLog', v, setReadingLog)
  const saveWritingLog    = (v) => persist('writingLog', v, setWritingLog)
  const savePoints        = (v) => persist('points', v, setPoints)
  const saveBadges        = (v) => persist('badges', v, setBadges)
  const saveCalendars     = (v) => persist('calendars', v, setCalendars)
  const saveProfileVisibility = (v) => persist('profileVisibility', v, setProfileVisibility)
  const saveMenu          = (v) => persist('menu', v, setMenu)
  const saveMealRequests  = (v) => persist('mealRequests', v, setMealRequests)
  const saveRuleGroups    = (v) => persist('ruleGroups', v, setRuleGroups)
  const saveUserRules     = (v) => persist('userRules', v, setUserRules)

  const addPoints = (userId, amount) => {
    const parsedAmount = Number(amount)
    if (!userId || Number.isNaN(parsedAmount) || parsedAmount <= 0) return

    setPoints((prev) => {
      const updated = { ...prev, [userId]: (prev[userId] || 0) + parsedAmount }
      storage.set('points', updated)
      return updated
    })
  }
  const spendPoints = (userId, amount) => {
    const parsedAmount = Number(amount)
    if (!userId || Number.isNaN(parsedAmount) || parsedAmount <= 0) return false

    let didSpend = false
    setPoints((prev) => {
      const current = prev[userId] || 0
      if (current < parsedAmount) return prev

      didSpend = true
      const updated = { ...prev, [userId]: current - parsedAmount }
      storage.set('points', updated)
      return updated
    })

    return didSpend
  }
  const awardBadge = (userId, badgeId) => {
    if (!userId || !badgeId) return

    setBadges((prev) => {
      const userBadges = prev[userId] || []
      if (userBadges.includes(badgeId)) return prev

      const updated = { ...prev, [userId]: [...userBadges, badgeId] }
      storage.set('badges', updated)
      return updated
    })
  }

  // Effective ranks — HP mode > customRanks > defaults
  const effectiveRanks = settings?.hpMode ? HP_RANKS : (customRanks || RANKS)

  // getEffectiveRules — merges global → group → individual
  const getEffectiveRules = (userId) => {
    const base = { ...settings }
    const user = users.find(u => u.id === userId)
    if (!user) return base
    if (user.groupId) {
      const group = ruleGroups.find(g => g.id === user.groupId)
      if (group?.rules) Object.assign(base, group.rules)
    }
    if (userRules[userId]) Object.assign(base, userRules[userId])
    return base
  }

  // When HP mode is on, house color becomes primary color
  const effectiveSettings = settings?.hpMode
    ? { ...settings, primaryColor: HP_HOUSES.find(h=>h.id===settings.hpHouse)?.color || settings.primaryColor }
    : settings
  const kids    = users.filter(u => u.role === 'kid')
  const parents = users.filter(u => u.role === 'parent')
  const isParent = currentUser?.role === 'parent'
  const isKid    = currentUser?.role === 'kid'

  return (
    <AuthContext.Provider value={{
      users, currentUser, firebaseUser, kids, parents, isParent, isKid,
      login, logout, addUser, updateUser, removeUser,
      settings: effectiveSettings, updateSettings,
      chores, saveChores,
      schedule, saveSchedule,
      specialDays, saveSpecialDays,
      weekendActs, saveWeekendActs,
      rewards, saveRewards,
      rules, saveRules,
      announcements, saveAnnouncements,
      choreCategories, saveChoreCategories,
      customRequestTypes, saveCustomRequestTypes,
      customRanks, saveCustomRanks, effectiveRanks,
      customBadges, saveCustomBadges,
      photos, savePhotos,
      parentNotes, saveParentNotes,
      redemptions, saveRedemptions,
      activityLog, saveActivityLog, logActivity,
      weeklyResetDate, doWeeklyReset,
      lessonResetLog, saveLessonResetLog,
      onboardingDone, saveOnboardingDone,
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
      menu, saveMenu, mealRequests, saveMealRequests,
      profileVisibility, saveProfileVisibility,
      ruleGroups, saveRuleGroups,
      userRules, saveUserRules,
      getEffectiveRules,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
