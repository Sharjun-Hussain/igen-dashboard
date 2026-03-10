"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Smartphone,
  Headphones,
  Zap,
  Gamepad2,
  ShieldCheck,
  ImageIcon,
  Link as LinkIcon,
  Check,
  X,
  Layout,
  ArrowUpRight,
  Tag,
  RefreshCw,
  AlertCircle,
  Upload,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const STORAGE_BASE = API_BASE?.replace("/api/v1", "");

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
      subtitle: "Experience the lightest, most durable design with the A17 Pro chip.",
      badge: "TITANIUM SERIES",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
      link: "/collections/iphone-15-pro-max",
      icon: "phone",
    },
    audio: {
      id: "audio",
      title: "Premium Audio",
      badge: "NOISE CANCELLING",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
      link: "/collections/audio",
      icon: "headphone",
    },
    power: {
      id: "power",
      title: "Power & Charging",
      badge: "MAGSAFE & TYPE-C",
      image: "https://images.unsplash.com/photo-1625723347040-0fdf78cb3c1e?q=80&w=1974&auto=format&fit=crop",
      link: "/collections/power",
      icon: "zap",
    },
    gaming: {
      id: "gaming",
      title: "Gaming Beasts",
      badge: "144HZ & SNAPDRAGON",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop",
      link: "/collections/gaming",
      icon: "gamepad",
    },
    protection: {
      id: "protection",
      title: "Protection",
      badge: "CASES & TEMPERED GLASS",
      image: "https://images.unsplash.com/photo-1592910793739-12348c41469e?q=80&w=2071&auto=format&fit=crop",
      link: "/collections/protection",
      icon: "shield",
    },
  },
};

