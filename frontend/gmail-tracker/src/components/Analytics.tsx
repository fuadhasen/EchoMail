import { useToast } from "@/context/ToastContext";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Divide,
  Download,
  HelpCircle,
  Lightbulb,
  Loader2,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";

interface DataPoint {
  date: string;
  tracked: number;
  completed: number;
}

interface Campaign {
  name: string;
  sent: string;
  responseRate: number;
  avgTime: string;
  status: "Active" | "Closed";
}

// Time frame dataset
const data30: DataPoint[] = [
  { date: "Jun 1", tracked: 30, completed: 20 },
  { date: "Jun 10", tracked: 45, completed: 28 },
  { date: "Jun 20", tracked: 68, completed: 42 },
  { date: "Today", tracked: 82, completed: 58 },
];

const data90: DataPoint[] = [
  { date: "Apr 1", tracked: 85, completed: 60 },
  { date: "May 1", tracked: 125, completed: 92 },
  { date: "Jun 1", tracked: 190, completed: 145 },
  { date: "Today", tracked: 245, completed: 198 },
];

const dataCustom: DataPoint[] = [
  { date: "Jan 1", tracked: 280, completed: 210 },
  { date: "Mar 1", tracked: 490, completed: 375 },
  { date: "May 1", tracked: 710, completed: 580 },
  { date: "Today", tracked: 960, completed: 810 },
];

// Campaigns Data
const allCampaigns: Campaign[] = [
  {
    name: "Q3 Product Launch Alpha",
    sent: "1,240",
    responseRate: 78,
    avgTime: "14.2h",
    status: "Active",
  },
  {
    name: "Customer NPS Survey",
    sent: "4,800",
    responseRate: 42,
    avgTime: "2.4d",
    status: "Closed",
  },
  {
    name: "User Interviews - Tier 1",
    sent: "150",
    responseRate: 92,
    avgTime: "4.8h",
    status: "Active",
  },
  {
    name: "Developer Beta Feedback",
    sent: "680",
    responseRate: 84,
    avgTime: "8.6h",
    status: "Active",
  },
  {
    name: "Partner Integration Check",
    sent: "320",
    responseRate: 65,
    avgTime: "1.1d",
    status: "Closed",
  },
];

