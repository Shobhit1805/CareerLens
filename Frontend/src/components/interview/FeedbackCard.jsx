import { CheckCircle2, XCircle, AlertCircle, Trophy, ArrowRight } from 'lucide-react'

const verdictConfig = {
  excellent: {
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle2,
    color: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
  },
  good: {
    bg: 'bg-blue-50 border-blue-200',
    icon: CheckCircle2,
    color: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
  },
  average: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: AlertCircle,
    color: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  poor: {
    bg: 'bg-red-50 border-red-200',
    icon: XCircle,
    color: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
  },
}

const FeedbackCard = ({ feedback, onNext, isLast }) => {
  const config = verdictConfig[feedback.verdict] || verdictConfig.average
  const Icon = config.icon

  return (
    <div className={`rounded-2xl border p-6 ${config.bg} page-enter`}>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Icon size={20} className={config.color} />
          <span className='font-semibold text-gray-900'>AI Feedback</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
            {feedback.verdict}
          </span>
          <span className='text-2xl font-bold text-gray-900'>{feedback.score}/10</span>
        </div>
      </div>

      <div className='space-y-3 mb-5'>
        <div>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            What was good
          </div>
          <p className='text-sm text-gray-700'>{feedback.whatWasGood}</p>
        </div>
        <div>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            What was missing
          </div>
          <p className='text-sm text-gray-700'>{feedback.whatWasMissing}</p>
        </div>
        <div className='bg-white bg-opacity-70 rounded-xl p-3'>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            Model answer
          </div>
          <p className='text-sm text-gray-700'>{feedback.modelAnswer}</p>
        </div>
        <div>
          <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            💡 Tip
          </div>
          <p className='text-sm text-gray-700'>{feedback.improvementTip}</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className='w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2'
      >
        {isLast ? (
          <><Trophy size={15} /> View Results</>
        ) : (
          <>Next Question <ArrowRight size={15} /></>
        )}
      </button>
    </div>
  )
}

export default FeedbackCard