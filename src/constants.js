// constants.js — FamOps default data
// Everything here is overridable by parents in the app

export const APP_NAME = 'FamOps'
export const APP_VERSION = '1.0.0'

// Military ranks (kids level up through these with XP)
export const RANKS = [
  { name: 'Recruit',    minXP: 0,    icon: '🔰', color: '#888' },
  { name: 'Private',   minXP: 100,  icon: '⭐', color: '#43a047' },
  { name: 'Corporal',  minXP: 250,  icon: '⭐⭐', color: '#43a047' },
  { name: 'Sergeant',  minXP: 500,  icon: '🌟', color: '#4a90e2' },
  { name: 'Staff Sgt', minXP: 800,  icon: '🌟🌟', color: '#4a90e2' },
  { name: 'Lieutenant',minXP: 1200, icon: '💫', color: '#9c27b0' },
  { name: 'Captain',   minXP: 1800, icon: '🏅', color: '#9c27b0' },
  { name: 'Major',     minXP: 2500, icon: '🎖️', color: '#f5a623' },
  { name: 'Colonel',   minXP: 3500, icon: '🏆', color: '#f5a623' },
  { name: 'General',   minXP: 5000, icon: '👑', color: '#ffc107' },
]

export const getRank = (xp) => {
  const r = [...RANKS].reverse().find(r => xp >= r.minXP)
  return r || RANKS[0]
}

export const getNextRank = (xp) => {
  return RANKS.find(r => xp < r.minXP) || null
}

// Default avatars — way more options
export const AVATARS = [
  // Animals
  '🦁','🐯','🐻','🦊','🐼','🦄','🐸','🐧','🦋','🐬','🐺','🦅','🦈','🐲','🦋',
  '🐮','🐷','🦝','🐨','🦘','🦁','🐙','🦑','🦜','🦚',
  // People
  '👦','👧','🧒','👩','👨','🧔','👩‍🦱','👨‍🦱','👩‍🦰','👨‍🦰',
  '🧑‍🚀','👩‍✈️','👨‍✈️','🧑‍🎤','👩‍🎨','👨‍🎨','🧑‍💻','👩‍🔬','👨‍🔬',
  // Cool
  '🤖','👾','🎭','🦸','🦹','🧙','🧛','🥷','🤠','😎',
  // Sports
  '⚽','🏈','🏀','⚾','🎮','🎯','🏋️','🤸',
]

export const COLORS = [
  '#f5a623','#ffc107','#ff6b35','#e53935','#9c27b0',
  '#e91e8c','#4a90e2','#43a047','#00bcd4','#607d8b',
  '#795548','#ff5722','#3f51b5','#009688','#8bc34a',
]

// Default chore categories
export const CHORE_CATEGORIES = ['Morning','Afternoon','Evening','Weekly','Pet Care','Kitchen','Outdoor']

// Default mandatory chores
export const DEFAULT_CHORES = [
  { id:'ch1', label:'Morning Dog Care', category:'Morning', mandatory:true, points:10 },
  { id:'ch2', label:'Morning Dog Care #2', category:'Morning', mandatory:true, points:10 },
  { id:'ch3', label:'Afternoon Dog Care', category:'Afternoon', mandatory:true, points:10 },
  { id:'ch4', label:'Afternoon Dog Care #2', category:'Afternoon', mandatory:true, points:10 },
  { id:'ch5', label:'Evening Dog Care', category:'Evening', mandatory:true, points:10 },
  { id:'ch6', label:'Evening Dog Care #2', category:'Evening', mandatory:true, points:10 },
  { id:'ch7', label:'Bunny Care', category:'Morning', mandatory:true, points:10 },
  { id:'ch8', label:'Jamie Care', category:'Morning', mandatory:true, points:10 },
  { id:'ch9', label:'Room Cleaning', category:'Morning', mandatory:true, points:15 },
  { id:'ch10', label:'Upstairs Bathroom', category:'Morning', mandatory:true, points:15 },
  { id:'ch11', label:'Downstairs Bathroom', category:'Morning', mandatory:true, points:15 },
  { id:'ch12', label:'Dinner Dishes', category:'Evening', mandatory:true, points:15 },
  { id:'ch13', label:'Backyard Cleanup', category:'Afternoon', mandatory:false, points:10 },
  { id:'ch14', label:'Vacuum', category:'Afternoon', mandatory:false, points:10 },
  { id:'ch15', label:'Carpet Cleaning', category:'Afternoon', mandatory:false, points:10 },
  { id:'ch16', label:'Laundry', category:'Afternoon', mandatory:false, points:15 },
]

// Default schedule
export const DEFAULT_SCHEDULE = [
  { id:'s1', time:'0800–1000', label:'Chore Signup Window', note:'Opens 8am, closes 10am. No phones during chores.', icon:'📋', visible:'all' },
  { id:'s2', time:'0830–0930', label:'Breakfast', note:'Breakfast Briefs', icon:'🍳', visible:'all' },
  { id:'s3', time:'1000–1300', label:'Chore Time', note:'No phones. When done: double check, help others, hobby, read or write.', icon:'🧹', visible:'all' },
  { id:'s4', time:'1300–1400', label:'Lunch Break', note:'1 hour — electronics allowed', icon:'🍔', visible:'all' },
  { id:'s5', time:'1300–1600', label:'Laundry Window', note:'Last wash at 1530', icon:'👕', visible:'all' },
  { id:'s6', time:'1400–1500', label:'Reading (Mandatory)', note:'30 minutes minimum. Log it in the app.', icon:'📖', visible:'all' },
  { id:'s7', time:'1500–1600', label:'Writing (Mandatory)', note:'30 min, 1-2 paragraphs depending on age.', icon:'✏️', visible:'all' },
  { id:'s8', time:'1530–1630', label:'Snack & Studies', note:'', icon:'📚', visible:'all' },
  { id:'s9', time:'1630–2000', label:'Outside Time', note:'', icon:'🌤️', visible:'all' },
  { id:'s10', time:'1630–2100', label:'Showers', note:'', icon:'🚿', visible:'all' },
  { id:'s11', time:'2000–2100', label:'Dinner', note:'', icon:'🍽️', visible:'all' },
  { id:'s12', time:'2200–2230', label:'Dessert', note:'', icon:'🍦', visible:'all' },
  { id:'s13', time:'0000–0030', label:'Midnight Chow', note:'', icon:'🌙', visible:'all' },
]

