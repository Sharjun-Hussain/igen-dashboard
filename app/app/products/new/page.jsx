"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  Image as ImageIcon,
  DollarSign,
  Box,
  Tag,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  Shield,
  Palette,
  HardDrive,
  Award,
  Percent,
  TrendingUp,
  Star,
  Flame,
} from "lucide-react";

export default function CreateProductPage() {
  const containerRef = useRef(null);

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState(["New Arrival"]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    regularPrice: "", // Changed: Regular price
    salePrice: "", // Changed: Sale/Discounted price
    discountPercent: "", // NEW: Auto-calculated discount %
    costPerItem: "",
    sku: "",
    barcode: "",
    imei: "", // IMEI for phones
    quantity: "",
    status: "Active",
    category: "Smartphones",
    brand: "Samsung",
    condition: "Brand New",
    storage: "128GB",
    color: "Black",
    warrantyMonths: "12",
    // NEW: Product Badges
    isTrending: false,
    isFeatured: false,
    isTopSelling: false,
    // NEW: Offer Management
    hasOffer: false,
    offerName: "",
    offerValidUntil: "",
  });

  // NEW: Check if category is phone-related
  const isPhoneCategory = ["Smartphones", "Refurbished Phones"].includes(formData.category);

  // NEW: Auto-calculate discount percentage
  const calculateDiscount = (regular, sale) => {
    if (regular && sale && parseFloat(regular) > parseFloat(sale)) {
      const discount = ((parseFloat(regular) - parseFloat(sale)) / parseFloat(regular)) * 100;
      return discount.toFixed(0);
    }
    return "";
  };

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Header Slide In
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
      );

      // Form Cards Stagger
      tl.fromTo(
        ".animate-card",
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          clearProps: "all",
        },
        "-=0.5",
      );
    },
    { scope: containerRef },
  );

  // --- HANDLERS ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImages([...images, url]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Success animation could go here
    }, 1500);
  };

  // NEW: Condition badge colors
  const getConditionColor = (condition) => {
    const colors = {
      "Brand New": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Refurbished - Like New": "bg-blue-50 text-blue-700 border-blue-200",
      "Grade A": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Grade B": "bg-amber-50 text-amber-700 border-amber-200",
      "Grade C": "bg-slate-100 text-slate-600 border-slate-200",
    };
    return colors[condition] || colors["Brand New"];
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full font-sans text-slate-900"
    >
      {/* 1. TOP HEADER & ACTIONS */}
      <div className="sticky top-16 z-40 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 mb-8 pt-4">
        <div className="max-w-6xl mx-auto pb-4">
          <div className="flex items-center justify-between">
            <div className="animate-header flex items-center gap-4">
              <button className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Add Product
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-indigo-600">Store</span>
                  <span>/</span>
                  <span>Products</span>
                  <span>/</span>
                  <span>New</span>
                </div>
              </div>
            </div>

            <div className="animate-header flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (MAIN CONTENT) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* A. GENERAL INFO */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                General Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung Galaxy S24 Ultra"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Description
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                    <textarea
                      rows="6"
                      className="w-full bg-transparent p-4 text-sm outline-none resize-y"
                      placeholder="Describe your product..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* B. MEDIA / IMAGES */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Media</h2>
                <span className="text-xs text-slate-400 font-medium">
                  Accepts images, videos, or 3D models
                </span>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200"
                  >
                    <img
                      src={img}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeImage(idx)}
                        className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload Trigger */}
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold uppercase">Upload</span>
                </label>
              </div>
            </div>

            {/* C. PHONE SPECIFICATIONS - CONDITIONAL (Only for Phones) */}
            {isPhoneCategory && (
              <div className="animate-card bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-600" /> Phone Specifications
                </h2>
                <p className="text-xs text-slate-500 mb-4">Essential phone details (auto-hidden for accessories)</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* IMEI Number */}
                  <div>
                    <label className="flex text-xs font-bold text-slate-700 uppercase mb-2 items-center gap-1">
                      <Shield className="w-3 h-3 text-amber-500" />
                      IMEI Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789012345"
                      value={formData.imei}
                      onChange={(e) =>
                        setFormData({ ...formData, imei: e.target.value })
                      }
                      className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono"
                      maxLength="15"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">15-digit unique identifier</p>
                  </div>

                  {/* Warranty Period */}
                  <div>
                    <label className="flex text-xs font-bold text-slate-700 uppercase mb-2 items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-500" />
                      Warranty Period
                    </label>
                    <select
                      value={formData.warrantyMonths}
                      onChange={(e) =>
                        setFormData({ ...formData, warrantyMonths: e.target.value })
                      }
                      className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="0">No Warranty</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>

                  {/* Storage */}
                  <div>
                    <label className="flex text-xs font-bold text-slate-700 uppercase mb-2 items-center gap-1">
                      <HardDrive className="w-3 h-3 text-blue-500" />
                      Storage Size
                    </label>
                    <select
                      value={formData.storage}
                      onChange={(e) =>
                        setFormData({ ...formData, storage: e.target.value })
                      }
                      className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="flex text-xs font-bold text-slate-700 uppercase mb-2 items-center gap-1">
                      <Palette className="w-3 h-3 text-pink-500" />
                      Color
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Phantom Black"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* D. PRICING & OFFERS */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-slate-400" /> Pricing & Offers
                </h2>
                {/* Offer Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasOffer}
                    onChange={(e) =>
                      setFormData({ ...formData, hasOffer: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-600">Special Offer</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Regular Price */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1">
                    Regular Price (Rs.)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">Rs.</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.regularPrice}
                      onChange={(e) => {
                        const newRegular = e.target.value;
                        setFormData({ 
                          ...formData, 
                          regularPrice: newRegular,
                          discountPercent: calculateDiscount(newRegular, formData.salePrice)
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-4 py-3 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Sale/Discounted Price */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1">
                    Sale Price (Rs.)
                    {formData.discountPercent && (
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {formData.discountPercent}% OFF
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold">Rs.</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.salePrice}
                      onChange={(e) => {
                        const newSale = e.target.value;
                        setFormData({ 
                          ...formData, 
                          salePrice: newSale,
                          discountPercent: calculateDiscount(formData.regularPrice, newSale)
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Discounted price shown to customers
                  </p>
                </div>
              </div>

              {/* Offer Details (Conditional) */}
              {formData.hasOffer && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-amber-900">Offer Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 flex">
                        Offer Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Black Friday Sale"
                        value={formData.offerName}
                        onChange={(e) =>
                          setFormData({ ...formData, offerName: e.target.value })
                        }
                        className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase mb-1.5 flex">
                        Valid Until
                      </label>
                      <input
                        type="date"
                        value={formData.offerValidUntil}
                        onChange={(e) =>
                          setFormData({ ...formData, offerValidUntil: e.target.value })
                        }
                        className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Per Item */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-700 uppercase mb-2 flex">
                      Cost per Item
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold">Rs.</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={formData.costPerItem}
                        onChange={(e) =>
                          setFormData({ ...formData, costPerItem: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex-1 pt-6">
                    <p className="text-xs text-slate-500">
                      Customers won't see this
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* E. INVENTORY */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-slate-400" /> Inventory
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Barcode (ISBN, UPC)
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (SIDEBAR) --- */}
          <div className="space-y-8">
            {/* 1. CONDITION - NEW */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Product Condition
              </h3>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium cursor-pointer mb-3"
              >
                <option value="Brand New">Brand New</option>
                <option value="Refurbished - Like New">Refurbished - Like New</option>
                <option value="Grade A">Grade A (Excellent)</option>
                <option value="Grade B">Grade B (Good)</option>
                <option value="Grade C">Grade C (Fair)</option>
              </select>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${getConditionColor(formData.condition)}`}>
                <CheckCircle2 className="w-3 h-3" />
                {formData.condition}
              </div>
            </div>

            {/* 2. STATUS */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Status
              </h3>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium cursor-pointer"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                This product will be hidden from all sales channels.
              </p>
            </div>

            {/* 3. ORGANIZATION */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" /> Organization
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">
                    Brand
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 outline-none"
                  >
                    <option value="Samsung">Samsung</option>
                    <option value="Apple">Apple</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Google">Google</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Realme">Realme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 outline-none"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Refurbished Phones">Refurbished Phones</option>
                    <option value="Phone Accessories">Phone Accessories</option>
                    <option value="Cases & Covers">Cases & Covers</option>
                    <option value="Screen Protectors">Screen Protectors</option>
                    <option value="Chargers & Cables">Chargers & Cables</option>
                    </select>
                </div>
              </div>
            </div>

            {/* 4. PRODUCT BADGES - NEW */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Marketing Badges
              </h3>
              <p className="text-xs text-slate-500 mb-4">Highlight this product on your storefront</p>

              <div className="space-y-3">
                {/* Trending Product */}
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) =>
                      setFormData({ ...formData, isTrending: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Trending</p>
                      <p className="text-[10px] text-slate-400">Show in trending section</p>
                    </div>
                  </div>
                </label>

                {/* Featured Product */}
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Star className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Featured</p>
                      <p className="text-[10px] text-slate-400">Promote on homepage</p>
                    </div>
                  </div>
                </label>

                {/* Top Selling Product */}
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isTopSelling}
                    onChange={(e) =>
                      setFormData({ ...formData, isTopSelling: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Top Selling</p>
                      <p className="text-[10px] text-slate-400">Best sellers badge</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 5. TAGS */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" /> Tags
              </h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold group"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-indigo-400 hover:text-indigo-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Enter tag and hit enter..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-2">
                Used for filtering and search.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
