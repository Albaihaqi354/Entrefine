export interface Order {
  order_id: string;
  channel: string;
  order_status: string;
  buyer_user_id: string;
  pay_time: string | null;
  create_time: string;
  net_amount: number;
}

export interface ChannelStat {
  name: string;
  total: number;
  completed: number;
  cancelled: number;
  revenue: number;
  cancellationRate: number;
  successRate: number;
}

export interface AnomalyAlert {
  level: "warning" | "critical";
  title: string;
  description: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  aov: number;
  successRate: number;
  cancellationRate: number;
  channelData: { name: string; value: number }[];
  channelStats: ChannelStat[];
  trendData: { date: string; revenue: number }[];
  alerts: AnomalyAlert[];
}
