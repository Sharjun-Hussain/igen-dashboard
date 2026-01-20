"use client";

import React, { useState } from "react";
import {
  Save,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  Palette,
  LayoutGrid,
  CheckCircle2,
  X,
  Layout,
  Trophy,
  Users,
  Star,
  PackageCheck,
} from "lucide-react";

// --- INITIAL DATA ---

const INITIAL_HEADER = {
  id: "header_config",
  type: "header",
  titleStart: "The Igen",
  titleHighlight: "Promise",
  subtitle:
    "We don't just sell tech; we provide a seamless experience from checkout to unboxing.",
};

const INITIAL_CARDS = [
  {
    id: "card_delivery",
    type: "card",
    title: "Island-wide Delivery",
    description: "Next-day delivery to Eastern Province & Island-wide.",
    icon: "truck",
    color: "blue",
  },
  {
    id: "card_warranty",
    type: "card",
    title: "Official Warranty",
    description: "1 Year Apple Care / Company Warranty on all devices.",
    icon: "shield",
    color: "green",
  },
  {
    id: "card_payment",
    type: "card",
    title: "Flexible Payments",
    description: "Pay in installments with Koko, Mintpay, or Credit Cards.",
    icon: "card",
    color: "purple",
  },
  {
    id: "card_support",
    type: "card",
    title: "Expert Support",
    description: "24/7 technical support via WhatsApp and Hotline.",
    icon: "headphone",
    color: "orange",
  },
];

const INITIAL_STATS = [
  { id: "stat_1", type: "stat", value: "15k+", label: "ORDERS SHIPPED" },
  { id: "stat_2", type: "stat", value: "4.9/5", label: "CUSTOMER RATING" },
  { id: "stat_3", type: "stat", value: "100%", label: "GENUINE PRODUCTS" },
  { id: "stat_4", type: "stat", value: "24/7", label: "SUPPORT TEAM" },
];

