"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Printer,
  X,
  User,
  MapPin,
  MessageCircle,
  Send,
  Mail,
  CreditCard,
  Package,
  RotateCcw,
  Ban,
  FileText,
  Check,
} from "lucide-react";

// --- MOCK DATA GENERATOR (Relative to Today) ---
const generateOrders = (count) => {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i); // Go back 'i' days

    return {
      id: `#ORD-${1000 + i}`,
      // Raw date object for sorting/filtering
      rawDate: date,
      // Formatted string for display
      dateStr: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      customer: {
        name: [
          "Alex Morgan",
          "Sarah Conner",
          "John Wick",
          "Ellen Ripley",
          "James Bond",
          "Tony Stark",
        ][i % 6],
        email: `customer${i}@example.com`,
        ordersCount: (i % 12) + 1,
        totalSpent: i * 120 + 50,
        avatar: `https://i.pravatar.cc/150?u=${i}`,
      },
      total: (Math.random() * 500 + 50).toFixed(2),
      items: (i % 3) + 1,
      paymentStatus: ["Paid", "Pending", "Refunded", "Failed"][i % 4],
      fulfillmentStatus: ["Fulfilled", "Unfulfilled", "Shipped", "Returned"][
        i % 4
      ],
      channel: ["Online Store", "POS", "Mobile App"][i % 3],
    };
  });
};

const MOCK_ORDERS = generateOrders(60);

