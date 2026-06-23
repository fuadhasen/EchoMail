import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

import { Mail, Reply, Bell, Eye } from "lucide-react";
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

  return <section className="">The Analysis component</section>;
};

export default RecentActivity;
