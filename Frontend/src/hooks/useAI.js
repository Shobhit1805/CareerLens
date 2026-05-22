import { useDispatch, useSelector } from 'react-redux'
import {
  setResult,
  clearResult,
  setLoading,
  setError,
  setInterviewSettings,
  setInterviewQuestions,
  addFeedback,
  resetInterview,
} from '../store/aiSlice'
import aiService from '../services/aiService'

const useAI = () => {
  const dispatch = useDispatch()
  const { result, loading, error, interview } = useSelector((state) => state.ai)

  const analyzeResume = async (resumeFile, jobDescription) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearResult())

      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription)

      const data = await aiService.analyzeResume(formData)
      dispatch(setResult(data.data))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Analysis failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const downloadResume = async (atsResume) => {
    try {
      dispatch(setLoading(true))
      const blob = await aiService.downloadResume(atsResume)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${atsResume.name}_resume.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Download failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const startInterview = (settings, questions) => {
    dispatch(setInterviewSettings(settings))
    dispatch(setInterviewQuestions(questions))
  }

  const submitAnswer = async (question, answer) => {
    try {
      dispatch(setLoading(true))
      const payload = {
        question: question.question,
        answer,
        topic: question.topic || question.category,
        difficulty: question.difficulty || 'medium',
        resumeText: result?.resumeText || '',
        jobDescription: result?.jobDescription || '',
      }
      const data = await aiService.evaluateAnswer(payload)
      dispatch(addFeedback({ ...data.feedback, question: question.question, answer }))
      return data.feedback
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Evaluation failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const sendChatMessage = async (messages) => {
    try {
      const data = await aiService.chat(
        messages,
        result?.resumeText || '',
        result?.jobDescription || '',
        result || null
      )
      return data.reply
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Chat failed'))
      return null
    }
  }

  const clearInterview = () => {
    dispatch(resetInterview())
  }

  return {
    result,
    loading,
    error,
    interview,
    analyzeResume,
    downloadResume,
    startInterview,
    submitAnswer,
    sendChatMessage,
    clearInterview,
  }
}

export default useAI