"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { z } from "zod"; // Import Zod
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  Layers,
  CheckCircle2,
  Loader2,
  Smartphone,
  Shield,
  AlertCircle,
  Trash2,
  Plus,
  Box,
  ScanBarcode,
  Flame,
  Star,
  TrendingUp,
  Cpu,
  Battery,
  Camera,
  Maximize,
} from "lucide-react";

// --- ZOD SCHEMA ---
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  variants: z
    .array(
      z.object({
        storage: z.string(),
        color: z.string(),
        regularPrice: z.string().min(1, "Price is required"),
        stock: z.string().min(1, "Stock is required"),
      }),
    )
    .min(1, "Please add at least one variant (e.g. 128GB Black)"),
});

export default function CreateProductPage() {
  const containerRef = useRef(null);

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Validation Errors

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "Samsung",
    category: "Smartphones",
    condition: "Brand New",
    status: "Active",
    // Phone Specifics
    modelNumber: "",
    imei: "",
    processor: "",
    screenSize: "",
    battery: "",
    mainCamera: "",
    // Inventory
    barcode: "",
    // Warranty
    warrantyMonths: "12",
    isCustomWarranty: false,
    customWarranty: "",
    // Badges
    isTrending: false,
    isFeatured: false,
    isTopSelling: false,
  });

  const [images, setImages] = useState([]);

  // VARIANTS STATE
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    storage: "128GB",
    color: "Black",
    regularPrice: "",
    salePrice: "",
    stock: "10",
    sku: "",
  });

  const isPhoneCategory = ["Smartphones", "Refurbished Phones"].includes(
    formData.category,
  );

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
      );
      tl.fromTo(
        ".animate-card",
        { y: 30, opacity: 0, scale: 0.99 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          clearProps: "all",
        },
        "-=0.5",
      );
    },
    { scope: containerRef },
  );

  // --- HANDLERS ---

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => [...prev, URL.createObjectURL(file)]);
      // Clear image error if exists
      if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  // Add Variant
  const handleAddVariant = () => {
    // Simple validation for the adder inputs
    if (!currentVariant.regularPrice || !currentVariant.stock) {
      alert("Please enter a Price and Stock quantity.");
      return;
    }
    const newVariant = { ...currentVariant, id: Date.now() };
    setVariants([...variants, newVariant]);
    // Clear variant error if exists
    if (errors.variants) setErrors((prev) => ({ ...prev, variants: null }));

    // Reset inputs but keep storage/color for workflow speed
    setCurrentVariant({
      ...currentVariant,
      regularPrice: "",
      salePrice: "",
      stock: "10",
      sku: "",
    });
  };

  // Remove Variant
  const removeVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  // SAVE & VALIDATE
  const handleSave = () => {
    setIsLoading(true);
    setErrors({}); // Reset errors

    // Prepare data for Zod
    const payload = {
      ...formData,
      images,
      variants,
    };

    try {
      productSchema.parse(payload);

      // If valid:
      setTimeout(() => {
        setIsLoading(false);
        alert("Product Saved Successfully!");
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((validationError) => {
          const field = validationError.path[0];
          fieldErrors[field] = validationError.message;
        });
        setErrors(fieldErrors);

        // Scroll to top to see errors
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Helper for Error Styles
  const getInputClass = (field) => `
    w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all
    ${
      errors[field]
        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
        : "border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
    }
  `;

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full font-sans text-slate-900 pb-20 bg-slate-50/50"
    >
      {/* 1. TOP HEADER */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 mb-8 pt-4">
        <div className="max-w-6xl mx-auto pb-4 px-6">
          <div className="flex items-center justify-between">
            <div className="animate-header flex items-center gap-4">
              <button className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Add Product
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-indigo-600">Store</span>
                  <span>/</span>
                  <span>Inventory</span>
                  <span>/</span>
                  <span>New</span>
                </div>
              </div>
            </div>

            <div className="animate-header flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg">
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Validating...
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

      <div className="max-w-6xl mx-auto px-6">
        {/* Error Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="animate-header mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-bold text-sm">
                Please correct the errors below
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* A. GENERAL INFO */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                General Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung Galaxy S24 Ultra"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={getInputClass("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 font-bold">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="5"
                    className={getInputClass("description")}
                    placeholder="Describe your product specs and features..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1 font-bold">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* B. MEDIA */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Product Images <span className="text-red-500">*</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  PNG, JPG, WEBP (Max 5MB)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={img}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1 right-1 p-1 bg-white text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label
                  className={`aspect-square rounded-xl border-2 border-dashed ${errors.images ? "border-red-300 bg-red-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400"} transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500`}
                >
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
              {errors.images && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.images}
                </p>
              )}
            </div>

            {/* C. PHONE SPECIFICATIONS (RESTORED) */}
            {isPhoneCategory && (
              <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                  <Smartphone className="w-5 h-5 text-indigo-600" /> Technical
                  Specifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                  {/* Model Number */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                      <Box className="w-3 h-3" /> Model Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SM-S928B"
                      value={formData.modelNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          modelNumber: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  {/* IMEI (Optional placeholder) */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                      <ScanBarcode className="w-3 h-3" /> Master IMEI / Serial
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={formData.imei}
                      onChange={(e) =>
                        setFormData({ ...formData, imei: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  {/* Processor */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> Processor (Chipset)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Snapdragon 8 Gen 3"
                      value={formData.processor}
                      onChange={(e) =>
                        setFormData({ ...formData, processor: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  {/* Screen */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                      <Maximize className="w-3 h-3" /> Display Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6.8 inch AMOLED"
                      value={formData.screenSize}
                      onChange={(e) =>
                        setFormData({ ...formData, screenSize: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  {/* Battery */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                      <Battery className="w-3 h-3" /> Battery Capacity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5000 mAh"
                      value={formData.battery}
                      onChange={(e) =>
                        setFormData({ ...formData, battery: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  {/* Camera */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Main Camera
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 200 MP"
                      value={formData.mainCamera}
                      onChange={(e) =>
                        setFormData({ ...formData, mainCamera: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* D. VARIANTS & PRICING */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" /> Variants &
                    Pricing <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Add at least one variant (e.g. Base Model).
                  </p>
                </div>
              </div>

              {/* Variant Adder */}
              <div
                className={`bg-slate-50 rounded-xl p-5 border mb-6 ${errors.variants ? "border-red-200 bg-red-50/50" : "border-slate-200"}`}
              >
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                      Storage
                    </label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      value={currentVariant.storage}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          storage: e.target.value,
                        })
                      }
                    >
                      <option>64GB</option>
                      <option>128GB</option>
                      <option>256GB</option>
                      <option>512GB</option>
                      <option>1TB</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                      Color
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Black"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      value={currentVariant.color}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          color: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-slate-900 mb-1.5 block">
                      Regular Price
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      value={currentVariant.regularPrice}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          regularPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-green-600 mb-1.5 block">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      placeholder="Optional"
                      className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                      value={currentVariant.salePrice}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          salePrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                      Stock
                    </label>
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      value={currentVariant.stock}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <button
                      onClick={handleAddVariant}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Variants Table */}
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Variant</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {variants.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-6 text-slate-400 italic"
                        >
                          No variants added yet.
                        </td>
                      </tr>
                    ) : (
                      variants.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">
                              {v.storage} - {v.color}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {v.salePrice ? (
                              <div className="flex flex-col">
                                <span className="font-bold text-green-600">
                                  Rs. {v.salePrice}
                                </span>
                                <span className="text-[10px] line-through text-slate-400">
                                  Rs. {v.regularPrice}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-slate-700">
                                Rs. {v.regularPrice}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">
                              {v.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => removeVariant(v.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {errors.variants && (
                <p className="text-xs text-red-500 font-bold mt-2 text-center">
                  {errors.variants}
                </p>
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="space-y-8">
            {/* 1. STATUS & ORGANIZATION */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Organization
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                  >
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                    Brand
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                  >
                    <option>Samsung</option>
                    <option>Apple</option>
                    <option>Xiaomi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                  >
                    <option>Smartphones</option>
                    <option>Accessories</option>
                    <option>Tablets</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. MARKETING BADGES */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Marketing
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-amber-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) =>
                      setFormData({ ...formData, isTrending: e.target.checked })
                    }
                    className="accent-amber-600 w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Flame className="w-3 h-3 text-amber-500" /> Trending
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-indigo-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="accent-indigo-600 w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Star className="w-3 h-3 text-indigo-500" /> Featured
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-green-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTopSelling}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isTopSelling: e.target.checked,
                      })
                    }
                    className="accent-green-600 w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-green-500" /> Top
                      Selling
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. CONDITION & WARRANTY */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                  >
                    <option>Brand New</option>
                    <option>Refurbished</option>
                    <option>Grade A</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-500">
                      Warranty
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-[10px] font-bold text-indigo-600">
                      <input
                        type="checkbox"
                        checked={formData.isCustomWarranty}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isCustomWarranty: e.target.checked,
                          })
                        }
                      />{" "}
                      Custom
                    </label>
                  </div>
                  {formData.isCustomWarranty ? (
                    <input
                      type="text"
                      placeholder="e.g. 1 Year Hardware"
                      value={formData.customWarranty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customWarranty: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                    />
                  ) : (
                    <select
                      value={formData.warrantyMonths}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          warrantyMonths: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none"
                    >
                      <option value="0">No Warranty</option>
                      <option value="12">1 Year</option>
                      <option value="24">2 Years</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* 4. INVENTORY */}
            <div className="animate-card bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Box className="w-4 h-4 text-slate-400" /> Inventory Logic
              </h3>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <ScanBarcode className="w-3 h-3" /> Master Barcode
                </label>
                <input
                  type="text"
                  placeholder="UPC / EAN"
                  value={formData.barcode}
                  onChange={(e) =>
                    setFormData({ ...formData, barcode: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Used if variants don't have unique codes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
