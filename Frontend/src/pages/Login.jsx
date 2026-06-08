import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { login, error } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await login(formData)
    setIsSubmitting(false)
    navigate('/dashboard')
  }

  return (
    <div className='min-h-screen bg-gray-50 flex'>

      {/* Left Panel */}
      <div className='hidden lg:flex lg:w-1/2 bg-white border-r border-gray-100 flex-col justify-between p-12'>
        <div>
          <div className='flex items-center gap-2 mb-16'>
            <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>C</span>
            </div>
            <span className='text-xl font-bold text-gray-900'>CareerLens</span>
          </div>
          <h1 className='text-4xl font-bold text-gray-900 leading-tight mb-4'>
            Land your dream job<br />with AI precision
          </h1>
          <p className='text-gray-500 text-lg'>
            Analyze your resume, prepare for interviews, and get an ATS-optimized resume — all in one place.
          </p>
        </div>

        <div className='space-y-4'>
          {[
            'AI-powered resume analysis',
            'Mock interview with real-time feedback',
            'ATS-optimized resume generation',
            'Personalized 30-day roadmap',
          ].map((feature, i) => (
            <div key={i} className='flex items-center gap-3'>
              <div className='w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0'>
                <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <span className='text-gray-600 text-sm'>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md page-enter'>

          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>Welcome back</h2>
            <p className='text-gray-500'>Sign in to your CareerLens account</p>
          </div>

          {error && (
            <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm'>
              <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Email
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='you@example.com'
                className='w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  className='w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-black font-medium hover:underline'>
              Sign up free
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login