import axiosInstance from './axiosInstance'

const aiService = {
  analyzeResume: async (formData) => {
    const { data } = await axiosInstance.post('/ai/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  downloadResume: async (atsResume) => {
    const { data } = await axiosInstance.post(
      '/ai/download-resume',
      { atsResume },
      { responseType: 'blob' }
    )
    return data
  },

  getAnalyses: async () => {
    const { data } = await axiosInstance.get('/ai/analyses')
    return data
  },

  getAnalysisById: async (id) => {
    const { data } = await axiosInstance.get(`/ai/analyses/${id}`)
    return data
  },

  evaluateAnswer: async (payload) => {
    const { data } = await axiosInstance.post('/ai/interview-answer', payload)
    return data
  },

  chat: async (messages, resumeText, jobDescription, analysisResult) => {
    const { data } = await axiosInstance.post('/ai/chat', {
      messages,
      resumeText,
      jobDescription,
      analysisResult,
    })
    return data
  },
}

export default aiService