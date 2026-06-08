import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Signup = () => {
  const navigate = useNavigate()
  const { signup, error } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
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
    await signup(formData)
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
            Your AI career<br />co-pilot is here
          </h1>
          <p className='text-gray-500 text-lg'>
            Join thousands of job seekers who use CareerLens to land their dream jobs faster.
          </p>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          {[
            { value: '10x', label: 'Faster interview prep' },
            { value: '95%', label: 'ATS pass rate' },
            { value: '500+', label: 'Interview questions' },
            { value: '30', label: 'Day roadmap' },
          ].map((stat, i) => (
            <div key={i} className='bg-gray-50 rounded-xl p-4'>
              <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
              <div className='text-sm text-gray-500 mt-0.5'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md page-enter'>

          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>Create your account</h2>
            <p className='text-gray-500'>Start your AI-powered career journey today</p>
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
                Full Name
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Shobhit Jain'
                className='w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white'
                required
              />
            </div>

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
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Already have an account?{' '}
            <Link to='/login' className='text-black font-medium hover:underline'>
              Sign in
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Signup