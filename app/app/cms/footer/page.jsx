"use client";

import React, { useState } from "react";
import {
  Save,
  MapPin,
  Clock,
  Mail,
  CreditCard,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ShieldCheck,
  Wallet,
  Layout,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Type,
  Link as LinkIcon,
} from "lucide-react";

// --- INITIAL DATA ---

const INITIAL_DATA = {
  brand: {
    description:
      "Sri Lanka's most trusted tech destination. We bring the future of technology to your doorstep with official warranties and premium support.",
    socials: {
      twitter: true,
      instagram: true,
      facebook: true,
      linkedin: false,
    },
  },
  columns: [
    {
      id: "col1",
      title: "Discover",
      links: [
        { id: 1, label: "Shop All", href: "/shop" },
        { id: 2, label: "New Arrivals", href: "/new" },
        { id: 3, label: "Flash Deals", href: "/deals" },
        { id: 4, label: "Bundles", href: "/bundles" },
        { id: 5, label: "Tech Blog", href: "/blog" },
      ],
    },
    {
      id: "col2",
      title: "Help",
      links: [
        { id: 6, label: "Warranty Info", href: "/warranty" },
        { id: 7, label: "Returns", href: "/returns" },
        { id: 8, label: "FAQs", href: "/faqs" },
        { id: 9, label: "Contact Us", href: "/contact" },
      ],
    },
  ],
  store: {
    badge: "Flagship Store",
    city: "Sainthamruthu",
    address: "Main Street, Sainthamruthu.",
    hours: "Open Daily: 10AM - 8PM",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop", // Map/Store bg
  },
  newsletter: {
    title: "Join the inner circle.",
    subtitle: "Get access to secret sales and restock alerts.",
    placeholder: "Enter email address",
  },
  bottom: {
    copyright: "© 2026 Igen LK. All rights reserved. | Solution By Inzeedo",
    paymentMethods: ["visa", "master", "koko"],
  },
};

