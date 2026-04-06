import React from "react";
import { DollarSign, ShoppingBag, TrendingUp, CheckCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "../../lib/utils";

interface Props {
  totalRevenue: number;
  totalOrders: number;
  aov: number;
  successRate: number;
}

export function SummaryCards({ totalRevenue, totalOrders, aov, successRate }: Props) {
  const cards = [
    { label: "Total Pendapatan", val: formatCurrency(totalRevenue), sub: "Net Revenue", icon: <DollarSign size={18} className="text-black" /> },
    { label: "Volume Pesanan", val: formatNumber(totalOrders), sub: "Total Transaksi", icon: <ShoppingBag size={18} className="text-black" /> },
    { label: "AOV (Rata-rata)", val: formatCurrency(aov), sub: "Avg order value", icon: <TrendingUp size={18} className="text-black" /> },
    { label: "Success Rate", val: `${successRate.toFixed(1)}%`, sub: "Status Completed", icon: <CheckCircle size={18} className="text-black" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((m, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#F9EFE5] rounded-xl">{m.icon}</div>
            <span className="text-[10px] font-bold text-[#8F92A1] uppercase tracking-wider">{m.sub}</span>
          </div>
          <p className="text-[#7F8790] text-xs font-medium mb-1">{m.label}</p>
          <h2 className="text-2xl font-bold text-black">{m.val}</h2>
        </div>
      ))}
    </div>
  );
}
