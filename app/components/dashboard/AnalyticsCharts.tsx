import React from "react";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { formatCurrency } from "../../lib/utils";

interface Props {
  trendData: { date: string; revenue: number }[];
  channelData: { name: string; value: number }[];
}

const CHANNEL_COLORS: Record<string, string> = {
  Shopee: "#ee4d2d",
  "Tiktok Shop": "#000000",
  Tokopedia: "#00AA5B",
};

export function AnalyticsCharts({ trendData, channelData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xs font-bold text-[#8F92A1] uppercase mb-6 flex items-center gap-2 tracking-wider">
          <TrendingUp size={14} /> Tren Pendapatan Harian
        </h3>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: "#8F92A1", fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: string) => {
                  const d = new Date(val);
                  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
                }}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value: string | number | readonly (string | number)[] | undefined) => formatCurrency(Number(Array.isArray(value) ? value[0] : value || 0))} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', background: '#fff', fontSize: '12px' }} 
              />
              <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-6">Market Share</h3>
        <div className="h-50 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                {channelData.map((d, i) => (
                  <Cell key={i} fill={CHANNEL_COLORS[d.name] || "#ccc"} />
                ))}
              </Pie>
              <Tooltip formatter={(value: string | number | readonly (string | number)[] | undefined) => formatCurrency(Number(Array.isArray(value) ? value[0] : value || 0))} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
