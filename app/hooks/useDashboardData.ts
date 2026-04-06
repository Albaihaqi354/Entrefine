"use client";

import { useState, useEffect, useMemo } from "react";
import { Order, DashboardMetrics, ChannelStat, AnomalyAlert } from "../lib/types";

export function useDashboardData() {
  const [rawData, setRawData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/frontend-engineer-task.csv");
        const csvText = await response.text();
        const lines = csvText.split("\n").filter((l) => l.trim());
        const headers = lines[0].split(",");

        const parsed = lines.slice(1).map((line) => {
          const vals = line.split(",");
          const obj: Record<string, string | number | null> = {};
          headers.forEach((h, i) => {
            if (h === "net_amount") obj[h] = parseFloat(vals[i]) || 0;
            else obj[h] = vals[i] === "null" ? null : vals[i];
          });
          return obj as unknown as Order;
        });

        setRawData(parsed);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const metrics = useMemo<DashboardMetrics | null>(() => {
    if (!rawData.length) return null;

    const completed = rawData.filter((o) => o.order_status === "COMPLETED");
    const cancelled = rawData.filter((o) => o.order_status === "CANCELLED");
    const totalRevenue = completed.reduce((acc, o) => acc + o.net_amount, 0);
    const successRate = (completed.length / rawData.length) * 100;
    const cancellationRate = (cancelled.length / rawData.length) * 100;

    // Per-channel breakdown
    const channels = Array.from(new Set(rawData.map((o) => o.channel)));
    const channelStats: ChannelStat[] = channels.map((name) => {
      const orders = rawData.filter((o) => o.channel === name);
      const comp = orders.filter((o) => o.order_status === "COMPLETED");
      const canc = orders.filter((o) => o.order_status === "CANCELLED");
      const revenue = comp.reduce((acc, o) => acc + o.net_amount, 0);
      return {
        name,
        total: orders.length,
        completed: comp.length,
        cancelled: canc.length,
        revenue,
        cancellationRate: orders.length > 0 ? (canc.length / orders.length) * 100 : 0,
        successRate: orders.length > 0 ? (comp.length / orders.length) * 100 : 0,
      };
    });

    const channelData = channelStats
      .map(({ name, revenue }) => ({ name, value: revenue }))
      .filter((d) => d.value > 0);

    // Anomaly Detection — 2 paling relevan untuk tim finance
    const alerts: AnomalyAlert[] = [];

    if (cancellationRate >= 25) {
      alerts.push({
        level: "critical",
        title: "Tingkat Pembatalan Kritis",
        description: `${cancellationRate.toFixed(1)}% pesanan dibatalkan — jauh di atas batas wajar.`,
      });
    } else if (cancellationRate >= 15) {
      alerts.push({
        level: "warning",
        title: "Tingkat Pembatalan Tinggi",
        description: `${cancellationRate.toFixed(1)}% pesanan dibatalkan. Perlu diperiksa.`,
      });
    }

    const worstChannel = channelStats.reduce((prev, cur) =>
      cur.cancellationRate > prev.cancellationRate ? cur : prev
    );
    if (worstChannel.cancellationRate >= 30) {
      alerts.push({
        level: "critical",
        title: `Pembatalan Tinggi di ${worstChannel.name}`,
        description: `${worstChannel.cancellationRate.toFixed(1)}% pesanan dibatalkan di ${worstChannel.name} (${worstChannel.cancelled} dari ${worstChannel.total}).`,
      });
    }

    // Daily Trend
    const dailyMap: Record<string, number> = {};
    completed.forEach((o) => {
      const date = (o.pay_time || o.create_time)?.split(" ")[0];
      if (date) dailyMap[date] = (dailyMap[date] || 0) + o.net_amount;
    });
    const trendData = Object.entries(dailyMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRevenue,
      totalOrders: rawData.length,
      aov: completed.length > 0 ? totalRevenue / completed.length : 0,
      successRate,
      cancellationRate,
      channelData,
      channelStats,
      trendData,
      alerts,
    };
  }, [rawData]);

  return { rawData, metrics, loading };
}
