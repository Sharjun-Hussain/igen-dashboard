"use client";

import React, { useState } from "react";
import {
  Save,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Tag,
  X,
  CheckCircle2,
  ArrowUpRight,
  Heading,
} from "lucide-react";

// --- INITIAL DATA ---

const INITIAL_HEADER = {
  id: "hero_header",
  type: "header",
  title: "Upgrade Your Tech Game.",
  subtitle: "Brand New & Refurbished Phones, Accessories & Gadgets.",
  linkText: "View All Products",
  linkUrl: "/products",
};

const INITIAL_GRID_DATA = [
  {
    id: "slot_1",
    type: "grid_item",
    label: "Main Feature (Top Left)",
    colSpan: "col-span-12 md:col-span-8",
    title: "iPhone 15 Pro.",
    subtitle: "Titanium.",
    badge: "New Arrival",
    badgeColor: "bg-indigo-600 text-white",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
    link: "/products/iphone-15-pro",
    textColor: "text-white",
    overlay: "bg-gradient-to-r from-black/80 to-transparent",
  },
  {
    id: "slot_2",
    type: "grid_item",
    label: "Side Feature (Top Right)",
    colSpan: "col-span-12 md:col-span-4",
    title: "Galaxy AI",
    subtitle: "S24 Ultra Series",
    badge: "",
    badgeColor: "bg-purple-600 text-white",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
    link: "/products/galaxy-s24",
    textColor: "text-white",
    overlay: "bg-purple-900/80",
  },
  {
    id: "slot_3",
    type: "grid_item",
    label: "Bottom Left",
    colSpan: "col-span-12 md:col-span-4",
    title: "Sony XM5",
    subtitle: "Audio",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
    link: "/products/sony-xm5",
    textColor: "text-white",
    overlay: "bg-gradient-to-t from-black/90 via-black/20 to-transparent",
  },
  {
    id: "slot_4",
    type: "grid_item",
    label: "Bottom Center",
    colSpan: "col-span-12 md:col-span-4",
    title: "Ultra Watch",
    subtitle: "Adventure awaits",
    badge: "-15%",
    badgeColor: "bg-red-600 text-white",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02ea6ca920?q=80&w=2074&auto=format&fit=crop",
    link: "/products/apple-watch-ultra",
    textColor: "text-white",
    overlay: "bg-gradient-to-t from-black/80 via-transparent to-transparent",
  },
  {
    id: "slot_5",
    type: "grid_item",
    label: "Bottom Right",
    colSpan: "col-span-12 md:col-span-4",
    title: "Watch the Film",
    subtitle: "Experience the ecosystem",
    badge: "Preview",
    badgeColor:
      "bg-white/20 backdrop-blur-md text-white border border-white/30",
    image:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop",
    link: "/campaigns/ecosystem",
    textColor: "text-white",
    overlay: "bg-red-900/40 mix-blend-multiply",
  },
];

