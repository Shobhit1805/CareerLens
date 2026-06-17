import { useNavigate } from 'react-router-dom'
import { Trophy, ArrowLeft, RotateCcw, TrendingDown } from 'lucide-react'
import useAI from '../hooks/useAI'
import ScoreCircle from '../components/interview/ScoreCircle'
import TopicBreakdown from '../components/interview/TopicBreakdown'
import AnswerReviewCard from '../components/interview/AnswerReviewCard'

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
          <p className='text-gray-500 text-sm mb-6'>Complete a mock interview to see your results</p>
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

  const verdictCounts = feedbacks.reduce((acc, f) => {
    acc[f.verdict] = (acc[f.verdict] || 0) + 1
    return acc
  }, {})

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
    .filter((t) => t.avg < 5)
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
                  { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50' },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center`}>
                    <div className={`text-2xl font-bold ${item.color}`}>
                      {verdictCounts[item.label.toLowerCase()] || 0}
                    </div>
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