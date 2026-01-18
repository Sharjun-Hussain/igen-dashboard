"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Search,
  Plus,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Package,
  AlertTriangle,
  XCircle,
  Clock,
  X,
  MoreHorizontal,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    sku: "AUD-001",
    category: "Audio",
    price: 349.0,
    stock: 45,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    sku: "LAP-002",
    category: "Laptops",
    price: 1999.0,
    stock: 12,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&q=80",
  },
  {
    id: 3,
    name: "Fujifilm X-T5",
    sku: "CAM-045",
    category: "Cameras",
    price: 1699.0,
    stock: 3,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
  },
  {
    id: 4,
    name: "Keychron Q1 Pro",
    sku: "ACC-099",
    category: "Accessories",
    price: 199.0,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
  },
  {
    id: 5,
    name: "Herman Miller Aeron",
    sku: "FUR-101",
    category: "Furniture",
    price: 1250.0,
    stock: 8,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
  },
  {
    id: 6,
    name: "iPad Air 5",
    sku: "TAB-202",
    category: "Tablets",
    price: 599.0,
    stock: 120,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
  },
];

// --- MOCK ORDERS GENERATOR ---
const generateMockOrders = (productId) => {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `#ORD-${1000 + i + productId}`,
    customer: [
      "Alex Morgan",
      "Sarah Chen",
      "Mike Ross",
      "Emma Watson",
      "John Doe",
    ][i],
    date: `Jan ${12 + i}, 2024`,
    amount: (Math.random() * 500 + 100).toFixed(2),
    status: ["Completed", "Processing", "Completed", "Shipped", "Completed"][i],
  }));
};

