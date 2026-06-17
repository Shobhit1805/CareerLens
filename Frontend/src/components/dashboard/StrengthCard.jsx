import { CheckCircle2 } from "lucide-react";

const StrengthCard = ({ strength }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
      <div className="flex items-center gap-2 mb-1.5">
        <CheckCircle2 size={15} className="text-green-500" />
        <span className="text-sm font-semibold text-gray-900">
          {strength.area}
        </span>
      </div>
      <p className="text-xs text-gray-500 ml-5">{strength.description}</p>
    </div>
  );
};

export default StrengthCard;
