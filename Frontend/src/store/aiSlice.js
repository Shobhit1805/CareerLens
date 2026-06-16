import { createSlice } from '@reduxjs/toolkit'

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    result: null,
    analyses: [],
    loading: false,
    error: null,
    interview: {
      questions: [],
      currentIndex: 0,
      answers: [],
      feedbacks: [],
      isComplete: false,
      settings: null,
    },
  },
  reducers: {
    setResult: (state, action) => {
      state.result = action.payload
      state.error = null
    },
    clearResult: (state) => {
      state.result = null
      state.error = null
    },
    setAnalyses: (state, action) => {
      state.analyses = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearAI: (state) => {
      state.result = null
      state.analyses = []
      state.error = null
      state.loading = false
      state.interview = {
        questions: [],
        currentIndex: 0,
        answers: [],
        feedbacks: [],
        isComplete: false,
        settings: null,
      }
    },
    setInterviewSettings: (state, action) => {
      state.interview.settings = action.payload
    },
    setInterviewQuestions: (state, action) => {
      state.interview.questions = action.payload
      state.interview.currentIndex = 0
      state.interview.answers = []
      state.interview.feedbacks = []
      state.interview.isComplete = false
    },
    addFeedback: (state, action) => {
      state.interview.feedbacks.push(action.payload)
      state.interview.currentIndex += 1
      if (state.interview.currentIndex >= state.interview.questions.length) {
        state.interview.isComplete = true
      }
    },
    resetInterview: (state) => {
      state.interview = {
        questions: [],
        currentIndex: 0,
        answers: [],
        feedbacks: [],
        isComplete: false,
        settings: null,
      }
    },
  },
})

export const {
  setResult,
  clearResult,
  setAnalyses,
  setLoading,
  setError,
  clearAI,
  setInterviewSettings,
  setInterviewQuestions,
  addFeedback,
  resetInterview,
} = aiSlice.actions

export default aiSlice.reducer