import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";

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
        <div className="bg-red-100 h-44 items-end gap-3 px-2 relative mb-2"></div>
      </div>
    </section>
  );
};

export default AnalyticsPreview;