export default function ServicePromisesManager() {
  const [headerData, setHeaderData] = useState(INITIAL_HEADER);
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [stats, setStats] = useState(INITIAL_STATS);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleUpdate = (e) => {
    if (!selectedItem) return;
    const { name, value } = e.target;

    setSelectedItem((prev) => ({ ...prev, [name]: value }));

    if (selectedItem.type === "header") {
      setHeaderData((prev) => ({ ...prev, [name]: value }));
    } else if (selectedItem.type === "card") {
      setCards((prev) =>
        prev.map((c) =>
          c.id === selectedItem.id ? { ...c, [name]: value } : c,
        ),
      );
    } else if (selectedItem.type === "stat") {
      setStats((prev) =>
        prev.map((s) =>
          s.id === selectedItem.id ? { ...s, [name]: value } : s,
        ),
      );
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Promises Section Updated!");
    }, 800);
  };

  // --- RENDER HELPERS ---
  const renderIcon = (iconName, className) => {
    switch (iconName) {
      case "truck":
        return <Truck className={className} />;
      case "shield":
        return <ShieldCheck className={className} />;
      case "card":
        return <CreditCard className={className} />;
      case "headphone":
        return <Headphones className={className} />;
      default:
        return <CheckCircle2 className={className} />;
    }
  };

  // Helper for Adaptive Colors (Light & Dark Mode)
  const getColorClasses = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      case "green":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "purple":
        return "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
      case "orange":
        return "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  // Helper for Border Selection Color
  const getBorderColor = (color) => {
    switch (color) {
      case "blue":
        return "border-blue-500 ring-blue-500/20";
      case "green":
        return "border-emerald-500 ring-emerald-500/20";
      case "purple":
        return "border-purple-500 ring-purple-500/20";
      case "orange":
        return "border-orange-500 ring-orange-500/20";
      default:
        return "border-indigo-500 ring-indigo-500/20";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Toolbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Promises & Stats
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage the trust indicators. Colors adapt to light/dark mode
              automatically.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </header>

        {/* --- PREVIEW CANVAS --- */}
        {/* Uses global background (slate-50/950) instead of hardcoded black */}
        <div className="flex-1 p-8 md:p-16 overflow-x-hidden flex flex-col items-center">
          <div className="max-w-[1200px] w-full">
            {/* A. HEADER */}
            <div
              onClick={() => setSelectedItem(headerData)}
              className={`
                text-center mb-16 p-4 rounded-xl cursor-pointer border-2 transition-all
                ${
                  selectedItem?.id === "header_config"
                    ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                    : "border-transparent hover:border-slate-300 dark:hover:border-slate-800"
                }
              `}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {headerData.titleStart}{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {headerData.titleHighlight}
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                {headerData.subtitle}
              </p>
            </div>

            {/* B. CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {cards.map((card) => {
                const colorClasses = getColorClasses(card.color);

                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedItem(card)}
                    className={`
                      p-8 rounded-3xl cursor-pointer transition-all border shadow-sm hover:shadow-md
                      /* Base Styles (Light/Dark) */
                      bg-white dark:bg-slate-900
                      
                      /* Selection Logic */
                      ${
                        selectedItem?.id === card.id
                          ? `${getBorderColor(card.color)} ring-2`
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }
                    `}
                  >
                    {/* Icon Box */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClasses}`}
                    >
                      {renderIcon(card.icon, "w-7 h-7")}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {card.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* C. STATS ROW */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    onClick={() => setSelectedItem(stat)}
                    className={`
                      p-4 rounded-xl cursor-pointer transition-all border-2
                      ${
                        selectedItem?.id === stat.id
                          ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                          : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: EDITOR SIDEBAR */}
      <div
        className={`
        w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 
        flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-20 absolute right-0 lg:relative
        ${selectedItem ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}
      `}
      >
        {selectedItem ? (
          <>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Editing{" "}
                  {selectedItem.type === "header"
                    ? "Header"
                    : selectedItem.type === "card"
                      ? "Service Card"
                      : "Statistic"}
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {selectedItem.title || selectedItem.label || "Settings"}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* --- HEADER EDITOR --- */}
              {selectedItem.type === "header" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Title Start
                      </label>
                      <input
                        name="titleStart"
                        value={headerData.titleStart}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block text-indigo-500">
                        Highlight
                      </label>
                      <input
                        name="titleHighlight"
                        value={headerData.titleHighlight}
                        onChange={handleUpdate}
                        className="input-field text-indigo-600 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Subtitle
                    </label>
                    <textarea
                      name="subtitle"
                      value={headerData.subtitle}
                      onChange={handleUpdate}
                      rows={4}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              )}

              {/* --- CARD EDITOR --- */}
              {selectedItem.type === "card" && (
                <div className="space-y-4">
                  {/* Icon & Color Selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <LayoutGrid className="w-3 h-3" /> Icon
                      </label>
                      <select
                        name="icon"
                        value={selectedItem.icon}
                        onChange={handleUpdate}
                        className="input-field text-xs"
                      >
                        <option value="truck">Truck</option>
                        <option value="shield">Shield</option>
                        <option value="card">Credit Card</option>
                        <option value="headphone">Headphone</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Palette className="w-3 h-3" /> Accent
                      </label>
                      <select
                        name="color"
                        value={selectedItem.color}
                        onChange={handleUpdate}
                        className="input-field text-xs"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Card Title
                    </label>
                    <input
                      name="title"
                      value={selectedItem.title}
                      onChange={handleUpdate}
                      className="input-field font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={selectedItem.description}
                      onChange={handleUpdate}
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              )}

              {/* --- STAT EDITOR --- */}
              {selectedItem.type === "stat" && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                      {selectedItem.value}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {selectedItem.label}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Stat Value
                    </label>
                    <input
                      name="value"
                      value={selectedItem.value}
                      onChange={handleUpdate}
                      className="input-field font-bold text-lg"
                      placeholder="e.g. 15k+"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Label (Uppercase)
                    </label>
                    <input
                      name="label"
                      value={selectedItem.label}
                      onChange={handleUpdate}
                      className="input-field"
                      placeholder="ORDERS SHIPPED"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" /> Done Editing
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Layout className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              Section Manager
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Select a Card, Statistic, or the Header to customize this section.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all;
        }
      `}</style>
    </div>
  );
}
