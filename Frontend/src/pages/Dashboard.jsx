import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useAI from '../hooks/useAI'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { result, loading, error, analyzeResume, downloadResume } = useAI()

  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [activeTab, setActiveTab] = useState('skillGaps')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resumeFile || !jobDescription) return
    await analyzeResume(resumeFile, jobDescription)
  }

  return (
    <div className='min-h-screen bg-base-200'>

      {/* Navbar */}
      <div className='navbar bg-base-100 shadow px-6'>
        <div className='flex-1'>
          <span className='text-xl font-bold'>CareerLens</span>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-base-content/60'>
            Hey, {user?.name} 👋
          </span>
          <button className='btn btn-sm btn-outline' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-10'>

        {/* Upload Form */}
        <div className='card bg-base-100 shadow-xl mb-10'>
          <div className='card-body'>
            <h2 className='card-title text-2xl mb-1'>Analyze Your Resume</h2>
            <p className='text-base-content/60 mb-6'>
              Upload your resume and paste the job description to get started
            </p>

            {error && (
              <div className='alert alert-error mb-4'>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Resume (PDF only)</span>
                </label>
                <input
                  type='file'
                  accept='.pdf'
                  className='file-input file-input-bordered w-full'
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  required
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Job Description</span>
                </label>
                <textarea
                  className='textarea textarea-bordered w-full h-40'
                  placeholder='Paste the job description here...'
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              <button
                type='submit'
                className='btn btn-primary w-full'
                disabled={loading}
              >
                {loading
                  ? <><span className='loading loading-spinner' /> Analyzing...</>
                  : 'Analyze Resume'
                }
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='card-title text-2xl'>Your Results</h2>
                <button
                  className='btn btn-success btn-sm'
                  onClick={() => downloadResume(result.atsResume)}
                  disabled={loading}
                >
                  {loading ? <span className='loading loading-spinner' /> : '⬇ Download ATS Resume'}
                </button>
              </div>

              {/* Tabs */}
              <div className='tabs tabs-bordered mb-6'>
                <button
                  className={`tab ${activeTab === 'skillGaps' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('skillGaps')}
                >
                  Skill Gaps
                </button>
                <button
                  className={`tab ${activeTab === 'technical' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('technical')}
                >
                  Technical Questions
                </button>
                <button
                  className={`tab ${activeTab === 'behavioral' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('behavioral')}
                >
                  Behavioral Questions
                </button>
              </div>

              {/* Skill Gaps Tab */}
              {activeTab === 'skillGaps' && (
                <div className='flex flex-col gap-4'>
                  {result.skillGaps.map((gap, index) => (
                    <div key={index} className='card bg-base-200'>
                      <div className='card-body py-4'>
                        <div className='flex items-center justify-between'>
                          <h3 className='font-bold text-lg'>{gap.skill}</h3>
                          <span className={`badge ${
                            gap.importance === 'high'
                              ? 'badge-error'
                              : gap.importance === 'medium'
                              ? 'badge-warning'
                              : 'badge-success'
                          }`}>
                            {gap.importance}
                          </span>
                        </div>
                        <p className='text-base-content/70'>{gap.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Questions Tab */}
              {activeTab === 'technical' && (
                <div className='flex flex-col gap-4'>
                  {result.technicalQuestions.map((q, index) => (
                    <div key={index} className='card bg-base-200'>
                      <div className='card-body py-4'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='badge badge-outline'>{q.topic}</span>
                          <span className={`badge ${
                            q.difficulty === 'hard'
                              ? 'badge-error'
                              : q.difficulty === 'medium'
                              ? 'badge-warning'
                              : 'badge-success'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className='font-medium'>{q.question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Behavioral Questions Tab */}
              {activeTab === 'behavioral' && (
                <div className='flex flex-col gap-4'>
                  {result.behavioralQuestions.map((q, index) => (
                    <div key={index} className='card bg-base-200'>
                      <div className='card-body py-4'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='badge badge-outline'>{q.category}</span>
                        </div>
                        <p className='font-medium'>{q.question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard