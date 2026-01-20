"use client";

import React, { useState } from "react";
import {
  Save,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Plus,
  Trash2,
  LayoutTemplate,
} from "lucide-react";

// --- INITIAL DATA ---

const INITIAL_SECTION_HEADER = {
  id: "header_config",
  type: "header",
  badge: "Fresh Drops",
  title: "New Arrivals",
  tabs: ["View All", "Phones", "Audio", "Watches", "Accessories"],
};

const INITIAL_FEATURE_BANNER = {
  id: "feature_banner",
  type: "banner",
  badge: "Limited Edition",
  title: "Future Foldables.",
  description: "Next-gen hinged devices. In stock and ready to ship.",
  buttonText: "Shop Now",
  link: "/collections/foldables",
  image:
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
};

const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    type: "product",
    brand: "NOTHING",
    name: "Nothing Phone (2)",
    price: "Rs. 165,000",
    image:
      "https://images.unsplash.com/photo-1696446702302-3f749a21228e?q=80&w=2070&auto=format&fit=crop",
    timeBadge: "2 hrs ago",
    badgeColor: "bg-green-500 text-black",
    link: "/products/nothing-phone-2",
  },
  {
    id: "prod_2",
    type: "product",
    brand: "GOOGLE",
    name: "Pixel 8 Pro",
    price: "Rs. 285,000",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
    timeBadge: "1 day ago",
    badgeColor: "bg-indigo-500 text-white",
    link: "/products/pixel-8-pro",
  },
  {
    id: "prod_3",
    type: "product",
    brand: "APPLE",
    name: "iPhone 15",
    price: "Rs. 245,000",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1974&auto=format&fit=crop",
    timeBadge: "3 days ago",
    badgeColor: "bg-blue-500 text-white",
    link: "/products/iphone-15",
  },
];

