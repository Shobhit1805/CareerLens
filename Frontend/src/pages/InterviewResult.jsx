import { useNavigate } from 'react-router-dom'
import {
  Trophy, ArrowLeft, CheckCircle2,
  XCircle, AlertCircle, RotateCcw,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react'
import useAI from '../hooks/useAI'

// ─── Score Circle ─────────────────────────────────────────────────────────────
const ScoreCircle = ({ score }) => {
  const percentage = (score / 10) * 100
  const color = score >= 7 ? '#22c55e' : score >= 5 ? '#eab308' : '#ef4444'
  const label = score >= 7 ? 'Excellent' : score >= 5 ? 'Good' : 'Needs Work'

  return (
    <div className='flex flex-col items-center'>
      <div className='relative w-32 h-32'>
        <svg className='w-32 h-32 -rotate-90' viewBox='0 0 36 36'>
          <circle cx='18' cy='18' r='15.9' fill='none' stroke='#e5e7eb' strokeWidth='2.5' />
          <circle
            cx='18' cy='18' r='15.9'
            fill='none'
            stroke={color}
            strokeWidth='2.5'
            strokeDasharray='100'
            strokeDashoffset={100 - percentage}
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-3xl font-bold text-gray-900'>{score.toFixed(1)}</span>
          <span className='text-xs text-gray-400'>out of 10</span>
        </div>
      </div>
      <span className='mt-2 text-sm font-semibold' style={{ color }}>{label}</span>
    </div>
  )
}

// ─── Topic Breakdown ──────────────────────────────────────────────────────────
const TopicBreakdown = ({ feedbacks }) => {
  const topicScores = {}

  feedbacks.forEach(f => {
    const topic = f.topic || 'Behavioral'
    if (!topicScores[topic]) {
      topicScores[topic] = { total: 0, count: 0 }
    }
    topicScores[topic].total += f.score
    topicScores[topic].count += 1
  })

  const topics = Object.entries(topicScores).map(([topic, data]) => ({
    topic,
    avg: data.total / data.count,
    count: data.count,
  })).sort((a, b) => b.avg - a.avg)

  return (
    <div className='space-y-3'>
      {topics.map(({ topic, avg, count }) => {
        const color = avg >= 7 ? 'bg-green-500' : avg >= 5 ? 'bg-yellow-500' : 'bg-red-500'
        const Icon = avg >= 7 ? TrendingUp : avg >= 5 ? Minus : TrendingDown
        const iconColor = avg >= 7 ? 'text-green-500' : avg >= 5 ? 'text-yellow-500' : 'text-red-500'

        return (
          <div key={topic} className='flex items-center gap-3'>
            <div className='w-28 text-xs text-gray-600 truncate flex-shrink-0'>{topic}</div>
            <div className='flex-1 bg-gray-100 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${(avg / 10) * 100}%` }}
              />
            </div>
            <div className='flex items-center gap-1 w-16 flex-shrink-0'>
              <Icon size={12} className={iconColor} />
              <span className='text-xs font-medium text-gray-700'>{avg.toFixed(1)}/10</span>
            </div>
            <span className='text-xs text-gray-400 w-16 flex-shrink-0'>{count} qs</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Answer Review Card ───────────────────────────────────────────────────────
const AnswerReviewCard = ({ feedback, index }) => {
  const verdictConfig = {
    excellent: { bg: 'bg-green-50 border-green-100', icon: CheckCircle2, color: 'text-green-600' },
    good: { bg: 'bg-blue-50 border-blue-100', icon: CheckCircle2, color: 'text-blue-600' },
    average: { bg: 'bg-yellow-50 border-yellow-100', icon: AlertCircle, color: 'text-yellow-600' },
    poor: { bg: 'bg-red-50 border-red-100', icon: XCircle, color: 'text-red-600' },
  }

  const config = verdictConfig[feedback.verdict] || verdictConfig.average
  const Icon = config.icon

  return (
    <div className={`rounded-xl border p-4 ${config.bg}`}>
      <div className='flex items-start justify-between gap-3 mb-3'>
        <div className='flex items-start gap-2'>
          <span className='text-xs text-gray-400 mt-0.5 flex-shrink-0'>Q{index + 1}.</span>
          <p className='text-sm font-medium text-gray-900'>{feedback.question}</p>
        </div>
        <div className='flex items-center gap-1.5 flex-shrink-0'>
          <Icon size={14} className={config.color} />
          <span className='text-sm font-bold text-gray-900'>{feedback.score}/10</span>
        </div>
      </div>

      <div className='ml-5 space-y-2'>
        <div className='bg-white bg-opacity-70 rounded-lg p-2.5'>
          <div className='text-xs text-gray-400 mb-0.5'>Your answer</div>
          <p className='text-xs text-gray-600'>{feedback.answer}</p>
        </div>
        <div className='text-xs text-gray-600'>
          <span className='font-medium'>Missing: </span>
          {feedback.whatWasMissing}
        </div>
        <div className='text-xs text-blue-600'>
          💡 {feedback.improvementTip}
        </div>
      </div>
    </div>
  )
}

// ─── Interview Result ─────────────────────────────────────────────────────────
const InterviewResult = () => {
  const navigate = useNavigate()
  const { interview, clearInterview } = useAI()
  const { feedbacks } = interview

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center page-enter'>
          <Trophy size={40} className='text-gray-300 mx-auto mb-4' />
          <h2 className='text-xl font-bold text-gray-900 mb-2'>No results found</h2>
          <p className='text-gray-500 text-sm mb-6'>
            Complete a mock interview to see your results
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className='bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors'
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const overallScore = feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length
  const excellentCount = feedbacks.filter(f => f.verdict === 'excellent').length
  const goodCount = feedbacks.filter(f => f.verdict === 'good').length
  const averageCount = feedbacks.filter(f => f.verdict === 'average').length
  const poorCount = feedbacks.filter(f => f.verdict === 'poor').length

  const weakTopics = Object.entries(
    feedbacks.reduce((acc, f) => {
      const topic = f.topic || 'Behavioral'
      if (!acc[topic]) acc[topic] = { total: 0, count: 0 }
      acc[topic].total += f.score
      acc[topic].count += 1
      return acc
    }, {})
  )
    .map(([topic, data]) => ({ topic, avg: data.total / data.count }))
    .filter(t => t.avg < 5)
    .sort((a, b) => a.avg - b.avg)

  const handleRetry = () => {
    clearInterview()
    navigate('/interview')
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Navbar */}
      <nav className='bg-white border-b border-gray-100 sticky top-0 z-40'>
        <div className='max-w-3xl mx-auto px-6 h-14 flex items-center gap-4'>
          <button
            onClick={() => navigate('/dashboard')}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <ArrowLeft size={18} />
          </button>
          <span className='font-bold text-gray-900'>Interview Results</span>
        </div>
      </nav>

      <div className='max-w-3xl mx-auto px-6 py-10 page-enter space-y-6'>

        {/* Score Card */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <ScoreCircle score={overallScore} />
            <div className='flex-1 w-full'>
              <h2 className='text-lg font-bold text-gray-900 mb-4'>Overall Performance</h2>
              <div className='grid grid-cols-4 gap-3'>
                {[
                  { label: 'Excellent', count: excellentCount, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Good', count: goodCount, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Average', count: averageCount, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { label: 'Poor', count: poorCount, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                    <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                    <div className='text-xs text-gray-500 mt-0.5'>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <h2 className='text-sm font-bold text-gray-900 mb-4'>Topic Breakdown</h2>
          <TopicBreakdown feedbacks={feedbacks} />
        </div>

        {/* Weak Areas */}
        {weakTopics.length > 0 && (
          <div className='bg-red-50 border border-red-100 rounded-2xl p-6'>
            <h2 className='text-sm font-bold text-gray-900 mb-3 flex items-center gap-2'>
              <TrendingDown size={16} className='text-red-500' />
              Areas that need improvement
            </h2>
            <div className='space-y-2'>
              {weakTopics.map(({ topic, avg }) => (
                <div key={topic} className='flex items-center justify-between'>
                  <span className='text-sm text-gray-700'>{topic}</span>
                  <span className='text-sm font-medium text-red-600'>{avg.toFixed(1)}/10</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Review */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
          <h2 className='text-sm font-bold text-gray-900 mb-4'>Answer Review</h2>
          <div className='space-y-3'>
            {feedbacks.map((feedback, i) => (
              <AnswerReviewCard key={i} feedback={feedback} index={i} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className='grid grid-cols-2 gap-3 pb-6'>
          <button
            onClick={handleRetry}
            className='flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all'
          >
            <RotateCcw size={15} />
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className='flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors'
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  )
}

export default InterviewResult