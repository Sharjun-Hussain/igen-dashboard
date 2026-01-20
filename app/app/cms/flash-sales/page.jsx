"use client";

import React, { useState } from "react";
import {
  Save,
  Clock,
  Tag,
  Percent,
  DollarSign,
  Image as ImageIcon,
  ShoppingBag,
  Star,
  Trash2,
  Plus,
  CheckCircle2,
  X,
  Zap,
  ChevronRight,
  Timer,
} from "lucide-react";

// --- INITIAL DATA ---

const INITIAL_SECTION_HEADER = {
  id: "header_config",
  type: "header",
  badge: "Limited Time Offers",
  title: "Deals of the Week",
  linkText: "View All Offers",
};

const INITIAL_MAIN_DEAL = {
  id: "main_deal",
  type: "main_deal",
  productName: "iPhone 15 Pro Max",
  tag: "TITANIUM - 256GB",
  originalPrice: "Rs. 425,000",
  salePrice: "Rs. 385,000",
  saveAmount: "Rs. 40,000",
  discountBadge: "-11% OFF",
  endTime: "23 : 43 : 16", // Static string for CMS preview
  image:
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
  bgColor: "bg-slate-950", // The specific dark look from your screenshot
};

const INITIAL_SIDE_DEALS = [
  {
    id: "deal_1",
    type: "side_deal",
    brand: "APPLE",
    name: "MagSafe Charger",
    originalPrice: "Rs. 15,000",
    salePrice: "Rs. 12,500",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1625723347040-0fdf78cb3c1e?q=80&w=1974&auto=format&fit=crop",
    badge: "SALE",
  },
  {
    id: "deal_2",
    type: "side_deal",
    brand: "SAMSUNG",
    name: "Samsung 45W Adapter",
    originalPrice: "Rs. 10,500",
    salePrice: "Rs. 8,500",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
    badge: "SALE",
  },
  {
    id: "deal_3",
    type: "side_deal",
    brand: "GOOGLE",
    name: "Pixel Buds Pro",
    originalPrice: "Rs. 55,000",
    salePrice: "Rs. 45,000",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1572569028738-411a09778009?q=80&w=2070&auto=format&fit=crop",
    badge: "HOT",
  },
];

