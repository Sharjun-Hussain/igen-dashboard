"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  Layers,
  Loader2,
  Smartphone,
  AlertCircle,
  Trash2,
  Plus,
  Box,
  ScanBarcode,
  Flame,
  Star,
  TrendingUp,
  Globe,
  Tag,
  Search,
  MoveLeft,
  MoveRight,
  Eye,
  FileText,
  Image as ImageIcon,
  Check,
} from "lucide-react";

// --- ZOD SCHEMA ---
const productSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  slug: z.string().min(3, "Slug is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(10, "Full description is required"),
  shortDescription: z
    .string()
    .max(160, "Short description too long")
    .optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  heroImage: z.string().min(1, "Hero image is required"),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1, "SKU is required"),
        price: z.string().min(1, "Price is required"),
        stock: z.string(),
      }),
    )
    .min(1, "Add at least one variant"),
});

export default function CreateProductPage() {
  const containerRef = useRef(null);

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general"); // general | variants | seo | specs

  // MAIN DATA STORE
  const [formData, setFormData] = useState({
    // Basic
    name: "",
    slug: "",
    brand: "Samsung",
    category: "Smartphones",
    type: "Physical", // Physical | Digital
    condition: "Brand New",
    status: "Draft", // Draft | Published | Archived

    // Descriptions
    shortDescription: "", // Excerpt
    description: "", // HTML/Rich Text

    // Badges & Offers
    isFeatured: false,
    isTrending: false,
    isOfferProduct: false,

    // Inventory & Warranty
    warrantyType: "Manufacturer",
    warrantyPeriod: "12 Months",

    // Lists
    tags: [], // Array of strings
    features: [], // Array of strings (bullets)
    specifications: [], // Array of { key, value }

    // SEO
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  // MEDIA STATE
  const [heroImage, setHeroImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  // VARIANTS STATE
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    sku: "",
    color: "Black",
    storage: "128GB",
    price: "",
    salePrice: "",
    stock: "10",
    isDefault: false,
    imageIndex: null, // Link to a gallery image
  });

  // INPUT BUFFERS (For Tags, Features, Specs)
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [specInput, setSpecInput] = useState({ key: "", value: "" });

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      gsap.fromTo(
        ".animate-fade-up",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, clearProps: "all" },
      );
    },
    { scope: containerRef, dependencies: [activeTab] },
  );

  // --- LOGIC HANDLERS ---

  // Slug Generator
  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  };

  // Image Handlers
  const handleHeroUpload = (e) => {
    const file = e.target.files[0];
    if (file) setHeroImage(URL.createObjectURL(file));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setGalleryImages((prev) => [...prev, ...newUrls]);
  };

  const moveGalleryImage = (index, direction) => {
    const newImages = [...galleryImages];
    if (direction === "left" && index > 0) {
      [newImages[index], newImages[index - 1]] = [
        newImages[index - 1],
        newImages[index],
      ];
    } else if (direction === "right" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
    }
    setGalleryImages(newImages);
  };

  // Tag Handler
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  // Variant Handler
  const addVariant = () => {
    if (!currentVariant.price || !currentVariant.sku)
      return alert("Price and SKU required");

    setVariants([...variants, { ...currentVariant, id: Date.now() }]);
    // Reset but keep some common fields
    setCurrentVariant((prev) => ({
      ...prev,
      sku: "",
      price: "",
      salePrice: "",
      isDefault: false,
    }));
  };

  // Save Function
  const handleSave = () => {
    setIsLoading(true);
    setErrors({});

    // Construct final payload
    const payload = {
      ...formData,
      heroImage,
      images: galleryImages,
      variants,
    };

    try {
      productSchema.parse(payload);
      setTimeout(() => {
        setIsLoading(false);
        alert("Product Published Successfully!");
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-900 pb-20 font-sans text-slate-900 dark:text-slate-100"
    >
      {/* 1. HEADER & ACTIONS */}
      <header className="sticky top-16 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-all rounded-xl mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Create Product
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span
                    className={`w-2 h-2 rounded-full ${formData.status === "Published" ? "bg-green-500" : "bg-amber-500"}`}
                  ></span>
                  {formData.status} Mode
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
             
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold">
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Publish Product
              </button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "general", label: "General Info", icon: FileText },
              { id: "media", label: "Media Gallery", icon: ImageIcon },
              { id: "variants", label: "Pricing & Variants", icon: Layers },
              { id: "specs", label: "Specs & Features", icon: Smartphone },
              { id: "seo", label: "SEO Metadata", icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                  ${activeTab === tab.id ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* ERROR BANNER */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 animate-fade-up">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">
              Please fix the validation errors highlighted below.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT CONTENT (8 cols) --- */}
          <div className="lg:col-span-8 space-y-8">
            {/* TABS */}


            {/* TAB CONTENT: GENERAL */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-up">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`w-full p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:border-indigo-500 transition-all dark:text-white ${errors.name ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700"}`}
                        placeholder="e.g. Sony WH-1000XM5 Headphones"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                          Slug (URL)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) =>
                              setFormData({ ...formData, slug: e.target.value })
                            }
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-600 dark:text-slate-300 text-sm"
                            placeholder="sony-headphones-xm5"
                          />
                          <button
                            onClick={generateSlug}
                            className="px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                          Product Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                        >
                          <option>Physical Product</option>
                          <option>Digital Asset</option>
                          <option>Service</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1">
                        Short Description (Excerpt)
                      </label>
                      <textarea
                        rows="2"
                        value={formData.shortDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shortDescription: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white"
                        placeholder="Brief summary for list views..."
                      ></textarea>
                      <p className="text-[10px] text-right text-slate-400">
                        {formData.shortDescription.length}/160
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1">
                        Full Description
                      </label>
                      <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[200px] p-4 relative group cursor-text">
                        <textarea
                          className="w-full h-full bg-transparent outline-none resize-none text-sm z-10 relative dark:text-white"
                          placeholder="Write your rich text description here..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          rows="8"
                        ></textarea>
                        {/* Placeholder for WYSIWYG Tooltip */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded text-xs dark:text-slate-300">
                            B
                          </div>
                          <div className="p-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded text-xs dark:text-slate-300">
                            I
                          </div>
                          <div className="p-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded text-xs dark:text-slate-300">
                            List
                          </div>
                        </div>
                      </div>
                      {errors.description && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MEDIA */}
            {activeTab === "media" && (
              <div className="space-y-6 animate-fade-up">
                {/* Hero Image */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> Hero Image
                    (Thumbnail)
                  </h3>
                  <div className="flex gap-6 items-start">
                    <div className="w-40 h-40 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center relative overflow-hidden group">
                      {heroImage ? (
                        <img
                          src={heroImage}
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            Click to Upload
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleHeroUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        This is the main image used on category pages and search
                        results.
                      </p>
                      <div className="text-xs text-slate-400 space-y-1">
                        <p>• Recommended Size: 1200x1200px</p>
                        <p>• Max File Size: 5MB</p>
                        <p>• Format: JPG, PNG, WEBP</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Gallery Images
                    </h3>
                    <label className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg cursor-pointer transition-colors">
                      + Add Images
                      <input
                        type="file"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>

                  {galleryImages.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        No extra images added yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => moveGalleryImage(idx, "left")}
                              className="p-1 bg-white dark:bg-slate-800 rounded hover:bg-indigo-50 dark:hover:bg-slate-700"
                            >
                              <MoveLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setGalleryImages(
                                  galleryImages.filter((_, i) => i !== idx),
                                )
                              }
                              className="p-1 bg-white dark:bg-slate-800 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveGalleryImage(idx, "right")}
                              className="p-1 bg-white dark:bg-slate-800 rounded hover:bg-indigo-50 dark:hover:bg-slate-700"
                            >
                              <MoveRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm font-bold">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SPECS & FEATURES */}
            {activeTab === "specs" && (
              <div className="space-y-6 animate-fade-up">
                {/* Bullet Points */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                    Key Features (Bullet Points)
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none dark:text-white"
                      placeholder="e.g. Active Noise Cancellation..."
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setFormData((p) => ({
                            ...p,
                            features: [...p.features, featureInput],
                          }));
                          setFeatureInput("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (featureInput) {
                          setFormData((p) => ({
                            ...p,
                            features: [...p.features, featureInput],
                          }));
                          setFeatureInput("");
                        }
                      }}
                      className="bg-indigo-600 text-white px-4 rounded-xl"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {formData.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                          {feat}
                        </span>
                        <button
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              features: p.features.filter((_, i) => i !== idx),
                            }))
                          }
                          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specs Table */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                    Technical Specifications
                  </h3>
                  <div className="flex gap-2 mb-4 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Label
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none dark:text-white"
                        placeholder="e.g. Battery Life"
                        value={specInput.key}
                        onChange={(e) =>
                          setSpecInput({ ...specInput, key: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Value
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none dark:text-white"
                        placeholder="e.g. 30 Hours"
                        value={specInput.value}
                        onChange={(e) =>
                          setSpecInput({ ...specInput, value: e.target.value })
                        }
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (specInput.key && specInput.value) {
                          setFormData((p) => ({
                            ...p,
                            specifications: [...p.specifications, specInput],
                          }));
                          setSpecInput({ key: "", value: "" });
                        }
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl h-[38px]"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-4 py-3">Specification</th>
                          <th className="px-4 py-3">Value</th>
                          <th className="px-4 py-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {formData.specifications.map((spec, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                              {spec.key}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                              {spec.value}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    specifications: p.specifications.filter(
                                      (_, i) => i !== idx,
                                    ),
                                  }))
                                }
                                className="text-slate-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: VARIANTS */}
            {activeTab === "variants" && (
              <div className="space-y-6 animate-fade-up">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                    Manage Variants
                  </h3>

                  {/* Variant Adder */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          SKU (Unique ID)
                        </label>
                        <input
                          type="text"
                          value={currentVariant.sku}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              sku: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="S24-BLK-128"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Storage / Size
                        </label>
                        <input
                          type="text"
                          value={currentVariant.storage}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              storage: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Color
                        </label>
                        <input
                          type="text"
                          value={currentVariant.color}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              color: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Linked Image
                        </label>
                        <select
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              imageIndex: e.target.value,
                            })
                          }
                        >
                          <option value="">No specific image</option>
                          {galleryImages.map((_, idx) => (
                            <option key={idx} value={idx}>
                              Image #{idx + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Price
                        </label>
                        <input
                          type="number"
                          value={currentVariant.price}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              price: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 block">
                          Sale Price
                        </label>
                        <input
                          type="number"
                          value={currentVariant.salePrice}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              salePrice: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-green-200 dark:border-green-800 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="Optional"
                        />
                      </div>
                      <div className="flex items-center gap-2 pb-2">
                        <input
                          type="checkbox"
                          id="defVar"
                          checked={currentVariant.isDefault}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              isDefault: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-indigo-600"
                        />
                        <label
                          htmlFor="defVar"
                          className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Default Variant
                        </label>
                      </div>
                      <button
                        onClick={addVariant}
                        className="bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700"
                      >
                        Add Variant
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-4 py-3">Image</th>
                          <th className="px-4 py-3">SKU</th>
                          <th className="px-4 py-3">Variant</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {variants.map((v) => (
                          <tr key={v.id}>
                            <td className="px-4 py-3">
                              {v.imageIndex !== null &&
                              galleryImages[v.imageIndex] ? (
                                <img
                                  src={galleryImages[v.imageIndex]}
                                  className="w-8 h-8 rounded border object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded border dark:border-slate-600"></div>
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs dark:text-slate-300">
                              {v.sku}{" "}
                              {v.isDefault && (
                                <span className="ml-2 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] rounded font-bold">
                                  DEFAULT
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 dark:text-slate-300">
                              {v.storage} - {v.color}
                            </td>
                            <td className="px-4 py-3 dark:text-slate-300">
                              {v.salePrice ? (
                                <span>
                                  <span className="line-through text-slate-400 text-xs mr-2">
                                    {v.price}
                                  </span>
                                  <span className="text-green-600 dark:text-green-400 font-bold">
                                    {v.salePrice}
                                  </span>
                                </span>
                              ) : (
                                v.price
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() =>
                                  setVariants(
                                    variants.filter((i) => i.id !== v.id),
                                  )
                                }
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SEO */}
            {activeTab === "seo" && (
              <div className="space-y-6 animate-fade-up">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                    Search Engine Optimization
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white"
                          value={formData.metaTitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metaTitle: e.target.value,
                            })
                          }
                          placeholder={formData.name}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                          Meta Description
                        </label>
                        <textarea
                          rows="4"
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white"
                          value={formData.metaDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metaDescription: e.target.value,
                            })
                          }
                          placeholder="Brief description for search results..."
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                          Keywords
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white"
                          value={formData.metaKeywords}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metaKeywords: e.target.value,
                            })
                          }
                          placeholder="electronics, sony, headphones, audio"
                        />
                      </div>
                    </div>

                    {/* Preview Card */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                        <Search className="w-3 h-3" /> Google Snippet Preview
                      </h4>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-800 dark:text-slate-200">
                              yourstore.com
                            </span>
                            <span className="text-[10px] text-slate-400">
                              https://yourstore.com/product/
                              {formData.slug || "product-slug"}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-1 truncate">
                          {formData.metaTitle ||
                            formData.name ||
                            "Product Title"}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {formData.metaDescription ||
                            formData.description ||
                            "This is how your product description will look in search engine results."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT SIDEBAR (4 cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. STATUS */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">
                Organization
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Brand
                  </label>
                  <select
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  >
                    <option>Samsung</option>
                    <option>Apple</option>
                    <option>Sony</option>
                    <option>Xiaomi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Category
                  </label>
                  <select
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Smartphones</option>
                    <option>Audio</option>
                    <option>Wearables</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. TAGS */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-md flex items-center gap-1"
                  >
                    {tag}{" "}
                    <button
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          tags: p.tags.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type & hit Enter..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>

            {/* 3. OFFERS & BADGES */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">
                Marketing
              </h3>
              <div className="space-y-3">
                {[
                  {
                    id: "isTrending",
                    label: "Trending",
                    icon: Flame,
                    color: "text-amber-500",
                  },
                  {
                    id: "isFeatured",
                    label: "Featured",
                    icon: Star,
                    color: "text-indigo-500",
                  },
                  {
                    id: "isOfferProduct",
                    label: "Offer / Deal",
                    icon: TrendingUp,
                    color: "text-green-500",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData[item.id]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [item.id]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <div className="flex-1 font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <item.icon className={`w-4 h-4 ${item.color}`} />{" "}
                      {item.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. COUPONS / OFFERS (Mockup) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm opacity-70">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">
                Coupons
              </h3>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
                No active coupons available.
                <br />
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold cursor-pointer hover:underline">
                  Create Coupon
                </span>
              </div>
            </div>

            {/* 5. RELATIONS (Mockup) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">
                Compatible Items
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search accessories..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
