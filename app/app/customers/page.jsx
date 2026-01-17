"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  MoreHorizontal,
  Calendar,
  ShieldAlert,
  Ban,
  CheckCircle2,
  ShoppingBag,
  DollarSign,
  Check,
} from "lucide-react";

// --- MOCK DATA GENERATOR ---
const generateCustomers = (count) => {
  const statuses = ["Active", "Active", "Active", "Blocked"];

  return Array.from({ length: count }, (_, i) => {
    // Generate dates relative to today for filtering
    const joinedDate = new Date();
    joinedDate.setDate(joinedDate.getDate() - Math.floor(Math.random() * 365));

    return {
      id: i + 1,
      name:
        [
          "Emma Watson",
          "Liam Neeson",
          "Olivia Wilde",
          "Noah Centineo",
          "Ava Gardner",
          "James Dean",
          "Robert Downey",
        ][i % 7] + ` ${i}`,
      email: `customer${i}@example.com`,
      phone: `+1 (555) 010-${1000 + i}`,
      location: [
        "New York, USA",
        "London, UK",
        "Berlin, DE",
        "Toronto, CA",
        "Tokyo, JP",
      ][i % 5],
      ordersCount: Math.floor(Math.random() * 50),
      totalSpent: (Math.random() * 5000).toFixed(2),
      joinedDate: joinedDate,
      joinedDateStr: joinedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: statuses[i % 4],
      avatar: `https://i.pravatar.cc/150?u=${i + 500}`,
    };
  });
};

const MOCK_CUSTOMERS = generateCustomers(85);

