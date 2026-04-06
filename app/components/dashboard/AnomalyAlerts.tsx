import React from "react";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { AnomalyAlert, ChannelStat } from "../../lib/types";
import { formatCurrency } from "../../lib/utils";

interface Props {
  alerts: AnomalyAlert[];
  channelStats: ChannelStat[];
}

const CHANNEL_COLORS: Record<string, string> = {
  Shopee: "#ee4d2d",
  "Tiktok Shop": "#000000",
  Tokopedia: "#00AA5B",
};

export function AnomalyAlerts({ alerts, channelStats }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Alert Panel */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8F92A1]">
            Deteksi Masalah
          </h3>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {alerts.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Semua Indikator Normal</p>
                <p className="text-xs text-emerald-600">Tidak ada anomali yang terdeteksi pada periode ini.</p>
              </div>
            </div>
          ) : (
            alerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-4 rounded-xl border ${
                  alert.level === "critical"
                    ? "bg-rose-50 border-rose-100"
                    : "bg-amber-50 border-amber-100"
                }`}
              >
                {alert.level === "critical" ? (
                  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm font-bold ${alert.level === "critical" ? "text-rose-800" : "text-amber-800"}`}>
                    {alert.title}
                  </p>
                  <p className={`text-xs mt-0.5 ${alert.level === "critical" ? "text-rose-600" : "text-amber-600"}`}>
                    {alert.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Per-Channel Health */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8F92A1]">
            Kesehatan Channel
          </h3>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {channelStats.map((ch) => (
            <div key={ch.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CHANNEL_COLORS[ch.name] || "#ccc" }}
                  />
                  <span className="text-xs font-bold">{ch.name}</span>
                </div>
                <span className="text-[10px] font-bold text-[#8F92A1]">
                  {ch.successRate.toFixed(0)}% sukses
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${ch.successRate}%`,
                    backgroundColor: ch.successRate >= 70 ? "#22c55e" : ch.successRate >= 50 ? "#f59e0b" : "#ef4444",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#8F92A1]">
                <span>{ch.total} pesanan</span>
                <span className="text-rose-500">{ch.cancelled} dibatalkan</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
