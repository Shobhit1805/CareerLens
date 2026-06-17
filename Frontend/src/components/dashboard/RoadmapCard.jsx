import { Calendar, CheckCircle2 } from "lucide-react";

const RoadmapCard = ({ week }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
          <Calendar size={13} className="text-white" />
        </div>
        <div>
          <div className="text-xs text-gray-400">{week.week}</div>
          <div className="text-sm font-semibold text-gray-900">
            {week.focus}
          </div>
        </div>
      </div>
      <ul className="space-y-1.5">
        {week.tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
            <CheckCircle2
              size={12}
              className="text-gray-400 mt-0.5 flex-shrink-0"
            />
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoadmapCard;
