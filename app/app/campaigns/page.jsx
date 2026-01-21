"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  MessageSquare,
  Mail,
  Smartphone,
  Globe,
  Calendar,
  Users,
  BarChart3,
  MoreHorizontal,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Send,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  Trash2,
  Edit3,
} from "lucide-react";

// --- MOCK DATA ---
const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: "New Year Mega Sale",
    channel: "WhatsApp",
    status: "Active",
    audience: "All Customers",
    reach: 12500,
    clicks: 4200,
    revenue: 450000,
    date: "Jan 01 - Jan 15",
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    id: 2,
    name: "Abandoned Cart Recovery",
    channel: "SMS",
    status: "Active", // Recurring
    audience: "Cart Abandoners",
    reach: 850,
    clicks: 120,
    revenue: 85000,
    date: "Ongoing",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: 3,
    name: "February Flash Deal",
    channel: "Email",
    status: "Scheduled",
    audience: "VIP Members",
    reach: 0,
    clicks: 0,
    revenue: 0,
    date: "Feb 01, 2026",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    id: 4,
    name: "Q4 Clearance",
    channel: "Social",
    status: "Ended",
    audience: "Social Followers",
    reach: 45000,
    clicks: 1200,
    revenue: 120000,
    date: "Dec 01 - Dec 31",
    color: "bg-slate-50 text-slate-600 border-slate-200",
  },
];

export default function MarketingCampaignsPage() {
  const containerRef = useRef(null);

  // --- STATE ---
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Create/Edit Form State
  const [formData, setFormData] = useState({
    name: "",
    channel: "WhatsApp",
    audience: "All Customers",
    scheduleType: "Now", // Now vs Later
    startDate: "",
    message: "",
  });

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Header & KPIs
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      );

      // Table Rows
      tl.fromTo(
        ".campaign-row",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, clearProps: "all" },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  // --- HANDLERS ---
  const getChannelIcon = (channel) => {
    switch (channel) {
      case "WhatsApp":
        return <Smartphone className="w-4 h-4" />;
      case "SMS":
        return <MessageSquare className="w-4 h-4" />;
      case "Email":
        return <Mail className="w-4 h-4" />;
      case "Social":
        return <Globe className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Scheduled":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Ended":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API
    setTimeout(() => {
      const newCampaign = {
        id: Date.now(),
        name: formData.name,
        channel: formData.channel,
        status: formData.scheduleType === "Now" ? "Active" : "Scheduled",
        audience: formData.audience,
        reach: 0,
        clicks: 0,
        revenue: 0,
        date:
          formData.scheduleType === "Now"
            ? "Started Today"
            : formData.startDate,
        color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      };

      setCampaigns([newCampaign, ...campaigns]);
      setIsLoading(false);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        name: "",
        channel: "WhatsApp",
        audience: "All Customers",
        scheduleType: "Now",
        startDate: "",
        message: "",
      });
    }, 1200);
  };

  // Handle Quick Action from Header
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsModalOpen(true);
      // Clean up URL to prevent re-opening on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleDelete = (id) => {
    if (confirm("Delete this campaign?")) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  const filteredCampaigns = campaigns.filter(
    (c) => filterStatus === "All" || c.status === filterStatus,
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900 pb-20"
    >
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-header">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Marketing
          </h1>
          <p className="text-slate-500 font-medium">
            Create and manage multi-channel campaigns.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create Campaign
        </button>
      </div>

      {/* 2. KPI OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Active Campaigns",
            val: "2",
            icon: Megaphone,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Total Reach",
            val: "58.4k",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Revenue Generated",
            val: "Rs. 655k",
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Avg. ROI",
            val: "450%",
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="animate-header bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
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

      {/* 3. CAMPAIGN LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-header">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {["All", "Active", "Scheduled", "Ended"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === status ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Reach
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.map((camp) => (
                <tr
                  key={camp.id}
                  className="campaign-row hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border ${camp.color.replace("text", "border").split(" ")[2]} ${camp.color.split(" ")[0]}`}
                      >
                        {getChannelIcon(camp.channel)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {camp.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          {camp.channel} • <Clock className="w-3 h-3" />{" "}
                          {camp.date}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(camp.status)}`}
                    >
                      {camp.status === "Active" && (
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      )}
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-700">
                      {camp.reach.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {camp.clicks.toLocaleString()} Clicks
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-900">
                      Rs. {camp.revenue.toLocaleString()}
                    </div>
                    {camp.revenue > 0 && (
                      <div className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> ROI Positive
                      </div>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(camp.id)}
                        className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCampaigns.length === 0 && (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
              <p>No campaigns found in this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Create Campaign
                </h3>
                <p className="text-xs text-slate-500">
                  Reach your customers via their favorite apps.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full border border-slate-200 hover:border-slate-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Campaign Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Summer Sale 2026"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Channel & Audience Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Channel
                  </label>
                  <div className="relative">
                    <select
                      value={formData.channel}
                      onChange={(e) =>
                        setFormData({ ...formData, channel: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm appearance-none focus:bg-white focus:border-indigo-500 outline-none"
                    >
                      <option>WhatsApp</option>
                      <option>SMS</option>
                      <option>Email</option>
                      <option>Social</option>
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                      {getChannelIcon(formData.channel)}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Audience
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({ ...formData, audience: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  >
                    <option>All Customers</option>
                    <option>VIP Members</option>
                    <option>Cart Abandoners</option>
                    <option>New Signups</option>
                  </select>
                </div>
              </div>

              {/* Schedule Toggle */}
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex gap-1">
                {["Now", "Later"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, scheduleType: type })
                    }
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${formData.scheduleType === type ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {type === "Now" ? "Send Immediately" : "Schedule for Later"}
                  </button>
                ))}
              </div>

              {/* Date Picker (Conditional) */}
              {formData.scheduleType === "Later" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 block">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              )}

              {/* Message Area */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Message Content
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    {formData.message.length} chars
                  </span>
                </div>
                <textarea
                  rows="4"
                  placeholder={`Type your ${formData.channel} message here...`}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none"
                ></textarea>
                <p className="text-[10px] text-slate-400">
                  {formData.channel === "SMS"
                    ? "Cost: ~Rs 1.50 per segment."
                    : "Standard messaging rates apply."}
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {formData.scheduleType === "Now"
                    ? "Launch Campaign"
                    : "Schedule Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
