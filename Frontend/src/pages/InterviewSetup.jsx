import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Trophy, ChevronRight, Loader2 } from 'lucide-react'
import useAI from '../hooks/useAI'

const InterviewSetup = () => {
  const navigate = useNavigate()
  const { result, startInterview } = useAI()

  const timeOptions = [
    { label: 'No limit', value: 0 },
    { label: '30 sec', value: 30 },
    { label: '1 min', value: 60 },
    { label: '2 min', value: 120 },
    { label: '3 min', value: 180 },
  ]

  const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Mixed']

  // Build topic options from analysis result
  const allTopics = [
    ...new Set([
      ...(result?.technicalQuestions?.map(q => q.topic) || []),
      'Behavioral',
    ])
  ]

  const [selectedTopics, setSelectedTopics] = useState(allTopics)
  const [timePerQuestion, setTimePerQuestion] = useState(0)
  const [difficulty, setDifficulty] = useState('Mixed')

  if (!result) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center page-enter'>
          <Trophy size={40} className='text-gray-300 mx-auto mb-4' />
          <h2 className='text-xl font-bold text-gray-900 mb-2'>No analysis found</h2>
          <p className='text-gray-500 text-sm mb-6'>
            Please analyze your resume first before starting an interview
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

  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  const buildQuestions = () => {
    let questions = []

    const technical = result.technicalQuestions?.filter(q => {
      if (difficulty === 'Mixed') return selectedTopics.includes(q.topic)
      return selectedTopics.includes(q.topic) && q.difficulty?.toLowerCase() === difficulty.toLowerCase()
    }) || []

    const behavioral = selectedTopics.includes('Behavioral')
      ? result.behavioralQuestions || []
      : []

    questions = [...technical, ...behavioral]

    // Shuffle questions
    return questions.sort(() => Math.random() - 0.5).slice(0, 15)
  }

  const handleStart = () => {
    const questions = buildQuestions()
    if (questions.length === 0) {
      alert('No questions found for selected topics and difficulty. Please adjust your settings.')
      return
    }
    startInterview({ timePerQuestion, difficulty }, questions)
    navigate('/interview/start')
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
          <span className='font-bold text-gray-900'>Interview Setup</span>
        </div>
      </nav>

      <div className='max-w-3xl mx-auto px-6 py-10 page-enter'>

        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>Configure your mock interview</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Customize topics, difficulty and timing to match your target role
          </p>
        </div>

        <div className='space-y-6'>

          {/* Topics */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
            <h2 className='text-sm font-semibold text-gray-900 mb-1'>Select Topics</h2>
            <p className='text-xs text-gray-400 mb-4'>
              Topics are based on your resume analysis
            </p>
            <div className='flex flex-wrap gap-2'>
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTopics.includes(topic)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <p className='text-xs text-gray-400 mt-3'>
              {selectedTopics.length} of {allTopics.length} topics selected
            </p>
          </div>

          {/* Difficulty */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
            <h2 className='text-sm font-semibold text-gray-900 mb-1'>Difficulty</h2>
            <p className='text-xs text-gray-400 mb-4'>
              Mixed includes all difficulty levels
            </p>
            <div className='grid grid-cols-4 gap-2'>
              {difficultyOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    difficulty === d
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time per question */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
            <h2 className='text-sm font-semibold text-gray-900 mb-1'>
              Time per Question
            </h2>
            <p className='text-xs text-gray-400 mb-4'>
              A countdown timer will appear for each question
            </p>
            <div className='grid grid-cols-5 gap-2'>
              {timeOptions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTimePerQuestion(t.value)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-0.5 ${
                    timePerQuestion === t.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t.value > 0 && <Clock size={12} />}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary + Start */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
            <h2 className='text-sm font-semibold text-gray-900 mb-4'>Interview Summary</h2>
            <div className='grid grid-cols-3 gap-4 mb-6'>
              <div className='bg-gray-50 rounded-xl p-3 text-center'>
                <div className='text-xl font-bold text-gray-900'>
                  {buildQuestions().length}
                </div>
                <div className='text-xs text-gray-500 mt-0.5'>Questions</div>
              </div>
              <div className='bg-gray-50 rounded-xl p-3 text-center'>
                <div className='text-xl font-bold text-gray-900'>{difficulty}</div>
                <div className='text-xs text-gray-500 mt-0.5'>Difficulty</div>
              </div>
              <div className='bg-gray-50 rounded-xl p-3 text-center'>
                <div className='text-xl font-bold text-gray-900'>
                  {timePerQuestion === 0 ? '∞' : `${timePerQuestion}s`}
                </div>
                <div className='text-xs text-gray-500 mt-0.5'>Per question</div>
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={selectedTopics.length === 0}
              className='w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              Start Interview
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default InterviewSetup