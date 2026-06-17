const diffConfig = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

const QuestionCard = ({ q }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm text-gray-800 font-medium leading-relaxed">
          {q.question}
        </p>
        {q.difficulty && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${diffConfig[q.difficulty]}`}
          >
            {q.difficulty}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mt-2">
        {q.topic && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {q.topic}
          </span>
        )}
        {q.category && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {q.category}
          </span>
        )}
      </div>
      {q.whyAsked && (
        <p className="text-xs text-gray-400 mt-2 italic">{q.whyAsked}</p>
      )}
      {q.tip && <p className="text-xs text-blue-600 mt-2">💡 {q.tip}</p>}
    </div>
  );
};

export default QuestionCard;
