"use client";

import React, { useState } from "react";
import {
  Save,
  MousePointerClick,
  Package,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  ArrowRight,
  X,
  Layout,
  Type,
  Link as LinkIcon,
} from "lucide-react";

// --- INITIAL DATA ---

const INITIAL_DATA = {
  header: {
    badge: "ISLAND-WIDE DELIVERY",
    titleStart: "From Our Store",
    titleEnd: "To Your Doorstep.",
    description:
      "Sit back and relax. We handle the logistics with trusted courier partners to ensure your tech arrives safe and fast, anywhere in Sri Lanka.",
  },
  steps: [
    {
      id: 1,
      title: "You Click Order",
      description:
        "Choose your favorite gadgets and checkout securely in seconds.",
      icon: "click",
    },
    {
      id: 2,
      title: "We Pack & Ship",
      description:
        "Your item is safely packed with bubble wrap and handed to couriers.",
      icon: "package",
    },
    {
      id: 3,
      title: "Arrives at Doorstep",
      description:
        "Track your package until it reaches your hands. Unbox and enjoy!",
      icon: "pin",
    },
  ],
  footer: {
    partnersLabel: "Trusted Delivery Partners",
    partnersText: "We use PromptX, Certis & Domex.",
    timeLabel: "DELIVERY TIME",
    timeText: "1-2 Days (Colombo) • 2-3 Days (Outstation)",
    buttonText: "Track My Order",
    buttonLink: "/track-order",
  },
};

