import { AlertTriangle, Clock, Mail, Radio } from "lucide-react";

interface MetricCardProps {
  totalTracked: number;
  awaitingResponses: number;
  responsesReceived: number;
  needsAttention: number;
}

// create array of objects for the cards

const SummaryCards = ({
  totalTracked,
  awaitingResponses,
  responsesReceived,
  needsAttention,
}: MetricCardProps) => {
  const metrics = [
    {
      id: "total-tracked",
      title: "Total Tracked",
      value: totalTracked.toLocaleString(),
      badge: "+12%",
      badgeType: "success",
      icon: Radio,
      iconClass: "bg-[#3525cd]/5 text-[#3525cd]",
      colorClass: "text-[#0b1c30]",
      hoverBorder: "hover:border-[#3525cd]/30",
    },
    {
      id: "awaiting-responses",
      title: "Awaiting Responses",
      value: awaitingResponses.toLocaleString(),
      badge: null,
      icon: Clock,
      iconClass: "bg-[#ffb695]/10 text-[#7e3000]",
      colorClass: "text-[#0b1c30]",
      hoverBorder: "hover:border-[#7e3000]/30",
    },
    {
      id: "responses-received",
      title: "Responses Received",
      value: responsesReceived.toLocaleString(),
      badge: "89% rate",
      badgeType: "info",
      icon: Mail,
      iconClass: "bg-emerald-500/5 text-emerald-600",
      colorClass: "text-[#0b1c30]",
      hoverBorder: "hover:border-emerald-500/30",
    },
    {
      id: "needs-attention",
      title: "Needs Attention",
      value: needsAttention.toString().padStart(2, "0"),
      badge: null,
      icon: AlertTriangle,
      iconClass: "bg-[#ffdad6] text-[#ba1a1a]",
      colorClass: "text-[#ba1a1a]",
      hoverBorder: "hover:border-[#ba1a1a]/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className={`bg-white p-6 rounded-xl border border-[#c7c4d8]/30 transition-all cursor-default ${m.hoverBorder} group relative flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-2 rounded-lg ${m.iconClass} transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon size={20} className="stroke-[2.2]" />
              </div>
              {m.badge && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.badgeType === "success" ? "text-[#3525cd] bg-[#3525cd]/10 animate-pulse" : "text-emerald-600 bg-emerald-500/10"}`}
                >
                  {m.badge}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#777587] font-sans font-medium text-xs uppercase tracking-wider">
                {m.title}
              </p>
              <h3
                className={`font-sans text-3xl font-bold mt-1 ${m.colorClass} tracking-tight`}
              >
                {m.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
