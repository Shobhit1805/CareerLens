import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(formData)
    navigate('/dashboard')
  }

  return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center'>
      <div className='card w-full max-w-md bg-base-100 shadow-xl'>
        <div className='card-body'>

          <h1 className='text-3xl font-bold text-center mb-2'>CareerLens</h1>
          <p className='text-center text-base-content/60 mb-6'>
            Welcome back! Login to continue
          </p>

          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='you@example.com'
                className='input input-bordered w-full'
                required
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                className='input input-bordered w-full'
                required
              />
            </div>

            <button
              type='submit'
              className='btn btn-primary w-full mt-2'
              disabled={loading}
            >
              {loading ? <span className='loading loading-spinner' /> : 'Login'}
            </button>
          </form>

          <p className='text-center text-sm mt-4'>
            Don't have an account?{' '}
            <Link to='/signup' className='link link-primary'>
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login