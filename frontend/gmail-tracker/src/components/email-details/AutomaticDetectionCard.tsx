import { useToast } from "@/context/ToastContext";
import type { TrackedEmailB } from "@/services/trackedEmail";
import {
  Activity,
  BellRing,
  CheckCircle2,
  Clock,
  Cpu,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface AutomaticDetectionCardProps {
  email: TrackedEmailB;
  onSync: () => void;
}

const AutomaticDetectionCard = ({
  email,
  onSync,
}: AutomaticDetectionCardProps) => {
  const { triggerToast } = useToast();
  const [activeTab, setActiveTab] = useState<"detection" | "reminders">(
    "detection",
  );

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState("2m ago");

  const total = email.recipients.length;
  const responded = email.recipients.filter((r) => r.has_responded).length;
  const pending = total - responded;

  const handleScanNow = () => {
    setIsSyncing(true);
    if (onSync) onSync();
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText("Just now");
      triggerToast(
        "Gmail outbox re-scanned. Response detection & reminder status updated.",
        "info",
      );
    }, 600);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 font-sans text-left">
      {/* header and status indicator */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h3 className="font-sans text-xs font-bold text-slate-900 tracking-tight truncate">
            Automation Engine
          </h3>
        </div>

        <button
          type="button"
          onClick={handleScanNow}
          disabled={isSyncing}
          className="text-[11px] font-sans font-semibold text-[#3525cd] hover:text-[#281ca8] bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50 active:scale-[0.98]"
          title="Re-scan outbox for recipient replies"
        >
          <RefreshCw
            size={11}
            className={
              isSyncing ? "animate-spin text-[#3525cd]" : "text-[#3525cd]"
            }
          />
          <span>{isSyncing ? "Scanning..." : "Scan Outbox"}</span>
        </button>
      </div>

      {/* view controller segmented */}
      <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("detection")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "detection"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Radio
            size={12}
            className={
              activeTab === "detection" ? "text-[#3525cd]" : "text-slate-400"
            }
          />
          <span>Response Detection</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
              activeTab === "detection"
                ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60"
                : "bg-slate-200/70 text-slate-600"
            }`}
          >
            {responded}/{total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reminders")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "reminders"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BellRing
            size={12}
            className={
              activeTab === "reminders" ? "text-amber-500" : "text-slate-400"
            }
          />
          <span>Auto Reminders</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
              activeTab === "reminders"
                ? "bg-amber-50 text-amber-700 font-bold border border-amber-200/60"
                : "bg-slate-200/70 text-slate-600"
            }`}
          >
            {pending > 0 ? pending : "Done"}
          </span>
        </button>
      </div>

      {/* view 1: response detection detailed information */}
      {activeTab === "detection" && (
        <div className="space-y-3 pt-0.5">
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock size={12} className="text-slate-400" />
                Scan Loop
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-800">
                Every 5 minutes (Last: {lastSyncText})
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Cpu size={12} className="text-slate-400" />
                Webhook Latency
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-800">
                32 ms
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-600" />
                Detection Protocol
              </span>
              <span className="font-sans text-[11px] font-semibold text-slate-800">
                Gmail Thread ID Matcher
              </span>
            </div>
          </div>
        </div>
      )}

      {/* view 2: auto reminder detailed information */}
      {activeTab === "reminders" && (
        <div className="space-y-3 pt-0.5 font-sans">
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock size={12} className="text-slate-400" />
                Cadence Rule
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-800">
                24h Post-Deadline
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-600" />
                Auto-Halt Trigger
              </span>
              <span className="font-sans text-[11px] font-semibold text-emerald-700">
                On Reply Captured
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Activity size={12} className="text-slate-400" />
                Anti-Spam Frequency
              </span>
              <span className="font-sans text-[11px] font-semibold text-slate-800">
                Max 1 / 24 Hours
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5 truncate">
          <Sparkles size={12} className="text-[#3525cd] shrink-0" />
          <span className="truncate">Google Workspace OAuth Active</span>
        </span>
      </div>
    </div>
  );
};

export default AutomaticDetectionCard;
