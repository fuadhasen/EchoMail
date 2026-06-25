import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

import { Mail, Reply, Bell, Eye, Loader2 } from "lucide-react";
import type { ActivityItems } from "@/type";

interface RecentActivityProps {
  initialItems: ActivityItems[];
}

const RecentActivity = ({ initialItems }: RecentActivityProps) => {
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "reply":
        return <Reply className="w-4 h-4 text-emerald-600" />;
      case "reminder":
        return <Bell className="w-4 h-4 text-[#3525cd]" />;
      case "view":
        return <Eye className="w-4 h-4 text-[#777587]" />;
      default:
        return <Mail className="w-4 h-4 text-[#3525cd]" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "reply":
        return "bg-emerald-500/10 text-emerald-600";
      case "reminder":
        return "bg-[#3525cd]/10 text-[#3525cd]";
      case "view":
        return "bg-gray-100 text-[#777587]";
      default:
        return "bg-[#3525cd]/10 text-[#3525cd]";
    }
  };

  const moreMockActivities: ActivityItems[] = [
    {
      id: 101,
      iconType: "reply",
      user: "Sarah Chen",
      boldText: "Sarah Chen",
      regularText: " approved contract extension proposal for Acme Corp",
      timeLabel: "4 hours ago",
    },
    {
      id: 102,
      iconType: "reminder",
      regularText: "Daily workspace communications backup finalized",
      timeLabel: "5 hours ago",
    },
    {
      id: 103,
      iconType: "view",
      user: "Alex Rivera",
      boldText: "Alex Rivera",
      regularText: " ran communications velocity analytics audit report",
      timeLabel: "6 hours ago",
    },
  ];

  const handleLoadMore = () => {
    if (
      isLoading ||
      items.length >= initialItems.length + moreMockActivities.length
    )
      return;

    setIsLoading(true);
    // Simulate API network call delay
    setTimeout(() => {
      setItems((prev) => [...prev, ...moreMockActivities]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <section className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-sm">
      <h3 className="font-sans text-[#0b1c30] text-base font-bold mb-6">
        Recent Activity
      </h3>

      <div className=" p-3 space-y-6">
        {items.map((item) => (
          <div className="flex gap-4 items-start group">
            {/* bulb */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200 ${getIconBg(item.iconType)}`}
            >
              {getIcon(item.iconType)}
            </div>

            {/* activity info */}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs text-[#0b1c30]">
                {item.boldText ? (
                  <>
                    <span className="font-bold hover:text-[#3525cd] transition-colors cursor-pointer">
                      {item.boldText}
                    </span>
                    {item.regularText}
                  </>
                ) : (
                  item.regularText
                )}
              </p>
              <p className="font-sans text-[11px] text-[#777587] mt-0.5">
                {item.timeLabel}
              </p>
            </div>
          </div>
        ))}
      </div>

      {items.length < initialItems.length + moreMockActivities.length && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full mt-6 py-2.5 border border-[#c7c4d8]/30 rounded-lg text-[#464555] font-sans font-bold text-xs hover:bg-[#eff4ff]/40  transition-all active:scale-99 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Loading Activity ...
            </>
          ) : (
            "Load More Activity"
          )}
        </button>
      )}
    </section>
  );
};

export default RecentActivity;