export default function FooterManager() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedSection, setSelectedSection] = useState(null); // 'brand', 'col1', 'col2', 'store', 'newsletter', 'bottom'
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
  const handleUpdate = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleLinkUpdate = (colId, linkId, field, value) => {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === colId
          ? {
              ...col,
              links: col.links.map((l) =>
                l.id === linkId ? { ...l, [field]: value } : l,
              ),
            }
          : col,
      ),
    }));
  };

  const toggleSocial = (key) => {
    setData((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        socials: { ...prev.brand.socials, [key]: !prev.brand.socials[key] },
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Footer Updated!");
    }, 800);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT PANEL: PREVIEW */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-50 shrink-0 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Footer Manager
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Customize the site footer, links, and store information.
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
        <div className="flex-1 p-8 md:p-12 overflow-x-hidden flex flex-col items-center justify-start bg-slate-100 dark:bg-black/80">
          <div className="w-full max-w-[1300px]">
            {/* FOOTER CONTAINER SIMULATION */}
            <div className="bg-black text-slate-400 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-800">
              {/* TOP ROW */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
                {/* 1. BRAND INFO */}
                <div
                  onClick={() => setSelectedSection("brand")}
                  className={`
                    md:col-span-4 p-4 -m-4 rounded-xl cursor-pointer transition-all border-2
                    ${selectedSection === "brand" ? "border-indigo-500 bg-white/5" : "border-transparent hover:bg-white/5"}
                  `}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-black text-sm">
                      I
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">
                      IGEN.
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6">
                    {data.brand.description}
                  </p>
                  <div className="flex gap-4">
                    {data.brand.socials.twitter && (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <Twitter className="w-4 h-4" />
                      </div>
                    )}
                    {data.brand.socials.instagram && (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <Instagram className="w-4 h-4" />
                      </div>
                    )}
                    {data.brand.socials.facebook && (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <Facebook className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. LINK COLUMNS */}
                <div className="md:col-span-4 flex gap-8">
                  {data.columns.map((col) => (
                    <div
                      key={col.id}
                      onClick={() => setSelectedSection(col.id)}
                      className={`
                        flex-1 p-4 -m-4 rounded-xl cursor-pointer transition-all border-2
                        ${selectedSection === col.id ? "border-indigo-500 bg-white/5" : "border-transparent hover:bg-white/5"}
                      `}
                    >
                      <h3 className="text-white font-bold mb-6">{col.title}</h3>
                      <ul className="space-y-4 text-sm">
                        {col.links.map((link) => (
                          <li
                            key={link.id}
                            className="hover:text-white transition-colors"
                          >
                            {link.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* 3. STORE CARD */}
                <div className="md:col-span-4">
                  <div
                    onClick={() => setSelectedSection("store")}
                    className={`
                      relative overflow-hidden rounded-3xl h-full min-h-[220px] p-8 flex flex-col justify-center cursor-pointer transition-all border-2
                      ${selectedSection === "store" ? "border-indigo-500" : "border-slate-800 hover:border-slate-700"}
                    `}
                  >
                    {/* Background Image Overlay */}
                    <img
                      src={data.store.image}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 mix-blend-multiply" />

                    <div className="relative z-10">
                      <span className="inline-block bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4">
                        {data.store.badge}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {data.store.city}
                      </h3>
                      <div className="space-y-1 text-sm text-slate-200">
                        <p>{data.store.address}</p>
                        <p className="opacity-80">{data.store.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: Newsletter & Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Newsletter */}
                <div
                  onClick={() => setSelectedSection("newsletter")}
                  className={`
                    bg-[#111] p-8 rounded-3xl border border-slate-800 flex items-center justify-between gap-4 cursor-pointer transition-all
                    ${selectedSection === "newsletter" ? "ring-2 ring-indigo-500" : "hover:bg-[#151515]"}
                  `}
                >
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-1">
                      {data.newsletter.title}
                    </h4>
                    <p className="text-xs">{data.newsletter.subtitle}</p>
                  </div>
                  <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>

                {/* Secure Badge Area */}
                <div className="bg-[#111] p-8 rounded-3xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-white font-bold text-xs uppercase">
                          Secure
                        </p>
                        <p className="text-[10px] uppercase">Checkout</p>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-indigo-500" />
                      <div>
                        <p className="text-white font-bold text-xs uppercase">
                          Flexible
                        </p>
                        <p className="text-[10px] uppercase">Payments</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-slate-200 text-black text-[10px] font-bold px-2 py-1 rounded">
                      VISA
                    </span>
                    <span className="bg-slate-200 text-black text-[10px] font-bold px-2 py-1 rounded">
                      MASTER
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM BAR */}
              <div
                onClick={() => setSelectedSection("bottom")}
                className={`
                  pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs cursor-pointer transition-all
                  ${selectedSection === "bottom" ? "text-indigo-400" : ""}
                `}
              >
                <p>{data.bottom.copyright}</p>
                <div className="flex gap-6">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                  <span>Sitemap</span>
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
        ${selectedSection ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}
      `}
      >
        {selectedSection ? (
          <>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Editing
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white capitalize">
                  {selectedSection === "col1"
                    ? "Discover Links"
                    : selectedSection === "col2"
                      ? "Help Links"
                      : selectedSection}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSection(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* --- BRAND EDITOR --- */}
              {selectedSection === "brand" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Description
                    </label>
                    <textarea
                      value={data.brand.description}
                      onChange={(e) =>
                        handleUpdate("brand", "description", e.target.value)
                      }
                      className="input-field resize-none h-32"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                      Social Icons
                    </label>
                    <div className="flex gap-2">
                      {["twitter", "instagram", "facebook", "linkedin"].map(
                        (social) => (
                          <button
                            key={social}
                            onClick={() => toggleSocial(social)}
                            className={`
                            p-3 rounded-lg border transition-all capitalize text-xs font-bold
                            ${
                              data.brand.socials[social]
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400"
                                : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                            }
                          `}
                          >
                            {social}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- LINKS EDITOR (Reusable for Col1 & Col2) --- */}
              {(selectedSection === "col1" || selectedSection === "col2") && (
                <div className="space-y-6">
                  {/* Column Title */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Column Title
                    </label>
                    <input
                      value={
                        data.columns.find((c) => c.id === selectedSection).title
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setData((prev) => ({
                          ...prev,
                          columns: prev.columns.map((c) =>
                            c.id === selectedSection ? { ...c, title: val } : c,
                          ),
                        }));
                      }}
                      className="input-field font-bold"
                    />
                  </div>

                  {/* Links List */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase block">
                      Links
                    </label>
                    {data.columns
                      .find((c) => c.id === selectedSection)
                      .links.map((link) => (
                        <div key={link.id} className="flex gap-2">
                          <div className="flex-1 space-y-1">
                            <input
                              value={link.label}
                              onChange={(e) =>
                                handleLinkUpdate(
                                  selectedSection,
                                  link.id,
                                  "label",
                                  e.target.value,
                                )
                              }
                              className="input-field py-2 text-xs font-bold"
                              placeholder="Label"
                            />
                            <input
                              value={link.href}
                              onChange={(e) =>
                                handleLinkUpdate(
                                  selectedSection,
                                  link.id,
                                  "href",
                                  e.target.value,
                                )
                              }
                              className="input-field py-2 text-xs font-mono text-slate-500"
                              placeholder="/url"
                            />
                          </div>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg h-fit mt-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    <button className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>
                </div>
              )}

              {/* --- STORE EDITOR --- */}
              {selectedSection === "store" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Badge
                    </label>
                    <input
                      value={data.store.badge}
                      onChange={(e) =>
                        handleUpdate("store", "badge", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      City Name
                    </label>
                    <input
                      value={data.store.city}
                      onChange={(e) =>
                        handleUpdate("store", "city", e.target.value)
                      }
                      className="input-field font-bold text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Address Line
                    </label>
                    <textarea
                      value={data.store.address}
                      onChange={(e) =>
                        handleUpdate("store", "address", e.target.value)
                      }
                      className="input-field resize-none h-20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Opening Hours
                    </label>
                    <input
                      value={data.store.hours}
                      onChange={(e) =>
                        handleUpdate("store", "hours", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {/* --- NEWSLETTER EDITOR --- */}
              {selectedSection === "newsletter" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Title
                    </label>
                    <input
                      value={data.newsletter.title}
                      onChange={(e) =>
                        handleUpdate("newsletter", "title", e.target.value)
                      }
                      className="input-field font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Subtitle
                    </label>
                    <textarea
                      value={data.newsletter.subtitle}
                      onChange={(e) =>
                        handleUpdate("newsletter", "subtitle", e.target.value)
                      }
                      className="input-field resize-none h-24"
                    />
                  </div>
                </div>
              )}

              {/* --- BOTTOM EDITOR --- */}
              {selectedSection === "bottom" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                      Copyright Text
                    </label>
                    <textarea
                      value={data.bottom.copyright}
                      onChange={(e) =>
                        handleUpdate("bottom", "copyright", e.target.value)
                      }
                      className="input-field resize-none h-20"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedSection(null)}
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
              Footer Editor
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on any section (Links, Store, Newsletter) to edit.
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