export default function CollectionsManager() {
  const { data: session } = useSession();
  const [data, setData] = useState(INITIAL_DATA);
  const [previews, setPreviews] = useState({
    hero: "",
    audio: "",
    power: "",
    gaming: "",
    protection: "",
  });
  const [selectedId, setSelectedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputs = {
    hero: useRef(null),
    audio: useRef(null),
    power: useRef(null),
    gaming: useRef(null),
    protection: useRef(null),
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

        // 1. Header
        const header = mapSection("collections_header", ["label", "titleStart", "titleEnd", "description"]);
        if (header) {
          newData.header = { ...newData.header, ...header };
        }

        // 2. Cards
        ["hero", "audio", "power", "gaming", "protection"].forEach((id) => {
          const card = mapSection(`collections_${id}`, ["title", "subtitle", "badge", "image", "link", "icon"]);
          if (card) {
            if (card.image && !card.image.startsWith("http")) {
              card.image = `${STORAGE_BASE}/${card.image}`;
            }
            newData.cards[id] = { ...newData.cards[id], ...card };
            newPreviews[id] = card.image;
          }
        });

        setData(newData);
        setPreviews(newPreviews);
      } catch (err) {
        console.warn("CMS defaults used for collections", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

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

  const handleImageChange = (cardId, e) => {
    const file = e.target.files[0];
    if (file) {
      handleCardUpdate(cardId, "imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [cardId]: reader.result }));
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

      // 1. Header
      append("collections_header", "label", data.header.label, "text");
      append("collections_header", "titleStart", data.header.titleStart, "text");
      append("collections_header", "titleEnd", data.header.titleEnd, "text");
      append("collections_header", "description", data.header.description, "textarea");

      // 2. Cards
      ["hero", "audio", "power", "gaming", "protection"].forEach((id) => {
        const card = data.cards[id];
        append(`collections_${id}`, "title", card.title, "text");
        if (id === "hero") append(`collections_${id}`, "subtitle", card.subtitle, "textarea");
        append(`collections_${id}`, "badge", card.badge, "text");
        append(`collections_${id}`, "link", card.link, "link");
        append(`collections_${id}`, "icon", card.icon, "text");
        
        if (card.imageFile) {
          append(`collections_${id}`, "image", card.imageFile, "image");
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

  const getIcon = (name) => {
    switch (name) {
      case "phone": return <Smartphone className="w-5 h-5" />;
      case "headphone": return <Headphones className="w-5 h-5" />;
      case "zap": return <Zap className="w-5 h-5" />;
      case "gamepad": return <Gamepad2 className="w-5 h-5" />;
      case "shield": return <ShieldCheck className="w-5 h-5" />;
      default: return <Layout className="w-5 h-5" />;
    }
  };

  const selectedItem = selectedId === "header" ? data.header : data.cards[selectedId];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Collections…</p>
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
            <h1 className="text-2xl font-bold">Collections Grid</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage the bento grid section.</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg">
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
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col items-center">
          <div className="max-w-[1200px] w-full space-y-8">
            {/* A. SECTION HEADER */}
            <div onClick={() => setSelectedId("header")} className={`flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 rounded-2xl cursor-pointer transition-all border-2 ${selectedId === "header" ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10 shadow-lg" : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"}`}>
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 block">{data.header.label}</span>
                <h2 className="text-4xl md:text-5xl font-black">{data.header.titleStart} <span className="text-slate-500 dark:text-slate-600">{data.header.titleEnd}</span></h2>
              </div>
              <p className="max-w-sm text-slate-500 dark:text-slate-400 text-sm leading-relaxed md:text-right">{data.header.description}</p>
            </div>

            {/* B. BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
              {/* 1. HERO CARD */}
              <div onClick={() => setSelectedId("hero")} className={`md:col-span-7 md:row-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all ${selectedId === "hero" ? "border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl" : "border-transparent hover:opacity-95"}`}>
                <img src={previews.hero || data.cards.hero.image} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full"><span className="text-[10px] font-bold text-white uppercase tracking-wider">{data.cards.hero.badge}</span></div>
                  <div className="flex items-end justify-between">
                    <div className="max-w-md">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 text-white">{getIcon(data.cards.hero.icon)}</div>
                      <h3 className="text-3xl font-bold text-white mb-2">{data.cards.hero.title}</h3>
                      <p className="text-slate-300 text-sm">{data.cards.hero.subtitle}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300 shadow-xl"><ArrowUpRight className="w-6 h-6" /></div>
                  </div>
                </div>
              </div>

              {/* 2. RIGHT COLUMN */}
              <div className="md:col-span-5 md:row-span-2 flex flex-col gap-4">
                {["audio", "power"].map((id) => (
                  <div key={id} onClick={() => setSelectedId(id)} className={`flex-1 relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all ${selectedId === id ? "border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl" : "border-transparent hover:opacity-95"}`}>
                    <img src={previews[id] || data.cards[id].image} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 p-6 flex flex-col justify-between ${id === "audio" ? "bg-black/40" : "bg-linear-to-r from-black/80 to-transparent"}`}>
                      <div className="self-end bg-white/20 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full"><span className="text-[9px] font-bold text-white uppercase tracking-wider">{data.cards[id].badge}</span></div>
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 text-white">{getIcon(data.cards[id].icon)}</div>
                        <h3 className="text-xl font-bold text-white">{data.cards[id].title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* C. BOTTOM ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[250px]">
              {["gaming", "protection"].map((id) => (
                <div key={id} onClick={() => setSelectedId(id)} className={`relative rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-all ${selectedId === id ? "border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl" : "border-transparent hover:opacity-95"}`}>
                  <img src={previews[id] || data.cards[id].image} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={`absolute inset-0 p-6 flex flex-col justify-end ${id === "gaming" ? "bg-black/50" : "bg-black/40"}`}>
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full"><span className="text-[10px] font-bold text-white uppercase tracking-wider">{data.cards[id].badge}</span></div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 text-white">{getIcon(data.cards[id].icon)}</div>
                    <h3 className="text-2xl font-bold text-white">{data.cards[id].title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: EDITOR SIDEBAR */}
      <div className={`w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-20 absolute right-0 lg:relative ${selectedId ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}`}>
        {selectedId ? (
          <>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div><span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Editing</span><h2 className="font-bold text-slate-900 dark:text-white capitalize">{selectedId === "header" ? "Header" : `${selectedId} Card`}</h2></div>
              <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedId === "header" ? (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Top Label</label><input value={data.header.label} onChange={(e) => handleHeaderUpdate("label", e.target.value)} className="input-field text-indigo-600 font-bold" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title Start</label><input value={data.header.titleStart} onChange={(e) => handleHeaderUpdate("titleStart", e.target.value)} className="input-field font-bold" /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title End</label><input value={data.header.titleEnd} onChange={(e) => handleHeaderUpdate("titleEnd", e.target.value)} className="input-field font-bold text-slate-400" /></div>
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description</label><textarea value={data.header.description} onChange={(e) => handleHeaderUpdate("description", e.target.value)} className="input-field resize-none h-32" /></div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-1"><ImageIcon className="w-3 h-3" /> Image Upload</label>
                    <div onClick={() => fileInputs[selectedId].current?.click()} className="group relative aspect-video rounded-xl bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all overflow-hidden shadow-inner">
                      {previews[selectedId] ? (
                        <>
                          <img src={previews[selectedId]} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"><Upload className="w-6 h-6 mb-2" /><span className="text-xs font-bold uppercase">Change Image</span></div>
                        </>
                      ) : (
                        <><Upload className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2 group-hover:scale-110 transition-transform" /><span className="text-xs font-bold text-slate-400">Click to Upload</span></>
                      )}
                      <input type="file" ref={fileInputs[selectedId]} onChange={(e) => handleImageChange(selectedId, e)} className="hidden" accept="image/*" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Layout className="w-3 h-3" /> Grid Settings</label>
                    <div className="grid grid-cols-5 gap-2 px-1">
                      {["phone", "headphone", "zap", "gamepad", "shield"].map((icon) => (
                        <button key={icon} onClick={() => handleCardUpdate(selectedId, "icon", icon)} className={`aspect-square flex items-center justify-center rounded-lg border-2 transition-all ${selectedItem.icon === icon ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 scale-105 shadow-md" : "border-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{getIcon(icon)}</button>
                      ))}
                    </div>
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label><input value={selectedItem.title} onChange={(e) => handleCardUpdate(selectedId, "title", e.target.value)} className="input-field font-bold text-lg shadow-sm" /></div>
                  {selectedId === "hero" && <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subtitle</label><textarea value={selectedItem.subtitle} onChange={(e) => handleCardUpdate(selectedId, "subtitle", e.target.value)} className="input-field resize-none h-20 shadow-sm" /></div>}
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2"><Tag className="w-3 h-3" /> Badge Text</label><input value={selectedItem.badge} onChange={(e) => handleCardUpdate(selectedId, "badge", e.target.value)} className="input-field font-mono text-xs uppercase" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2"><LinkIcon className="w-3 h-3" /> Navigation Link</label><input value={selectedItem.link} onChange={(e) => handleCardUpdate(selectedId, "link", e.target.value)} className="input-field text-[11px] text-indigo-600 font-mono shadow-sm" /></div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-3"><button onClick={() => setSelectedId(null)} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity border-none shadow-xl"><Check className="w-4 h-4" /> Done</button></div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400"><Layout className="w-10 h-10 mb-4 opacity-10" /><h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Layout Manager</h3><p className="text-sm mt-2 max-w-[200px]">Click on the header or any card in the preview to customize.</p></div>
        )}
      </div>
      <style jsx>{`
        .input-field { @apply w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all; }
      `}</style>
    </div>
  );
}

function CheckCircle2(props) {
  return <Check {...props} className={props.className + " bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-0.5"} />;
}
