// App.jsx — FamOps root
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import LoginPage      from './pages/LoginPage'
import HomePage       from './pages/HomePage'
import ChoresPage     from './pages/ChoresPage'
import LearnPage      from './pages/LearnPage'
import CalendarPage   from './pages/CalendarPage'
import ProfilePage    from './pages/ProfilePage'
import ParentPage     from './pages/ParentPage'
import DisplayPage    from './pages/DisplayPage'
import OnboardingPage from './pages/OnboardingPage'
import MealPage       from './pages/MealPage'

export const BackBtn = ({ label = 'Home' }) => {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate('/home')} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,.07)', border: 'none',
      color: '#fff', fontFamily: 'Nunito,sans-serif', fontWeight: 800,
      fontSize: '.85rem', padding: '8px 16px', borderRadius: 999,
      cursor: 'pointer', marginBottom: 18,
    }}>← {label}</button>
  )
}

// Guard — blocks unauthenticated users and enforces kid section access controls
const Guard = ({ children, section }) => {
  const { currentUser, isKid, settings } = useAuth()
  const navigate = useNavigate()
  if (!currentUser) { navigate('/'); return null }
  // If a section is toggled off in parent controls, redirect kids to home
  if (isKid && section && settings?.kidControls?.[section] === false) {
    navigate('/home'); return null
  }
  return children
}

const AppInner = () => {
  const { users, onboardingDone } = useAuth()
  return (
    <Routes>
      <Route path='/setup'    element={<OnboardingPage />} />
      <Route path='/display'  element={<DisplayPage />} />
      <Route path='/' element={
        users.length === 0 && !onboardingDone ? <OnboardingPage /> : <LoginPage />
      } />
      <Route path='/home'     element={<Guard><HomePage /></Guard>} />
      <Route path='/chores'   element={<Guard><ChoresPage /></Guard>} />
      <Route path='/learn/*'  element={<Guard section='learn'><LearnPage /></Guard>} />
      <Route path='/calendar' element={<Guard section='calendar'><CalendarPage /></Guard>} />
      <Route path='/profile'  element={<Guard><ProfilePage /></Guard>} />
      <Route path='/meals'    element={<Guard section='meals'><MealPage /></Guard>} />
      <Route path='/parent/*' element={<Guard><ParentPage /></Guard>} />
      <Route path='*'         element={<LoginPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
