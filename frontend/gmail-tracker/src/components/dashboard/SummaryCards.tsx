import { BellRing, CheckCircle2, Clock, Mail } from "lucide-react";
import { motion } from "motion/react";

interface MetricCardProps {
  totalTracked: number;
  awaitingResponses: number;
  completedThreads: number;
  remindersDispatched: number;
}

// create array of objects for the cards

const SummaryCards = ({
  totalTracked,
  awaitingResponses,
  completedThreads,
  remindersDispatched,
}: MetricCardProps) => {
  const metrics = [
    {
      id: "total-tracked",
      title: "Total Tracked",
      value: totalTracked?.toLocaleString(),
      badge: "Active System",
      badgeType: "neutral",
      icon: Mail,
      iconBg: "bg-[#eff4ff] text-[#3525cd]",
      valueColor: "text-slate-900",
      hoverBorder: "hover:border-[#3525cd]/30",
    },
    {
      id: "awaiting-responses",
      title: "Awaiting Responses",
      value: awaitingResponses?.toLocaleString(),
      badge:
        awaitingResponses > 0
          ? `${awaitingResponses} pending`
          : totalTracked == 0
            ? "Nothing pending"
            : "All clear",
      badgeType: awaitingResponses > 0 ? "warning" : "success",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-700 border border-amber-200/50",
      valueColor: "text-slate-900",
      hoverBorder: "hover:border-amber-300",
    },
    {
      id: "completed-threads",
      title: "Completed Threads",
      value: completedThreads.toLocaleString(),
      badge:
        totalTracked > 0
          ? `${Math.round((completedThreads / Math.max(totalTracked, 1)) * 100)}% done`
          : "No completions",
      badgeType: "success",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/50",
      valueColor: "text-slate-900",
      hoverBorder: "hover:border-emerald-300",
    },
    {
      id: "reminders-dispatched",
      title: "Reminders Dispatched",
      value: remindersDispatched.toLocaleString(),
      badge:
        totalTracked === 0
          ? "None sent"
          : remindersDispatched > 0
            ? "Active Follow-ups"
            : "None sent",
      badgeType: "info",
      icon: BellRing,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-200/50",
      valueColor: "text-slate-900",
      hoverBorder: "hover:border-purple-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className={`bg-white p-6 rounded-2xl border border-slate-200/80 transition-all duration-200 shadow-2xs cursor-default ${m.hoverBorder} group relative flex flex-col justify-between`}
          >
            <div className="flex justify-between items-center mb-4 p-2">
              <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-slate-600">
                {m.title}
              </span>
              <div
                className={`p-2 rounded-xl ${m.iconBg} transition-transform duration-200 group-hover:scale-105 shrink-0`}
              >
                <Icon size={16} className="stroke-2.2" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <h3
                className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight ${m.valueColor}`}
              >
                {m.value}
              </h3>
              {m.badge && (
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    m.badgeType === "warning"
                      ? "text-amber-800 bg-amber-50 border-amber-200"
                      : m.badgeType === "succes"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : m.badgeType === "info"
                          ? "text-[#3525cd] bg-[#eff4ff] border-[#3525cd]/15"
                          : "text-slate-700 bg-slate-50 border-slate-200"
                  }`}
                >
                  {m.badge}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
