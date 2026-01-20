"use client";

import React, { useState } from "react";
import {
  Save,
  Plus,
  Minus,
  MessageCircle,
  HelpCircle,
  Trash2,
  CheckCircle2,
  X,
  Layout,
  Link as LinkIcon,
} from "lucide-react";

// --- INITIAL DATA ---

const INITIAL_DATA = {
  header: {
    label: "SUPPORT CENTER",
    title: "Frequently Asked Questions",
    description:
      "Everything you need to know about the product and billing. Can't find the answer you're looking for?",
  },
  faqs: [
    {
      id: 1,
      question: "Do you offer cash on delivery (COD)?",
      answer:
        "Yes! We offer Cash on Delivery for orders below Rs. 50,000 island-wide. For high-value items, we require a partial deposit.",
    },
    {
      id: 2,
      question: "How long does delivery take?",
      answer:
        "Deliveries within Colombo take 1-2 working days. Outstation deliveries typically take 2-3 working days.",
    },
    {
      id: 3,
      question: "Is the warranty official or shop warranty?",
      answer:
        "We provide 1 Year Company Warranty (Apple Care / Genxt / Singer) for brand new devices.",
    },
  ],
  footer: {
    title: "Still have questions?",
    subtitle:
      "Can't find the answer you're looking for? Please chat to our friendly team.",
    buttonText: "Chat on WhatsApp",
    buttonLink: "https://wa.me/...",
  },
};

export default function FaqManager() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedId, setSelectedId] = useState(null);
  const [openFaq, setOpenFaq] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleUpdate = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleFaqUpdate = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) =>
        faq.id === id ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  // ADD NEW FAQ
  const handleAddFaq = () => {
    const newId = Math.max(...data.faqs.map((f) => f.id), 0) + 1;
    const newFaq = {
      id: newId,
      question: "New Question",
      answer: "Type your answer here...",
    };
    setData((prev) => ({ ...prev, faqs: [...prev.faqs, newFaq] }));
    setSelectedId(newId);
    setOpenFaq(newId);
  };

  // DELETE FAQ
  const handleDeleteFaq = (e, id) => {
    e.stopPropagation(); // Prevent opening the accordion when clicking delete
    if (confirm("Are you sure you want to delete this question?")) {
      setData((prev) => ({
        ...prev,
        faqs: prev.faqs.filter((f) => f.id !== id),
      }));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("FAQs Saved!");
    }, 800);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Toolbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-50 shrink-0 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              FAQ Manager
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Add, edit, or remove questions directly from the list.
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
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col items-center justify-start pt-12">
          <div className="max-w-[800px] w-full space-y-12 pb-20">
            {/* A. HEADER */}
            <div
              onClick={() => setSelectedId("header")}
              className={`
                text-center cursor-pointer p-6 rounded-2xl transition-all border-2 relative z-10
                ${
                  selectedId === "header"
                    ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10"
                    : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                }
              `}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                  {data.header.label}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                {data.header.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-lg leading-relaxed">
                {data.header.description}
              </p>
            </div>

            {/* B. FAQ LIST */}
            <div className="space-y-3">
              {data.faqs.map((faq) => (
                <div
                  key={faq.id}
                  onClick={() => {
                    setSelectedId(faq.id);
                    setOpenFaq(openFaq === faq.id ? null : faq.id);
                  }}
                  className={`
                    group relative rounded-2xl cursor-pointer transition-all border overflow-hidden
                    bg-white dark:bg-[#0F0F0F] 
                    ${
                      selectedId === faq.id
                        ? "ring-2 ring-indigo-500 border-indigo-500"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }
                  `}
                >
                  <div className="p-6 flex items-center justify-between gap-4 pr-14">
                    <h3
                      className={`text-lg font-bold transition-colors ${openFaq === faq.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"}`}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaq === faq.id ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                    >
                      {openFaq === faq.id ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* DELETE BUTTON (Floating on the right) */}
                  <button
                    onClick={(e) => handleDeleteFaq(e, faq.id)}
                    className="absolute top-6 right-16 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Expanded Content */}
                  <div
                    className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${openFaq === faq.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                  `}
                  >
                    <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}

              {/* ADD NEW BUTTON (Inline) */}
              <button
                onClick={handleAddFaq}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all font-bold group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                Add New Question
              </button>
            </div>

            {/* C. FOOTER / CONTACT */}
            <div
              onClick={() => setSelectedId("footer")}
              className={`
                bg-slate-900 dark:bg-[#151515] p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 px-8 cursor-pointer border-2 transition-all shadow-xl
                ${
                  selectedId === "footer"
                    ? "border-indigo-500 ring-4 ring-indigo-500/20"
                    : "border-transparent hover:scale-[1.01]"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"
                    ></div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-0.5">
                    {data.footer.title}
                  </p>
                  <p className="text-slate-400 text-xs max-w-[250px]">
                    {data.footer.subtitle}
                  </p>
                </div>
              </div>

              <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 whitespace-nowrap">
                <MessageCircle className="w-4 h-4" /> {data.footer.buttonText}
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
                  {selectedId === "header"
                    ? "Header"
                    : selectedId === "footer"
                      ? "Contact Info"
                      : "Question"}
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
              {selectedId === "header" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Top Label
                    </label>
                    <input
                      value={data.header.label}
                      onChange={(e) =>
                        handleUpdate("header", "label", e.target.value)
                      }
                      className="input-field text-indigo-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Main Title
                    </label>
                    <textarea
                      value={data.header.title}
                      onChange={(e) =>
                        handleUpdate("header", "title", e.target.value)
                      }
                      className="input-field font-bold text-lg resize-none"
                      rows={2}
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

              {typeof selectedId === "number" && (
                <div className="space-y-4">
                  {(() => {
                    const faq = data.faqs.find((f) => f.id === selectedId);
                    if (!faq) return null;
                    return (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Question
                          </label>
                          <textarea
                            value={faq.question}
                            onChange={(e) =>
                              handleFaqUpdate(
                                selectedId,
                                "question",
                                e.target.value,
                              )
                            }
                            className="input-field font-bold resize-none"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) =>
                              handleFaqUpdate(
                                selectedId,
                                "answer",
                                e.target.value,
                              )
                            }
                            className="input-field resize-none h-40"
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {selectedId === "footer" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Box Title
                    </label>
                    <input
                      value={data.footer.title}
                      onChange={(e) =>
                        handleUpdate("footer", "title", e.target.value)
                      }
                      className="input-field font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Subtitle
                    </label>
                    <textarea
                      value={data.footer.subtitle}
                      onChange={(e) =>
                        handleUpdate("footer", "subtitle", e.target.value)
                      }
                      className="input-field resize-none"
                      rows={3}
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
                      <LinkIcon className="w-3 h-3" /> WhatsApp Link
                    </label>
                    <input
                      value={data.footer.buttonLink}
                      onChange={(e) =>
                        handleUpdate("footer", "buttonLink", e.target.value)
                      }
                      className="input-field text-xs text-indigo-600 font-mono"
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
              FAQ Manager
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Select a question to edit its text.
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
