"use client";

import React, { useState } from "react";
import {
  Save,
  Battery,
  Bluetooth,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  Globe,
  Play,
  Zap,
  Star,
  Check,
  X,
  Layout,
  Type,
  ImageIcon,
  Clock,
  Link as LinkIcon,
  List,
} from "lucide-react";

// --- INITIAL DATA ---
// Make sure you copy this entire object!
const INITIAL_DATA = {
  // Main Product Card
  product: {
    title: "Sony WH-1000XM5",
    price: "$299",
    oldPrice: "$399",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
  },
  // Review Card
  review: {
    rating: "4.9",
    text: "Best noise cancelling ever.",
    author: "VERIFIED BUYER",
  },
  // Timer Card
  timer: {
    endsIn: "03:46:22",
    badge: "FLASH",
  },
  // Video Card
  video: {
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
    label: "WATCH REVIEW",
    videoUrl: "https://youtube.com/",
  },
  // Specs (Right Column)
  specs: {
    battery: "30 Hours",
    connectivity: "Bluetooth 5.2",
  },
  // Buy Card
  buy: {
    label: "Buy Now",
    sublabel: "FREE EXPRESS SHIPPING",
  },
  // Service List (Crucial for the map function)
  services: [
    { id: 1, text: "30-Day Returns", icon: "return" },
    { id: 2, text: "2 Year Warranty", icon: "shield" },
    { id: 3, text: "Global Shipping", icon: "globe" },
  ],
};

