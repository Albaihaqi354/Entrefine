"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Order } from "../../lib/types";
import { formatCurrency } from "../../lib/utils";

interface Props {
  orders: Order[];
}

const ITEMS_PER_PAGE = 20;

const CHANNEL_COLORS: Record<string, string> = {
  Shopee: "#ee4d2d",
  "Tiktok Shop": "#121212",
  Tokopedia: "#00AA5B",
};

export function OrdersTable({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = o.order_id.toLowerCase().includes(search.toLowerCase());
      const matchChannel = filterChannel === "Semua" || o.channel === filterChannel;
      return matchSearch && matchChannel;
    });
  }, [orders, search, filterChannel]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const startRange = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length);

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-sm mb-12">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
        <h3 className="font-bold text-black uppercase tracking-widest text-xs">Monitoring Transaksi</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F92A1]" />
            <input
              className="pl-9 pr-4 py-2 bg-[#F8F8F8] border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-black/10 w-full md:w-64 transition-all text-xs"
              placeholder="Cari ID Pesanan..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="px-3 py-2 bg-[#F8F8F8] border border-transparent rounded-lg focus:outline-none text-xs cursor-pointer"
            value={filterChannel}
            onChange={(e) => {
              setFilterChannel(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Semua">Semua</option>
            <option value="Shopee">Shopee</option>
            <option value="Tiktok Shop">TikTok</option>
            <option value="Tokopedia">Tokopedia</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F9EFE5] text-black text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">ID Pesanan</th>
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Net Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedOrders.map((o) => (
              <tr key={o.order_id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{o.order_id}</td>
                <td className="px-6 py-4 text-slate-500">{o.pay_time || o.create_time}</td>
                <td className="px-6 py-4">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${CHANNEL_COLORS[o.channel]}20`, color: CHANNEL_COLORS[o.channel] }}
                  >
                    {o.channel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      `text-[10px] font-bold ${o.order_status === "COMPLETED"
                        ? "text-emerald-600"
                        : o.order_status === "CANCELLED"
                        ? "text-rose-600"
                        : "text-[#8F92A1]"}`
                    }
                  >
                    {o.order_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-black">{formatCurrency(o.net_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 bg-white border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] uppercase font-bold text-[#8F92A1] tracking-widest">
          Menampilkan <span className="text-black">{startRange}</span> - <span className="text-black">{endRange}</span> dari <span className="text-black">{filteredOrders.length}</span> data
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-100 bg-white hover:bg-[#F9EFE5] disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold px-4 py-2 bg-[#F9EFE5] rounded-lg tracking-widest uppercase">
              PAGE {currentPage} / {totalPages || 1}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg border border-slate-100 bg-white hover:bg-[#F9EFE5] disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
