import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import useAuth from './hooks/useAuth'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'
import Interview from './pages/Interview'
import InterviewResult from './pages/InterviewResult'

const App = () => {
  const { isAuthenticated, fetchMe } = useAuth()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchMe()
    }
  }, [])

  return (
    <Routes>
      <Route path='/' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Navigate to='/login' />} />
      <Route path='/login' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Login />} />
      <Route path='/signup' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Signup />} />
      <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />} />
      <Route path='/interview' element={isAuthenticated ? <InterviewSetup /> : <Navigate to='/login' />} />
      <Route path='/interview/start' element={isAuthenticated ? <Interview /> : <Navigate to='/login' />} />
      <Route path='/interview/result' element={isAuthenticated ? <InterviewResult /> : <Navigate to='/login' />} />
    </Routes>
  )
}

export default App