export default function HeroManagerPage() {
  const [headerData, setHeaderData] = useState(INITIAL_HEADER);
  const [gridItems, setGridItems] = useState(INITIAL_GRID_DATA);

  // Selected Item can be the Header OR a Grid Item
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- FIXED HANDLER ---
  const handleUpdate = (e) => {
    // 1. SAFETY CHECK: If no item is selected, stop immediately.
    if (!selectedItem) return;

    const { name, value } = e.target;

    // 2. Update the sidebar inputs (local state)
    setSelectedItem((prev) => (prev ? { ...prev, [name]: value } : null));

    // 3. Update the main data source
    if (selectedItem.type === "header") {
      setHeaderData((prev) => ({ ...prev, [name]: value }));
    } else {
      setGridItems((prev) =>
        prev.map((item) =>
          // Ensure we are comparing IDs safely
          item.id === selectedItem.id ? { ...item, [name]: value } : item,
        ),
      );
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API save
    setTimeout(() => {
      setIsSaving(false);
      alert("Layout Saved!");
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* 1. MAIN PREVIEW AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Hero Layout Manager
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Click the header text or any grid block to edit.
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
                <Save className="w-4 h-4" /> Save Layout
              </>
            )}
          </button>
        </header>

        {/* --- THE PREVIEW CANVAS --- */}
        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {/* A. EDITABLE HEADER SECTION */}
          <div
            onClick={() => setSelectedItem(headerData)}
            className={`
              mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 p-4 rounded-2xl transition-all cursor-pointer border-2
              ${
                selectedItem?.id === "hero_header"
                  ? "border-indigo-500 bg-indigo-50/10"
                  : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800"
              }
            `}
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 leading-[0.9]">
                {headerData.title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={
                      i === 2 || i === 3
                        ? "text-indigo-600 dark:text-indigo-500"
                        : ""
                    }
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                {headerData.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white group">
              {headerData.linkText}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </div>

          {/* B. THE GRID SECTION */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {gridItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`
                  ${item.colSpan} 
                  relative group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-200
                  ${
                    selectedItem?.id === item.id
                      ? "border-indigo-500 ring-4 ring-indigo-500/20 scale-[0.99]"
                      : "border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.01]"
                  }
                `}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 ${item.overlay}`} />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="absolute top-6 left-6 flex gap-2">
                    {item.badge && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.badgeColor || "bg-indigo-600 text-white"}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="relative z-10">
                    <h3
                      className={`text-sm font-bold uppercase tracking-widest opacity-80 ${item.textColor} mb-1`}
                    >
                      {item.subtitle}
                    </h3>
                    <h2
                      className={`text-3xl font-extrabold tracking-tight ${item.textColor} leading-none`}
                    >
                      {item.title}
                    </h2>
                  </div>
                  <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    <span className="bg-white text-indigo-900 px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                      <Type className="w-4 h-4" /> Edit Content
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. EDITOR SIDEBAR */}
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
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {selectedItem.type === "header"
                    ? "Editing Header"
                    : "Editing Grid Block"}
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {selectedItem.title || "Untitled"}
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
              {/* --- HEADER SPECIFIC INPUTS --- */}
              {selectedItem.type === "header" && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Heading className="w-3 h-3" /> Headline Text
                      </label>
                      <textarea
                        name="title"
                        rows={2}
                        value={selectedItem.title || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Subheadline
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={selectedItem.subtitle || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Link Label
                      </label>
                      <input
                        type="text"
                        name="linkText"
                        value={selectedItem.linkText || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* --- GRID ITEM SPECIFIC INPUTS --- */}
              {selectedItem.type === "grid_item" && (
                <>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Image URL
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="image"
                        value={selectedItem.image || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <div className="absolute right-3 top-3 w-4 h-4 rounded-full overflow-hidden border border-slate-300">
                        <img
                          src={selectedItem.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Type className="w-3 h-3" /> Product Name
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={selectedItem.title || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Subtitle / Caption
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={selectedItem.subtitle || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Badge & Visuals */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Badge
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="badge"
                        value={selectedItem.badge || ""}
                        onChange={handleUpdate}
                        placeholder="None"
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <select
                        name="badgeColor"
                        value={selectedItem.badgeColor || ""}
                        onChange={handleUpdate}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs outline-none"
                      >
                        <option value="bg-indigo-600 text-white">Blue</option>
                        <option value="bg-purple-600 text-white">Purple</option>
                        <option value="bg-red-600 text-white">Red</option>
                        <option value="bg-black text-white">Black</option>
                        <option value="bg-white/20 backdrop-blur-md text-white border border-white/30">
                          Glass
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* --- LINK INPUT (SHARED) --- */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 space-y-3">
                <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Destination URL
                </label>
                <input
                  type="text"
                  name={selectedItem.type === "header" ? "linkUrl" : "link"}
                  value={
                    selectedItem.type === "header"
                      ? selectedItem.linkUrl || ""
                      : selectedItem.link || ""
                  }
                  onChange={handleUpdate}
                  placeholder="/products/..."
                  className="w-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-lg p-2.5 text-sm font-mono text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
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
              <Type className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              Nothing Selected
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on the Header text or a Grid Block to start editing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
