import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut, Upload, FileText, ChevronRight,
  Download, Trophy, Target, BookOpen,
  MessageSquare, X, Send, Loader2,
  TrendingUp, AlertCircle, CheckCircle2,
  Calendar, Sparkles
} from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useAI from '../hooks/useAI'

// ─── Chat Panel ───────────────────────────────────────────────────────────────
const ChatPanel = ({ onClose }) => {
  const { sendChatMessage } = useAI()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your CareerLens AI. I have full context of your resume and job description. Ask me anything — interview tips, skill advice, resume improvements, or career guidance!'
    }
  ])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || chatLoading) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setChatLoading(true)

    const reply = await sendChatMessage(
      updatedMessages.map(m => ({ role: m.role, content: m.content }))
    )

    if (reply) {
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    }
    setChatLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-100 shadow-2xl flex flex-col z-50'>
      {/* Header */}
      <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 bg-black rounded-lg flex items-center justify-center'>
            <Sparkles size={14} className='text-white' />
          </div>
          <div>
            <div className='text-sm font-semibold text-gray-900'>CareerLens AI</div>
            <div className='text-xs text-green-500 flex items-center gap-1'>
              <div className='w-1.5 h-1.5 bg-green-500 rounded-full' />
              Online
            </div>
          </div>
        </div>
        <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-black text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className='flex justify-start'>
            <div className='bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm'>
              <div className='flex gap-1'>
                <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className='px-4 py-3 border-t border-gray-100'>
        <div className='flex items-end gap-2 bg-gray-50 rounded-xl px-3 py-2'>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask anything about your career...'
            className='flex-1 bg-transparent text-sm text-gray-800 resize-none focus:outline-none max-h-24 min-h-[20px]'
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || chatLoading}
            className='text-black disabled:text-gray-300 transition-colors flex-shrink-0'
          >
            <Send size={16} />
          </button>
        </div>
        <p className='text-xs text-gray-400 text-center mt-2'>Press Enter to send</p>
      </div>
    </div>
  )
}

// ─── Match Score Card ─────────────────────────────────────────────────────────
const MatchScoreCard = ({ score, summary }) => {
  const color = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'
  const bg = score >= 70 ? 'bg-green-50 border-green-200' : score >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
  const bar = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <div className='flex items-center justify-between mb-3'>
        <div>
          <div className='text-sm font-medium text-gray-600'>Resume Match Score</div>
          <div className={`text-4xl font-bold mt-0.5 ${color}`}>{score}%</div>
        </div>
        <div className={`w-14 h-14 rounded-full border-4 ${bar.replace('bg-', 'border-')} flex items-center justify-center`}>
          <Target size={20} className={color} />
        </div>
      </div>
      <div className='w-full bg-white rounded-full h-1.5 mb-3'>
        <div
          className={`h-1.5 rounded-full transition-all duration-1000 ${bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className='text-sm text-gray-600'>{summary}</p>
    </div>
  )
}

// ─── Skill Gap Card ───────────────────────────────────────────────────────────
const SkillGapCard = ({ gap }) => {
  const importanceConfig = {
    high: { bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    medium: { bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    low: { bg: 'bg-green-50', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  }
  const config = importanceConfig[gap.importance] || importanceConfig.medium

  return (
    <div className={`rounded-xl p-4 ${config.bg}`}>
      <div className='flex items-start justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <div className={`w-2 h-2 rounded-full mt-1 ${config.dot}`} />
          <span className='font-semibold text-gray-900 text-sm'>{gap.skill}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
          {gap.importance}
        </span>
      </div>
      <p className='text-xs text-gray-600 ml-4 mb-2'>{gap.description}</p>
      {gap.howToLearn && (
        <div className='ml-4 flex items-start gap-1.5'>
          <BookOpen size={11} className='text-gray-400 mt-0.5 flex-shrink-0' />
          <p className='text-xs text-gray-500'>{gap.howToLearn}</p>
        </div>
      )}
    </div>
  )
}

// ─── Question Card ────────────────────────────────────────────────────────────
const QuestionCard = ({ q, type }) => {
  const diffConfig = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <div className='bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all'>
      <div className='flex items-start justify-between gap-3 mb-2'>
        <p className='text-sm text-gray-800 font-medium leading-relaxed'>{q.question}</p>
        {q.difficulty && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${diffConfig[q.difficulty]}`}>
            {q.difficulty}
          </span>
        )}
      </div>
      <div className='flex items-center gap-3 mt-2'>
        {q.topic && (
          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>
            {q.topic}
          </span>
        )}
        {q.category && (
          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>
            {q.category}
          </span>
        )}
      </div>
      {q.whyAsked && (
        <p className='text-xs text-gray-400 mt-2 italic'>{q.whyAsked}</p>
      )}
      {q.tip && (
        <p className='text-xs text-blue-600 mt-2'>💡 {q.tip}</p>
      )}
    </div>
  )
}

