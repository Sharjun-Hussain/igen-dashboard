"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Tag,
  X,
  CheckCircle2,
  ArrowUpRight,
  Heading,
  RefreshCw,
  AlertCircle,
  Upload,
} from "lucide-react";

// --- DEFAULT DATA (used if API hasn't seeded yet) ---

const DEFAULT_HEADER = {
  id: "hero_header",
  type: "header",
  title: "Upgrade Your Tech Game.",
  subtitle: "Brand New & Refurbished Phones, Accessories & Gadgets.",
  linkText: "View All Products",
  linkUrl: "/products",
};

const DEFAULT_GRID_DATA = [
  {
    id: "slot_1",
    type: "grid_item",
    label: "Main Feature (Top Left)",
    colSpan: "col-span-12 md:col-span-8",
    title: "iPhone 15 Pro.",
    subtitle: "Titanium.",
    badge: "New Arrival",
    badgeColor: "bg-indigo-600 text-white",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop",
    link: "/products/iphone-15-pro",
    textColor: "text-white",
    overlay: "bg-gradient-to-r from-black/80 to-transparent",
  },
  {
    id: "slot_2",
    type: "grid_item",
    label: "Side Feature (Top Right)",
    colSpan: "col-span-12 md:col-span-4",
    title: "Galaxy AI",
    subtitle: "S24 Ultra Series",
    badge: "",
    badgeColor: "bg-purple-600 text-white",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
    link: "/products/galaxy-s24",
    textColor: "text-white",
    overlay: "bg-purple-900/80",
  },
  {
    id: "slot_3",
    type: "grid_item",
    label: "Bottom Left",
    colSpan: "col-span-12 md:col-span-4",
    title: "Sony XM5",
    subtitle: "Audio",
    badge: "",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
    link: "/products/sony-xm5",
    textColor: "text-white",
    overlay: "bg-gradient-to-t from-black/90 via-black/20 to-transparent",
  },
  {
    id: "slot_4",
    type: "grid_item",
    label: "Bottom Center",
    colSpan: "col-span-12 md:col-span-4",
    title: "Ultra Watch",
    subtitle: "Adventure awaits",
    badge: "-15%",
    badgeColor: "bg-red-600 text-white",
    image: "https://images.unsplash.com/photo-1434493789847-2f02ea6ca920?q=80&w=2074&auto=format&fit=crop",
    link: "/products/apple-watch-ultra",
    textColor: "text-white",
    overlay: "bg-gradient-to-t from-black/80 via-transparent to-transparent",
  },
  {
    id: "slot_5",
    type: "grid_item",
    label: "Bottom Right",
    colSpan: "col-span-12 md:col-span-4",
    title: "Watch the Film",
    subtitle: "Experience the ecosystem",
    badge: "Preview",
    badgeColor: "bg-white/20 backdrop-blur-md text-white border border-white/30",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop",
    link: "/campaigns/ecosystem",
    textColor: "text-white",
    overlay: "bg-red-900/40 mix-blend-multiply",
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const STORAGE_BASE = API_BASE?.replace("/api/v1", "");

export default function HeroManagerPage() {
  const { data: session } = useSession();

  const [headerData, setHeaderData] = useState(DEFAULT_HEADER);
  const [gridItems, setGridItems] = useState(DEFAULT_GRID_DATA);
  const [selectedItem, setSelectedItem] = useState(null);

  // Per-slot image files (keyed by slot id)
  const [imageFiles, setImageFiles] = useState({});
  // Per-slot local preview URLs
  const [imagePreviews, setImagePreviews] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // --- FETCH CMS DATA ON MOUNT ---
  useEffect(() => {
    if (!session?.accessToken) return;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/cms`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/json",
          },
        });
        const data = await res.json();

        // Map home.hero → header fields
        const heroItems = data?.data?.home?.hero || [];
        if (heroItems.length > 0) {
          const mapped = {};
          heroItems.forEach((item) => { mapped[item.key] = item.value; });

          setHeaderData((prev) => ({
            ...prev,
            title: mapped.title || prev.title,
            subtitle: mapped.subtitle || prev.subtitle,
            linkText: mapped.link_text || prev.linkText,
            linkUrl: mapped.link_url || prev.linkUrl,
          }));

          // If hero has an image, apply it to slot_1
          if (mapped.image) {
            const imageUrl = mapped.image.startsWith("http")
              ? mapped.image
              : `${STORAGE_BASE}/${mapped.image}`;
            setGridItems((prev) =>
              prev.map((item) =>
                item.id === "slot_1" ? { ...item, image: imageUrl } : item
              )
            );
          }
        }

        // Map home.hero_slot_X → each grid slot
        for (let i = 1; i <= 5; i++) {
          const slotItems = data?.data?.home?.[`hero_slot_${i}`] || [];
          if (slotItems.length > 0) {
            const mapped = {};
            slotItems.forEach((item) => { mapped[item.key] = item.value; });
            setGridItems((prev) =>
              prev.map((slot) => {
                if (slot.id !== `slot_${i}`) return slot;
                return {
                  ...slot,
                  title: mapped.title || slot.title,
                  subtitle: mapped.subtitle || slot.subtitle,
                  badge: mapped.badge ?? slot.badge,
                  link: mapped.link || slot.link,
                  image: mapped.image
                    ? mapped.image.startsWith("http")
                      ? mapped.image
                      : `${STORAGE_BASE}/${mapped.image}`
                    : slot.image,
                };
              })
            );
          }
        }
      } catch {
        // silently use defaults if API unavailable
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session]);

  // --- UPDATE HANDLER (same as original) ---
  const handleUpdate = (e) => {
    if (!selectedItem) return;
    const { name, value } = e.target;
    setSelectedItem((prev) => (prev ? { ...prev, [name]: value } : null));

    if (selectedItem.type === "header") {
      setHeaderData((prev) => ({ ...prev, [name]: value }));
    } else {
      setGridItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, [name]: value } : item
        )
      );
    }
  };

  // --- IMAGE FILE PICKER (for grid items) ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedItem) return;
    const slotId = selectedItem.id;
    const previewUrl = URL.createObjectURL(file);

    setImageFiles((prev) => ({ ...prev, [slotId]: file }));
    setImagePreviews((prev) => ({ ...prev, [slotId]: previewUrl }));

    // Update the grid item's displayed image
    setGridItems((prev) =>
      prev.map((item) =>
        item.id === slotId ? { ...item, image: previewUrl } : item
      )
    );
    setSelectedItem((prev) => prev ? { ...prev, image: previewUrl } : null);
  };

  // --- SAVE TO API ---
  const handleSave = async () => {
    if (!session?.accessToken) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      let idx = 0;

      // 1. Header fields → page=home, section=hero
      const headerFields = [
        { key: "title", value: headerData.title, type: "text" },
        { key: "subtitle", value: headerData.subtitle, type: "textarea" },
        { key: "link_text", value: headerData.linkText, type: "text" },
        { key: "link_url", value: headerData.linkUrl, type: "link" },
      ];
      headerFields.forEach((field) => {
        formData.append(`contents[${idx}][page]`, "home");
        formData.append(`contents[${idx}][section]`, "hero");
        formData.append(`contents[${idx}][key]`, field.key);
        formData.append(`contents[${idx}][type]`, field.type);
        formData.append(`contents[${idx}][value]`, field.value || "");
        idx++;
      });

      // 2. Grid items → page=home, section=hero_slot_N
      gridItems.forEach((item, i) => {
        const slotNum = i + 1;
        const section = `hero_slot_${slotNum}`;
        const slotFile = imageFiles[item.id];

        const slotFields = [
          { key: "title", value: item.title, type: "text" },
          { key: "subtitle", value: item.subtitle, type: "text" },
          { key: "badge", value: item.badge, type: "text" },
          { key: "link", value: item.link, type: "link" },
        ];

        slotFields.forEach((field) => {
          formData.append(`contents[${idx}][page]`, "home");
          formData.append(`contents[${idx}][section]`, section);
          formData.append(`contents[${idx}][key]`, field.key);
          formData.append(`contents[${idx}][type]`, field.type);
          formData.append(`contents[${idx}][value]`, field.value || "");
          idx++;
        });

        // Image (only if a new file was chosen)
        if (slotFile) {
          formData.append(`contents[${idx}][page]`, "home");
          formData.append(`contents[${idx}][section]`, section);
          formData.append(`contents[${idx}][key]`, "image");
          formData.append(`contents[${idx}][type]`, "image");
          formData.append(`contents[${idx}][value]`, slotFile);
          idx++;
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");

      setSaveSuccess(true);
      setImageFiles({});
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOADING STATE ---
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* 1. MAIN PREVIEW AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Hero Layout Manager
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Click the header text or any grid block to edit.
            </p>
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
              {isSaving ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
              ) : (
                <><Save className="w-4 h-4" /> Save Layout</>
              )}
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-8 mt-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* --- THE PREVIEW CANVAS (ORIGINAL DESIGN) --- */}
        <div className="p-8 max-w-[1400px] mx-auto w-full">
          {/* A. EDITABLE HEADER SECTION */}
          <div
            onClick={() => setSelectedItem(headerData)}
            className={`
              mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 p-4 rounded-2xl transition-all cursor-pointer border-2
              ${
                selectedItem?.id === "hero_header"
                  ? "border-indigo-500 bg-indigo-50/10"
                  : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800"
              }
            `}
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 leading-[0.9]">
                {headerData.title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={i === 2 || i === 3 ? "text-indigo-600 dark:text-indigo-500" : ""}
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                {headerData.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white group">
              {headerData.linkText}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </div>

          {/* B. THE GRID SECTION (ORIGINAL 5-SLOT DESIGN) */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {gridItems.map((item) => {
              const displayImage = imagePreviews[item.id] || item.image;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`
                    ${item.colSpan} 
                    relative group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-200
                    ${
                      selectedItem?.id === item.id
                        ? "border-indigo-500 ring-4 ring-indigo-500/20 scale-[0.99]"
                        : "border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.01]"
                    }
                  `}
                >
                  <img
                    src={displayImage}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 ${item.overlay}`} />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="absolute top-6 left-6 flex gap-2">
                      {item.badge && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.badgeColor || "bg-indigo-600 text-white"}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3
                        className={`text-sm font-bold uppercase tracking-widest opacity-80 ${item.textColor} mb-1`}
                      >
                        {item.subtitle}
                      </h3>
                      <h2
                        className={`text-3xl font-extrabold tracking-tight ${item.textColor} leading-none`}
                      >
                        {item.title}
                      </h2>
                    </div>
                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                      <span className="bg-white text-indigo-900 px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                        <Type className="w-4 h-4" /> Edit Content
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. EDITOR SIDEBAR (ORIGINAL DESIGN + new image upload support) */}
      <div
        className={`
          w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 
          flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-20 absolute right-0 lg:relative
          ${selectedItem ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}
        `}
      >
        {selectedItem ? (
          <>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {selectedItem.type === "header" ? "Editing Header" : "Editing Grid Block"}
                </span>
                <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {selectedItem.type === "grid_item" ? selectedItem.label : (selectedItem.title || "Untitled")}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* --- HEADER SPECIFIC INPUTS --- */}
              {selectedItem.type === "header" && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Heading className="w-3 h-3" /> Headline Text
                      </label>
                      <textarea
                        name="title"
                        rows={2}
                        value={selectedItem.title || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Subheadline
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={selectedItem.subtitle || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Link Label
                      </label>
                      <input
                        type="text"
                        name="linkText"
                        value={selectedItem.linkText || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* --- GRID ITEM SPECIFIC INPUTS --- */}
              {selectedItem.type === "grid_item" && (
                <>
                  {/* Image — with file upload */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Image
                    </label>
                    {/* Current image preview thumbnail */}
                    <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-2">
                      <img
                        src={imagePreviews[selectedItem.id] || selectedItem.image}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                    </div>
                    {/* URL input */}
                    <div className="relative">
                      <input
                        type="text"
                        name="image"
                        value={selectedItem.image || ""}
                        onChange={handleUpdate}
                        placeholder="Image URL or upload below"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    {/* File upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm font-bold text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {imageFiles[selectedItem.id] ? imageFiles[selectedItem.id].name : "Upload New Image"}
                    </button>
                    {imageFiles[selectedItem.id] && (
                      <p className="text-xs text-emerald-600 font-medium">✓ Ready to save: {imageFiles[selectedItem.id].name}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Type className="w-3 h-3" /> Product Name
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={selectedItem.title || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Subtitle / Caption
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={selectedItem.subtitle || ""}
                        onChange={handleUpdate}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Badge
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="badge"
                        value={selectedItem.badge || ""}
                        onChange={handleUpdate}
                        placeholder="None"
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <select
                        name="badgeColor"
                        value={selectedItem.badgeColor || ""}
                        onChange={handleUpdate}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs outline-none"
                      >
                        <option value="bg-indigo-600 text-white">Blue</option>
                        <option value="bg-purple-600 text-white">Purple</option>
                        <option value="bg-red-600 text-white">Red</option>
                        <option value="bg-black text-white">Black</option>
                        <option value="bg-white/20 backdrop-blur-md text-white border border-white/30">Glass</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* --- LINK INPUT (SHARED) --- */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 space-y-3">
                <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Destination URL
                </label>
                <input
                  type="text"
                  name={selectedItem.type === "header" ? "linkUrl" : "link"}
                  value={
                    selectedItem.type === "header"
                      ? selectedItem.linkUrl || ""
                      : selectedItem.link || ""
                  }
                  onChange={handleUpdate}
                  placeholder="/products/..."
                  className="w-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-lg p-2.5 text-sm font-mono text-indigo-700 dark:text-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving…" : "Save to API"}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" /> Done Editing
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Type className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              Nothing Selected
            </h3>
            <p className="text-sm mt-2 max-w-[200px]">
              Click on the Header text or a Grid Block to start editing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