export default function InteractiveOrdersPage() {
  const containerRef = useRef(null);

  // --- MAIN STATE ---
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- FILTER STATES ---
  const [activeTab, setActiveTab] = useState("All");

  // Date Filter State
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [dateRange, setDateRange] = useState({ label: "All Time", days: null });

  // "More Filters" State
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilters, setStatusFilters] = useState([]); // Stores selected statuses like 'Paid', 'Shipped'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Drawer Actions State
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // --- REFS ---
  const tableRef = useRef(null);
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  // --- FILTER LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Text Search
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Tab Filter (High Level)
      const matchesTab =
        activeTab === "All"
          ? true
          : activeTab === "Unfulfilled"
            ? order.fulfillmentStatus === "Unfulfilled"
            : activeTab === "Unpaid"
              ? order.paymentStatus === "Pending"
              : true;

      // 3. Date Filter
      let matchesDate = true;
      if (dateRange.days !== null) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateRange.days);
        // Reset time for accurate comparison
        cutoffDate.setHours(0, 0, 0, 0);
        const orderDate = new Date(order.rawDate);
        orderDate.setHours(0, 0, 0, 0);
        matchesDate = orderDate >= cutoffDate;
      }

      // 4. "More Filters" Icon (Specific Statuses)
      let matchesStatusFilter = true;
      if (statusFilters.length > 0) {
        matchesStatusFilter =
          statusFilters.includes(order.paymentStatus) ||
          statusFilters.includes(order.fulfillmentStatus);
      }

      return matchesSearch && matchesTab && matchesDate && matchesStatusFilter;
    });
  }, [orders, searchTerm, activeTab, dateRange, statusFilters]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Reset page when filters change
  useEffect(
    () => setCurrentPage(1),
    [searchTerm, activeTab, dateRange, statusFilters],
  );

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      // Initial Load
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      );
      tl.fromTo(
        ".animate-toolbar",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  // Row Transitions
  useGSAP(() => {
    if (tableRef.current) {
      gsap.fromTo(
        ".order-row",
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.02,
          ease: "expo.out",
          clearProps: "all",
        },
      );
    }
  }, [paginatedOrders]);

  // Drawer Animation
  useGSAP(() => {
    if (selectedOrder && drawerRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.5, ease: "power4.out" },
      );
    }
  }, [selectedOrder]);

  // --- HANDLERS ---
  const handleCloseDrawer = () => {
    setShowActionsMenu(false);
    const tl = gsap.timeline({ onComplete: () => setSelectedOrder(null) });
    tl.to(drawerRef.current, {
      x: "100%",
      duration: 0.3,
      ease: "power3.in",
    }).to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  const handleDateSelect = (label, days) => {
    setDateRange({ label, days });
    setShowDateMenu(false);
  };

  const toggleStatusFilter = (status) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter((s) => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const performDrawerAction = (action) => {
    console.log(`Performing action: ${action} on order ${selectedOrder?.id}`);
    setShowActionsMenu(false);
    // You would add your API calls here
    alert(`${action} initiated for ${selectedOrder?.id}`);
  };

  // --- HELPERS ---
  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Refunded":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "Failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getFulfillmentColor = (status) => {
    switch (status) {
      case "Fulfilled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Unfulfilled":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Returned":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50  font-sans text-slate-900 overflow-x-hidden relative"
      onClick={() => {
        // Global click to close menus if open (simple implementation)
        if (showDateMenu) setShowDateMenu(false);
        if (showFilterMenu) setShowFilterMenu(false);
      }}
    >
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="animate-header">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Orders
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage and fulfill your store orders.
          </p>
        </div>
        <div className="animate-header flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95">
            <Package className="w-4 h-4" /> Create Order
          </button>
        </div>
      </div>

      {/* 2. ADVANCED FILTERS TOOLBAR */}
      <div className="animate-toolbar bg-white rounded-2xl shadow-sm border border-slate-200 p-1 mb-6 relative z-20">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-3">
          {/* Tab Filters */}
          <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-hide">
            {["All", "Unfulfilled", "Unpaid", "Open"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>

            {/* DATE FILTER DROPDOWN */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDateMenu(!showDateMenu);
                  setShowFilterMenu(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-xs font-bold transition-colors ${showDateMenu ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 text-slate-600 hover:border-indigo-300"}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{dateRange.label}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform ${showDateMenu ? "rotate-180" : ""}`}
                />
              </button>

              {showDateMenu && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    { label: "All Time", days: null },
                    { label: "Today", days: 0 },
                    { label: "Last 7 Days", days: 7 },
                    { label: "Last 30 Days", days: 30 },
                    { label: "Last 90 Days", days: 90 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateSelect(item.label, item.days);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${dateRange.label === item.label ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {item.label}
                      {dateRange.label === item.label && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MORE FILTERS DROPDOWN */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterMenu(!showFilterMenu);
                  setShowDateMenu(false);
                }}
                className={`p-2 border rounded-lg transition-all ${showFilterMenu ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}`}
              >
                <div className="relative">
                  <Filter className="w-4 h-4" />
                  {statusFilters.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full border border-white"></span>
                  )}
                </div>
              </button>

              {showFilterMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-30 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    Payment Status
                  </h4>
                  <div className="space-y-1 mb-3">
                    {["Paid", "Pending", "Refunded", "Failed"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={statusFilters.includes(status)}
                          onChange={() => toggleStatusFilter(status)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">{status}</span>
                      </label>
                    ))}
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    Fulfillment
                  </h4>
                  <div className="space-y-1">
                    {["Fulfilled", "Unfulfilled", "Shipped"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={statusFilters.includes(status)}
                          onChange={() => toggleStatusFilter(status)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ORDERS TABLE */}
      <div className="animate-toolbar bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px] z-10 relative">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse" ref={tableRef}>
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="order-row hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td
                      className="p-4 pl-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-4 font-bold text-slate-900 text-sm">
                      {order.id}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {order.dateStr}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          <img
                            src={order.customer.avatar}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {order.customer.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900">
                      ${order.total}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPaymentColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getFulfillmentColor(order.fulfillmentStatus)}`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm font-medium">
                        No orders found matching your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setActiveTab("All");
                          setDateRange({ label: "All Time", days: null });
                          setStatusFilters([]);
                        }}
                        className="mt-2 text-indigo-600 text-sm font-bold hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER */}
        <div className="border-t border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:border-indigo-500 outline-none font-bold text-slate-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="hidden sm:inline ml-2">
              {filteredOrders.length > 0 ? (
                <>
                  <span className="font-bold text-slate-900">
                    {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredOrders.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-900">
                    {filteredOrders.length}
                  </span>
                </>
              ) : (
                <span>0 results</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* Page Numbers */}
            {[...Array(Math.min(3, totalPages))].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- ORDER DETAILS DRAWER --- */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          onClick={() => setShowActionsMenu(false)}
        >
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={handleCloseDrawer}
          />

          <div className="absolute inset-y-0 right-0 flex max-w-full pl-0 sm:pl-16">
            <div
              ref={drawerRef}
              className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-100"
            >
              {/* Drawer Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {selectedOrder.id}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getPaymentColor(selectedOrder.paymentStatus)}`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getFulfillmentColor(selectedOrder.fulfillmentStatus)}`}
                    >
                      {selectedOrder.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedOrder.dateStr} via {selectedOrder.channel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseDrawer}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                {/* CUSTOMER PROFILE CARD */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Customer
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={selectedOrder.customer.avatar}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {selectedOrder.customer.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5" /> New York, USA
                      </div>
                      <div className="text-xs font-bold text-slate-400">
                        {selectedOrder.customer.ordersCount} orders • $
                        {selectedOrder.customer.totalSpent} spent
                      </div>
                    </div>
                  </div>

                  {/* COMMUNICATION ACTIONS */}
                  <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=Order ${selectedOrder.id} Update`,
                        )
                      }
                      className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase">
                        WhatsApp
                      </span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-all active:scale-95">
                      <Send className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase">
                        Telegram
                      </span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95">
                      <Mail className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase">
                        Email
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" /> Shipping
                    </h3>
                    <address className="not-italic text-sm text-slate-600 leading-relaxed">
                      <span className="block text-slate-900 font-bold">
                        {selectedOrder.customer.name}
                      </span>
                      123 Innovation Blvd
                      <br />
                      Tech District, Suite 400
                      <br />
                      San Francisco, CA 94103
                    </address>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" /> Payment
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium">
                          ${(selectedOrder.total * 0.9).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tax</span>
                        <span className="font-medium">
                          ${(selectedOrder.total * 0.1).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                        <span className="font-bold text-slate-900">Total</span>
                        <span className="font-bold text-slate-900">
                          ${selectedOrder.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer & MORE ACTIONS POPUP */}
              <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 relative">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionsMenu(!showActionsMenu);
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2"
                  >
                    More Actions <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* POPUP MENU */}
                  {showActionsMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                      <button
                        onClick={() =>
                          performDrawerAction("Print Packing Slip")
                        }
                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-3"
                      >
                        <Printer className="w-4 h-4 text-slate-400" /> Print
                        Packing Slip
                      </button>
                      <button
                        onClick={() => performDrawerAction("Refund Items")}
                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-3"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-400" /> Refund
                        Items
                      </button>
                      <div className="h-px bg-slate-100"></div>
                      <button
                        onClick={() => performDrawerAction("Cancel Order")}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-3"
                      >
                        <Ban className="w-4 h-4" /> Cancel Order
                      </button>
                    </div>
                  )}
                </div>

                <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                  Fulfill Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
