import { Award, HelpCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const AnalyticsPreview = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [showScoreDetail, setShowScoreDetail] = useState(false);

  const velocityData = [
    {
      day: "Mon",
      height: "h-[30%]",
      val: "4.2h",
      label: "Monday",
      colorClass: "bg-[#3525cd]/10 group-hover:bg-[#3525cd]/25",
    },
    {
      day: "Tue",
      height: "h-[45%]",
      val: "6.1h",
      label: "Tuesday",
      colorClass: "bg-[#3525cd]/15 group-hover:bg-[#3525cd]/30",
    },
    {
      day: "Wed",
      height: "h-[60%]",
      val: "8.5h",
      label: "Wednesday",
      colorClass: "bg-[#3525cd]/20 group-hover:bg-[#3525cd]/35",
    },
    {
      day: "Thu",
      height: "h-[85%]",
      val: "12.0h",
      label: "Thursday",
      colorClass: "bg-[#3525cd]/40 group-hover:bg-[#3525cd]/55",
    },
    {
      day: "Fri",
      height: "h-[70%]",
      val: "10.2h",
      label: "Friday",
      colorClass: "bg-[#3525cd] shadow-sm",
    },
    {
      day: "Sat",
      height: "h-[40%]",
      val: "5.4h",
      label: "Saturday",
      colorClass: "bg-[#3525cd]/25 group-hover:bg-[#3525cd]/40",
    },
    {
      day: "Sun",
      height: "h-[25%]",
      val: "3.1h",
      label: "Sunday",
      colorClass: "bg-[#3525cd]/10 group-hover:bg-[#3525cd]/25",
    },
  ];

  const scoreDetails = [
    {
      name: "Resolution Speed",
      score: 96,
      desc: "Average response under 8 mins",
    },
    {
      name: "Follow-up Rate",
      score: 91,
      desc: "91% thread closure within 24h",
    },
    {
      name: "SLA Compliance",
      score: 95,
      desc: "Exceeded enterprise benchmarks",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Velocity Card */}
      <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-sans text-[#0b1c30] text-base font-bold leading-tight">
              Response Velocity
            </h3>
            <span className="text-xs text-[#777587] font-sans flex items-center gap-1">
              <TrendingUp size={12} className="text-[#3525cd]" />
              Tracked hourly
            </span>
          </div>
          <p className="font-sans text-xs text-[#777587] mb-8">
            Average response intervals
          </p>
        </div>

        {/* Bar Chart */}
        <div className="flex h-44 items-end gap-3 px-2 relative mb-2">
          {velocityData.map((d, index) => (
            <div
              key={d.day}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
              className="flex-1 flex flex-col justify-end h-full group relative cursor-pointer"
            >
              <AnimatePresence>
                {hoveredBar == index && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#213145] text-[#eaf1ff] text-[10px] px-2.5 py-1.5 rounded-md shadow-md z-20 whitespace-nowrap text-center outline-none border border-[#777587]/20  font-sans"
                  >
                    <div>{d.label}</div>
                    <div>{d.val} avg</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bar Filled elements */}
              <div
                className={`w-full rounded-t transition-all duration-300 ${d.colorClass} ${d.height}`}
                style={{ transitionDelay: `${index * 15}ms` }}
              ></div>
            </div>
          ))}
        </div>

        {/* labels Bar */}
        <div className="flex justify-between mt-2 pt-2 border-t border-[#c7c4d8]/10  text-[#777587]  font-semibold text-[11px] font-sans tracking-wide">
          <span>Mon</span>
          <span>Wed</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Effciency Score Card */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        onClick={() => setShowScoreDetail(!showScoreDetail)}
        className="bg-[#3525cd] p-6 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden group shadow-lg cursor-pointer min-h-[250px]"
      >
        {/* Ambient glow decoration backdrops */}
        <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transitions-colors duration-500" />
        <div className="absolute -left-12 top-12  w-28 h-28 bg-[#4f46e5]/40 rounded blur-xl" />
      </motion.div>
    </section>
  );
};

export default AnalyticsPreview;