export default function CustomersPage() {
  const containerRef = useRef(null);

  // --- STATE ---
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // --- FILTER STATES ---
  const [activeTab, setActiveTab] = useState("All"); // All, Active, Blocked

  // Date Filter
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [dateRange, setDateRange] = useState({ label: "Any Time", days: null });

  // Status Filter Menu
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilters, setStatusFilters] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Drawer Actions
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // --- REFS ---
  const tableRef = useRef(null);
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  // --- FILTER LOGIC ---
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 1. Search
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Tab Filter (Quick Access)
      const matchesTab = activeTab === "All" ? true : c.status === activeTab;

      // 3. Date Filter (Joined within X days)
      let matchesDate = true;
      if (dateRange.days !== null) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateRange.days);
        matchesDate = c.joinedDate >= cutoffDate;
      }

      // 4. Advanced Status Filter (Multi-select)
      let matchesStatusFilter = true;
      if (statusFilters.length > 0) {
        matchesStatusFilter = statusFilters.includes(c.status);
      }

      return matchesSearch && matchesTab && matchesDate && matchesStatusFilter;
    });
  }, [customers, searchTerm, activeTab, dateRange, statusFilters]);

  // --- PAGINATION LOGIC ---
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Reset page on filter change
  useEffect(
    () => setCurrentPage(1),
    [searchTerm, activeTab, dateRange, statusFilters, itemsPerPage],
  );

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Header & Stats
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      );
      tl.fromTo(
        ".animate-stat",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05 },
        "-=0.6",
      );
      // Toolbar
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
        ".customer-row",
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
  }, [paginatedCustomers]);

  // Drawer Animation
  useGSAP(() => {
    if (selectedCustomer && drawerRef.current) {
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
  }, [selectedCustomer]);

  // --- HANDLERS ---
  const handleCloseDrawer = () => {
    setShowActionsMenu(false);
    const tl = gsap.timeline({ onComplete: () => setSelectedCustomer(null) });
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

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Blocked":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden relative"
      onClick={() => {
        if (showDateMenu) setShowDateMenu(false);
        if (showFilterMenu) setShowFilterMenu(false);
      }}
    >
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="animate-header">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Customers
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            View and manage your customer base.
          </p>
        </div>
        <div className="animate-header flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Customers",
            val: "2,543",
            icon: User,
            color: "text-indigo-600",
          },
          {
            label: "Active Members",
            val: "1,890",
            icon: CheckCircle2,
            color: "text-emerald-600",
          },
          {
            label: "Blocked Users",
            val: "24",
            icon: Ban,
            color: "text-red-600",
          },
          {
            label: "Avg. Spend",
            val: "$450",
            icon: DollarSign,
            color: "text-blue-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="animate-stat bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <h4 className="text-2xl font-bold text-slate-900">{stat.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TOOLBAR */}
      <div className="animate-toolbar bg-white rounded-2xl shadow-sm border border-slate-200 p-1 mb-6 relative z-20">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 p-3">
          {/* Tab Filters */}
          <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-hide">
            {["All", "Active", "Blocked"].map((tab) => (
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
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>

            {/* DATE JOINED FILTER */}
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
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase">
                    Joined Within
                  </div>
                  {[
                    { label: "Any Time", days: null },
                    { label: "Last 30 Days", days: 30 },
                    { label: "Last 90 Days", days: 90 },
                    { label: "Last Year", days: 365 },
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

            {/* STATUS FILTER DROPDOWN */}
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
                  className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-30 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    Filter Status
                  </h4>
                  <div className="space-y-1">
                    {["Active", "Blocked"].map((status) => (
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

      {/* 4. CUSTOMER TABLE */}
      <div className="animate-toolbar bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse" ref={tableRef}>
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="customer-row hover:bg-slate-50/80 transition-colors cursor-pointer group"
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
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100">
                          <img
                            src={customer.avatar}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {customer.name}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(customer.status)}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {customer.location}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {customer.joinedDateStr}
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900">
                      ${customer.totalSpent}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-slate-400 font-medium"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION FOOTER (MATCHING ORDERS PAGE) */}
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
              {filteredCustomers.length > 0 ? (
                <>
                  <span className="font-bold text-slate-900">
                    {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredCustomers.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-900">
                    {filteredCustomers.length}
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

      {/* --- DETAILS DRAWER --- */}
      {selectedCustomer && (
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
              className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-100"
            >
              {/* Header */}
              <div className="relative h-32 bg-slate-100">
                <div className="absolute inset-0 bg-indigo-600/10 pattern-dots"></div>
                <button
                  onClick={handleCloseDrawer}
                  className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-sm hover:bg-white rounded-full text-slate-600 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="px-8 relative -mt-12 flex items-end justify-between mb-6">
                <div className="flex items-end gap-4">
                  <img
                    src={selectedCustomer.avatar}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-white"
                  />
                  <div className="pb-1">
                    <h2 className="text-2xl font-bold text-slate-900 leading-none mb-1">
                      {selectedCustomer.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">
                        {selectedCustomer.location}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(selectedCustomer.status)}`}
                      >
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
                {/* Action Bar */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=Hello ${selectedCustomer.name}`,
                      )
                    }
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      WhatsApp
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-all active:scale-95">
                    <Send className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      Telegram
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95">
                    <Mail className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      Email
                    </span>
                  </button>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Contact Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {selectedCustomer.email}
                        </div>
                        <div className="text-xs text-slate-400">
                          Primary Email
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {selectedCustomer.phone}
                        </div>
                        <div className="text-xs text-slate-400">Mobile</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {selectedCustomer.location}
                        </div>
                        <div className="text-xs text-slate-400">
                          Billing Address
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">
                      Lifetime Spent
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      ${selectedCustomer.totalSpent}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">
                      Total Orders
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {selectedCustomer.ordersCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center relative">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionsMenu(!showActionsMenu);
                    }}
                    className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold text-sm"
                  >
                    Manage
                  </button>
                  {showActionsMenu && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                      <button className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                        <Ban className="w-3.5 h-3.5" /> Block Customer
                      </button>
                      <button className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5" /> Reset Password
                      </button>
                    </div>
                  )}
                </div>

                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
