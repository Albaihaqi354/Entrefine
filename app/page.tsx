"use client";

import { Loader2, User } from "lucide-react";
import { useDashboardData } from "./hooks/useDashboardData";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { AnalyticsCharts } from "./components/dashboard/AnalyticsCharts";
import { AnomalyAlerts } from "./components/dashboard/AnomalyAlerts";
import { OrdersTable } from "./components/dashboard/OrdersTable";

export default function DashboardPage() {
  const { metrics, rawData, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
        <p className="font-medium uppercase tracking-widest text-[10px]">Sinkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black font-sans pb-12">
      {/* Navbar Minimalis Luxury */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 px-3 bg-black rounded-lg text-[#F9EFE5] text-[10px] font-bold tracking-[0.2em] uppercase">
            Admin
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-[#F9EFE5] border border-black/5 flex items-center justify-center text-black">
            <User size={16} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <header className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black tracking-tighter mb-2 uppercase">Ringkasan Data</h2>
          <p className="text-[#8F92A1] text-[10px] font-bold uppercase tracking-[0.3em]">Update: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </header>

        {metrics && (
          <>
            <SummaryCards
              totalRevenue={metrics.totalRevenue}
              totalOrders={metrics.totalOrders}
              aov={metrics.aov}
              successRate={metrics.successRate}
            />

            <AnomalyAlerts
              alerts={metrics.alerts}
              channelStats={metrics.channelStats}
            />

            <AnalyticsCharts
              trendData={metrics.trendData}
              channelData={metrics.channelData}
            />

            <OrdersTable orders={rawData} />
          </>
        )}
      </main>
    </div>
  );
}
