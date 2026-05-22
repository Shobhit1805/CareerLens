import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuth from './hooks/useAuth'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

const App = () => {
  const { isAuthenticated, fetchMe } = useAuth()

  useEffect(() => {
    fetchMe()
  }, [])

  return (
    <Routes>
      <Route path='/' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Navigate to='/login' />} />
      <Route path='/login' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Login />} />
      <Route path='/signup' element={isAuthenticated ? <Navigate to='/dashboard' /> : <Signup />} />
      <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />} />
    </Routes>
  )
}

export default App