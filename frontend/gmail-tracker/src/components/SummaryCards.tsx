import React from "react";
import { Card, CardContent } from "../components/ui/card";

interface Props {
  title: string;
  value: number | string;
  // Optional additions to elevate the design
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
}

const SummaryCards = ({ title, value, icon: Icon }: Props) => {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-100/60 bg-white  transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-200/60 cursor-pointer">
      {/* Decorative gradient background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              {title}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {value}
            </h2>
          </div>

          {/* Icon Container with subtle background ring */}
          {Icon && (
            <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCards;