export default function FlashSalesManager() {
  const [headerData, setHeaderData] = useState(INITIAL_SECTION_HEADER);
  const [mainDeal, setMainDeal] = useState(INITIAL_MAIN_DEAL);
  const [sideDeals, setSideDeals] = useState(INITIAL_SIDE_DEALS);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleUpdate = (e) => {
    if (!selectedItem) return;
    const { name, value } = e.target;

    setSelectedItem((prev) => ({ ...prev, [name]: value }));

    if (selectedItem.type === "header") {
      setHeaderData((prev) => ({ ...prev, [name]: value }));
    } else if (selectedItem.type === "main_deal") {
      setMainDeal((prev) => ({ ...prev, [name]: value }));
    } else if (selectedItem.type === "side_deal") {
      setSideDeals((prev) =>
        prev.map((d) =>
          d.id === selectedItem.id ? { ...d, [name]: value } : d,
        ),
      );
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Flash Sales Updated!");
    }, 800);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Flash Sales Manager
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage your "Deals of the Week" timer and products.
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
                flex flex-col md:flex-row md:items-end justify-between gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${
                  selectedItem?.id === "header_config"
                    ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                    : "border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                }
              `}
            >
              <div>
                <span className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest mb-1">
                  <Zap className="w-3 h-3 fill-current" /> {headerData.badge}
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {headerData.title}
                </h2>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                {headerData.linkText} <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* B. MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: MAIN DEAL (Span 7) */}
              <div
                onClick={() => setSelectedItem(mainDeal)}
                className={`
                  lg:col-span-7 relative overflow-hidden rounded-3xl p-8 lg:p-10 cursor-pointer group transition-all shadow-2xl
                  ${
                    selectedItem?.id === "main_deal"
                      ? "ring-4 ring-indigo-500/30 border-indigo-500"
                      : "hover:shadow-3xl"
                  }
                  /* Main Deal often looks best Dark, but here we adapt or keep it dark as per screenshot */
                  bg-slate-900 dark:bg-black text-white
                `}
              >
                {/* Background Image Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-transparent z-0"></div>
                <img
                  src={mainDeal.image}
                  className="absolute bottom-[-10%] right-[-10%] w-[80%] h-auto object-contain z-0 opacity-50 md:opacity-100 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
                  alt="Main Deal"
                />

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[400px]">
                  {/* Top Row: Timer & Badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                      <Timer className="w-4 h-4 text-red-400 animate-pulse" />
                      <div className="text-sm font-mono font-bold tracking-widest text-white">
                        <span className="text-xs text-slate-400 mr-2 uppercase font-sans">
                          Ends In:
                        </span>
                        {mainDeal.endTime}
                      </div>
                    </div>
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/20">
                      {mainDeal.discountBadge}
                    </span>
                  </div>

                  {/* Bottom Row: Product Details */}
                  <div className="max-w-md mt-auto">
                    <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                      <Tag className="w-3 h-3" /> {mainDeal.tag}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[0.9]">
                      {mainDeal.productName}
                    </h3>

                    <div className="flex items-end gap-4 mb-6">
                      <div>
                        <span className="text-slate-400 text-sm line-through block">
                          {mainDeal.originalPrice}
                        </span>
                        <span className="text-3xl font-bold text-white">
                          {mainDeal.salePrice}
                        </span>
                      </div>
                      <div className="text-emerald-400 text-xs font-bold uppercase tracking-wide mb-2">
                        You Save <br /> {mainDeal.saveAmount}
                      </div>
                    </div>

                    <button className="w-full sm:w-auto bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                      Add to Cart <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: SIDE DEALS (Span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {sideDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedItem(deal)}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border
                      ${
                        selectedItem?.id === deal.id
                          ? "bg-white dark:bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                          : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }
                    `}
                  >
                    {/* Image */}
                    <div className="w-24 h-24 shrink-0 bg-slate-100 dark:bg-black rounded-xl p-2 relative">
                      <img
                        src={deal.image}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        alt={deal.name}
                      />
                      <span className="absolute top-0 left-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg rounded-tl-lg">
                        {deal.badge}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {deal.brand}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-current" />{" "}
                          {deal.rating}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white truncate mb-1">
                        {deal.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 dark:text-white font-bold">
                          {deal.salePrice}
                        </span>
                        <span className="text-slate-400 text-xs line-through">
                          {deal.originalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <button className="w-10 h-10 shrink-0 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-slate-800 transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button className="mt-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-sm font-bold hover:text-indigo-600 hover:border-indigo-400 transition-colors flex items-center justify-center gap-2">
                  View All Deals <ChevronRight className="w-4 h-4" />
                </button>
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
                  Editing {selectedItem.type.replace("_", " ")}
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {selectedItem.title ||
                    selectedItem.productName ||
                    selectedItem.name ||
                    "Config"}
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
                      Section Title
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
                      Link Text
                    </label>
                    <input
                      name="linkText"
                      value={headerData.linkText}
                      onChange={handleUpdate}
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {/* --- MAIN DEAL EDITOR --- */}
              {selectedItem.type === "main_deal" && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Timer Countdown
                    </label>
                    <input
                      name="endTime"
                      value={mainDeal.endTime}
                      onChange={handleUpdate}
                      className="input-field font-mono text-center"
                      placeholder="HH : MM : SS"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Product Name
                    </label>
                    <input
                      name="productName"
                      value={mainDeal.productName}
                      onChange={handleUpdate}
                      className="input-field font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Sale Price
                      </label>
                      <input
                        name="salePrice"
                        value={mainDeal.salePrice}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Original
                      </label>
                      <input
                        name="originalPrice"
                        value={mainDeal.originalPrice}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Saved Amount Text
                    </label>
                    <input
                      name="saveAmount"
                      value={mainDeal.saveAmount}
                      onChange={handleUpdate}
                      className="input-field text-emerald-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Tag Line
                      </label>
                      <input
                        name="tag"
                        value={mainDeal.tag}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Discount Badge
                      </label>
                      <input
                        name="discountBadge"
                        value={mainDeal.discountBadge}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Image URL
                    </label>
                    <input
                      name="image"
                      value={mainDeal.image}
                      onChange={handleUpdate}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              )}

              {/* --- SIDE DEAL EDITOR --- */}
              {selectedItem.type === "side_deal" && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-xl p-2">
                    <img
                      src={selectedItem.image}
                      className="w-full h-full object-contain"
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Sale Price
                      </label>
                      <input
                        name="salePrice"
                        value={selectedItem.salePrice}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Original
                      </label>
                      <input
                        name="originalPrice"
                        value={selectedItem.originalPrice}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Brand
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
                        Corner Badge
                      </label>
                      <input
                        name="badge"
                        value={selectedItem.badge}
                        onChange={handleUpdate}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Image URL
                    </label>
                    <input
                      name="image"
                      value={selectedItem.image}
                      onChange={handleUpdate}
                      className="input-field text-xs"
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
              <Zap className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              Flash Sale Manager
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Select the Main Deal or any Side Deal to configure pricing and
              timers.
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
