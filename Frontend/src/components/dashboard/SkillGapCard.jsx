import { BookOpen } from "lucide-react";

const importanceConfig = {
  high: {
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  medium: {
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  low: {
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
};

const SkillGapCard = ({ gap }) => {
  const config = importanceConfig[gap.importance] || importanceConfig.medium;

  return (
    <div className={`rounded-xl p-4 ${config.bg}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full mt-1 ${config.dot}`} />
          <span className="font-semibold text-gray-900 text-sm">
            {gap.skill}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}
        >
          {gap.importance}
        </span>
      </div>
      <p className="text-xs text-gray-600 ml-4 mb-2">{gap.description}</p>
      {gap.howToLearn && (
        <div className="ml-4 flex items-start gap-1.5">
          <BookOpen size={11} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500">{gap.howToLearn}</p>
        </div>
      )}
    </div>
  );
};

export default SkillGapCard;
