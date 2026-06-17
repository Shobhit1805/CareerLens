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

export default ScoreCircle