export const DEFAULT_SPECIAL_DAYS = [
  { id:'sp1', day:'Monday', event:'Family Game Night', icon:'🎲', visible:'all' },
  { id:'sp2', day:'Wednesday', event:'Library — Half Work Day', icon:'📖', visible:'all' },
  { id:'sp3', day:'Thursday', event:'Home Movie Night', icon:'🎬', visible:'all' },
]

// Default weekend activities
export const DEFAULT_WEEKEND_ACTIVITIES = [
  { id:'wa1', label:'Cousin Sleepover (Zoe\'s Pool)', icon:'🏊', points:0 },
  { id:'wa2', label:'Mall Trip', icon:'🛍️', points:0 },
  { id:'wa3', label:'Skating', icon:'⛸️', points:0 },
  { id:'wa4', label:'Movies', icon:'🎬', points:0 },
  { id:'wa5', label:'Backyard Campout', icon:'⛺', points:0 },
  { id:'wa6', label:'Bowling', icon:'🎳', points:0 },
  { id:'wa7', label:'Stone Mountain Camping', icon:'🏕️', points:0 },
]

// Default strike consequences
export const STRIKE_CONSEQUENCES = [
  { strike: 1, label: 'Extra 2 chores', icon: '🧹' },
  { strike: 1, label: 'No sugar for the day', icon: '🍬' },
  { strike: 2, label: 'No electronics (except lunch)', icon: '📱' },
  { strike: 2, label: 'Earlier bedtime', icon: '🛏️' },
  { strike: 3, label: 'Weekend lost — no redemption', icon: '❌' },
]

// Default reward catalog
export const DEFAULT_REWARDS = [
  { id:'r1', label:'Extra screen time (1hr)', icon:'📱', cost:50 },
  { id:'r2', label:'Choose dinner tonight', icon:'🍕', cost:75 },
  { id:'r3', label:'Sleep in 1 hour', icon:'😴', cost:100 },
  { id:'r4', label:'Skip one chore (non-mandatory)', icon:'🎯', cost:150 },
  { id:'r5', label:'Movie night pick', icon:'🎬', cost:200 },
  { id:'r6', label:'Mall trip', icon:'🛍️', cost:300 },
  { id:'r7', label:'Special 1-on-1 day', icon:'⭐', cost:500 },
]

// Default badges
export const BADGES = [
  { id:'b1', label:'First Chore', icon:'🌱', desc:'Completed your first chore', xp:0 },
  { id:'b2', label:'Perfect Week', icon:'💎', desc:'All chores approved for a full week', xp:0 },
  { id:'b3', label:'Scholar', icon:'📚', desc:'Completed 5 lessons', xp:0 },
  { id:'b4', label:'Speed Reader', icon:'⚡', desc:'Logged reading 7 days in a row', xp:0 },
  { id:'b5', label:'Writer', icon:'✍️', desc:'Submitted 5 writing logs', xp:0 },
  { id:'b6', label:'No Strikes', icon:'🎖️', desc:'Zero strikes for a full week', xp:0 },
  { id:'b7', label:'Early Bird', icon:'🌅', desc:'Signed up for chores at 8am 5 days', xp:0 },
  { id:'b8', label:'Team Player', icon:'🤝', desc:'Completed a helping hand chore', xp:0 },
  { id:'b9', label:'Quiz Master', icon:'🧠', desc:'Passed 10 quizzes on first try', xp:0 },
  { id:'b10', label:'Redeemed', icon:'💪', desc:'Earned out of a punishment', xp:0 },
]

// Request types kids can submit
export const REQUEST_TYPES = [
  { id:'sleepover', label:'Sleepover', icon:'🛌' },
  { id:'mall', label:'Mall Day', icon:'🛍️' },
  { id:'birthday', label:'Birthday Party', icon:'🎂' },
  { id:'movies', label:'Movies', icon:'🎬' },
  { id:'friend', label:'Friend Hangout', icon:'👥' },
  { id:'sports', label:'Sports Event', icon:'🏈' },
  { id:'gaming', label:'Gaming Day', icon:'🎮' },
  { id:'other', label:'Something Else', icon:'✨' },
]

// Date helpers
export const todayKey  = () => new Date().toISOString().slice(0, 10)
export const weekKey   = () => { const d = new Date(); const mon = new Date(d); mon.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1)); return mon.toISOString().slice(0, 10) }
export const monthKey  = () => new Date().toISOString().slice(0, 7)
export const daysAgo   = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10) }
export const isWorkday = () => { const d = new Date().getDay(); return d >= 1 && d <= 4 }
export const isWeekend = () => !isWorkday()
export const getDayName = () => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]
export const getSpecialDay = (specialDays) => (specialDays || []).find(s => s.day === getDayName())
export const isSignupOpen = () => { const h = new Date().getHours(); return h >= 8 && h < 10 }
export const formatDate = (iso) => { if (!iso) return ''; const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' }) }
