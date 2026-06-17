import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const TopicBreakdown = ({ feedbacks }) => {
  const topicScores = {}

  feedbacks.forEach((f) => {
    const topic = f.topic || 'Behavioral'
    if (!topicScores[topic]) topicScores[topic] = { total: 0, count: 0 }
    topicScores[topic].total += f.score
    topicScores[topic].count += 1
  })

  const topics = Object.entries(topicScores)
    .map(([topic, data]) => ({
      topic,
      avg: data.total / data.count,
      count: data.count,
    }))
    .sort((a, b) => b.avg - a.avg)

  return (
    <div className='space-y-3'>
      {topics.map(({ topic, avg, count }) => {
        const color = avg >= 7 ? 'bg-green-500' : avg >= 5 ? 'bg-yellow-500' : 'bg-red-500'
        const Icon = avg >= 7 ? TrendingUp : avg >= 5 ? Minus : TrendingDown
        const iconColor = avg >= 7 ? 'text-green-500' : avg >= 5 ? 'text-yellow-500' : 'text-red-500'

        return (
          <div key={topic} className='flex items-center gap-3'>
            <div className='w-28 text-xs text-gray-600 truncate flex-shrink-0'>{topic}</div>
            <div className='flex-1 bg-gray-100 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${(avg / 10) * 100}%` }}
              />
            </div>
            <div className='flex items-center gap-1 w-16 flex-shrink-0'>
              <Icon size={12} className={iconColor} />
              <span className='text-xs font-medium text-gray-700'>{avg.toFixed(1)}/10</span>
            </div>
            <span className='text-xs text-gray-400 w-16 flex-shrink-0'>{count} qs</span>
          </div>
        )
      })}
    </div>
  )
}

export default TopicBreakdown