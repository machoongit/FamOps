// App.jsx — FamOps root
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import LoginPage   from './pages/LoginPage'
import HomPage     from './pages/HomePage'
import ChoresPage  from './pages/ChoresPage'
import LearnPage   from './pages/LearnPage'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import ParentPage  from './pages/ParentPage'

const NAV = [
  { to: '/home',     icon: '🏠', label: 'Home'    },
  { to: '/chores',   icon: '✅', label: 'Chores'  },
  { to: '/learn',    icon: '📚', label: 'Learn'   },
  { to: '/calendar', icon: '📅', label: 'Calendar'},
  { to: '/profile',  icon: '👤', label: 'Me'      },
]

const BottomNav = () => {
  const { currentUser, isParent, settings } = useAuth()
  const color = settings?.primaryColor || '#f5a623'
  if (!currentUser) return null
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#111', borderTop: '1px solid rgba(255,255,255,.07)',
      display: 'flex', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          flex: 1, padding: '10px 4px 8px', textAlign: 'center', textDecoration: 'none',
          fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: '.65rem',
          color: isActive ? color : '#555',
          borderTop: isActive ? `2px solid ${color}` : '2px solid transparent',
          transition: 'all .2s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        })}>
          <span style={{ fontSize: '1.2rem' }}>{icon}</span>
          {label}
        </NavLink>
      ))}
      {isParent && (
        <NavLink to='/parent' style={({ isActive }) => ({
          flex: 1, padding: '10px 4px 8px', textAlign: 'center', textDecoration: 'none',
          fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: '.65rem',
          color: isActive ? '#9c27b0' : '#555',
          borderTop: isActive ? '2px solid #9c27b0' : '2px solid transparent',
          transition: 'all .2s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        })}>
          <span style={{ fontSize: '1.2rem' }}>⚙️</span>
          Control
        </NavLink>
      )}
    </nav>
  )
}

const AppInner = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <Routes>
        <Route path='/'          element={<LoginPage />} />
        <Route path='/home'      element={currentUser ? <HomPage />      : <LoginPage />} />
        <Route path='/chores'    element={currentUser ? <ChoresPage />   : <LoginPage />} />
        <Route path='/learn/*'   element={currentUser ? <LearnPage />    : <LoginPage />} />
        <Route path='/calendar'  element={currentUser ? <CalendarPage /> : <LoginPage />} />
        <Route path='/profile'   element={currentUser ? <ProfilePage />  : <LoginPage />} />
        <Route path='/parent/*'  element={currentUser ? <ParentPage />   : <LoginPage />} />
        <Route path='*'          element={<LoginPage />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
