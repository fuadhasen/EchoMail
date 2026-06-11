import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { BarChart3 } from "lucide-react";

import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";

const analyticsData = [
  { month: "Jan", responses: 12 },
  { month: "Feb", responses: 18 },
  { month: "Mar", responses: 25 },
  { month: "Apr", responses: 22 },
  { month: "May", responses: 35 },
  { month: "Jun", responses: 42 },
];

const AnalyticsPreview = () => {
  return (
    <Card className="ring-0 shadow-sm bg-white rounded-xl">
      <CardHeader className="pb-3 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <BarChart3 className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-950">
            Analytics Preview
          </CardTitle>
        </div>

        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
          Last 6 Month
        </span>
      </CardHeader>

      <CardContent>
        {/* Top Metricss */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">Response Rate</p>
          <h2 className="text-4xl font-bold  text-slate-900 mt-1">82%</h2>
          <p className="text-sm text-emerald-600 mt-1">+12% from last month</p>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <XAxis dataKey={"month"} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="#10b981"
                fill="#d1fae5"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Responses</p>
            <p className="text-2xl font-semibold text-slate-900">82</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-2xl font-semibold text-slate-900">18</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Reminders</p>
            <p className="text-2xl font-semibold text-slate-900">24</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPreview;
