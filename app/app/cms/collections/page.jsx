"use client";

import React, { useState } from "react";
import {
  Save,
  Smartphone,
  Headphones,
  Zap,
  Gamepad2,
  ShieldCheck,
  ImageIcon,
  Link as LinkIcon,
  Type,
  Check,
  X,
  Layout,
  ArrowUpRight,
  Tag,
} from "lucide-react";

// --- INITIAL DATA (Matching image_6bdd67.png) ---

const INITIAL_DATA = {
  header: {
    label: "LEVEL UP YOUR TECH",
    titleStart: "Next Gen",
    titleEnd: "Mobile.",
    description:
      "Discover the latest flagships, premium accessories, and high-performance gear. Upgrade your digital lifestyle today.",
  },
  cards: {
    hero: {
      id: "hero",
      title: "iPhone 15 Pro Max",
      subtitle:
        "Experience the lightest, most durable design with the A17 Pro chip.",
      badge: "TITANIUM SERIES",
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
      link: "/collections/iphone-15-pro-max",
      icon: "phone",
    },
    audio: {
      id: "audio",
      title: "Premium Audio",
      badge: "NOISE CANCELLING",
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
      link: "/collections/audio",
      icon: "headphone",
    },
    power: {
      id: "power",
      title: "Power & Charging",
      badge: "MAGSAFE & TYPE-C",
      image:
        "https://images.unsplash.com/photo-1625723347040-0fdf78cb3c1e?q=80&w=1974&auto=format&fit=crop",
      link: "/collections/power",
      icon: "zap",
    },
    gaming: {
      id: "gaming",
      title: "Gaming Beasts",
      badge: "144HZ & SNAPDRAGON",
      image:
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop", // Laptop/Gaming setup
      link: "/collections/gaming",
      icon: "gamepad",
    },
    protection: {
      id: "protection",
      title: "Protection",
      badge: "CASES & TEMPERED GLASS",
      image:
        "https://images.unsplash.com/photo-1592910793739-12348c41469e?q=80&w=2071&auto=format&fit=crop", // Case/Accessories
      link: "/collections/protection",
      icon: "shield",
    },
  },
};

