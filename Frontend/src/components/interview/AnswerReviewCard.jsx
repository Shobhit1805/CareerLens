import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

const verdictConfig = {
  excellent: { bg: 'bg-green-50 border-green-100', icon: CheckCircle2, color: 'text-green-600' },
  good: { bg: 'bg-blue-50 border-blue-100', icon: CheckCircle2, color: 'text-blue-600' },
  average: { bg: 'bg-yellow-50 border-yellow-100', icon: AlertCircle, color: 'text-yellow-600' },
  poor: { bg: 'bg-red-50 border-red-100', icon: XCircle, color: 'text-red-600' },
}

const AnswerReviewCard = ({ feedback, index }) => {
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

export default AnswerReviewCard