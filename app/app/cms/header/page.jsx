"use client";

import React, { useState } from "react";
import {
  Save,
  Search,
  ShoppingBag,
  User,
  ChevronDown,
  Smartphone,
  Headphones,
  Tablet,
  Watch,
  Laptop,
  RotateCcw,
  CheckCircle2,
  X,
  Layout,
  Link as LinkIcon,
  ImageIcon,
  Grid,
  Type,
  MousePointer2,
} from "lucide-react";

// --- INITIAL DATA (Based on your dark mode screenshot) ---

const INITIAL_DATA = {
  // 1. Navbar Links
  navLinks: [
    { id: 1, label: "SHOP", href: "/shop" },
    { id: 2, label: "PHONES", href: "/shop/phones" },
    { id: 3, label: "ACCESSORIES", href: "/shop/accessories" },
    { id: 4, label: "REFURBISHED", href: "/shop/refurbished" },
  ],
  // 2. Mega Menu Categories
  categories: [
    {
      id: "c1",
      label: "Smartphones",
      href: "/shop/smartphones",
      icon: "smartphone",
    },
    {
      id: "c2",
      label: "Refurbished",
      href: "/shop/refurbished",
      icon: "refresh",
    },
    { id: "c3", label: "Tablets", href: "/shop/tablets", icon: "tablet" },
    { id: "c4", label: "Audio", href: "/shop/audio", icon: "headphones" },
    {
      id: "c5",
      label: "Accessories",
      href: "/shop/accessories",
      icon: "watch",
    },
  ],
  // 3. Mega Menu Promos
  promo1: {
    id: "promo1",
    title: "iPhone 16 Pro",
    subtitle: "Titanium design.",
    badge: "NEW ARRIVAL",
    image:
      "https://images.unsplash.com/photo-1696446702302-3f749a21228e?q=80&w=2070&auto=format&fit=crop",
    link: "/product/iphone-16",
    theme: "light",
  },
  promo2: {
    id: "promo2",
    title: "Premium Audio",
    subtitle: "Immersive sound experience.",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
    link: "/collections/audio",
    theme: "dark",
  },
};

