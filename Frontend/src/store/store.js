import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import aiReducer from './aiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ai: aiReducer,
  },
})