export default function DeliveryProcessManager() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleUpdate = (group, field, value) => {
    if (group.startsWith("step_")) {
      const stepId = parseInt(group.split("_")[1]);
      setData((prev) => ({
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === stepId ? { ...s, [field]: value } : s,
        ),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [group]: { ...prev[group], [field]: value },
      }));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Delivery Section Saved!");
    }, 800);
  };

  // Icon Helper
  const getIcon = (name) => {
    switch (name) {
      case "click":
        return <MousePointerClick className="w-6 h-6" />;
      case "package":
        return <Package className="w-6 h-6" />;
      case "pin":
        return <MapPin className="w-6 h-6" />;
      default:
        return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Toolbar - Added z-index and solid background to prevent see-through */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-50 shrink-0 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Delivery Process
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage the "How it Works" section.
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
        {/* Changed justify-center to justify-start and added pt-12 to prevent top clipping */}
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col items-center justify-start pt-12">
          <div className="max-w-[1000px] w-full space-y-16 pb-20">
            {/* A. HEADER */}
            <div
              onClick={() => setSelectedGroup("header")}
              className={`
                text-center cursor-pointer p-6 rounded-2xl transition-all border-2 relative z-10
                ${
                  selectedGroup === "header"
                    ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                    : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                }
              `}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  {data.header.badge}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                {data.header.titleStart}{" "}
                <span className="text-indigo-600 dark:text-indigo-500">
                  {data.header.titleEnd}
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                {data.header.description}
              </p>
            </div>

            {/* B. PROCESS STEPS */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 z-0">
              {/* Connecting Line (Desktop Only) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 dark:from-slate-800 dark:via-indigo-900 dark:to-slate-800 -z-10"></div>

              {data.steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => setSelectedGroup(`step_${step.id}`)}
                  className={`
                    flex flex-col items-center text-center p-6 rounded-2xl cursor-pointer transition-all border-2 group bg-slate-50 dark:bg-slate-950
                    ${
                      selectedGroup === `step_${step.id}`
                        ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                        : "border-transparent hover:bg-white dark:hover:bg-slate-900"
                    }
                  `}
                >
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                      {getIcon(step.icon)}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm border-4 border-white dark:border-slate-950">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[250px] mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* C. FOOTER BAR */}
            <div
              onClick={() => setSelectedGroup("footer")}
              className={`
                bg-slate-900 dark:bg-black p-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 px-8 cursor-pointer border-2 transition-all shadow-2xl relative z-10
                ${
                  selectedGroup === "footer"
                    ? "border-indigo-500 ring-4 ring-indigo-500/20"
                    : "border-transparent hover:scale-[1.01]"
                }
              `}
            >
              {/* Left: Partners */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    {data.footer.partnersLabel}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {data.footer.partnersText}
                  </p>
                </div>
              </div>

              {/* Divider (Desktop) */}
              <div className="hidden md:block w-px h-12 bg-white/10"></div>

              {/* Middle: Delivery Time */}
              <div className="text-center md:text-left w-full md:w-auto">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  {data.footer.timeLabel}
                </p>
                <p className="text-white font-bold text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  {data.footer.timeText}
                </p>
              </div>

              {/* Right: Button */}
              <button className="w-full md:w-auto bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                {data.footer.buttonText} <ArrowRight className="w-4 h-4" />
              </button>
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
                  {selectedGroup.startsWith("step")
                    ? `Step ${selectedGroup.split("_")[1]}`
                    : selectedGroup}
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
              {/* --- HEADER EDITOR --- */}
              {selectedGroup === "header" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Badge
                    </label>
                    <input
                      value={data.header.badge}
                      onChange={(e) =>
                        handleUpdate("header", "badge", e.target.value)
                      }
                      className="input-field text-indigo-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Title Start
                    </label>
                    <input
                      value={data.header.titleStart}
                      onChange={(e) =>
                        handleUpdate("header", "titleStart", e.target.value)
                      }
                      className="input-field font-bold text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Title End (Colored)
                    </label>
                    <input
                      value={data.header.titleEnd}
                      onChange={(e) =>
                        handleUpdate("header", "titleEnd", e.target.value)
                      }
                      className="input-field font-bold text-lg text-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Description
                    </label>
                    <textarea
                      value={data.header.description}
                      onChange={(e) =>
                        handleUpdate("header", "description", e.target.value)
                      }
                      className="input-field resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* --- STEP EDITOR --- */}
              {selectedGroup && selectedGroup.startsWith("step") && (
                <div className="space-y-4">
                  {(() => {
                    const stepId = parseInt(selectedGroup.split("_")[1]);
                    const step = data.steps.find((s) => s.id === stepId);
                    return (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Step Title
                          </label>
                          <input
                            value={step.title}
                            onChange={(e) =>
                              handleUpdate(
                                selectedGroup,
                                "title",
                                e.target.value,
                              )
                            }
                            className="input-field font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Description
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) =>
                              handleUpdate(
                                selectedGroup,
                                "description",
                                e.target.value,
                              )
                            }
                            className="input-field resize-none"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Icon Type
                          </label>
                          <select
                            value={step.icon}
                            onChange={(e) =>
                              handleUpdate(
                                selectedGroup,
                                "icon",
                                e.target.value,
                              )
                            }
                            className="input-field"
                          >
                            <option value="click">Mouse Click</option>
                            <option value="package">Package / Box</option>
                            <option value="pin">Map Location</option>
                          </select>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* --- FOOTER EDITOR --- */}
              {selectedGroup === "footer" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Partners Label
                    </label>
                    <input
                      value={data.footer.partnersLabel}
                      onChange={(e) =>
                        handleUpdate("footer", "partnersLabel", e.target.value)
                      }
                      className="input-field font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Partners List
                    </label>
                    <input
                      value={data.footer.partnersText}
                      onChange={(e) =>
                        handleUpdate("footer", "partnersText", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Delivery Time Text
                    </label>
                    <input
                      value={data.footer.timeText}
                      onChange={(e) =>
                        handleUpdate("footer", "timeText", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Button Label
                    </label>
                    <input
                      value={data.footer.buttonText}
                      onChange={(e) =>
                        handleUpdate("footer", "buttonText", e.target.value)
                      }
                      className="input-field font-bold"
                    />
                    <label className="text-xs font-bold text-slate-500 uppercase mt-3 mb-1 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> Button Link
                    </label>
                    <input
                      value={data.footer.buttonLink}
                      onChange={(e) =>
                        handleUpdate("footer", "buttonLink", e.target.value)
                      }
                      className="input-field text-xs text-indigo-600"
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
              Delivery Manager
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on the Header, any Step, or the Footer bar to edit content.
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