export default function NavbarManager() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedId, setSelectedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleLinkUpdate = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((l) =>
        l.id === id ? { ...l, [field]: value } : l,
      ),
    }));
  };

  const handleCategoryUpdate = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    }));
  };

  const handlePromoUpdate = (promoKey, field, value) => {
    setData((prev) => ({
      ...prev,
      [promoKey]: { ...prev[promoKey], [field]: value },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Navigation Saved!");
    }, 800);
  };

  // Icon Helper
  const renderIcon = (name, className) => {
    switch (name) {
      case "smartphone":
        return <Smartphone className={className} />;
      case "headphones":
        return <Headphones className={className} />;
      case "tablet":
        return <Tablet className={className} />;
      case "watch":
        return <Watch className={className} />;
      case "laptop":
        return <Laptop className={className} />;
      case "refresh":
        return <RotateCcw className={className} />;
      default:
        return <Grid className={className} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Navigation & Menu
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage top links and the mega menu content below.
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
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col items-center justify-start bg-slate-100 dark:bg-black/50">
          <div className="w-full max-w-[1200px] space-y-8">
            {/* SECTION 1: NAVBAR STRIP */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                1. Top Navigation Bar
              </h3>
              <div className="bg-black text-white rounded-2xl p-4 flex items-center justify-between shadow-xl border border-slate-800">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-black text-sm">
                    I
                  </div>
                  <span className="text-xl font-black tracking-tighter">
                    IGEN.
                  </span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6">
                  {data.navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setSelectedId(link.id)}
                      className={`
                            text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-lg transition-all
                            ${
                              selectedId === link.id
                                ? "bg-white text-black scale-105"
                                : "text-slate-400 hover:text-white hover:bg-white/10"
                            }
                          `}
                    >
                      {link.label}
                    </button>
                  ))}

                  {/* Catalog Trigger (Static Visual) */}
                  <div className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase px-3 py-2 text-indigo-400">
                    CATALOG <ChevronDown className="w-3 h-3" />
                  </div>
                </div>

                {/* Icons */}
                <div className="flex gap-4 text-slate-400">
                  <Search className="w-5 h-5" />
                  <User className="w-5 h-5" />
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* SECTION 2: MEGA MENU PANEL */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                2. Mega Menu Content
              </h3>

              <div className="bg-[#0A0A0A] rounded-2xl border border-slate-800 shadow-2xl p-2 flex min-h-[400px]">
                {/* Left: Categories */}
                <div className="w-1/4 p-6 border-r border-slate-900">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
                    Categories
                  </h4>
                  <ul className="space-y-2">
                    {data.categories.map((cat) => (
                      <li
                        key={cat.id}
                        onClick={() => setSelectedId(cat.id)}
                        className={`
                              flex items-center gap-3 p-3 rounded-xl text-sm font-bold cursor-pointer transition-all
                              ${
                                selectedId === cat.id
                                  ? "bg-white text-black"
                                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
                              }
                            `}
                      >
                        {renderIcon(cat.icon, "w-4 h-4")}
                        {cat.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Middle: Promo 1 */}
                <div className="w-1/3 p-2">
                  <div
                    onClick={() => setSelectedId("promo1")}
                    className={`
                          h-full relative rounded-xl overflow-hidden group cursor-pointer border-2 transition-all
                          ${selectedId === "promo1" ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-transparent hover:opacity-90"}
                        `}
                  >
                    <img
                      src={data.promo1.image}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 flex flex-col justify-end">
                      <span className="self-start bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                        {data.promo1.badge}
                      </span>
                      <h4 className="text-white font-bold text-2xl leading-none mb-1">
                        {data.promo1.title}
                      </h4>
                      <p className="text-slate-300 text-xs">
                        {data.promo1.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Promo 2 */}
                <div className="w-5/12 p-2">
                  <div
                    onClick={() => setSelectedId("promo2")}
                    className={`
                          h-full relative rounded-xl overflow-hidden group cursor-pointer border-2 transition-all bg-[#111]
                          ${selectedId === "promo2" ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-transparent hover:opacity-90"}
                        `}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <img
                        src={data.promo2.image}
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h4 className="text-white font-bold text-2xl leading-none mb-1">
                        {data.promo2.title}
                      </h4>
                      <p className="text-slate-400 text-xs">
                        {data.promo2.subtitle}
                      </p>
                    </div>
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
        flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-50 absolute right-0 lg:relative
        ${selectedId ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}
      `}
      >
        {selectedId ? (
          <>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Editing
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white capitalize truncate max-w-[200px]">
                  {typeof selectedId === "number"
                    ? "Nav Link"
                    : selectedId.startsWith("c")
                      ? "Menu Category"
                      : "Promo Card"}
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
              {/* --- NAV LINK EDITOR --- */}
              {typeof selectedId === "number" && (
                <div className="space-y-4">
                  {(() => {
                    const link = data.navLinks.find((l) => l.id === selectedId);
                    return link ? (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Link Label
                          </label>
                          <input
                            value={link.label}
                            onChange={(e) =>
                              handleLinkUpdate(
                                selectedId,
                                "label",
                                e.target.value,
                              )
                            }
                            className="input-field font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Destination
                          </label>
                          <input
                            value={link.href}
                            onChange={(e) =>
                              handleLinkUpdate(
                                selectedId,
                                "href",
                                e.target.value,
                              )
                            }
                            className="input-field text-xs text-indigo-600"
                          />
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}

              {/* --- CATEGORY EDITOR --- */}
              {typeof selectedId === "string" && selectedId.startsWith("c") && (
                <div className="space-y-4">
                  {(() => {
                    const cat = data.categories.find(
                      (c) => c.id === selectedId,
                    );
                    return cat ? (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Category Name
                          </label>
                          <input
                            value={cat.label}
                            onChange={(e) =>
                              handleCategoryUpdate(
                                selectedId,
                                "label",
                                e.target.value,
                              )
                            }
                            className="input-field font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Icon
                          </label>
                          <select
                            value={cat.icon}
                            onChange={(e) =>
                              handleCategoryUpdate(
                                selectedId,
                                "icon",
                                e.target.value,
                              )
                            }
                            className="input-field"
                          >
                            <option value="smartphone">Smartphone</option>
                            <option value="headphones">Headphones</option>
                            <option value="tablet">Tablet</option>
                            <option value="laptop">Laptop</option>
                            <option value="watch">Watch</option>
                            <option value="refresh">Refresh/Refurb</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Destination
                          </label>
                          <input
                            value={cat.href}
                            onChange={(e) =>
                              handleCategoryUpdate(
                                selectedId,
                                "href",
                                e.target.value,
                              )
                            }
                            className="input-field text-xs text-indigo-600"
                          />
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}

              {/* --- PROMO EDITOR --- */}
              {typeof selectedId === "string" &&
                selectedId.startsWith("promo") && (
                  <div className="space-y-4">
                    {(() => {
                      const promo = data[selectedId];
                      return (
                        <>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                              Title
                            </label>
                            <input
                              value={promo.title}
                              onChange={(e) =>
                                handlePromoUpdate(
                                  selectedId,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="input-field font-bold text-lg"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                              Subtitle
                            </label>
                            <input
                              value={promo.subtitle}
                              onChange={(e) =>
                                handlePromoUpdate(
                                  selectedId,
                                  "subtitle",
                                  e.target.value,
                                )
                              }
                              className="input-field"
                            />
                          </div>

                          {selectedId === "promo1" && (
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                                Badge
                              </label>
                              <input
                                value={promo.badge}
                                onChange={(e) =>
                                  handlePromoUpdate(
                                    selectedId,
                                    "badge",
                                    e.target.value,
                                  )
                                }
                                className="input-field"
                              />
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                              <ImageIcon className="w-3 h-3" /> Image URL
                            </label>
                            <input
                              value={promo.image}
                              onChange={(e) =>
                                handlePromoUpdate(
                                  selectedId,
                                  "image",
                                  e.target.value,
                                )
                              }
                              className="input-field text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                              <LinkIcon className="w-3 h-3" /> Link
                            </label>
                            <input
                              value={promo.link}
                              onChange={(e) =>
                                handlePromoUpdate(
                                  selectedId,
                                  "link",
                                  e.target.value,
                                )
                              }
                              className="input-field text-xs text-indigo-600"
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedId(null)}
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
              <MousePointer2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              Select an Element
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on a Nav Link, Category, or Promo Card to edit it.
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
