import { useToast } from "@/context/ToastContext";
import { CheckCircle2, Divide } from "lucide-react";
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
            {hoveredPointIndex !== null && <div>hoveredPointIndex</div>}
          </div>
        </div>

        {/* smart insights */}
        <div>smart insights</div>
      </div>

      {/* Row2: Response Distribution */}
      <div>Row 2</div>

      {/* Row 3: Current status */}
      <div>row 3</div>
    </div>
  );
};

export default Analytics;
