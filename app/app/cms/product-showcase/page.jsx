"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Save,
  Battery,
  Bluetooth,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  Globe,
  Play,
  Zap,
  Star,
  Check,
  X,
  Layout,
  Type,
  ImageIcon,
  Clock,
  Link as LinkIcon,
  List,
  RefreshCw,
  AlertCircle,
  Upload,
} from "lucide-react";
import { CheckCircle2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const STORAGE_BASE = API_BASE?.replace("/api/v1", "");

const INITIAL_DATA = {
  product: {
    title: "Sony WH-1000XM5",
    price: "$299",
    oldPrice: "$399",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
  },
  review: {
    rating: "4.9",
    text: "Best noise cancelling ever.",
    author: "VERIFIED BUYER",
  },
  timer: {
    endsIn: "03:46:22",
    badge: "FLASH",
  },
  video: {
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
    label: "WATCH REVIEW",
    videoUrl: "https://youtube.com/",
  },
  specs: {
    battery: "30 Hours",
    connectivity: "Bluetooth 5.2",
  },
  buy: {
    label: "Buy Now",
    sublabel: "FREE EXPRESS SHIPPING",
  },
  services: [
    { id: "showcase_service_1", text: "30-Day Returns", icon: "return" },
    { id: "showcase_service_2", text: "2 Year Warranty", icon: "shield" },
    { id: "showcase_service_3", text: "Global Shipping", icon: "globe" },
  ],
};

export default function ProductShowcaseManager() {
  const { data: session } = useSession();
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Image upload refs & local previews
  const productImgRef = useRef(null);
  const videoImgRef = useRef(null);
  const [previews, setPreviews] = useState({ product: null, video: null });

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

        // Helper to map section
        const mapSection = (sectionName, fields) => {
          const sec = sections[sectionName] || [];
          if (sec.length > 0) {
            const mapped = {};
            sec.forEach(i => mapped[i.key] = i.value);
            const result = {};
            fields.forEach(f => {
              if (mapped[f]) result[f] = mapped[f];
            });
            return result;
          }
          return null;
        };

        // 1. Product
        const prod = mapSection("showcase_product", ["title", "price", "oldPrice", "badge", "image"]);
        if (prod) {
          if (prod.image && !prod.image.startsWith("http")) {
            prod.image = `${STORAGE_BASE}/${prod.image}`;
          }
          newData.product = { ...newData.product, ...prod };
        }

        // 2. Review
        const rev = mapSection("showcase_review", ["rating", "text", "author"]);
        if (rev) newData.review = { ...newData.review, ...rev };

        // 3. Timer
        const time = mapSection("showcase_timer", ["endsIn", "badge"]);
        if (time) newData.timer = { ...newData.timer, ...time };

        // 4. Video
        const vid = mapSection("showcase_video", ["image", "label", "videoUrl"]);
        if (vid) {
          if (vid.image && !vid.image.startsWith("http")) {
            vid.image = `${STORAGE_BASE}/${vid.image}`;
          }
          newData.video = { ...newData.video, ...vid };
        }

        // 5. Specs
        const spec = mapSection("showcase_specs", ["battery", "connectivity"]);
        if (spec) newData.specs = { ...newData.specs, ...spec };

        // 6. Buy
        const buy = mapSection("showcase_buy", ["label", "sublabel"]);
        if (buy) newData.buy = { ...newData.buy, ...buy };

        // 7. Services
        newData.services = INITIAL_DATA.services.map(s => {
          const sData = mapSection(s.id, ["text", "icon"]);
          return sData ? { ...s, ...sData } : s;
        });

        setData(newData);
      } catch (err) {
        console.warn("CMS defaults used for showcase", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const handleUpdate = (section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleServiceUpdate = (id, value) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, text: value } : s)),
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result }));
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
        formData.append(`contents[${index}][value]`, value || "");
        index++;
      };

      // 1. Product
      append("showcase_product", "title", data.product.title, "text");
      append("showcase_product", "price", data.product.price, "text");
      append("showcase_product", "oldPrice", data.product.oldPrice, "text");
      append("showcase_product", "badge", data.product.badge, "text");
      const prodImg = productImgRef.current?.files[0];
      append("showcase_product", "image", prodImg || data.product.image, prodImg ? "image" : "text");

      // 2. Review
      append("showcase_review", "rating", data.review.rating, "text");
      append("showcase_review", "text", data.review.text, "textarea");
      append("showcase_review", "author", data.review.author, "text");

      // 3. Timer
      append("showcase_timer", "endsIn", data.timer.endsIn, "text");
      append("showcase_timer", "badge", data.timer.badge, "text");

      // 4. Video
      const vidImg = videoImgRef.current?.files[0];
      append("showcase_video", "image", vidImg || data.video.image, vidImg ? "image" : "text");
      append("showcase_video", "label", data.video.label, "text");
      append("showcase_video", "videoUrl", data.video.videoUrl, "link");

      // 5. Specs
      append("showcase_specs", "battery", data.specs.battery, "text");
      append("showcase_specs", "connectivity", data.specs.connectivity, "text");

      // 6. Buy
      append("showcase_buy", "label", data.buy.label, "text");
      append("showcase_buy", "sublabel", data.buy.sublabel, "text");

      // 7. Services
      data.services.forEach(s => {
        append(s.id, "text", s.text, "text");
        append(s.id, "icon", s.icon, "text");
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
      setPreviews({ product: null, video: null });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getServiceIcon = (name) => {
    switch (name) {
      case "return": return <RotateCcw className="w-4 h-4" />;
      case "shield": return <ShieldCheck className="w-4 h-4" />;
      case "globe": return <Globe className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Showcase</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Bento-style grid for your hero product.</p>
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
          <div className="mx-8 mt-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="flex-1">{error}</p>
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex-1 p-8 md:p-12 flex flex-col items-center">
          <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* COLUMN 1 & 2 */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
              {/* MAIN PRODUCT CARD */}
              <div onClick={() => setSelectedGroup("product")} className={`relative h-[320px] rounded-[2rem] p-8 cursor-pointer transition-all border bg-white dark:bg-slate-900 ${selectedGroup === "product" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg"}`}>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold mb-4">{data.product.badge}</span>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{data.product.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-red-500">{data.product.price}</span>
                    <span className="text-lg text-slate-400 line-through">{data.product.oldPrice}</span>
                  </div>
                </div>
                <img src={previews.product || data.product.image} className="absolute bottom-0 right-0 w-3/5 h-auto object-contain drop-shadow-2xl" alt="Product" />
              </div>

              {/* RATING CARD */}
              <div onClick={() => setSelectedGroup("review")} className={`h-[140px] rounded-[2rem] p-8 flex items-center justify-between cursor-pointer transition-all border bg-slate-900 text-white ${selectedGroup === "review" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-transparent hover:scale-[1.01]"}`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-amber-400">{data.review.rating}</span>
                    <div className="flex text-amber-400 gap-0.5">{[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-current" />))}</div>
                  </div>
                  <div className="pl-4 border-l-2 border-amber-500/50">
                    <p className="text-sm italic font-medium text-slate-200">"{data.review.text}"</p>
                    <p className="text-[10px] font-bold text-amber-500 mt-1 uppercase">{data.review.author}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div className="flex flex-col gap-4 md:gap-6">
              <div onClick={() => setSelectedGroup("timer")} className={`h-[160px] rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer transition-all border bg-black text-white ${selectedGroup === "timer" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-transparent hover:scale-[1.02]"}`}>
                <div className="flex justify-between items-start"><Zap className="w-5 h-5 text-yellow-400 fill-current" /><span className="px-2 py-0.5 rounded border border-white/20 text-[10px] font-bold uppercase">{data.timer.badge}</span></div>
                <div><p className="text-[10px] font-bold text-slate-500 uppercase mb-1">ENDS IN</p><p className="text-2xl font-mono font-bold tracking-wider">{data.timer.endsIn}</p></div>
              </div>
              <div onClick={() => setSelectedGroup("video")} className={`flex-1 rounded-[2rem] overflow-hidden relative cursor-pointer group transition-all border bg-slate-100 dark:bg-slate-800 ${selectedGroup === "video" ? "border-indigo-500 ring-4 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800"}`}>
                <img src={previews.video || data.video.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end pb-8">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4"><Play className="w-5 h-5 text-white fill-current ml-1" /></div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">{data.video.label}</span>
                </div>
              </div>
            </div>

            {/* COLUMN 4 */}
            <div className="flex flex-col gap-4">
              {["Battery", "Connectivity"].map((spec) => (
                <div key={spec} onClick={() => setSelectedGroup("specs")} className={`p-5 rounded-[1.5rem] flex items-center gap-4 cursor-pointer transition-all border bg-white dark:bg-slate-900 ${selectedGroup === "specs" ? "border-indigo-500" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${spec === "Battery" ? "bg-indigo-50 text-indigo-600" : "bg-purple-50 text-purple-600"}`}>{spec === "Battery" ? <Battery className="w-5 h-5" /> : <Bluetooth className="w-5 h-5" />}</div>
                  <div><p className="font-bold text-slate-900 dark:text-white text-sm">{spec === "Battery" ? data.specs.battery : data.specs.connectivity}</p><p className="text-[10px] text-slate-500 font-bold uppercase">{spec}</p></div>
                </div>
              ))}
              <div onClick={() => setSelectedGroup("buy")} className={`p-6 rounded-[1.5rem] cursor-pointer transition-all border bg-white text-slate-900 ${selectedGroup === "buy" ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200"}`}><ShoppingBag className="w-6 h-6 mb-6" /><h3 className="text-xl font-extrabold mb-1">{data.buy.label}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{data.buy.sublabel}</p></div>
              <div onClick={() => setSelectedGroup("services")} className={`p-6 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 border space-y-4 cursor-pointer transition-all ${selectedGroup === "services" ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800"}`}>
                {data.services.map((s) => (<div key={s.id} className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-bold">{getServiceIcon(s.icon)} {s.text}</div>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDITOR SIDEBAR */}
      <div className={`w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out z-20 absolute right-0 lg:relative ${selectedGroup ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"}`}>
        {selectedGroup ? (
          <>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div><span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Editing</span><h2 className="font-bold text-slate-900 dark:text-white capitalize">{selectedGroup.replace("_", " ")} Section</h2></div>
              <button onClick={() => setSelectedGroup(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedGroup === "product" && (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Badge</label><input value={data.product.badge} onChange={(e) => handleUpdate("product", "badge", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Product Title</label><textarea value={data.product.title} onChange={(e) => handleUpdate("product", "title", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold outline-none resize-none" rows={2} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Price</label><input value={data.product.price} onChange={(e) => handleUpdate("product", "price", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold text-red-500 outline-none" />ls</div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Old Price</label><input value={data.product.oldPrice} onChange={(e) => handleUpdate("product", "oldPrice", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none" /></div>
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Image Upload</label><div className="flex flex-col gap-2"><input type="file" ref={productImgRef} onChange={(e) => handleImageChange(e, "product")} className="hidden" id="prod-img" /><label htmlFor="prod-img" className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group"><Upload className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" /><span className="text-xs font-bold text-slate-500 group-hover:text-indigo-500">Choose New Image</span></label><input value={data.product.image} onChange={(e) => handleUpdate("product", "image", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-[10px] font-mono outline-none" placeholder="Or paste URL" /></div></div>
                </div>
              )}
              {selectedGroup === "review" && (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Rating</label><input value={data.review.rating} onChange={(e) => handleUpdate("review", "rating", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Text</label><textarea value={data.review.text} onChange={(e) => handleUpdate("review", "text", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none resize-none" rows={3} /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Author</label><input value={data.review.author} onChange={(e) => handleUpdate("review", "author", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none" /></div>
                </div>
              )}
              {selectedGroup === "timer" && (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ends In</label><input value={data.timer.endsIn} onChange={(e) => handleUpdate("timer", "endsIn", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-mono outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Badge</label><input value={data.timer.badge} onChange={(e) => handleUpdate("timer", "badge", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none" /></div>
                </div>
              )}
              {selectedGroup === "video" && (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Thumbnail</label><div className="flex flex-col gap-2"><input type="file" ref={videoImgRef} onChange={(e) => handleImageChange(e, "video")} className="hidden" id="vid-img" /><label htmlFor="vid-img" className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group"><Upload className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" /><span className="text-xs font-bold text-slate-500 group-hover:text-indigo-500">Choose Thumbnail</span></label></div></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Video Link</label><input value={data.video.videoUrl} onChange={(e) => handleUpdate("video", "videoUrl", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-mono outline-none" placeholder="YouTube/MP4 Link" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Label</label><input value={data.video.label} onChange={(e) => handleUpdate("video", "label", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none" /></div>
                </div>
              )}
              {selectedGroup === "specs" && (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Battery</label><input value={data.specs.battery} onChange={(e) => handleUpdate("specs", "battery", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Connectivity</label><input value={data.specs.connectivity} onChange={(e) => handleUpdate("specs", "connectivity", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold outline-none" /></div>
                </div>
              )}
              {selectedGroup === "buy" && (
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Button Label</label><input value={data.buy.label} onChange={(e) => handleUpdate("buy", "label", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold outline-none" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Sub Label</label><input value={data.buy.sublabel} onChange={(e) => handleUpdate("buy", "sublabel", e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none" /></div>
                </div>
              )}
              {selectedGroup === "services" && (
                <div className="space-y-4">
                  {data.services.map((s, idx) => (
                    <div key={s.id} className="space-y-1"><label className="text-[10px] font-bold text-slate-400">ITEM {idx + 1}</label><input value={s.text} onChange={(e) => handleServiceUpdate(s.id, e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none" /></div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-3">
              <button onClick={handleSave} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50">
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
              <button onClick={() => setSelectedGroup(null)} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold">Done</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <Layout className="w-8 h-8 mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-slate-700">Select a section to edit</h3>
          </div>
        )}
      </div>
    </div>
  );
}
