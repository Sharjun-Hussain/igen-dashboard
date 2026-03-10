"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Image as ImageIcon,
  Type,
  X,
  MousePointer2,
  Heading,
  Upload,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const STORAGE_BASE = API_BASE?.replace("/api/v1", "");

const SHOP_HERO_FIELDS = [
  { key: "badge_text", label: "Top Badge", type: "text" },
  { key: "title_start", label: "Title (Start)", type: "text" },
  { key: "title_end", label: "Title (End/Accent)", type: "text" },
  { key: "description", label: "Description Text", type: "textarea" },
  { key: "image", label: "Banner Image", type: "image" },
  { key: "banner_title", label: "Banner Title", type: "text" },
  { key: "banner_subtitle", label: "Banner Subtitle", type: "text" },
];

const DEFAULT_DATA = {
  badge_text: "SEASON ESSENTIALS",
  title_start: "Curated Tech for",
  title_end: "Modern Living.",
  description: "Discover our latest collection of premium devices, engineered for performance and designed to inspire.",
  image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
  banner_title: "The Audio Collection",
  banner_subtitle: "Immersive soundscapes",
};

export default function ShopHeroManager() {
  const { data: session } = useSession();
  const [fields, setFields] = useState(DEFAULT_DATA);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

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
        const heroItems = data?.data?.shop?.hero || [];
        if (heroItems.length > 0) {
          const mapped = {};
          heroItems.forEach((item) => {
            mapped[item.key] = item.value;
          });
          setFields((prev) => ({ ...prev, ...mapped }));
          if (mapped.image) {
            const imageUrl = mapped.image.startsWith("http")
              ? mapped.image
              : `${STORAGE_BASE}/${mapped.image}`;
            setImagePreview(imageUrl);
          }
        }
      } catch (err) {
        console.warn("CMS defaults used for shop", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session]);

  const handleFieldChange = (key, value) => setFields((prev) => ({ ...prev, [key]: value }));

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFields((prev) => ({ ...prev, image: file.name }));
  };

  const handleSave = async () => {
    if (!session?.accessToken) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const formData = new FormData();
      let idx = 0;
      SHOP_HERO_FIELDS.forEach((field) => {
        // Only append if it's not an image OR if it's an image with a new file
        if (field.type === "image" && !imageFile) return;

        formData.append(`contents[${idx}][page]`, "shop");
        formData.append(`contents[${idx}][section]`, "hero");
        formData.append(`contents[${idx}][key]`, field.key);
        formData.append(`contents[${idx}][type]`, field.type);
        if (field.type === "image") {
          formData.append(`contents[${idx}][value]`, imageFile);
        } else {
          formData.append(`contents[${idx}][value]`, fields[field.key] || "");
        }
        idx++;
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
      setImageFile(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Shop Hero…</p>
        </div>
      </div>
    );
  }

  const currentField = SHOP_HERO_FIELDS.find((f) => f.key === selectedKey);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-white">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-50 shrink-0 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              Shop Page — Hero Redesign
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure the new "Curated Tech" layout. Click to edit.</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
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
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
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

        <div className="p-6 max-w-[1200px] mx-auto w-full space-y-8">
          {/* --- LIVE PREVIEW --- */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Live Preview</h3>
            <div 
              onClick={() => setSelectedKey(null)}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl overflow-hidden relative"
            >
              {/* Left Content */}
              <div className="flex-1 space-y-6 z-10">
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedKey("badge_text"); }}
                  className={`inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full cursor-pointer transition-all border-2 ${selectedKey === "badge_text" ? "border-indigo-500 scale-105" : "border-transparent"}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.15em]">{fields.badge_text}</span>
                </div>

                <div className="space-y-3">
                  <h1 
                    onClick={(e) => { e.stopPropagation(); setSelectedKey("title_start"); }}
                    className={`text-4xl md:text-5xl font-black tracking-tight leading-[1.1] cursor-pointer transition-all ${selectedKey === "title_start" || selectedKey === "title_end" ? "scale-105" : ""}`}
                  >
                    <span className="text-slate-900 dark:text-white block">{fields.title_start}</span>
                    <span 
                      onClick={(e) => { e.stopPropagation(); setSelectedKey("title_end"); }}
                      className={`text-slate-400 dark:text-slate-500 block ${selectedKey === "title_end" ? "text-indigo-500 dark:text-indigo-400 underline decoration-indigo-500/30" : ""}`}
                    >
                      {fields.title_end}
                    </span>
                  </h1>
                  <p 
                    onClick={(e) => { e.stopPropagation(); setSelectedKey("description"); }}
                    className={`text-base text-slate-500 dark:text-slate-400 max-w-md leading-relaxed cursor-pointer transition-all border-l-4 border-transparent pl-3 ${selectedKey === "description" ? "border-indigo-500 bg-indigo-50/50" : ""}`}
                  >
                    {fields.description}
                  </p>
                </div>
              </div>

              {/* Right Banner Card */}
              <div 
                onClick={(e) => { e.stopPropagation(); setSelectedKey("image"); }}
                className={`flex-1 w-full max-w-lg aspect-[1.3] relative rounded-[2rem] overflow-hidden cursor-pointer transition-all border-4 ${selectedKey === "image" || selectedKey === "banner_title" || selectedKey === "banner_subtitle" ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg" : "border-transparent"}`}
              >
                <img 
                  src={imagePreview || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop"} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                  alt="Banner" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                
                <div className="absolute bottom-6 left-6 space-y-0.5">
                  <h3 
                    onClick={(e) => { e.stopPropagation(); setSelectedKey("banner_title"); }}
                    className={`text-2xl font-bold text-white tracking-tight cursor-pointer ${selectedKey === "banner_title" ? "bg-indigo-600 px-2 rounded" : ""}`}
                  >
                    {fields.banner_title}
                  </h3>
                  <p 
                    onClick={(e) => { e.stopPropagation(); setSelectedKey("banner_subtitle"); }}
                    className={`text-slate-300 text-sm font-medium cursor-pointer ${selectedKey === "banner_subtitle" ? "bg-indigo-600 px-2 rounded" : ""}`}
                  >
                    {fields.banner_subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- EDITABLE FIELDS LIST --- */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-center md:text-left">Quick Fields Management</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {SHOP_HERO_FIELDS.map((field) => (
                <div 
                  key={field.key} 
                  onClick={() => setSelectedKey(field.key)} 
                  className={`bg-white dark:bg-slate-900 p-3 rounded-xl cursor-pointer border-2 transition-all flex flex-col items-center text-center gap-1.5 ${selectedKey === field.key ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-slate-200 dark:border-slate-800 hover:border-indigo-200 shadow-sm"}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    {field.type === "image" ? <ImageIcon className="w-4 h-4 text-indigo-500" /> : <Type className="w-4 h-4 text-indigo-500" />}
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider leading-none">{field.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EDITOR SIDEBAR */}
      <div className={`w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-100 absolute right-0 lg:relative ${selectedKey ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}`}>
        {selectedKey && currentField ? (
          <>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Editing Field</span>
                <h2 className="font-bold text-xl text-slate-900 dark:text-white">{currentField.label}</h2>
              </div>
              <button onClick={() => setSelectedKey(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {currentField.type === "image" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-1"><Upload className="w-3 h-3" /> Image Upload</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()} 
                      className="group relative aspect-video rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all overflow-hidden shadow-inner"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                            <ImageIcon className="w-6 h-6 mb-2" />
                            <span className="text-xs font-bold uppercase">Replace Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                          <span className="text-[10px] font-bold text-slate-400">Click to Upload</span>
                        </>
                      )}
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageSelect} 
                        className="hidden" 
                      />
                    </div>
                  </div>
                  {imageFile && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700 truncate">{imageFile.name} ready</span>
                    </div>
                  )}
                </div>
              ) : currentField.type === "textarea" ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Content</label>
                  <textarea 
                    rows={6} 
                    value={fields[currentField.key] || ""} 
                    onChange={(e) => handleFieldChange(currentField.key, e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-900 dark:text-white leading-relaxed" 
                    placeholder="Type your content here..."
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block ml-1">Content</label>
                  <input 
                    type="text" 
                    value={fields[currentField.key] || ""} 
                    onChange={(e) => handleFieldChange(currentField.key, e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white font-bold" 
                    placeholder="e.g. Modern Living."
                  />
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">CMS Metadata</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase tracking-wider text-amber-600/70">
                  <div>Page: <span className="text-amber-700">shop</span></div>
                  <div>Section: <span className="text-amber-700">hero</span></div>
                  <div>Key: <span className="text-amber-700">{currentField.key}</span></div>
                  <div>Type: <span className="text-amber-700">{currentField.type}</span></div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-[1.25rem] font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Syncing to API…" : "Save to Database"}
              </button>
              <button 
                onClick={() => setSelectedKey(null)} 
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-[1.25rem] font-bold text-xs uppercase hover:bg-slate-100 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <CheckCircle2 className="w-4 h-4" /> Done Editing
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
              <MousePointer2 className="w-8 h-8 opacity-20" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Layout Architect</h3>
              <p className="text-sm mt-2 max-w-[200px] leading-relaxed">Click any element in the live preview or the field deck below to customize your layout.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .input-field { 
          @apply w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all shadow-sm; 
        }
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
