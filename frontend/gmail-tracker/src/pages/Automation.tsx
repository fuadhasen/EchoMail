import { useToast } from "@/context/ToastContext";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Send,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { useNavigate } from "react-router";

const activityData = [
  { day: "Mon", actions: 3, reminders: 2, responses: 1, completed: 0 },
  { day: "Tue", actions: 5, reminders: 3, responses: 1, completed: 1 },
  { day: "Wed", actions: 8, reminders: 4, responses: 3, completed: 1 },
  { day: "Thu", actions: 4, reminders: 2, responses: 1, completed: 1 },
  { day: "Fri", actions: 7, reminders: 4, responses: 2, completed: 1 },
  { day: "Sat", actions: 2, reminders: 1, responses: 0, completed: 1 },
  { day: "Sun", actions: 3, reminders: 2, responses: 1, completed: 0 },
];

const recentActivities = [
  {
    id: 1,
    title: "Response detected",
    description: "John responded to Project Proposal",
    time: "2 min ago",
    icon: <CheckCircle2 size={11} className="text-emerald-600" />,
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    title: "Reminder sent",
    description: "Reminder sent to Sarah",
    time: "18 min ago",
    icon: <Send size={11} className="text-[#3525cd]" />,
    bg: "bg-indigo-50",
  },
  {
    id: 3,
    title: "Email completed",
    description: "All required recipients responded",
    time: "1h ago",
    icon: <Zap size={11} className="text-emerald-600" />,
    bg: "bg-emerald-50",
  },
  {
    id: 4,
    title: "Response detected",
    description: "Alex replied to Vendor Agreement",
    time: "3h ago",
    icon: <CheckCircle2 size={11} className="text-emerald-600" />,
    bg: "bg-emerald-50",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-md border border-slate-800 space-y-0.5">
        <p className="font-semibold text-slate-200">
          {label}: {data.actions} actions
        </p>
        <p className="text-[10px] text-slate-400">
          {data.reminders} reminders · {data.responses} responses ·{" "}
          {data.completed} completed
        </p>
      </div>
    );
  }
};

