"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Save, Image as ImageIcon, Type, X, CheckCircle2,
  MousePointer2, Heading, Upload, RefreshCw, AlertCircle, ShoppingBag,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const STORAGE_BASE = API_BASE?.replace("/api/v1", "");

const SHOP_HERO_FIELDS = [
  { key: "title", label: "Shop Hero Title", type: "text" },
  { key: "subtitle", label: "Shop Hero Subtitle", type: "textarea" },
  { key: "image", label: "Shop Hero Image", type: "image" },
];

export default function ShopHeroManager() {
  const { data: session } = useSession();
  const [fields, setFields] = useState({ title: "Discover Your Next Favourite.", subtitle: "Explore our curated collection of premium phones, gadgets & accessories.", image: "" });
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
        const res = await fetch(`${API_BASE}/admin/cms`, { headers: { Authorization: `Bearer ${session.accessToken}`, Accept: "application/json" } });
        const data = await res.json();
        const heroItems = data?.data?.shop?.hero || [];
        if (heroItems.length > 0) {
          const mapped = {};
          heroItems.forEach((item) => { mapped[item.key] = item.value; });
          setFields((prev) => ({ ...prev, ...mapped }));
          if (mapped.image) setImagePreview(`${STORAGE_BASE}/${mapped.image}`);
        }
      } catch { /* use defaults */ }
      finally { setIsLoading(false); }
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
    setIsSaving(true); setSaveSuccess(false); setError(null);
    try {
      const formData = new FormData();
      SHOP_HERO_FIELDS.forEach((field, index) => {
        formData.append(`contents[${index}][page]`, "shop");
        formData.append(`contents[${index}][section]`, "hero");
        formData.append(`contents[${index}][key]`, field.key);
        formData.append(`contents[${index}][type]`, field.type);
        if (field.type === "image") { if (imageFile) formData.append(`contents[${index}][value]`, imageFile); }
        else formData.append(`contents[${index}][value]`, fields[field.key] || "");
      });
      const res = await fetch(`${API_BASE}/admin/cms/update`, { method: "POST", headers: { Authorization: `Bearer ${session.accessToken}`, Accept: "application/json" }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      setSaveSuccess(true); setImageFile(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { setError(err.message); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center"><RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" /><p className="text-slate-600 dark:text-slate-400 font-medium">Loading…</p></div>
    </div>
  );

  const currentField = SHOP_HERO_FIELDS.find((f) => f.key === selectedKey);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /></div>
              Shop Page — Hero
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">1 image + 2 content fields. Click a card to edit.</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /> Saved!</span>}
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50">
              {isSaving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
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

        <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Live Preview</h3>
            <div className="relative w-full rounded-3xl overflow-hidden" style={{ minHeight: "420px" }}>
              <img src={imagePreview || "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop"} alt="Shop Hero" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="relative z-10 p-12 md:p-20 flex flex-col justify-center" style={{ minHeight: "420px" }}>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 max-w-2xl">{fields.title}</h1>
                <p className="text-lg text-slate-300 font-medium max-w-lg leading-relaxed mb-8">{fields.subtitle}</p>
                <span className="inline-flex w-fit items-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-indigo-600/30">
                  <ShoppingBag className="w-4 h-4" /> Shop Now
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Editable Fields (page=shop · section=hero)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SHOP_HERO_FIELDS.map((field) => (
                <div key={field.key} onClick={() => setSelectedKey(field.key)} className={`bg-white dark:bg-slate-900 rounded-2xl p-5 cursor-pointer border-2 transition-all duration-200 ${selectedKey === field.key ? "border-indigo-500 ring-4 ring-indigo-500/15 shadow-lg" : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {field.type === "image" ? <ImageIcon className="w-4 h-4 text-indigo-500" /> : field.key === "title" ? <Heading className="w-4 h-4 text-indigo-500" /> : <Type className="w-4 h-4 text-indigo-500" />}
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</span>
                    <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{field.type}</span>
                  </div>
                  {field.type === "image" ? (
                    <div className="flex items-center gap-3">
                      {imagePreview ? <img src={imagePreview} alt="Hero" className="w-16 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700" /> : <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center"><ImageIcon className="w-5 h-5 text-slate-400" /></div>}
                      <p className="text-xs font-mono text-slate-500 truncate">{fields.image || "No image set"}</p>
                    </div>
                  ) : (
                    <p className={`text-sm text-slate-700 dark:text-slate-300 line-clamp-2 ${field.key === "title" ? "font-bold" : ""}`}>{fields[field.key] || <span className="italic text-slate-400">Empty</span>}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EDITOR SIDEBAR */}
      <div className={`w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-20 absolute right-0 lg:relative ${selectedKey ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}`}>
        {selectedKey && currentField ? (
          <>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">shop · hero · {currentField.key}</span>
                <h2 className="font-bold text-slate-900 dark:text-white">{currentField.label}</h2>
              </div>
              <button onClick={() => setSelectedKey(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {currentField.type === "image" ? (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Image Upload</label>
                  {imagePreview && <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm font-bold text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                    <Upload className="w-4 h-4" />{imageFile ? imageFile.name : "Choose New Image"}
                  </button>
                  {imageFile && <p className="text-xs text-emerald-600 font-medium">✓ Ready: {imageFile.name}</p>}
                </div>
              ) : currentField.type === "textarea" ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Content</label>
                  <textarea rows={5} value={fields[currentField.key] || ""} onChange={(e) => handleFieldChange(currentField.key, e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-900 dark:text-white" />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Content</label>
                  <input type="text" value={fields[currentField.key] || ""} onChange={(e) => handleFieldChange(currentField.key, e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white font-semibold" />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <button onClick={handleSave} disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{isSaving ? "Saving…" : "Save to API"}
              </button>
              <button onClick={() => setSelectedKey(null)} className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:opacity-90">
                <CheckCircle2 className="w-4 h-4" /> Done Editing
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4"><MousePointer2 className="w-8 h-8 text-slate-300 dark:text-slate-600" /></div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nothing Selected</h3>
            <p className="text-sm mt-2 max-w-[200px]">Click a field card to start editing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
