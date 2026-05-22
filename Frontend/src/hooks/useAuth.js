 import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser, setLoading, setError } from '../store/authSlice'
import authService from '../services/authService'

const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const signup = async (userData) => {
    try {
      dispatch(setLoading(true))
      const data = await authService.signup(userData)
      dispatch(setUser(data.user))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Signup failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const login = async (userData) => {
    try {
      dispatch(setLoading(true))
      const data = await authService.login(userData)
      dispatch(setUser(data.user))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Login failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const logout = async () => {
    try {
      dispatch(setLoading(true))
      await authService.logout()
      dispatch(clearUser())
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Logout failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchMe = async () => {
    try {
      dispatch(setLoading(true))
      const data = await authService.getMe()
      dispatch(setUser(data.user))
    } catch (err) {
      dispatch(clearUser())
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { user, isAuthenticated, loading, error, signup, login, logout, fetchMe }
}

export default useAuth