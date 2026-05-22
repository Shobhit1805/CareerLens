import axiosInstance from './axiosInstance'

const authService = {
  signup: async (userData) => {
    const { data } = await axiosInstance.post('/auth/signup', userData)
    return data
  },

  login: async (userData) => {
    const { data } = await axiosInstance.post('/auth/login', userData)
    return data
  },

  logout: async () => {
    const { data } = await axiosInstance.post('/auth/logout')
    return data
  },

  getMe: async () => {
    const { data } = await axiosInstance.get('/auth/me')
    return data
  },
}

export default authService