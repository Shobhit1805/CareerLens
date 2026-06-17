import { useEffect, useState } from 'react'

const Timer = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    setTimeLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (seconds === 0) return
    if (timeLeft <= 0) {
      onExpire()
      return
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, seconds, onExpire])

  if (seconds === 0) return null

  const percentage = (timeLeft / seconds) * 100
  const isWarning = timeLeft <= seconds * 0.3
  const color = isWarning ? 'text-red-500' : 'text-gray-700'
  const ringColor = isWarning ? 'stroke-red-500' : 'stroke-black'

  return (
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
  )
}

export default Timer