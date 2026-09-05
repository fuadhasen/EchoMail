import { CheckCircle2 } from "lucide-react";

const Recipients = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border border-[#c7c4d8]/30 rounded-2xl shadow-xs">
      <div className="p-3 bg-[#eff4ff] text-[#3525cd] rounded-2xl mb-4">
        <CheckCircle2 size={32} className="stroke-[1.5]" />
      </div>
      <h3 className="font-sans text-lg font-bold text-[#0b1c30] mb-2">
        TrackedEmail Section
      </h3>
      <p className="font-sans text-xs text-[#777587] max-w-sm mb-6">
        This panel is on Progress
      </p>
      <button className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 text-xs font-bold py-2.5 px-5 rounded-xl transition-all font-sans cursor-pointer">
        Back to Tracked Emails
      </button>
    </div>
  );
};

export default Recipients;
