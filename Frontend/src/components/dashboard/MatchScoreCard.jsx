import { Target } from "lucide-react";

const MatchScoreCard = ({ score, summary }) => {
  const color =
    score >= 70
      ? "text-green-600"
      : score >= 40
        ? "text-yellow-600"
        : "text-red-600";

  const bg =
    score >= 70
      ? "bg-green-50 border-green-200"
      : score >= 40
        ? "bg-yellow-50 border-yellow-200"
        : "bg-red-50 border-red-200";

  const bar =
    score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-gray-600">
            Resume Match Score
          </div>
          <div className={`text-4xl font-bold mt-0.5 ${color}`}>{score}%</div>
        </div>
        <div
          className={`w-14 h-14 rounded-full border-4 ${bar.replace("bg-", "border-")} flex items-center justify-center`}
        >
          <Target size={20} className={color} />
        </div>
      </div>
      <div className="w-full bg-white rounded-full h-1.5 mb-3">
        <div
          className={`h-1.5 rounded-full transition-all duration-1000 ${bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">{summary}</p>
    </div>
  );
};

export default MatchScoreCard;