export default function ProductShowcaseManager() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleUpdate = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Special handler for the services array
  const handleServiceUpdate = (id, value) => {
    setData((prev) => ({
      ...prev,
      services: prev.services
        ? prev.services.map((s) => (s.id === id ? { ...s, text: value } : s))
        : [],
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Showcase Layout Saved!");
    }, 800);
  };

  // Icon Helper
  const getServiceIcon = (name) => {
    switch (name) {
      case "return":
        return <RotateCcw className="w-4 h-4" />;
      case "shield":
        return <ShieldCheck className="w-4 h-4" />;
      case "globe":
        return <Globe className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Product Showcase
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Bento-style grid for your hero product. Click any block to edit.
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
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col items-center">
          <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* COLUMN 1 & 2 (Left - Wide) */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
              {/* MAIN PRODUCT CARD */}
              <div
                onClick={() => setSelectedGroup("product")}
                className={`
                  relative h-[320px] rounded-[2rem] p-8 cursor-pointer transition-all border
                  bg-white dark:bg-slate-900
                  ${
                    selectedGroup === "product"
                      ? "border-indigo-500 ring-4 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg"
                  }
                `}
              >
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold mb-4">
                    {data.product.badge}
                  </span>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                    {data.product.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-red-500">
                      {data.product.price}
                    </span>
                    <span className="text-lg text-slate-400 line-through decoration-slate-400">
                      {data.product.oldPrice}
                    </span>
                  </div>
                </div>

                {/* Product Image Absolute */}
                <img
                  src={data.product.image}
                  className="absolute bottom-0 right-0 w-3/5 h-auto object-contain drop-shadow-2xl"
                  alt="Product"
                />

                {/* Fake Color Picker */}
                <div className="absolute bottom-8 left-8 flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-900 flex items-center justify-center">
                    <Check className="w-4 h-4 text-slate-900" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
                </div>
              </div>

              {/* RATING CARD */}
              <div
                onClick={() => setSelectedGroup("review")}
                className={`
                  h-[140px] rounded-[2rem] p-8 flex items-center justify-between cursor-pointer transition-all border
                  bg-slate-900 text-white
                  ${
                    selectedGroup === "review"
                      ? "border-indigo-500 ring-4 ring-indigo-500/20"
                      : "border-transparent hover:scale-[1.01]"
                  }
                `}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-amber-400">
                      {data.review.rating}
                    </span>
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="pl-4 border-l-2 border-amber-500/50">
                    <p className="text-sm italic font-medium text-slate-200">
                      "{data.review.text}"
                    </p>
                    <p className="text-[10px] font-bold text-amber-500 mt-1 uppercase">
                      {data.review.author}
                    </p>
                  </div>
                </div>
                {/* Fake Avatars */}
                <div className="hidden sm:flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900"
                    ></div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                    +2k
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (Middle) */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* TIMER CARD */}
              <div
                onClick={() => setSelectedGroup("timer")}
                className={`
                  h-[160px] rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer transition-all border
                  bg-black text-white
                  ${
                    selectedGroup === "timer"
                      ? "border-indigo-500 ring-4 ring-indigo-500/20"
                      : "border-transparent hover:scale-[1.02]"
                  }
                 `}
              >
                <div className="flex justify-between items-start">
                  <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="px-2 py-0.5 rounded border border-white/20 text-[10px] font-bold uppercase">
                    {data.timer.badge}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    ENDS IN
                  </p>
                  <p className="text-2xl font-mono font-bold tracking-wider">
                    {data.timer.endsIn}
                  </p>
                </div>
              </div>

              {/* VIDEO CARD */}
              <div
                onClick={() => setSelectedGroup("video")}
                className={`
                  flex-1 rounded-[2rem] overflow-hidden relative cursor-pointer group transition-all border
                  bg-slate-100 dark:bg-slate-800
                  ${
                    selectedGroup === "video"
                      ? "border-indigo-500 ring-4 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800"
                  }
                `}
              >
                <img
                  src={data.video.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end pb-8">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xl">
                    <Play className="w-5 h-5 text-white fill-current ml-1" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {data.video.label}
                  </span>
                </div>

                {/* Link Indicator Overlay */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <LinkIcon className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* COLUMN 4 (Right) */}
            <div className="flex flex-col gap-4">
              {/* SPECS - BATTERY */}
              <div
                onClick={() => setSelectedGroup("specs")}
                className={`
                   p-5 rounded-[1.5rem] flex items-center gap-4 cursor-pointer transition-all border
                   bg-white dark:bg-slate-900
                   ${selectedGroup === "specs" ? "border-indigo-500" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}
                 `}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Battery className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {data.specs.battery}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Battery
                  </p>
                </div>
              </div>

              {/* SPECS - BLUETOOTH */}
              <div
                onClick={() => setSelectedGroup("specs")}
                className={`
                   p-5 rounded-[1.5rem] flex items-center gap-4 cursor-pointer transition-all border
                   bg-white dark:bg-slate-900
                   ${selectedGroup === "specs" ? "border-indigo-500" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}
                 `}
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {data.specs.connectivity}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Wireless
                  </p>
                </div>
              </div>

              {/* BUY CARD */}
              <div
                onClick={() => setSelectedGroup("buy")}
                className={`
                   p-6 rounded-[1.5rem] cursor-pointer transition-all border relative overflow-hidden group
                   bg-white dark:bg-white text-slate-900
                   ${selectedGroup === "buy" ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200 hover:shadow-xl"}
                 `}
              >
                <div className="flex justify-between items-start mb-6">
                  <ShoppingBag className="w-6 h-6" />
                  <div className="w-6 h-6 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold mb-1">
                  {data.buy.label}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {data.buy.sublabel}
                </p>
              </div>

              {/* SERVICE LIST (Now Editable) */}
              <div
                onClick={() => setSelectedGroup("services")}
                className={`
                   p-6 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 border space-y-4 cursor-pointer transition-all
                   ${selectedGroup === "services" ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800 hover:border-slate-300"}
                 `}
              >
                {/* SAFE MAP using optional chaining */}
                {data.services?.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-bold"
                  >
                    {getServiceIcon(service.icon)} {service.text}
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
        ${selectedGroup ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}
      `}
      >
        {selectedGroup ? (
          <>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Editing
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white capitalize">
                  {selectedGroup.replace("_", " ")} Section
                </h2>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* --- PRODUCT EDITOR --- */}
              {selectedGroup === "product" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Badge
                    </label>
                    <input
                      value={data.product.badge}
                      onChange={(e) =>
                        handleUpdate("product", "badge", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Product Title
                    </label>
                    <textarea
                      value={data.product.title}
                      onChange={(e) =>
                        handleUpdate("product", "title", e.target.value)
                      }
                      className="input-field font-bold text-lg resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Price
                      </label>
                      <input
                        value={data.product.price}
                        onChange={(e) =>
                          handleUpdate("product", "price", e.target.value)
                        }
                        className="input-field font-bold text-red-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Old Price
                      </label>
                      <input
                        value={data.product.oldPrice}
                        onChange={(e) =>
                          handleUpdate("product", "oldPrice", e.target.value)
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Image URL
                    </label>
                    <input
                      value={data.product.image}
                      onChange={(e) =>
                        handleUpdate("product", "image", e.target.value)
                      }
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              )}

              {/* --- TIMER EDITOR --- */}
              {selectedGroup === "timer" && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 text-white rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">PREVIEW</p>
                    <p className="text-2xl font-mono">{data.timer.endsIn}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Ends In (Time)
                    </label>
                    <input
                      value={data.timer.endsIn}
                      onChange={(e) =>
                        handleUpdate("timer", "endsIn", e.target.value)
                      }
                      className="input-field font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Badge Text
                    </label>
                    <input
                      value={data.timer.badge}
                      onChange={(e) =>
                        handleUpdate("timer", "badge", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {/* --- REVIEW EDITOR --- */}
              {selectedGroup === "review" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Rating Score
                    </label>
                    <input
                      value={data.review.rating}
                      onChange={(e) =>
                        handleUpdate("review", "rating", e.target.value)
                      }
                      className="input-field font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Review Text
                    </label>
                    <textarea
                      value={data.review.text}
                      onChange={(e) =>
                        handleUpdate("review", "text", e.target.value)
                      }
                      className="input-field resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Author Label
                    </label>
                    <input
                      value={data.review.author}
                      onChange={(e) =>
                        handleUpdate("review", "author", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {/* --- VIDEO EDITOR --- */}
              {selectedGroup === "video" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Button Label
                    </label>
                    <input
                      value={data.video.label}
                      onChange={(e) =>
                        handleUpdate("video", "label", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <LinkIcon className="w-3 h-3" /> Video Link (YouTube/MP4)
                    </label>
                    <input
                      value={data.video.videoUrl}
                      onChange={(e) =>
                        handleUpdate("video", "videoUrl", e.target.value)
                      }
                      className="input-field text-xs font-mono"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Thumbnail URL
                    </label>
                    <input
                      value={data.video.image}
                      onChange={(e) =>
                        handleUpdate("video", "image", e.target.value)
                      }
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              )}

              {/* --- SPECS EDITOR --- */}
              {selectedGroup === "specs" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Battery Life
                    </label>
                    <input
                      value={data.specs.battery}
                      onChange={(e) =>
                        handleUpdate("specs", "battery", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Connectivity
                    </label>
                    <input
                      value={data.specs.connectivity}
                      onChange={(e) =>
                        handleUpdate("specs", "connectivity", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {/* --- SERVICES EDITOR --- */}
              {selectedGroup === "services" && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mb-4">
                    <p className="text-xs text-indigo-600 dark:text-indigo-300 font-bold flex items-center gap-2">
                      <List className="w-4 h-4" /> Service Highlights
                    </p>
                  </div>
                  {data.services?.map((service, index) => (
                    <div key={service.id} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Item {index + 1}
                      </label>
                      <input
                        value={service.text}
                        onChange={(e) =>
                          handleServiceUpdate(service.id, e.target.value)
                        }
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* --- BUY EDITOR --- */}
              {selectedGroup === "buy" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Main Label
                    </label>
                    <input
                      value={data.buy.label}
                      onChange={(e) =>
                        handleUpdate("buy", "label", e.target.value)
                      }
                      className="input-field font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Sub Label
                    </label>
                    <input
                      value={data.buy.sublabel}
                      onChange={(e) =>
                        handleUpdate("buy", "sublabel", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedGroup(null)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                <Check className="w-4 h-4" /> Done Editing
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
              Showcase Manager
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on any block (Product, Review, Services, etc.) to edit.
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
