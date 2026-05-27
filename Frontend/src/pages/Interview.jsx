import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, Loader2,
  CheckCircle2, XCircle, AlertCircle,
  Trophy, ArrowRight
} from 'lucide-react'
import useAI from '../hooks/useAI'

// ─── Timer Component ──────────────────────────────────────────────────────────
const Timer = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (seconds === 0) return
    if (timeLeft <= 0) {
      onExpire()
      return
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, seconds, onExpire])

  if (seconds === 0) return null

  const percentage = (timeLeft / seconds) * 100
  const isWarning = timeLeft <= seconds * 0.3
  const color = isWarning ? 'text-red-500' : 'text-gray-700'
  const ringColor = isWarning ? 'stroke-red-500' : 'stroke-black'

  return (
    <div className='flex items-center gap-2'>
      <div className='relative w-10 h-10'>
        <svg className='w-10 h-10 -rotate-90' viewBox='0 0 36 36'>
          <circle cx='18' cy='18' r='15.9' fill='none' stroke='#e5e7eb' strokeWidth='3' />
          <circle
            cx='18' cy='18' r='15.9'
            fill='none'
            className={ringColor}
            strokeWidth='3'
            strokeDasharray='100'
            strokeDashoffset={100 - percentage}
            strokeLinecap='round'
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${color}`}>
          {timeLeft}
        </div>
      </div>
    </div>
  )
}

// ─── Feedback Card ────────────────────────────────────────────────────────────
const FeedbackCard = ({ feedback, onNext, isLast }) => {
  const verdictConfig = {
    excellent: { bg: 'bg-green-50 border-green-200', icon: CheckCircle2, color: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    good: { bg: 'bg-blue-50 border-blue-200', icon: CheckCircle2, color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    average: { bg: 'bg-yellow-50 border-yellow-200', icon: AlertCircle, color: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
    poor: { bg: 'bg-red-50 border-red-200', icon: XCircle, color: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  }

  const config = verdictConfig[feedback.verdict] || verdictConfig.average
  const Icon = config.icon

  return (
    <div className={`rounded-2xl border p-6 ${config.bg} page-enter`}>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Icon size={20} className={config.color} />
          <span className='font-semibold text-gray-900'>AI Feedback</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
            {feedback.verdict}
          </span>
          <span className='text-2xl font-bold text-gray-900'>{feedback.score}/10</span>
        </div>
      </div>

      <div className='space-y-3 mb-5'>
        <div>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            What was good
          </div>
          <p className='text-sm text-gray-700'>{feedback.whatWasGood}</p>
        </div>
        <div>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            What was missing
          </div>
          <p className='text-sm text-gray-700'>{feedback.whatWasMissing}</p>
        </div>
        <div className='bg-white bg-opacity-70 rounded-xl p-3'>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            Model answer
          </div>
          <p className='text-sm text-gray-700'>{feedback.modelAnswer}</p>
        </div>
        <div>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            💡 Tip
          </div>
          <p className='text-sm text-gray-700'>{feedback.improvementTip}</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className='w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2'
      >
        {isLast ? (
          <>
            <Trophy size={15} />
            View Results
          </>
        ) : (
          <>
            Next Question
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </div>
  )
}

// ─── Interview ────────────────────────────────────────────────────────────────
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
  }, [questions, navigate])

  useEffect(() => {
    if (isComplete) {
      navigate('/interview/result')
    }
  }, [isComplete, navigate])

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || loading) return
    const feedback = await submitAnswer(currentQuestion, answer)
    if (feedback) setCurrentFeedback(feedback)
  }, [answer, loading, currentQuestion, submitAnswer])

  const handleNext = useCallback(() => {
    setCurrentFeedback(null)
    setAnswer('')
    setTimerKey(prev => prev + 1)
  }, [])

  const handleTimeExpire = useCallback(() => {
    if (!currentFeedback && !loading) {
      handleSubmit()
    }
  }, [currentFeedback, loading, handleSubmit])

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
            <span className='text-sm text-gray-500'>
              {settings?.difficulty}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className='h-0.5 bg-gray-100'>
          <div
            className='h-0.5 bg-black transition-all duration-500'
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </nav>

      <div className='max-w-3xl mx-auto px-6 py-10 page-enter'>

        {/* Question Card */}
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
                    currentQuestion.difficulty === 'hard'
                      ? 'bg-red-100 text-red-700'
                      : currentQuestion.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
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
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Evaluating your answer...
                </>
              ) : (
                <>
                  Submit Answer
                  <ChevronRight size={16} />
                </>
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