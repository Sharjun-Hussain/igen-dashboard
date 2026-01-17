"use client";

import React, { useState } from "react";
import {
  Calendar,
  Filter,
  ChevronDown,
  FileText,
  Table,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Activity,
  Globe,
  Smartphone,
  Mail,
} from "lucide-react";

// --- MOCK DATA ---
const KPI_DATA = [
  {
    label: "Online Revenue",
    value: "Rs. 2,450,000",
    change: "+14.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Web Orders",
    value: "3,850",
    change: "+5.4%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Avg. Order Value",
    value: "Rs. 635",
    change: "-2.1%",
    trend: "down",
    icon: Activity,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Active Users",
    value: "12,402",
    change: "+8.4%",
    trend: "up",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const TOP_PRODUCTS = [
  {
    name: "Wireless Earbuds Pro",
    sku: "AUD-001",
    sales: 1240,
    revenue: "Rs. 450,000",
    stock: "High",
  },
  {
    name: "Smart Watch Series 5",
    sku: "WBL-023",
    sales: 980,
    revenue: "Rs. 890,000",
    stock: "Medium",
  },
  {
    name: "Ergonomic Office Chair",
    sku: "FUR-101",
    sales: 650,
    revenue: "Rs. 1,200,000",
    stock: "Low",
  },
];

const LOWEST_PRODUCTS = [
  {
    name: "Legacy USB Hub",
    sku: "ACC-002",
    sales: 12,
    revenue: "Rs. 4,500",
    stock: "Dead Stock",
  },
  {
    name: "Wired Mouse Basic",
    sku: "ACC-099",
    sales: 24,
    revenue: "Rs. 8,200",
    stock: "High",
  },
];

// --- UTILS ---
const handleExportCSV = () => {
  // Simple CSV generation simulation
  const headers = "Product,SKU,Sales,Revenue\n";
  const rows = TOP_PRODUCTS.map(
    (p) => `${p.name},${p.sku},${p.sales},${p.revenue.replace("Rs. ", "")}`,
  ).join("\n");
  const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "analytics_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleExportPDF = () => {
  window.print(); // Triggers browser "Save as PDF" interface
};

// Smooth Chart Path Generator
const generateSmoothPath = (data, width, height) => {
  const max = Math.max(...data);
  const min = 0;
  const range = max - min;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return [x, y];
  });
  return points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point[0]},${point[1]}`;
    const [p0, p1] = [a[i - 1], point];
    const cp1x = p0[0] + (p1[0] - p0[0]) * 0.5;
    return `${acc} C ${cp1x},${p0[1]} ${cp1x},${p1[1]} ${p1[0]},${p1[1]}`;
  }, "");
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Revenue");
  const [timeRange, setTimeRange] = useState("This Month");
  const [isDateOpen, setIsDateOpen] = useState(false);

  // Mock Data for Charts
  const CHART_DATA =
    activeTab === "Revenue"
      ? [15, 45, 35, 65, 55, 85, 75, 100, 90, 120]
      : [40, 30, 50, 45, 60, 55, 70, 65, 80, 75];

  const chartPath = generateSmoothPath(CHART_DATA, 800, 250);
  const areaPath = `${chartPath} L 800,250 L 0,250 Z`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 print:bg-white print:pb-0">
      {/* 1. HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              Store Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Overview of online performance and revenue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDateOpen(!isDateOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-white hover:border-indigo-300 transition-all min-w-[160px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {timeRange}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDateOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  {[
                    "Today",
                    "Yesterday",
                    "This Month",
                    "Last Month",
                    "Last 90 Days",
                    "Year to Date",
                  ].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        setIsDateOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 rounded-md text-xs font-bold shadow-sm border border-slate-200 hover:text-indigo-600 transition-colors"
                title="Download CSV"
              >
                <Table className="w-3.5 h-3.5" /> CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                title="Save as PDF"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8 print:p-0 print:max-w-none">
        {/* 2. FILTER SECTION (Fixed: No scrollbars, Flex Wrap) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-start gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Filter className="w-4 h-4" /> Active Filters
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Category
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Living</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Order Status
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>All Status</option>
                <option>Completed</option>
                <option>Processing</option>
                <option>Returned</option>
              </select>
            </div>

            {/* Customer Type */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Customer Tier
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>All Customers</option>
                <option>New Visitors</option>
                <option>Returning</option>
                <option>VIP / Wholesale</option>
              </select>
            </div>

            {/* Region */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Region
              </label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>All Regions</option>
                <option>Western Province</option>
                <option>Central Province</option>
                <option>Southern Province</option>
              </select>
            </div>

            {/* Search Bar */}
            <div className="flex-[2] min-w-[250px]">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, SKU or Name..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
          {KPI_DATA.map((kpi, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group print:border-slate-300 print:shadow-none"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${kpi.bg} print:bg-slate-100`}>
                  <kpi.icon
                    className={`w-6 h-6 ${kpi.color} print:text-slate-900`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${kpi.trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* 4. MAIN CHART (Revenue/Orders) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Performance Over Time
              </h2>
              <p className="text-sm text-slate-500">
                Analysis for period: {timeRange}
              </p>
            </div>
            <div className="bg-slate-100 p-1 rounded-lg inline-flex print:hidden">
              {["Revenue", "Orders"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full h-80">
            <svg
              viewBox="0 0 800 250"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 50, 100, 150, 200, 250].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              ))}
              <path d={areaPath} fill="url(#chartFill)" />
              <path
                d={chartPath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* 5. PRODUCT PERFORMANCE TABLES */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:grid-cols-1 print:gap-8">
          {/* Highest Performing */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border print:border-slate-300">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Top Selling
                Products
              </h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Sold</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TOP_PRODUCTS.map((prod, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {prod.name}
                      </div>
                      <div className="text-xs text-slate-400">{prod.sku}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{prod.sales}</td>
                    <td className="px-6 py-4 font-bold text-slate-700 text-right">
                      {prod.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lowest Performing */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border print:border-slate-300">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-500" /> Least Selling
                Products
              </h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Sold</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LOWEST_PRODUCTS.map((prod, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {prod.name}
                      </div>
                      <div className="text-xs text-slate-400">{prod.sku}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-rose-600">
                      {prod.sales}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500 text-right">
                      {prod.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. ACQUISITION SOURCES (No POS) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 print:border print:border-slate-300">
          <h3 className="font-bold text-slate-900 mb-6">
            Traffic Sources (Online Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: "Direct / Website",
                val: "45%",
                icon: Globe,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                label: "Social Media",
                val: "30%",
                icon: Smartphone,
                color: "text-pink-600",
                bg: "bg-pink-50",
              },
              {
                label: "Email Campaigns",
                val: "15%",
                icon: Mail,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Google Search",
                val: "10%",
                icon: Search,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
            ].map((src, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg border border-slate-100"
              >
                <div className={`p-3 rounded-lg ${src.bg}`}>
                  <src.icon className={`w-5 h-5 ${src.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">
                    {src.val}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase">
                    {src.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