// --- CHART GENERATOR (SVG Sparkline) ---
const Sparkline = ({ data, color = "#4f46e5" }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((val - min) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" L");

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full overflow-visible preserve-3d"
    >
      <path d={`M0,100 L${points} L100,100 Z`} fill={color} fillOpacity="0.1" />
      <path
        d={`M${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

// --- COMPONENT: PRODUCT SHEET ---
const ProductSheet = ({ product, onClose }) => {
  const sheetRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Stats specific to opened product
  const stats = {
    revenue: (product.price * 142).toLocaleString(),
    sold: 142,
    returns: "2.4%",
    views: "1.2k",
  };

  const orders = generateMockOrders(product.id);

  useGSAP(() => {
    // Slide In
    gsap.fromTo(
      sheetRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.5, ease: "power3.out" },
    );
    // Content Stagger
    gsap.fromTo(
      ".sheet-animate",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.2 },
    );
  }, []);

  const handleClose = () => {
    gsap.to(sheetRef.current, {
      x: "100%",
      duration: 0.3,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm transition-opacity opacity-100"
      />

      {/* Sheet Panel */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col overflow-hidden border-l border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Product Details
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${product.status === "Published" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600"}`}
              >
                {product.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{product.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 p-6 space-y-6"
        >
          {/* Hero Section */}
          <div className="sheet-animate bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-6">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-600">
              <img
                src={product.image}
                className="w-full h-full object-cover"
                alt="Product"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Price</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${product.price}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Stock Level</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {product.stock}
                    </p>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? "bg-emerald-500" : "bg-amber-500"}`}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-200 transition-colors">
                  Edit Product
                </button>
                <button className="px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors">
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sheet-animate flex gap-6 border-b border-slate-200 dark:border-slate-700 px-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "overview" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}
            >
              Overview
              {activeTab === "overview" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "orders" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}
            >
              Orders History
              {activeTab === "orders" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
              )}
            </button>
          </div>

          {/* Tab Content: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="sheet-animate bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${stats.revenue}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Total Lifetime Revenue
                  </p>
                </div>
                <div className="sheet-animate bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.sold}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Units Sold
                  </p>
                </div>
              </div>

              {/* Sales Chart */}
              <div className="sheet-animate bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Sales Trend (30 Days)
                  </h3>
                  <select className="text-xs bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-slate-600 dark:text-slate-400 font-bold outline-none cursor-pointer">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
                <div className="h-32 w-full">
                  {/* Using our SVG Sparkline Component */}
                  <Sparkline
                    data={[10, 25, 18, 40, 35, 50, 45, 70, 65, 80, 75, 95]}
                  />
                </div>
              </div>

              {/* Details Grid */}
              <div className="sheet-animate bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Product Specifications
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  <div className="flex justify-between p-4 text-sm">
                    <span className="text-slate-500">SKU</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {product.sku}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 text-sm">
                    <span className="text-slate-500">Category</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 text-sm">
                    <span className="text-slate-500">Supplier</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Global Tech Distributors
                    </span>
                  </div>
                  <div className="flex justify-between p-4 text-sm">
                    <span className="text-slate-500">Added On</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Oct 24, 2023
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Orders */}
          {activeTab === "orders" && (
            <div className="sheet-animate bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold text-right">Amount</th>
                    <th className="p-4 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {orders.map((order, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {order.id}
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300">{order.customer}</td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-white">
                        ${order.amount}
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            order.status === "Completed"
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                              : order.status === "Processing"
                                ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 text-center">
                <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-center gap-1 mx-auto">
                  View All Orders <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ProductsPage() {
  const containerRef = useRef(null);
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");

  // NEW STATE: Selected Product for Sheet
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".animate-up",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05 },
      );
    },
    { scope: containerRef },
  );

  // Helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/50";
      case "Draft":
        return "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
      case "Low Stock":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800/50";
      case "Out of Stock":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800/50";
      default:
        return "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
    }
  };

  const getStockColor = (count) => {
    if (count === 0) return "bg-red-500";
    if (count < 10) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white relative"
    >
      {/* RENDER SHEET IF PRODUCT SELECTED */}
      {selectedProduct && (
        <ProductSheet
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* 1. HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 p-6 md:p-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="animate-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
              Products
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Manage inventory, pricing, and product details.
            </p>
          </div>
          <div className="animate-up">
            <Link
              href="/app/products/new"
              className="group flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 will-change-transform"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Products",
              val: "1,240",
              icon: Package,
              color: "text-indigo-600",
            },
            {
              label: "Low Stock",
              val: "12",
              icon: AlertTriangle,
              color: "text-amber-600",
            },
            {
              label: "Out of Stock",
              val: "4",
              icon: XCircle,
              color: "text-red-600",
            },
            {
              label: "Avg Price",
              val: "$245.00",
              icon: Clock,
              color: "text-emerald-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="animate-up bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.val}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* 3. TOOLBAR */}
        <div className="animate-up sticky top-4 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl p-2 flex flex-col sm:flex-row gap-3 items-center justify-between mb-8">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-transparent rounded-xl text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900 transition-all"
              placeholder="Search by name, SKU..."
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto p-1">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <div className="flex bg-slate-100/50 dark:bg-slate-900 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. CONTENT AREA */}
        <div className="min-h-[500px]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl animate-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 mb-4">
                <Search className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No products found
              </h3>
            </div>
          ) : (
            <>
              {viewMode === "list" ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-4 pl-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="p-4 pr-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className="product-item group hover:bg-slate-50/80 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                        >
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600">
                                <img
                                  src={product.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {product.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {product.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono text-slate-500 dark:text-slate-400">
                            {product.sku}
                          </td>
                          <td className="p-4">
                            <div className="w-32">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {product.stock} in stock
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getStockColor(product.stock)}`}
                                  style={{
                                    width: `${Math.min(product.stock, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(product.status)}`}
                            >
                              {product.status === "Published" && (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {product.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="product-item group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-3 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-xl hover:shadow-indigo-900/5 dark:hover:shadow-indigo-900/20 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative aspect-square rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden mb-3">
                        <img
                          src={product.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={product.name}
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(product.status)}`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>
                      <div className="px-1 pb-2">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="font-bold text-indigo-600 dark:text-indigo-400">
                            ${product.price}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <span className="font-mono bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded">
                            {product.sku}
                          </span>
                          <span>{product.category}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-50 dark:border-slate-700">
                          <div
                            className={`w-2 h-2 rounded-full ${getStockColor(product.stock)}`}
                          ></div>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
