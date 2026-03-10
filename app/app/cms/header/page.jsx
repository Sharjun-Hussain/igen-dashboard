"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
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
  X,
  Layout,
  Link as LinkIcon,
  ImageIcon,
  Grid,
  RefreshCw,
  AlertCircle,
  Upload,
  MousePointer2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const STORAGE_BASE = API_BASE?.replace("/api/v1", "");

const INITIAL_DATA = {
  navLinks: [
    { id: 1, label: "SHOP", href: "/shop" },
    { id: 2, label: "PHONES", href: "/shop/phones" },
    { id: 3, label: "ACCESSORIES", href: "/shop/accessories" },
    { id: 4, label: "REFURBISHED", href: "/shop/refurbished" },
  ],
  categories: [
    { id: "c1", label: "Smartphones", href: "/shop/smartphones", icon: "smartphone" },
    { id: "c2", label: "Refurbished", href: "/shop/refurbished", icon: "refresh" },
    { id: "c3", label: "Tablets", href: "/shop/tablets", icon: "tablet" },
    { id: "c4", label: "Audio", href: "/shop/audio", icon: "headphones" },
    { id: "c5", label: "Accessories", href: "/shop/accessories", icon: "watch" },
  ],
  promo1: {
    id: "promo1",
    title: "iPhone 16 Pro",
    subtitle: "Titanium design.",
    badge: "NEW ARRIVAL",
    image: "https://images.unsplash.com/photo-1696446702302-3f749a21228e?q=80&w=2070&auto=format&fit=crop",
    link: "/product/iphone-16",
    theme: "light",
  },
  promo2: {
    id: "promo2",
    title: "Premium Audio",
    subtitle: "Immersive sound experience.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
    link: "/collections/audio",
    theme: "dark",
  },
};