// ─── Roadmap Card ─────────────────────────────────────────────────────────────
const RoadmapCard = ({ week }) => (
  <div className='bg-white border border-gray-100 rounded-xl p-4'>
    <div className='flex items-center gap-2 mb-3'>
      <div className='w-7 h-7 bg-black rounded-lg flex items-center justify-center'>
        <Calendar size={13} className='text-white' />
      </div>
      <div>
        <div className='text-xs text-gray-400'>{week.week}</div>
        <div className='text-sm font-semibold text-gray-900'>{week.focus}</div>
      </div>
    </div>
    <ul className='space-y-1.5'>
      {week.tasks.map((task, i) => (
        <li key={i} className='flex items-start gap-2 text-xs text-gray-600'>
          <CheckCircle2 size={12} className='text-gray-400 mt-0.5 flex-shrink-0' />
          {task}
        </li>
      ))}
    </ul>
  </div>
)

// ─── Strength Card ────────────────────────────────────────────────────────────
const StrengthCard = ({ strength }) => (
  <div className='bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all'>
    <div className='flex items-center gap-2 mb-1.5'>
      <CheckCircle2 size={15} className='text-green-500' />
      <span className='text-sm font-semibold text-gray-900'>{strength.area}</span>
    </div>
    <p className='text-xs text-gray-500 ml-5'>{strength.description}</p>
  </div>
)

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { result, loading, error, analyzeResume, downloadResume } = useAI()

  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [activeTab, setActiveTab] = useState('skillGaps')
  const [showChat, setShowChat] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resumeFile || !jobDescription) return
    await analyzeResume(resumeFile, jobDescription)
    setActiveTab('skillGaps')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
    }
  }

  const tabs = [
    { id: 'skillGaps', label: 'Skill Gaps', icon: AlertCircle },
    { id: 'strengths', label: 'Strengths', icon: CheckCircle2 },
    { id: 'technical', label: 'Technical', icon: FileText },
    { id: 'behavioral', label: 'Behavioral', icon: MessageSquare },
    { id: 'roadmap', label: '30-Day Plan', icon: TrendingUp },
  ]

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Navbar */}
      <nav className='bg-white border-b border-gray-100 sticky top-0 z-40'>
        <div className='max-w-6xl mx-auto px-6 h-14 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 bg-black rounded-lg flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>C</span>
            </div>
            <span className='font-bold text-gray-900'>CareerLens</span>
          </div>
          <div className='flex items-center gap-4'>
            {result && (
              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  showChat
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare size={15} />
                AI Chat
              </button>
            )}
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center'>
                <span className='text-xs font-medium text-gray-600'>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className='text-sm text-gray-600 hidden sm:block'>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors'
            >
              <LogOut size={15} />
              <span className='hidden sm:block'>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`transition-all duration-300 ${showChat ? 'mr-96' : ''}`}>
        <div className='max-w-4xl mx-auto px-6 py-10'>

          {/* Upload Section */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 page-enter'>
            <div className='p-6 border-b border-gray-50'>
              <h1 className='text-xl font-bold text-gray-900'>Analyze Your Resume</h1>
              <p className='text-sm text-gray-500 mt-0.5'>
                Upload your resume and paste a job description to get AI-powered insights
              </p>
            </div>

            <div className='p-6'>
              {error && (
                <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm'>
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                  {/* File Upload */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                      Resume (PDF)
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-black bg-gray-50'
                          : resumeFile
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => document.getElementById('resumeInput').click()}
                    >
                      <input
                        id='resumeInput'
                        type='file'
                        accept='.pdf'
                        className='hidden'
                        onChange={(e) => setResumeFile(e.target.files[0])}
                      />
                      {resumeFile ? (
                        <>
                          <CheckCircle2 size={24} className='text-green-500 mx-auto mb-2' />
                          <p className='text-sm font-medium text-green-700'>{resumeFile.name}</p>
                          <p className='text-xs text-green-500 mt-0.5'>Click to change</p>
                        </>
                      ) : (
                        <>
                          <Upload size={24} className='text-gray-400 mx-auto mb-2' />
                          <p className='text-sm text-gray-600'>
                            Drop your PDF here or <span className='text-black font-medium'>browse</span>
                          </p>
                          <p className='text-xs text-gray-400 mt-0.5'>Max 5MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                      Job Description
                    </label>
                    <textarea
                      className='w-full h-36 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white resize-none'
                      placeholder='Paste the job description here...'
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      required
                    />
                  </div>

                </div>

                <button
                  type='submit'
                  disabled={loading || !resumeFile || !jobDescription}
                  className='w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className='animate-spin' />
                      Analyzing your resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Analyze Resume
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className='space-y-6 page-enter'>

              {/* Match Score + Actions Row */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='md:col-span-2'>
                  <MatchScoreCard
                    score={result.matchScore}
                    summary={result.matchSummary}
                  />
                </div>
                <div className='flex flex-col gap-3'>
                  <button
                    onClick={() => downloadResume(result.atsResume)}
                    disabled={loading}
                    className='flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex-1'
                  >
                    <Download size={15} />
                    Download ATS Resume
                  </button>
                  <button
                    onClick={() => navigate('/interview')}
                    className='flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex-1'
                  >
                    <Trophy size={15} />
                    Start Mock Interview
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm'>
                <div className='flex overflow-x-auto border-b border-gray-100 px-2'>
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                          activeTab === tab.id
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon size={14} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                <div className='p-5'>

                  {/* Skill Gaps */}
                  {activeTab === 'skillGaps' && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {result.skillGaps?.map((gap, i) => (
                        <SkillGapCard key={i} gap={gap} />
                      ))}
                    </div>
                  )}

                  {/* Strengths */}
                  {activeTab === 'strengths' && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {result.strengths?.map((strength, i) => (
                        <StrengthCard key={i} strength={strength} />
                      ))}
                    </div>
                  )}

                  {/* Technical Questions */}
                  {activeTab === 'technical' && (
                    <div className='space-y-3'>
                      {result.technicalQuestions?.map((q, i) => (
                        <QuestionCard key={i} q={q} type='technical' />
                      ))}
                    </div>
                  )}

                  {/* Behavioral Questions */}
                  {activeTab === 'behavioral' && (
                    <div className='space-y-3'>
                      {result.behavioralQuestions?.map((q, i) => (
                        <QuestionCard key={i} q={q} type='behavioral' />
                      ))}
                    </div>
                  )}

                  {/* 30 Day Roadmap */}
                  {activeTab === 'roadmap' && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {result.thirtyDayRoadmap?.map((week, i) => (
                        <RoadmapCard key={i} week={week} />
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Chat Panel */}
      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}

    </div>
  )
}

export default Dashboard