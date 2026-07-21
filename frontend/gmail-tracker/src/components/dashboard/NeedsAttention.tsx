import React from "react";

import { AlertCircle, Calendar, HelpCircle, UserCheck } from "lucide-react";
import type { SimplifiedAttentionItem } from "@/type";

interface NeedsAttentionProps {
  items: SimplifiedAttentionItem[];
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "overdue":
      return {
        badge: "bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]/50",
        icon: <AlertCircle className="w-3.5 h-3.5 text-[#ba1a1a]" />,
      };
    case "due tomorrow":
      return {
        badge: "bg-[#ffdbcc] text-[#7e3000] border-[#ffdbcc]/50",
        icon: <Calendar className="w-3.5 h-3.5 text-[#7e3000]" />,
      };
    case "reminder needed":
    default:
      return {
        badge: "bg-[#e2dfff] text-[#3525cd] border-[#e2dfff]/50",
        icon: <UserCheck className="w-3.5 h-3.5 text-[#3525cd]" />,
      };
  }
};

const NeedsAttention = ({ items }: NeedsAttentionProps) => {
  return (
    <section className="bg-white border border-[#c7c4d8]/30 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* List Header */}
      <div className="px-6 py-5 border-b border-[#c7c4d8]/20 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <h3 className="font-sans text-base font-bold text-[#0b1c30]">
            Needs Attention
          </h3>
          <span className="bg-[#eff4ff] text-[#3525cd] text-xs font-bold px-2 py-0.5 rounded-full border border-[#c7c4d8]/10">
            {items.length}
          </span>
        </div>
        <HelpCircle className="w-4 h-4 text-[#777587] cursor-help opacity-70 hover:opacity-100 transition-opacity " />
      </div>

      {/* List Content */}
      <div className="divide-y divide-[#c7c4d8]/15 flex flex-col">
        {items.map((item) => {
          const style = getStatusStyle(item.status);
          return (
            <div
              key={item.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#eff4ff]/10 transition-colors"
            >
              {/* Subject and sub details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-sans text-sm font-bold text-[#0b1c30] truncate hover:text-[#3525cd] transition-colors">
                  {item.subject}
                </h4>
                <p className="font-sans text-xs text-[#777587] mt-1.5 flex items-center gap-1.5">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#c7c4d8]" />
                  <span>
                    {item.pendingRecipients} pending{" "}
                    {item.pendingRecipients == 1 ? "recipient" : "recipients"}
                  </span>
                  <span className="text-[#c7c4d8">•</span>
                  <span className="font-mono text-[11px] text-[#777587] bg-[#f8f9ff] px-1.5 py-0.5 rounded border border-[#c7c4d8]/20">
                    {item.daysLeft}
                  </span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.badge}`}
                >
                  {style.icon} {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NeedsAttention;