export default function CollectionsManager() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedId, setSelectedId] = useState(null); // 'header', 'hero', 'audio', etc.
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleHeaderUpdate = (field, value) => {
    setData((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  };

  const handleCardUpdate = (cardId, field, value) => {
    setData((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: { ...prev.cards[cardId], [field]: value },
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Collections Layout Saved!");
    }, 800);
  };

  // Helper to get Icon component
  const getIcon = (name) => {
    switch (name) {
      case "phone":
        return <Smartphone className="w-4 h-4" />;
      case "headphone":
        return <Headphones className="w-4 h-4" />;
      case "zap":
        return <Zap className="w-4 h-4" />;
      case "gamepad":
        return <Gamepad2 className="w-4 h-4" />;
      case "shield":
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Layout className="w-4 h-4" />;
    }
  };

  const selectedItem =
    selectedId === "header" ? data.header : data.cards[selectedId];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Collections Grid
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage the "Next Gen Mobile" bento grid section.
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
          <div className="max-w-[1200px] w-full space-y-8">
            {/* A. SECTION HEADER */}
            <div
              onClick={() => setSelectedId("header")}
              className={`
                flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 rounded-2xl cursor-pointer transition-all border-2
                ${
                  selectedId === "header"
                    ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                    : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                }
              `}
            >
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 block">
                  {data.header.label}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                  {data.header.titleStart}{" "}
                  <span className="text-slate-500 dark:text-slate-600">
                    {data.header.titleEnd}
                  </span>
                </h2>
              </div>
              <p className="max-w-sm text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-right md:text-right">
                {data.header.description}
              </p>
            </div>

            {/* B. BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
              {/* 1. HERO CARD (Left Large) */}
              <div
                onClick={() => setSelectedId("hero")}
                className={`
                  md:col-span-7 md:row-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all
                  ${selectedId === "hero" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-transparent hover:opacity-95"}
                `}
              >
                <img
                  src={data.cards.hero.image}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  {/* Badge */}
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {data.cards.hero.badge}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="max-w-md">
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 text-white">
                        {getIcon(data.cards.hero.icon)}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {data.cards.hero.title}
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {data.cards.hero.subtitle}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. RIGHT COLUMN (Audio & Power) */}
              <div className="md:col-span-5 md:row-span-2 flex flex-col gap-4">
                {/* Audio Card */}
                <div
                  onClick={() => setSelectedId("audio")}
                  className={`
                    flex-1 relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all
                    ${selectedId === "audio" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-transparent hover:opacity-95"}
                  `}
                >
                  <img
                    src={data.cards.audio.image}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-between">
                    <div className="self-end bg-white/20 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full">
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                        {data.cards.audio.badge}
                      </span>
                    </div>
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 text-white">
                        {getIcon(data.cards.audio.icon)}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {data.cards.audio.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Power Card */}
                <div
                  onClick={() => setSelectedId("power")}
                  className={`
                    flex-1 relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all
                    ${selectedId === "power" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-transparent hover:opacity-95"}
                  `}
                >
                  <img
                    src={data.cards.power.image}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-6 flex flex-col justify-between">
                    <div className="self-end bg-white/20 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full">
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                        {data.cards.power.badge}
                      </span>
                    </div>
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 text-white">
                        {getIcon(data.cards.power.icon)}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {data.cards.power.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* C. BOTTOM ROW (Gaming & Protection) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[250px]">
              {/* Gaming Card */}
              <div
                onClick={() => setSelectedId("gaming")}
                className={`
                    relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all
                    ${selectedId === "gaming" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-transparent hover:opacity-95"}
                  `}
              >
                <img
                  src={data.cards.gaming.image}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-end">
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {data.cards.gaming.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 text-white">
                    {getIcon(data.cards.gaming.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {data.cards.gaming.title}
                  </h3>
                </div>
              </div>

              {/* Protection Card */}
              <div
                onClick={() => setSelectedId("protection")}
                className={`
                    relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all
                    ${selectedId === "protection" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-transparent hover:opacity-95"}
                  `}
              >
                <img
                  src={data.cards.protection.image}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {data.cards.protection.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 text-white">
                    {getIcon(data.cards.protection.icon)}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {data.cards.protection.title}
                  </h3>
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
        ${selectedId ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}
      `}
      >
        {selectedId ? (
          <>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Editing
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white capitalize">
                  {selectedId === "header"
                    ? "Header Section"
                    : `${selectedId} Card`}
                </h2>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* --- HEADER EDITOR --- */}
              {selectedId === "header" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Top Label
                    </label>
                    <input
                      value={data.header.label}
                      onChange={(e) =>
                        handleHeaderUpdate("label", e.target.value)
                      }
                      className="input-field text-indigo-600 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Title Start
                      </label>
                      <input
                        value={data.header.titleStart}
                        onChange={(e) =>
                          handleHeaderUpdate("titleStart", e.target.value)
                        }
                        className="input-field font-bold text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Title End
                      </label>
                      <input
                        value={data.header.titleEnd}
                        onChange={(e) =>
                          handleHeaderUpdate("titleEnd", e.target.value)
                        }
                        className="input-field font-bold text-lg text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Description
                    </label>
                    <textarea
                      value={data.header.description}
                      onChange={(e) =>
                        handleHeaderUpdate("description", e.target.value)
                      }
                      className="input-field resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* --- CARD EDITOR (Generic for all cards) --- */}
              {selectedId !== "header" && selectedItem && (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden mb-2 relative">
                    <img
                      src={selectedItem.image}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/50 text-white px-3 py-1 rounded text-xs backdrop-blur-sm">
                        Image Preview
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Background Image URL
                    </label>
                    <input
                      value={selectedItem.image}
                      onChange={(e) =>
                        handleCardUpdate(selectedId, "image", e.target.value)
                      }
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Card Title
                    </label>
                    <input
                      value={selectedItem.title}
                      onChange={(e) =>
                        handleCardUpdate(selectedId, "title", e.target.value)
                      }
                      className="input-field font-bold text-lg"
                    />
                  </div>

                  {selectedId === "hero" && (
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Subtitle
                      </label>
                      <textarea
                        value={selectedItem.subtitle}
                        onChange={(e) =>
                          handleCardUpdate(
                            selectedId,
                            "subtitle",
                            e.target.value,
                          )
                        }
                        className="input-field resize-none"
                        rows={2}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Badge Text
                    </label>
                    <input
                      value={selectedItem.badge}
                      onChange={(e) =>
                        handleCardUpdate(selectedId, "badge", e.target.value)
                      }
                      className="input-field font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> Destination URL
                    </label>
                    <input
                      value={selectedItem.link}
                      onChange={(e) =>
                        handleCardUpdate(selectedId, "link", e.target.value)
                      }
                      className="input-field text-xs text-indigo-600"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedId(null)}
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
              Collections Manager
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on the Header or any Grid Card to customize content.
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