export default function NewArrivalsManager() {
  const [headerData, setHeaderData] = useState(INITIAL_SECTION_HEADER);
  const [featureBanner, setFeatureBanner] = useState(INITIAL_FEATURE_BANNER);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLER TO UPDATE STATE ---
  const handleUpdate = (e) => {
    if (!selectedItem) return;
    const { name, value } = e.target;

    setSelectedItem((prev) => ({ ...prev, [name]: value }));

    if (selectedItem.type === "header") {
      setHeaderData((prev) => ({ ...prev, [name]: value }));
    } else if (selectedItem.type === "banner") {
      setFeatureBanner((prev) => ({ ...prev, [name]: value }));
    } else if (selectedItem.type === "product") {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedItem.id ? { ...p, [name]: value } : p,
        ),
      );
    }
  };

  const handleTabUpdate = (e) => {
    const val = e.target.value;
    const newTabs = val.split(",").map((t) => t.trim());
    setHeaderData((prev) => ({ ...prev, tabs: newTabs }));
    setSelectedItem((prev) => ({ ...prev, tabs: newTabs }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Changes Saved!");
    }, 800);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: VISUAL PREVIEW */}
      {/* Removed bg-black. Now uses global background colors. */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Top Toolbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              New Arrivals Manager
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Click elements to edit. Changes reflect in real-time.
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
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* A. HEADER SECTION */}
            <div
              onClick={() => setSelectedItem(headerData)}
              className={`
                group relative p-4 rounded-2xl border-2 cursor-pointer transition-all
                ${
                  selectedItem?.id === "header_config"
                    ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                    : "border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                }
              `}
            >
              {/* Badge & Title */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                    {headerData.badge}
                  </span>
                </div>
                {/* Adaptive Title Color */}
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {headerData.title}
                </h2>
              </div>

              {/* Tabs & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  {headerData.tabs.map((tab, idx) => (
                    <button
                      key={idx}
                      className={`
                        px-5 py-2 rounded-full text-sm font-medium transition-colors
                        ${
                          idx === 0
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                        }
                      `}
                    >
                      {tab}
                      {idx === 0 && (
                        <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                          10
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* B. CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT FEATURED BANNER (Span 4) */}
              <div
                onClick={() => setSelectedItem(featureBanner)}
                className={`
                  lg:col-span-4 relative h-[500px] rounded-3xl overflow-hidden cursor-pointer group border-2 transition-all shadow-xl
                  ${
                    selectedItem?.id === "feature_banner"
                      ? "border-indigo-500 ring-4 ring-indigo-500/20"
                      : "border-transparent hover:border-indigo-300 dark:hover:border-slate-700"
                  }
                `}
              >
                {/* Background Image & Gradient Overlay */}
                <div className="absolute inset-0 bg-slate-900">
                  <img
                    src={featureBanner.image}
                    className="w-full h-full object-cover opacity-60"
                    alt="Banner"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-transparent to-black/60 z-0"></div>

                {/* Content - Text White because it's on a dark image */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white mb-4 bg-white/10 backdrop-blur-sm">
                      {featureBanner.badge}
                    </span>
                    <h3 className="text-3xl font-extrabold text-white leading-tight mb-3">
                      {featureBanner.title.split(" ").map((word, i) => (
                        <div key={i}>{word}</div>
                      ))}
                    </h3>
                    <p className="text-slate-200 text-sm leading-relaxed max-w-[200px]">
                      {featureBanner.description}
                    </p>
                  </div>

                  <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] duration-200 shadow-lg">
                    {featureBanner.buttonText}{" "}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT PRODUCT CAROUSEL (Span 8) */}
              <div className="lg:col-span-8 overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedItem(product)}
                      className={`
                          min-w-[280px] w-[280px] relative rounded-3xl p-4 cursor-pointer group transition-all border
                          /* ADAPTIVE CARD STYLES */
                          ${
                            selectedItem?.id === product.id
                              ? "bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
                              : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                          }
                        `}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-black">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <div
                            className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 backdrop-blur-md shadow-sm ${product.badgeColor}`}
                          >
                            <Clock className="w-3 h-3" /> {product.timeBadge}
                          </div>
                        </div>

                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-white hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Text Details (Adaptive) */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          {product.brand}
                        </p>
                        <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-1 truncate">
                          {product.name}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                          {product.price}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add New Product Card */}
                  <div className="min-w-[100px] flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-400 transition-colors">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
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
                    : selectedItem.type === "banner"
                      ? "Featured Banner"
                      : "Product"}
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {selectedItem.title || selectedItem.name || "Configuration"}
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
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Badge Text
                    </label>
                    <input
                      name="badge"
                      value={headerData.badge}
                      onChange={handleUpdate}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Main Title
                    </label>
                    <input
                      name="title"
                      value={headerData.title}
                      onChange={handleUpdate}
                      className="input-field font-bold text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Tabs (Comma Separated)
                    </label>
                    <textarea
                      value={headerData.tabs.join(", ")}
                      onChange={handleTabUpdate}
                      className="input-field h-24 resize-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      e.g. View All, Phones, Audio...
                    </p>
                  </div>
                </div>
              )}

              {/* --- BANNER EDITOR --- */}
              {selectedItem.type === "banner" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Badge
                    </label>
                    <input
                      name="badge"
                      value={featureBanner.badge}
                      onChange={handleUpdate}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Title
                    </label>
                    <textarea
                      name="title"
                      value={featureBanner.title}
                      onChange={handleUpdate}
                      className="input-field h-20 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={featureBanner.description}
                      onChange={handleUpdate}
                      className="input-field h-24"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Button Text
                    </label>
                    <input
                      name="buttonText"
                      value={featureBanner.buttonText}
                      onChange={handleUpdate}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Destination Link
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        name="link"
                        value={featureBanner.link}
                        onChange={handleUpdate}
                        className="input-field pl-9 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- PRODUCT EDITOR --- */}
              {selectedItem.type === "product" && (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden mb-4 relative group">
                    <img
                      src={selectedItem.image}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> Change Image
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Brand Name
                    </label>
                    <input
                      name="brand"
                      value={selectedItem.brand}
                      onChange={handleUpdate}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Product Name
                    </label>
                    <input
                      name="name"
                      value={selectedItem.name}
                      onChange={handleUpdate}
                      className="input-field font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Price Display
                    </label>
                    <input
                      name="price"
                      value={selectedItem.price}
                      onChange={handleUpdate}
                      className="input-field"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Time Badge
                    </label>
                    <div className="flex gap-2">
                      <input
                        name="timeBadge"
                        value={selectedItem.timeBadge}
                        onChange={handleUpdate}
                        className="input-field w-2/3"
                      />
                      <select
                        name="badgeColor"
                        value={selectedItem.badgeColor}
                        onChange={handleUpdate}
                        className="input-field w-1/3 text-xs p-0 px-2"
                      >
                        <option value="bg-green-500 text-black">Green</option>
                        <option value="bg-blue-500 text-white">Blue</option>
                        <option value="bg-red-500 text-white">Red</option>
                        <option value="bg-indigo-500 text-white">Indigo</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                    <button className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg transition-colors text-sm font-bold">
                      <Trash2 className="w-4 h-4" /> Remove Product
                    </button>
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
              <LayoutTemplate className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              New Arrivals Manager
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on the Header, Banner, or any Product Card in the preview to
              edit it.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
