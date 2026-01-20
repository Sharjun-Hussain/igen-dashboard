"use client";

import React, { useState } from "react";
import {
  Save,
  Type,
  Link as LinkIcon,
  Tag,
  Palette,
  Gamepad2,
  Camera,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  X,
  Layout,
} from "lucide-react";

// --- INITIAL DATA MATCHING YOUR SCREENSHOT ---

const INITIAL_CARDS = [
  {
    id: "card_gaming",
    title: "Mobile Gaming Power.",
    description:
      "Dominate the arena with 144Hz displays and Snapdragon 8 Gen 3 processors.",
    badge: "NEXT-GEN READY",
    badgeIcon: "gamepad", // helper string to pick icon
    buttonText: "Shop Gaming",
    link: "/collections/gaming-phones",
    theme: "purple", // triggers the purple gradient
  },
  {
    id: "card_camera",
    title: "Pro Mobile Photography.",
    description:
      "Capture cinematic shots with 200MP sensors and AI-enhanced editing.",
    badge: "PRO CAMERA",
    badgeIcon: "camera",
    buttonText: "Upgrade Setup",
    link: "/collections/camera-phones",
    theme: "black", // triggers the dark grey look
  },
];

export default function FeaturedSectionsManager() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleUpdate = (e) => {
    if (!selectedCard) return;
    const { name, value } = e.target;

    // Update local selection for immediate feedback
    setSelectedCard((prev) => ({ ...prev, [name]: value }));

    // Update main state
    setCards((prev) =>
      prev.map((card) =>
        card.id === selectedCard.id ? { ...card, [name]: value } : card,
      ),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Featured Section Saved!");
    }, 800);
  };

  // Helper to get the Tailwind classes based on "theme" selection
  const getThemeClasses = (theme) => {
    switch (theme) {
      case "purple":
        return "bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 shadow-indigo-900/20";
      case "black":
        return "bg-slate-900 shadow-slate-900/20";
      case "blue":
        return "bg-gradient-to-br from-blue-950 to-slate-900 shadow-blue-900/20";
      case "green":
        return "bg-gradient-to-br from-emerald-950 to-slate-900 shadow-emerald-900/20";
      default:
        return "bg-slate-900";
    }
  };

  // Helper to render dynamic icons
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "gamepad":
        return <Gamepad2 className="w-3 h-3" />;
      case "camera":
        return <Smartphone className="w-3 h-3" />; // Using smartphone as generic camera phone icon
      default:
        return <Tag className="w-3 h-3" />;
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
              Featured Sections
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage the "Gaming Power" and "Pro Photography" promo blocks.
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
                    /* Selection Border Logic */
                    ${
                      selectedCard?.id === card.id
                        ? "border-indigo-500 ring-4 ring-indigo-500/30 scale-[0.99]"
                        : "border-transparent hover:scale-[1.01]"
                    }
                  `}
                >
                  {/* Top: Badge */}
                  <div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white mb-8">
                      {renderIcon(card.badgeIcon)} {card.badge}
                    </span>

                    {/* Middle: Text */}
                    <div className="max-w-md">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {card.title}
                      </h2>
                      <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Button */}
                  <div className="mt-8">
                    <button className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors group-hover:translate-x-1 duration-300">
                      {card.buttonText} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hover Overlay indicating "Edit" */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem] pointer-events-none">
                    <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-xl">
                      Click to Edit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT PANEL: EDITOR SIDEBAR */}
      <div
        className={`
        w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 
        flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-20 absolute right-0 lg:relative
        ${selectedCard ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}
      `}
      >
        {selectedCard ? (
          <>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Editing Block
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {selectedCard.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Color Theme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["purple", "black", "blue", "green"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() =>
                        handleUpdate({
                          target: { name: "theme", value: theme },
                        })
                      }
                      className={`
                        h-10 rounded-lg border-2 transition-all
                        ${theme === "purple" ? "bg-indigo-900" : ""}
                        ${theme === "black" ? "bg-slate-900" : ""}
                        ${theme === "blue" ? "bg-blue-900" : ""}
                        ${theme === "green" ? "bg-emerald-900" : ""}
                        ${
                          selectedCard.theme === theme
                            ? "border-indigo-500 ring-2 ring-indigo-500/30"
                            : "border-transparent hover:scale-105"
                        }
                      `}
                      title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                    />
                  ))}
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Type className="w-3 h-3" /> Headline
                  </label>
                  <textarea
                    name="title"
                    rows={2}
                    value={selectedCard.title}
                    onChange={handleUpdate}
                    className="input-field font-bold text-lg resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={selectedCard.description}
                    onChange={handleUpdate}
                    className="input-field resize-none"
                  />
                </div>
              </div>

              {/* Badge Config */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Badge Settings
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      name="badge"
                      value={selectedCard.badge}
                      onChange={handleUpdate}
                      className="input-field"
                      placeholder="Badge Text"
                    />
                  </div>
                  <select
                    name="badgeIcon"
                    value={selectedCard.badgeIcon}
                    onChange={handleUpdate}
                    className="input-field px-1 text-xs"
                  >
                    <option value="gamepad">Gamepad</option>
                    <option value="camera">Camera</option>
                    <option value="tag">Tag</option>
                  </select>
                </div>
              </div>

              {/* Link Config */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Button Label
                  </label>
                  <input
                    name="buttonText"
                    value={selectedCard.buttonText}
                    onChange={handleUpdate}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" /> Destination
                  </label>
                  <input
                    name="link"
                    value={selectedCard.link}
                    onChange={handleUpdate}
                    className="input-field font-mono text-xs text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedCard(null)}
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
              Select a Block
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on the Gaming or Photography card to edit its content and
              theme.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all;
        }
      `}</style>
    </div>
  );
}
