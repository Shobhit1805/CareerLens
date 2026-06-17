import { FileText } from "lucide-react";

const scoreColor = (score) => {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const PastAnalyses = ({ analyses, onLoad, loading }) => {
  if (analyses.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText size={28} className="text-gray-200 mx-auto mb-2" />
        <p className="text-xs text-gray-400">No past analyses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {analyses.map((analysis) => (
        <button
          key={analysis._id}
          onClick={() => onLoad(analysis._id)}
          disabled={loading}
          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-gray-900">
              {analysis.jobTitle}
            </p>
            <span
              className={`text-xs font-bold flex-shrink-0 ${scoreColor(analysis.result?.matchScore)}`}
            >
              {analysis.result?.matchScore}%
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(analysis.createdAt)}
          </p>
        </button>
      ))}
    </div>
  );
};

export default PastAnalyses;
