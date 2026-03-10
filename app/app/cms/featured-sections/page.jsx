"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Type,
  Link as LinkIcon,
  Tag,
  Palette,
  Gamepad2,
  CheckCircle2,
  X,
  Layout,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Smartphone,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const INITIAL_CARDS = [
  {
    id: "promo_banner_1",
    title: "Mobile Gaming Power.",
    description: "Dominate the arena with 144Hz displays and Snapdragon 8 Gen 3 processors.",
    badge: "NEXT-GEN READY",
    badgeIcon: "gamepad",
    buttonText: "Shop Gaming",
    link: "/collections/gaming-phones",
    theme: "purple",
  },
  {
    id: "promo_banner_2",
    title: "Pro Mobile Photography.",
    description: "Capture cinematic shots with 200MP sensors and AI-enhanced editing.",
    badge: "PRO CAMERA",
    badgeIcon: "camera",
    buttonText: "Upgrade Setup",
    link: "/collections/camera-phones",
    theme: "black",
  },
];

export default function PromoBannersManager() {
  const { data: session } = useSession();
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");

        const updatedCards = INITIAL_CARDS.map((card) => {
          const sectionData = data?.data?.home?.[card.id] || [];
          if (sectionData.length > 0) {
            const mapped = {};
            sectionData.forEach((item) => {
              mapped[item.key] = item.value;
            });
            return {
              ...card,
              title: mapped.title || card.title,
              description: mapped.description || card.description,
              badge: mapped.badge || card.badge,
              badgeIcon: mapped.badge_icon || card.badgeIcon,
              buttonText: mapped.button_text || card.buttonText,
              link: mapped.link || card.link,
              theme: mapped.theme || card.theme,
            };
          }
          return card;
        });
        setCards(updatedCards);
      } catch (err) {
        // silently use defaults if API hasn't been seeded
        console.warn("CMS data for promo banners not found, using defaults", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const handleUpdate = (e) => {
    if (!selectedCard) return;
    const { name, value } = e.target;
    setSelectedCard((prev) => ({ ...prev, [name]: value }));
    setCards((prev) =>
      prev.map((card) =>
        card.id === selectedCard.id ? { ...card, [name]: value } : card
      )
    );
  };

  const handleSave = async () => {
    if (!session?.accessToken) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      let index = 0;

      cards.forEach((card) => {
        const fields = [
          { key: "title", value: card.title, type: "text" },
          { key: "description", value: card.description, type: "textarea" },
          { key: "badge", value: card.badge, type: "text" },
          { key: "badge_icon", value: card.badgeIcon, type: "text" },
          { key: "button_text", value: card.buttonText, type: "text" },
          { key: "link", value: card.link, type: "link" },
          { key: "theme", value: card.theme, type: "text" },
        ];

        fields.forEach((field) => {
          formData.append(`contents[${index}][page]`, "home");
          formData.append(`contents[${index}][section]`, card.id);
          formData.append(`contents[${index}][key]`, field.key);
          formData.append(`contents[${index}][type]`, field.type);
          formData.append(`contents[${index}][value]`, field.value || "");
          index++;
        });
      });

      const res = await fetch(`${API_BASE}/admin/cms/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getThemeClasses = (theme) => {
    switch (theme) {
      case "purple": return "bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 shadow-indigo-900/20";
      case "black": return "bg-slate-900 shadow-slate-900/20";
      case "blue": return "bg-gradient-to-br from-blue-950 to-slate-900 shadow-blue-900/20";
      case "green": return "bg-gradient-to-br from-emerald-950 to-slate-900 shadow-emerald-900/20";
      default: return "bg-slate-900";
    }
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "gamepad": return <Gamepad2 className="w-3 h-3" />;
      case "camera": return <Smartphone className="w-3 h-3" />;
      default: return <Tag className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading CMS data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Promo Banners</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage home page marketing banners.</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-8 mt-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col justify-center">
          <div className="max-w-[1200px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`
                    group relative rounded-[2.5rem] p-10 md:p-12 min-h-[500px] flex flex-col justify-between cursor-pointer transition-all duration-300 border-2
                    ${getThemeClasses(card.theme)}
                    ${selectedCard?.id === card.id ? "border-indigo-500 ring-4 ring-indigo-500/30 scale-[0.99]" : "border-transparent hover:scale-[1.01]"}
                  `}
                >
                  <div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white mb-8">
                      {renderIcon(card.badgeIcon)} {card.badge}
                    </span>
                    <div className="max-w-md">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{card.title}</h2>
                      <p className="text-slate-300 text-base md:text-lg leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors group-hover:translate-x-1 duration-300">
                      {card.buttonText} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem] pointer-events-none">
                    <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-xl">Click to Edit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-20 absolute right-0 lg:relative ${selectedCard ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}`}>
        {selectedCard ? (
          <>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Editing Promo Banner</span>
                <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{selectedCard.title}</h2>
              </div>
              <button onClick={() => setSelectedCard(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Palette className="w-3 h-3" /> Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {["purple", "black", "blue", "green"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleUpdate({ target: { name: "theme", value: theme } })}
                      className={`h-10 rounded-lg border-2 transition-all ${theme === "purple" ? "bg-indigo-900" : theme === "black" ? "bg-slate-900" : theme === "blue" ? "bg-blue-900" : "bg-emerald-900"} ${selectedCard.theme === theme ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-transparent hover:scale-105"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Type className="w-3 h-3" /> Headline</label>
                <textarea name="title" rows={2} value={selectedCard.title} onChange={handleUpdate} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea name="description" rows={3} value={selectedCard.description} onChange={handleUpdate} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white resize-none" />
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Tag className="w-3 h-3" /> Badge Settings</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2"><input name="badge" value={selectedCard.badge} onChange={handleUpdate} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white" placeholder="Badge Text" /></div>
                  <select name="badgeIcon" value={selectedCard.badgeIcon} onChange={handleUpdate} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"><option value="gamepad">Gamepad</option><option value="camera">Camera</option><option value="tag">Tag</option></select>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Button Label</label><input name="buttonText" value={selectedCard.buttonText} onChange={handleUpdate} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><LinkIcon className="w-3 h-3" /> Destination</label><input name="link" value={selectedCard.link} onChange={handleUpdate} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-3">
                <button onClick={handleSave} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                </button>
                <button onClick={() => setSelectedCard(null)} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"><CheckCircle2 className="w-4 h-4" /> Done</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4"><Layout className="w-8 h-8 text-slate-300 dark:text-slate-600" /></div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Select a Block</h3>
            <p className="text-sm mt-2 max-w-[200px]">Click on a banner preview to edit its content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