const Automation = () => {
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastCheckText, setLastCheckText] = useState("2 min ago");

  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const toggleDetection = () => {
    const nextState = !detectionEnabled;
    setDetectionEnabled(nextState);
    triggerToast(
      nextState
        ? "Response Detection system resumed"
        : "Response Detection system paused",
      nextState ? "success" : "info",
    );
  };

  const toggleReminders = () => {
    const nextState = !remindersEnabled;
    setRemindersEnabled(nextState);
    triggerToast(
      nextState
        ? "Automatic Reminders system resumed"
        : "Automatic Reminders system paused",
      nextState ? "success" : "info",
    );
  };

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    triggerToast(
      "Evaluating EchoMail automation engine across 12 active threads...",
      "info",
    );

    setTimeout(() => {
      setIsSyncing(false);
      setLastCheckText("Just now");
      triggerToast(
        "Automation check complete! All 12 email threads evaluated. Systems optimal.",
        "success",
      );
    }, 1200);
  };

  return (
    <div className="w-full space-y-5 font-sans text-left px-4 md:px-8 py-4 ">
      <header className="w-full border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="spacey-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Automation
          </h1>
          <p className="text-sm text-slate-500 font-normal leading-relaxed mt-1">
            Echomail is working in the background for you.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-2xs transition-all ${
              detectionEnabled && remindersEnabled
                ? "bg-slate-50/90 border-slate-200 text-slate-700"
                : "bg-amber-50/90 border-amber-200/90 text-amber-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                detectionEnabled && remindersEnabled
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-slate-800 font-medium">
              {detectionEnabled && remindersEnabled
                ? "All systems operational"
                : !detectionEnabled && !remindersEnabled
                  ? "Automation paused"
                  : "Partial automation active"}
            </span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-60"
          >
            <RefreshCw
              size={13}
              className={isSyncing ? "animate-spin text-indigo-300" : ""}
            />
            <span>
              {isSyncing ? "Evaluating Engine..." : "Run Engine Check"}
            </span>
          </button>
        </div>
      </header>

      <section className="w-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5 sm:space-y-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#3525cd]">
            Engine Overview
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            How Echomail Automation Works
          </h2>
          <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-2xl">
            A continuous background workflow that monitors recipient activity,
            evaluate threads status, excute follow-ups automatically.
          </p>
        </div>

        {/* Process Visualization */}
        <div className="relative pt-1 pb-1">
          {/* horizontal line */}
          <div className="hidden md:block absolute  top-4.5 left-[10%] right-[10%] h-0.5 bg-slate-200/90 z-0" />

          <div className="grid grid-cols-1  md:grid-cols-4 gap-4 md:gap-2 relative z-10">
            {/* STEP 01 */}
            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#3525cd] text-[#3525cd]  flex items-center justify-center shrink-0 shadow-2xs transition-all group-hover:scale-105 z-10">
                <Radio size={16} strokeWidth={2.2} />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-[10px] font-mono font-extrabold tracking-wider text-[#3525cd] block">
                  01
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Response Detection
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Continuously checks tracked emails for new recipient replies.
                </p>

                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    <Clock size={10} className="text-slate-400" />
                    Every 5 min
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 02 */}
            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              <div className="md:hidden absolute  left-4.25 -top-4 h-4 w-0.5 bg-slate-200/90" />

              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center  shrink-0 shadow-2xs transition-all group-hover:border-[#3525cd] group-hover:text-[#3525cd] group-hover:scale-105 z-10">
                <Cpu size={16} strokeWidth={2.2} />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 group-hover:text-[#3525cd] transition-colors block">
                  02
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Response Evaluation
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Checks who has responded and who is still pending.
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    <Users size={10} className="text-slate-400" />
                    12 recipients monitored
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              {/* Mobile Vertical Connector Line */}
              <div className="md:hidden absolute left-4.25 -top-4 h-4 w-0.5 bg-slate-200/90" />

              {/* Node Icon */}
              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs transition-all group-hover:border-[#3525cd] group-hover:text-[#3525cd] group-hover:scale-105 z-10">
                <Workflow size={16} strokeWidth={2.2} />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 group-hover:text-[#3525cd] transition-colors block">
                  03
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Automation Decision
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Determines whether a reminder or completion action is
                  required.
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    <Zap size={10} className="text-[#3525cd]" />
                    Evaluated automatically
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 04 */}
            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              {/* Mobile Vertical Connector Line */}
              <div className="md:hidden absolute left-4.5 -top-4 h-4 w-0.5 bg-slate-200/90" />

              {/* Node Icon */}
              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs transition-all group-hover:border-[#3525cd] group-hover:text-[#3525cd] group-hover:scale-105 z-10">
                <Send size={16} strokeWidth={2.2} />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400 group-hover:text-[#3525cd] transition-colors block">
                  04
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Action
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Sends reminders or completes the tracked email when
                  appropriate.
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    <CheckCircle2 size={10} className="text-emerald-600" />
                    Automatic dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* left */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          {/* Automation status and cadence */}
          <section className="w-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Automation Status & Cadence
                </h2>
                <p className="text-[11px] text-slate-500 font-normal">
                  Real-time execution status and schedules for core engines
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] sm:text-[11px] font-semibold border border-emerald-200/70 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Engine Operational
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-lg overflow-hidden bg-white">
              {/* engine 1: response detection */}
              <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0  sm:w-5/12">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-[#3525cd] flex items-center justify-center shrink-0">
                    <Radio size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        Response Detection
                      </h3>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full border shrink-0 ${
                          detectionEnabled
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                            : "text-amber-700 bg-amber-50 border-amber-200/80"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${detectionEnabled ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                        />
                        {detectionEnabled ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                      Inbound reply monitoring engine
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2  sm:gap-4 sm:w-5/12 bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-md text-left">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Cadence
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      Every 5 min
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Last Check
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      {lastCheckText}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Next Check
                    </span>
                    <span
                      className={`text-xs font-bold mt-0.5 block  ${detectionEnabled ? "text-[#3525cd]" : "text-slate-400"}`}
                    >
                      {detectionEnabled ? "in 3 min" : "Paused"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end sm:w-2/12 shrink-0">
                  <button
                    type="button"
                    onClick={toggleDetection}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
                  >
                    {detectionEnabled ? (
                      <>
                        <Pause size={12} className="text-slate-500" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} className="text-emerald-600" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* engine 2: autmatic reminder */}
              <div className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0 sm:w-5/12">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-[#3525cd] flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        Automatic Reminders
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full border shrink-0 ${
                          remindersEnabled
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                            : "text-amber-700 bg-amber-50 border-amber-200/80"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${remindersEnabled ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                        />
                        {remindersEnabled ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                      Scheduled follow-up dispatch engine
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:w-5/12 bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-md text-left">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Cadence
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      Every 24 hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Last Run
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      18 min ago
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
                      Next Run
                    </span>
                    <span
                      className={`text-xs font-bold mt-0.5 block ${remindersEnabled ? "text-[#3525cd]" : "text-slate-400"}`}
                    >
                      {remindersEnabled ? "in 6 hrs" : "Paused"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end sm:w-2/12 shrink-0">
                  <button
                    type="button"
                    onClick={toggleReminders}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
                  >
                    {remindersEnabled ? (
                      <>
                        <Pause size={12} className="text-slate-500" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} className="text-emerald-600" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Mini Graph */}
          <section className="w-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Automation Activity
                </h2>
                <p className="text-[11px] text-slate-500 font-normal">
                  Last 7 days
                </p>
              </div>

              <div className="text-right">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-none block">
                  32
                </span>

                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                  actions
                </span>
              </div>
            </div>

            {/* lightweight area chart */}
            <div className="h-28 w-full pb-1 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 6, right: 6, left: -28, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="purpleGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3525cd" stopOpacity={0.2} />
                      <stop
                        offset="95%"
                        stopColor="#3525cd"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    dy={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#94a3b8" }}
                    domain={[0, "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="actions"
                    stroke="#3525cd"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleGradient)"
                    activeDot={{
                      r: 4,
                      fill: "#3525cd",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd]" />
                <span>32 automated actions</span>
              </div>

              <div className="font-mono text-slate-500 text-[10px]">
                18 reminders · 9 responses · 5 completed
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="lg:col-span-6">
          <section className="w-full h-full bg-white  border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Recent Activity
                </h2>
                <p className="text-[11px] text-slate-500 font-normal">
                  Latest automated background events
                </p>
              </div>

              <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
                Live Log
              </span>
            </div>

            <div className="relative flex-1 flex flex-col justify-evenly py-3 my-1">
              <div className="absolute left-2.75 top-4 bottom-4 w-px bg-slate-200/70 z-0" />

              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="relative flex items-start gap-3 text-xs z-10 group py-1"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-2xs ${activity.bg}`}
                  >
                    {activity.icon}
                  </div>

                  {/* text content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs group-hover:text-[#3525cd] transition-colors truncate">
                        {activity.title}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-400 shrink-0">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-medium">
                Showing Last 4 events
              </span>
              <button
                className="text-[#3525cd] hover:text-[#2b1ea8] font-semibold text-xs inline-flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                onClick={() =>
                  triggerToast(
                    "Opening complete automation activity log history...",
                    "info",
                  )
                }
              >
                <span>View all activity</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Automation;
