"use client";

import React from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- MOCK DATA ---
const KPI_DATA = [
  {
    title: "Total Revenue",
    value: "Rs. 4,250,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Total Orders",
    value: "1,250",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "New Customers",
    value: "340",
    change: "-2.4%",
    trend: "down",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Growth Rate",
    value: "24.5%",
    change: "+4.1%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-600",
  },
];

const CHART_DATA = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 2000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

const RECENT_ORDERS = [
  {
    id: "#ORD-001",
    customer: "Amila Perera",
    product: "iPhone 15 Pro",
    amount: "Rs. 385,000",
    status: "Completed",
    date: "Just now",
  },
  {
    id: "#ORD-002",
    customer: "Kasun Raj",
    product: "AirPods Pro 2",
    amount: "Rs. 78,000",
    status: "Processing",
    date: "5 mins ago",
  },
  {
    id: "#ORD-003",
    customer: "Nimali Silva",
    product: "MacBook Air M2",
    amount: "Rs. 325,000",
    status: "Pending",
    date: "1 hour ago",
  },
  {
    id: "#ORD-004",
    customer: "John Doe",
    product: "JBL Flip 6",
    amount: "Rs. 38,500",
    status: "Cancelled",
    date: "2 hours ago",
  },
  {
    id: "#ORD-005",
    customer: "Sarah Lee",
    product: "Galaxy S24",
    amount: "Rs. 295,000",
    status: "Completed",
    date: "3 hours ago",
  },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    Processing: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    Pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    Cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6 px-8 py-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Calendar className="w-4 h-4" /> Jan 16, 2026
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/20 dark:shadow-none">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  kpi.trend === "up"
                    ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}
              >
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
              {kpi.title}
            </h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* 3. CHART & RECENT ORDERS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART (2/3 Width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Revenue Analytics</h3>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-2 py-1 outline-none dark:text-slate-300">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                  className="dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg, #fff)",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    color: "var(--tooltip-text, #000)",
                  }}
                  itemStyle={{ color: "var(--tooltip-text, #000)" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY (1/3 Width) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Orders</h3>
          <div className="flex-1 overflow-auto">
            <div className="space-y-4">
              {RECENT_ORDERS.map((order, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs">
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {order.customer}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{order.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {order.amount}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full py-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}