export default function NavbarManager() {
  const { data: session } = useSession();
  const [data, setData] = useState(INITIAL_DATA);
  const [previews, setPreviews] = useState({ promo1: "", promo2: "" });
  const [selectedId, setSelectedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputs = {
    promo1: useRef(null),
    promo2: useRef(null),
  };

  // --- FETCH CMS DATA ---
  useEffect(() => {
    if (!session?.accessToken) return;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/cms`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/json",
          },
        });
        const apiData = await res.json();
        if (!res.ok) throw new Error(apiData.message || "Failed to fetch");

        const sections = apiData?.data?.home || {};
        const newData = { ...INITIAL_DATA };
        const newPreviews = { ...previews };

        const mapSection = (sectionName, keys) => {
          const sec = sections[sectionName] || [];
          if (sec.length === 0) return null;
          const mapped = {};
          sec.forEach((i) => (mapped[i.key] = i.value));
          return mapped;
        };

        // 1. Nav Links
        for (let i = 1; i <= 4; i++) {
          const link = mapSection(`header_nav_link_${i}`, ["label", "href"]);
          if (link) {
            newData.navLinks[i - 1] = { ...newData.navLinks[i - 1], ...link };
          }
        }

        // 2. Categories
        for (let i = 1; i <= 5; i++) {
          const cat = mapSection(`header_category_${i}`, ["label", "href", "icon"]);
          if (cat) {
            newData.categories[i - 1] = { ...newData.categories[i - 1], ...cat };
          }
        }

        // 3. Promos
        ["promo1", "promo2"].forEach((id) => {
          const promo = mapSection(`header_${id}`, ["title", "subtitle", "badge", "image", "link", "theme"]);
          if (promo) {
            if (promo.image && !promo.image.startsWith("http")) {
              promo.image = `${STORAGE_BASE}/${promo.image}`;
            }
            newData[id] = { ...newData[id], ...promo };
            newPreviews[id] = promo.image;
          }
        });

        setData(newData);
        setPreviews(newPreviews);
      } catch (err) {
        console.warn("CMS defaults used for header", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  // --- HANDLERS ---
  const handleLinkUpdate = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      navLinks: prev.navLinks.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    }));
  };

  const handleCategoryUpdate = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const handlePromoUpdate = (promoKey, field, value) => {
    setData((prev) => ({
      ...prev,
      [promoKey]: { ...prev[promoKey], [field]: value },
    }));
  };

  const handleImageChange = (promoKey, e) => {
    const file = e.target.files[0];
    if (file) {
      handlePromoUpdate(promoKey, "imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [promoKey]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!session?.accessToken) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      let index = 0;

      const append = (section, key, value, type) => {
        formData.append(`contents[${index}][page]`, "home");
        formData.append(`contents[${index}][section]`, section);
        formData.append(`contents[${index}][key]`, key);
        formData.append(`contents[${index}][type]`, type);
        if (value instanceof File) {
          formData.append(`contents[${index}][value]`, value);
        } else {
          formData.append(`contents[${index}][value]`, value || "");
        }
        index++;
      };

      // 1. Nav Links
      data.navLinks.forEach((link, i) => {
        append(`header_nav_link_${i + 1}`, "label", link.label, "text");
        append(`header_nav_link_${i + 1}`, "href", link.href, "link");
      });

      // 2. Categories
      data.categories.forEach((cat, i) => {
        append(`header_category_${i + 1}`, "label", cat.label, "text");
        append(`header_category_${i + 1}`, "href", cat.href, "link");
        append(`header_category_${i + 1}`, "icon", cat.icon, "text");
      });

      // 3. Promos
      ["promo1", "promo2"].forEach((id) => {
        const promo = data[id];
        append(`header_${id}`, "title", promo.title, "text");
        append(`header_${id}`, "subtitle", promo.subtitle, "text");
        if (id === "promo1") append(`header_${id}`, "badge", promo.badge, "text");
        append(`header_${id}`, "link", promo.link, "link");
        append(`header_${id}`, "theme", promo.theme, "text");
        
        if (promo.imageFile) {
          append(`header_${id}`, "image", promo.imageFile, "image");
        }
      });

      const res = await fetch(`${API_BASE}/admin/cms/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Save failed");

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderIcon = (name, className) => {
    switch (name) {
      case "smartphone": return <Smartphone className={className} />;
      case "headphones": return <Headphones className={className} />;
      case "tablet": return <Tablet className={className} />;
      case "watch": return <Watch className={className} />;
      case "laptop": return <Laptop className={className} />;
      case "refresh": return <RotateCcw className={className} />;
      default: return <Grid className={className} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Navigation…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-white">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-50 shrink-0 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Navigation & Menu</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage top links and the mega menu content below.</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50">
              {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-8 mt-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* --- PREVIEW CANVAS --- */}
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col items-center justify-start bg-slate-100 dark:bg-black/50">
          <div className="w-full max-w-[1200px] space-y-8">
            {/* SECTION 1: NAVBAR STRIP */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">1. Top Navigation Bar</h3>
              <div className="bg-black text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-black text-sm uppercase">I</div>
                  <span className="text-xl font-black tracking-tighter uppercase">IGEN.</span>
                </div>
                <div className="flex items-center gap-6">
                  {data.navLinks.map((link) => (
                    <button key={link.id} onClick={() => setSelectedId(link.id)} className={`text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-lg transition-all ${selectedId === link.id ? "bg-white text-black scale-105 shadow-md" : "text-slate-400 hover:text-white hover:bg-white/10"}`}>{link.label}</button>
                  ))}
                  <div className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase px-3 py-2 text-indigo-400 cursor-default">CATALOG <ChevronDown className="w-3 h-3" /></div>
                </div>
                <div className="flex gap-4 text-slate-400"><Search className="w-5 h-5" /><User className="w-5 h-5" /><ShoppingBag className="w-5 h-5" /></div>
              </div>
            </div>

            {/* SECTION 2: MEGA MENU PANEL */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">2. Mega Menu Content</h3>
              <div className="bg-[#0A0A0A] rounded-2xl border border-slate-800 shadow-2xl p-2 flex min-h-[420px]">
                {/* Left: Categories */}
                <div className="w-1/4 p-6 border-r border-slate-900 flex flex-col">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 px-3">Categories</h4>
                  <ul className="space-y-2 flex-1">
                    {data.categories.map((cat) => (
                      <li key={cat.id} onClick={() => setSelectedId(cat.id)} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold cursor-pointer transition-all ${selectedId === cat.id ? "bg-white text-black shadow-lg scale-[1.02]" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>{renderIcon(cat.icon, "w-4 h-4")}{cat.label}</li>
                    ))}
                  </ul>
                </div>

                {/* Middle: Promo 1 */}
                <div className="w-1/3 p-2">
                  <div onClick={() => setSelectedId("promo1")} className={`h-full relative rounded-2xl overflow-hidden group cursor-pointer border-2 transition-all ${selectedId === "promo1" ? "border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl" : "border-transparent hover:opacity-90 shadow-lg"}`}>
                    <img src={previews.promo1 || data.promo1.image} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent p-6 flex flex-col justify-end">
                      <span className="self-start bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-wide">{data.promo1.badge}</span>
                      <h4 className="text-white font-bold text-2xl leading-tight mb-1">{data.promo1.title}</h4>
                      <p className="text-slate-300 text-xs">{data.promo1.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Promo 2 */}
                <div className="w-5/12 p-2">
                  <div onClick={() => setSelectedId("promo2")} className={`h-full relative rounded-2xl overflow-hidden group cursor-pointer border-2 transition-all bg-[#111] flex flex-col ${selectedId === "promo2" ? "border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl" : "border-transparent hover:opacity-90 shadow-lg"}`}>
                    <div className="flex-1 flex items-center justify-center p-8"><img src={previews.promo2 || data.promo2.image} className="w-full h-auto max-h-[220px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" /></div>
                    <div className="p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <h4 className="text-white font-bold text-2xl leading-tight mb-1">{data.promo2.title}</h4>
                      <p className="text-slate-400 text-xs">{data.promo2.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: EDITOR SIDEBAR */}
      <div className={`w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-[100] absolute right-0 lg:relative ${selectedId ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}`}>
        {selectedId ? (
          <>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div><span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Editing</span><h2 className="font-bold text-slate-900 dark:text-white capitalize truncate max-w-[200px]">{typeof selectedId === "number" ? "Nav Link" : selectedId.startsWith("c") ? "Menu Category" : "Promo Card"}</h2></div>
              <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-7">
              {/* NAV LINK EDITOR */}
              {typeof selectedId === "number" && (
                <div className="space-y-4">
                  {(() => {
                    const link = data.navLinks.find((l) => l.id === selectedId);
                    return link ? (
                      <>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Link Label</label><input value={link.label} onChange={(e) => handleLinkUpdate(selectedId, "label", e.target.value)} className="input-field font-bold py-3 shadow-sm placeholder:text-slate-400" placeholder="e.g. SHOP" /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block text-indigo-600 dark:text-indigo-400">Destination URL</label><input value={link.href} onChange={(e) => handleLinkUpdate(selectedId, "href", e.target.value)} className="input-field text-xs font-mono shadow-sm bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/50" placeholder="/shop" /></div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}

              {/* CATEGORY EDITOR */}
              {typeof selectedId === "string" && selectedId.startsWith("c") && (
                <div className="space-y-5">
                  {(() => {
                    const cat = data.categories.find((c) => c.id === selectedId);
                    return cat ? (
                      <>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Category Name</label><input value={cat.label} onChange={(e) => handleCategoryUpdate(selectedId, "label", e.target.value)} className="input-field font-bold py-3 shadow-sm" /></div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Visual Icon</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["smartphone", "headphones", "tablet", "laptop", "watch", "refresh"].map((icon) => (
                              <button key={icon} onClick={() => handleCategoryUpdate(selectedId, "icon", icon)} className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all ${cat.icon === icon ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 scale-105 shadow-md" : "border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{renderIcon(icon, "w-5 h-5")}</button>
                            ))}
                          </div>
                        </div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Category Link</label><input value={cat.href} onChange={(e) => handleCategoryUpdate(selectedId, "href", e.target.value)} className="input-field text-xs font-mono" /></div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}

              {/* PROMO EDITOR */}
              {typeof selectedId === "string" && selectedId.startsWith("promo") && (
                <div className="space-y-5">
                  {(() => {
                    const promo = data[selectedId];
                    return (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-1"><Upload className="w-3 h-3" /> Background Media</label>
                          <div onClick={() => fileInputs[selectedId].current?.click()} className="group relative aspect-[16/10] rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all overflow-hidden shadow-inner">
                            {previews[selectedId] ? (
                              <>
                                <img src={previews[selectedId]} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"><ImageIcon className="w-6 h-6 mb-2" /><span className="text-xs font-bold">Replace Image</span></div>
                              </>
                            ) : (
                              <><ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" /><span className="text-[10px] font-bold text-slate-400">Click to Upload</span></>
                            )}
                            <input type="file" ref={fileInputs[selectedId]} onChange={(e) => handleImageChange(selectedId, e)} className="hidden" accept="image/*" />
                          </div>
                        </div>
                        <div className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <label className="text-[10px] font-bold text-slate-400 uppercase mt-1">Theme</label>
                          <div className="flex-1 flex gap-2">
                            {["light", "dark"].map(t => (
                              <button key={t} onClick={() => handlePromoUpdate(selectedId, "theme", t)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${promo.theme === t ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm border border-slate-200 dark:border-slate-600" : "text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Card Title</label><input value={promo.title} onChange={(e) => handlePromoUpdate(selectedId, "title", e.target.value)} className="input-field font-bold text-lg" /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Description</label><textarea value={promo.subtitle} onChange={(e) => handlePromoUpdate(selectedId, "subtitle", e.target.value)} className="input-field h-24 resize-none shadow-sm" /></div>
                        {selectedId === "promo1" && <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Badge Text</label><input value={promo.badge} onChange={(e) => handlePromoUpdate(selectedId, "badge", e.target.value)} className="input-field font-mono text-[11px] uppercase" /></div>}
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Action URL</label><input value={promo.link} onChange={(e) => handlePromoUpdate(selectedId, "link", e.target.value)} className="input-field text-xs font-mono text-indigo-600" /></div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-3"><button onClick={() => setSelectedId(null)} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold hover:opacity-90 transition-all border-none shadow-xl active:scale-95"><CheckCircle2 className="w-4 h-4" /> Save Selection</button></div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner"><MousePointer2 className="w-8 h-8 opacity-20" /></div>
            <div><h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Interactive Editor</h3><p className="text-sm mt-2 max-w-[200px] leading-relaxed">Click any nav link, category, or promo card in the preview to start customizing.</p></div>
          </div>
        )}
      </div>
      <style jsx>{`
        .input-field { @apply w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all shadow-sm; }
      `}</style>
    </div>
  );
}

function CheckCircle2(props) {
  return <Check {...props} className={props.className + " bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-0.5"} />;
}

function Check(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