const Analytics = () => {
  const { triggerToast } = useToast();
  const [timeFrame, setTimeFrame] = useState<"30_days" | "90_days" | "custom">(
    "30_days",
  );
  const [hoveredPointIndex, setHoverPointIndex] = useState<number | null>(null);
  const [campaignListExpanded, setCampaignListExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // active dataset
  const activeData =
    timeFrame === "30_days"
      ? data30
      : timeFrame === "90_days"
        ? data90
        : dataCustom;

  // Max value calculation for custom SVG charting
  const maxTracked = Math.max(...activeData.map((d) => d.tracked));
  const chartMax = maxTracked <= 100 ? 100 : maxTracked <= 300 ? 300 : 1000;

  // Chart dimension
  const width = 800;
  const height = 250;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // SVG coordinate generation
  const points = activeData.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (activeData.length - 1);
    const yTracked =
      height - paddingBottom - (d.tracked / chartMax) * chartHeight;
    const yCompleted =
      height - paddingBottom - (d.completed / chartMax) * chartHeight;
    return {
      ...d,
      x,
      yTracked,
      yCompleted,
    };
  });

  // Polyline path builders
  const dTracked = points
    .map((p, i) =>
      i === 0 ? `M ${p.x} ${p.yTracked}` : `L ${p.x} ${p.yTracked}`,
    )
    .join(" ");
  const dCompleted = points
    .map((p, i) =>
      i === 0 ? `M ${p.x} ${p.yCompleted}` : `L ${p.x} ${p.yCompleted}`,
    )
    .join(" ");

  // Area fill builders
  const dTrackedArea = `${dTracked} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  const dCompletedArea = `${dCompleted} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  // Grid levels (0%, 33%, 66%, 100%)
  const gridLevels = [0, 0.33, 0.66, 1];

  // Download simulation
  const handleDownloadReport = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      triggerToast("Intelligence report downloaded as PDF.", "success");
    }, 1000);
  };

  // Smart Insights based on Active Time frames
  const getSmartInsights = () => {
    if (timeFrame === "30_days") {
      return [
        {
          text: 'Emails sent on <span class="font-bold text-white">Tuesdays</span> have a 15% faster response rate.',
        },
        {
          text: 'Reminders sent <span class="font-bold text-white">24h before</span> deadline are 2x more effective.',
        },
        {
          text: 'Response velocity has increased by <span class="font-bold text-white">12%</span> this month.',
        },
      ];
    } else if (timeFrame === "90_days") {
      return [
        {
          text: 'Short emails with <span class="font-bold text-white">&lt; 3 action items</span> get replied 40% quicker.',
        },
        {
          text: 'Automated reminders at <span class="font-bold text-white">9:00 AM</span> increase conversion by 22%.',
        },
        {
          text: 'SLA breach rates dropped by <span class="font-bold text-white">18%</span> quarter-over-quarter.',
        },
      ];
    } else {
      return [
        {
          text: 'Conversion rate peaks after the <span class="font-bold text-white">first follow-up</span> (54% average).',
        },
        {
          text: 'Overall workspace response average stabilized at <span class="font-bold text-white">14.2 hours</span>.',
        },
        {
          text: 'Abandoned communications reduced by <span class="font-bold text-white">5%</span> this quarter.',
        },
      ];
    }
  };

  // Circular donut calculation
  const r = 50;
  const strokeWidth = 10;
  const circ = 2 * Math.PI * r;
  const onTimePercentage = 65;
  const latePercentage = 20;
  const abandonedPercentage = 15;

  const strokeOnTime = (onTimePercentage / 100) * circ;
  const strokeLate = (latePercentage / 100) * circ;
  const strokeAbandoned = (abandonedPercentage / 100) * circ;

  return (
    <div className=" w-full text-left space-y-6 md:space-y-8">
      {/* Top page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-bold text-[#0b1c30] tracking-tight">
            Analytics
          </h1>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            Real-time performance tracking and behavioral insights.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl self-start md:self-auto border border-zinc-200/40">
          <button
            type="button"
            onClick={() => {
              setTimeFrame("30_days");
              triggerToast("Last 30 Days view selected.", "info");
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer focus:outline-none ${
              timeFrame === "30_days"
                ? "bg-white text-[#3525cd] shadow-xs font-bold"
                : "text-zinc-500 hover:text-zinc-600"
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => {
              setTimeFrame("90_days");
              triggerToast("Last 90 Days view selected.", "info");
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer focus:outline-none ${
              timeFrame === "90_days"
                ? "bg-white text-[#3525cd] shadow-xs font-bold"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Last 90 Days
          </button>
          <button
            type="button"
            onClick={() => {
              setTimeFrame("custom");
              triggerToast("Custom view selected.", "info");
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer focus:outline-none ${
              timeFrame === "custom"
                ? "bg-white text-[#3525cd] shadow-xs font-bold"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Row 1: Performance Trends (2/3) width & smart insights (1/3) width */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Performance trends line charts */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/50 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between min-h-85">
          <div>
            <div className="flex items-center justify-between gap-4 mb-1">
              <div>
                <h3 className="font-sans text-base font-bold text-[#0b1c30] tracking-tight">
                  Performance Trends
                </h3>
                <p className="font-sans text-xs text-zinc-400 mt-0.5">
                  Email Tracked vs Completed responses
                </p>
              </div>

              {/* Legends */}
              <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-500 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd]" />
                  <span>Tracked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="flex items-center gap-1.5">Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* svg area-line */}
          <div className="relative w-full h-56 mt-4">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#3525cd" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {gridLevels.map((lvl, idx) => {
                const y = paddingTop + lvl * chartHeight;
                const labelVal = Math.round(chartMax - lvl * chartMax);
                return (
                  <g key={idx} className="opacity-70">
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.2"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      className="font-mono text-[9px] fill-zinc-400 font-semibold"
                    >
                      {labelVal}
                    </text>
                  </g>
                );
              })}

              {/* area fills */}
              <path d={dTrackedArea} fill="url(#tracked-gradient)" />
              <path d={dCompletedArea} fill="url(#completed-gradient)" />

              {/* line strokes */}
              <path
                d={dTracked}
                fill="none"
                stroke="#3525cd"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={dCompleted}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* active node highlight */}
              {hoveredPointIndex !== null && (
                <g>
                  {/* Vertical Hover Sync Line */}
                  <line
                    x1={points[hoveredPointIndex].x}
                    y1={paddingTop}
                    x2={points[hoveredPointIndex].x}
                    y2={height - paddingBottom}
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Rings */}
                  <circle
                    cx={points[hoveredPointIndex].x}
                    cy={points[hoveredPointIndex].yTracked}
                    r="6"
                    fill="#3525cd"
                    fillOpacity="0.15"
                  />
                  <circle
                    cx={points[hoveredPointIndex].x}
                    cy={points[hoveredPointIndex].yCompleted}
                    r="6"
                    fill="#06b6d4"
                    fillOpacity="0.15"
                  />
                  {/* Solids */}
                  <circle
                    cx={points[hoveredPointIndex].x}
                    cy={points[hoveredPointIndex].yTracked}
                    r="3.5"
                    fill="#3525cd"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={points[hoveredPointIndex].x}
                    cy={points[hoveredPointIndex].yCompleted}
                    r="3.5"
                    fill="#06b6d4"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Dates X-Axis Labels */}
              {points.map((p, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={height - 10}
                  textAnchor="middle"
                  className="font-sans text-[10px] fill-zinc-400 font-bold"
                >
                  {p.date}
                </text>
              ))}

              {/* Hitbox Overlays */}
              {points.map((p, i) => (
                <rect
                  key={i}
                  x={p.x - chartWidth / (points.length - 1) / 2}
                  y={paddingTop}
                  width={chartWidth / (points.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverPointIndex(i)}
                  onMouseLeave={() => setHoverPointIndex(null)}
                />
              ))}
            </svg>

            {/* floating tooltip html popup */}
            {hoveredPointIndex === 0 && (
              <div
                className="absolute bg-zinc-950 border border-zinc-800 text-white rounded-xl p-3 shadow-lg pointer-events-none flex flex-col gap-1 z-30 animate-in fade-in zoom-in-95 duration-150"
                style={{
                  left: `${(points[hoveredPointIndex].x / width) * 100}%`,
                  top: `${Math.max(10, Math.min(points[hoveredPointIndex].yTracked, points[hoveredPointIndex].yCompleted) - 52)}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="font-sans text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  {points[hoveredPointIndex].date}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold ">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd]" />
                    <span className="text-zinc-300">Tracked:</span>
                    <span className="font-extrabold text-white">
                      {points[hoveredPointIndex].tracked}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-zinc-300">Completed:</span>
                    <span className="font-extrabold text-white">
                      {points[hoveredPointIndex].completed}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* smart insights */}
        <div className="bg-[#3525cd] p-6 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden shadow-sm group">
          <div className="absolute -right-14 -bottom-14 w-44 h-44 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />
          <div className="absolute -left-12 -top-12 w-32 h-32 bg-indigo-500/30 rounded-full blur-xl " />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Sparkles
                    size={16}
                    className="text-amber-300 fill-amber-300/10"
                  />
                </div>
                <h3 className="font-sans text-base font-bold text-white tracking-tight ">
                  Smart Insights
                </h3>
              </div>
              <HelpCircle
                size={14}
                className="opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
              />
            </div>

            {/* list of custom insights */}
            <div className="space-y-4">
              {getSmartInsights().map((insight, idx) => (
                <div className="flex gap-3 text-left">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                  <p
                    className="font-sans text-xs text-indigo-100/90 leading-relaxed font-semibold"
                    dangerouslySetInnerHTML={{ __html: insight.text }}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadReport}
            className="relative z-10 mt-6 w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 active:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            {isDownloading ? (
              <>
                <Loader2 size={13} className="animate-spin text-white" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={13} className="text-white" />
                <span>Download Full Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row2: Response Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* response distribution chart */}
        <div className="bg-white border border-zinc-200/50 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-75">
          <div>
            <h3 className="font-sans text-base font-bold text-[#0b1c30] tracking-tight">
              Response Distribution
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Time elapsed until first completed response
            </p>
          </div>

          {/* pillar row */}
          <div className="grid grid-cols-4 gap-4 h-40 mt-6 items-end">
            {[
              {
                label: "< 1 Day",
                pct: 42,
                color: "bg-[#3525cd]",
                count: "143 emails",
              },
              {
                label: "1-3 Days",
                pct: 28,
                color: "bg-[#3525cd]/80",
                count: "95 emails",
              },
              {
                label: "3-7 Days",
                pct: 15,
                color: "bg-[#3525cd]/60",
                count: "51 emails",
              },
              {
                label: "7+ Days",
                pct: 15,
                color: "bg-[#3525cd]/45",
                count: "51 emails",
              },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-full relative h-28  flex flex-col justify-end">
                  {/* floating tool tip */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 bg-zinc-950 text-white font-sans text-[9px] font-bold py-1 px-2 ">
                    {pillar.count}
                  </div>

                  {/* pillar bar track */}
                  <div className="w-full bg-zinc-50 border border-zinc-200/30 rounded-t-xl h-full flex flex-col justify-end overflow-hidden">
                    <div
                      style={{ height: `${pillar.pct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ease-out ${pillar.color}`}
                    />
                  </div>
                </div>

                <div className="text-center mt-3.5">
                  <span className="font-sans text-[11px] font-bold text-[#0b1c30]">
                    {pillar.pct}
                  </span>
                  <p className="font-sans text-[10px] text-zinc-400 font-bold mt-0.5 whitespace-nowrap">
                    {pillar.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* reminder effeciency */}
        <div className="bg-white border border-zinc-200/50 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-75">
          <div>
            <h3 className="font-sans text-base font-bold text-[#0b1c30] tracking-tight">
              Reminder Efficacy
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Conversion rate per automated follow-up
            </p>
          </div>

          <div className="space-y-4 mt-5">
            {/* 0: Reminders */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
                <span>Initial Send (0 Reminders)</span>
                <span className="text-[#0b1c30] font-bold">32% Conversion</span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3525cd]/40 rounded-full w-[32%]" />
              </div>
            </div>

            {/* 1: Reminders */}
            <div className="space-y-1.5 p-3 bg-indigo-50/50 border border-indigo-100/30 rounded-xl relative">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[#3525cd] flex items-center gap-1.5">
                  After 1 Reminder
                  <span className="text-[9px] bg-[#3525cd] text-white px-1.5 py-0.5 rounded-md font-extrabold tracking-wide uppercase">
                    Peak Efficacy
                  </span>
                </span>
                <span className="text-[#3525cd] font-black">
                  54% Conversion
                </span>
              </div>
              <div className="h-2 bg-indigo-100 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#3525cd] rounded-full w-[54%]" />
              </div>
            </div>

            {/* 2+ reminders */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
                <span>After 2+ Reminders</span>
                <span className="text-[#0b1c30] font-bold">14% Conversion</span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3525cd]/25 rounded-full w-[14%]" />
              </div>
            </div>
          </div>

          {/* tips callout */}
          <div className="mt-5 p-3 bg-amber-50/50 border border-amber-200/30 rounded-xl flex items-start gap-2.5">
            <div className="bg-amber-100 p-1 rounded-lg shrink-0 text-amber-700">
              <Lightbulb size={13} className="fill-amber-400/10" />
            </div>
            <p className="font-sans text-[11px] text-amber-800 leading-normal font-semibold">
              Most Conversion happen after the{" "}
              <strong className="font-bold">first</strong>follow-up. Keep
              automatic sequences restricted.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Current status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mg:gap-8">
        {/* circular donut */}
        <div className="bg-white border border-zinc-200/50  rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-base font-bold text-[#0b1c30] tracking-tight">
              Current status
            </h3>
            <p className="font-sans text-xs text-zinc-400 mt-0.5">
              Overall distribution of final outcomes
            </p>
          </div>

          {/* svg donut */}
          <div className="relative flex justify-center items-center h-40 my-4">
            <svg
              width="130"
              height="130"
              viewBox="0 0 120 120"
              className="transform -rotate-90"
            >
              {/* completed on time */}
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#3525cd"
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeOnTime} ${circ}`}
              />

              {/* Completed late */}
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#06b6d4"
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeLate} ${circ}`}
                strokeDashoffset={-strokeOnTime}
              />

              {/* Abandoned */}
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#fda4af"
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeAbandoned} ${circ}`}
                strokeDashoffset={-(strokeOnTime + strokeLate)}
              />
            </svg>

            <div className="absolute text-center flex flex-col items-center">
              <span className="font-sans text-2xl font-black text-[#0b1c30] tracking-tight">
                85%
              </span>
              <span className="font-sans text-[9px] text-[#777587] font-bold uppercase tracking-widest mt-0.5 leading-none">
                Success
              </span>
            </div>
          </div>

          {/* legend and list */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd] shrink-0" />
                <span>Completed on time</span>
              </div>
              <span className="font-bold text-[#0b1c30]">65%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shrink-0" />
                <span>Completed late</span>
              </div>
              <span className="font-bold text-[#0b1c30]">20%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fda4af] shrink-0" />
                <span>Abandoned</span>
              </div>
              <span className="font-bold text-[#0b1c30]">15%</span>
            </div>
          </div>
        </div>

        {/* Top performing Campaign table */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/50 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-85">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
              <h3 className="font-sans text-base font-bold text-[#0b1c30] tracking-tight">
                Top Performing Campaigns
              </h3>
              <button
                onClick={() => {
                  setCampaignListExpanded(!campaignListExpanded);
                  triggerToast(
                    campaignListExpanded
                      ? "Campaign view collapsed."
                      : "Showing all tracked campaigns",
                    "info",
                  );
                }}
                className="text-xs font-bold text-[#3525cd] hover:text-[#3525cd]/80 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <span>{campaignListExpanded ? "Show Top 3" : "View All"}</span>
                {campaignListExpanded ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>

            {/* campaign table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border border-zinc-100 text-[10px] uppercase tracking-wider text-zinc-450 font-bold">
                    <th className="py-2.5 font-sans ">Campaign Name</th>
                    <th className="py-2.5 font-sans text-right">Sent</th>
                    <th className="py-2.5 font-sans pl-6 ">Response Rate</th>
                    <th className="py-2.5 font-sans text-right">Avg Time</th>
                    <th className="py-2.5 font-sans  text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {allCampaigns
                    .slice(0, campaignListExpanded ? undefined : 3)
                    .map((camp, idx) => (
                      <tr className="group hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 font-sans text-xs font-bold text-[#0b1c30] group-hover:text-[#3525cd] transition-colors  max-w-35 truncate">
                          {camp.name}
                        </td>
                        <td className="py-3 font-mono text-xs text-right text-zinc-500 font-semibold">
                          {camp.sent}
                        </td>
                        <td>
                          <div className="py-3 pl-6 font-sans text-xs text-zinc-600">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden shrink-0">
                                <div
                                  style={{ width: `${camp.responseRate}%` }}
                                  className="h-full bg-[#3525cd] rounded-full"
                                />
                              </div>
                              <span className="font-bold text-[#0b1c30] shrink-0">
                                {camp.responseRate}%
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-xs text-right text-zinc-500 font-semibold">
                          {camp.avgTime}
                        </td>
                        <td className="py-3 text-right">
                          {camp.status === "Active" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-50 text-zinc-500 border border-zinc-200">
                              <span className="w-1 h-1 rounded-full bg-zinc-400" />
                              Closed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-4 mt-4 flex items-center justify-between text-[11px] text-zinc-400 font-semibold font-sans">
            <span>
              Showing {campaignListExpanded ? "5 of 5" : "3 of 5"} campaigns
            </span>
            <span className="text-zinc-500">Live Syncronization: 1m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
