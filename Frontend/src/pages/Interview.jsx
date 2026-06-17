import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Loader2 } from 'lucide-react'
import useAI from '../hooks/useAI'
import Timer from '../components/interview/Timer'
import FeedbackCard from '../components/interview/FeedbackCard'

const Interview = () => {
  const navigate = useNavigate()
  const { interview, loading, submitAnswer } = useAI()

  const [answer, setAnswer] = useState('')
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [timerKey, setTimerKey] = useState(0)

  const { questions, currentIndex, settings, isComplete } = interview

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/interview')
    }
  }, [questions])

  useEffect(() => {
    if (isComplete) {
      navigate('/interview/result')
    }
  }, [isComplete])

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSubmit = async () => {
    if (!answer.trim() || loading) return
    const feedback = await submitAnswer(currentQuestion, answer)
    if (feedback) setCurrentFeedback(feedback)
  }

  const handleNext = useCallback(() => {
    setCurrentFeedback(null)
    setAnswer('')
    setTimerKey((prev) => prev + 1)
  }, [])

  const handleTimeExpire = useCallback(() => {
    if (!currentFeedback && !loading) handleSubmit()
  }, [currentFeedback, loading, answer])

  if (!currentQuestion) return null

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Navbar */}
      <nav className='bg-white border-b border-gray-100 sticky top-0 z-40'>
        <div className='max-w-3xl mx-auto px-6 h-14 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='font-bold text-gray-900'>Mock Interview</span>
            <span className='text-sm text-gray-400'>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Timer
              key={timerKey}
              seconds={settings?.timePerQuestion || 0}
              onExpire={handleTimeExpire}
            />
            <span className='text-sm text-gray-500'>{settings?.difficulty}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className='h-0.5 bg-gray-100'>
          <div
            className='h-0.5 bg-black transition-all duration-500'
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>
      </nav>

      <div className='max-w-3xl mx-auto px-6 py-10 page-enter'>

        {/* Question */}
        {!currentFeedback && (
          <div className='space-y-5'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
              <div className='flex items-center gap-2 mb-4'>
                {currentQuestion.topic && (
                  <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>
                    {currentQuestion.topic}
                  </span>
                )}
                {currentQuestion.category && (
                  <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>
                    {currentQuestion.category}
                  </span>
                )}
                {currentQuestion.difficulty && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700'
                    : currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>
              <h2 className='text-lg font-semibold text-gray-900 leading-relaxed'>
                {currentQuestion.question}
              </h2>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Your Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder='Type your answer here...'
                className='w-full h-48 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white resize-none'
                disabled={loading}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || loading}
              className='w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <><Loader2 size={16} className='animate-spin' /> Evaluating...</>
              ) : (
                <>Submit Answer <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}

        {/* Feedback */}
        {currentFeedback && (
          <FeedbackCard
            feedback={currentFeedback}
            onNext={handleNext}
            isLast={isLast}
          />
        )}

      </div>
    </div>
  )
}

export default Interview