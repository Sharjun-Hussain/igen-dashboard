"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  ShoppingCart,
} from "lucide-react";

const ProductRelationshipSelector = ({
  title,
  description,
  selectedIds,
  onUpdate,
  searchTerm,
  onSearchChange,
  results,
}) => {
  const toggleProduct = (id) => {
    if (selectedIds.includes(id)) {
      onUpdate(selectedIds.filter((item) => item !== id));
    } else {
      onUpdate([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by name or code..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-all dark:text-white text-sm"
          />
        </div>

        {/* Search Results */}
        {searchTerm.length > 2 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Search Results
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {results.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No products found.
                </p>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {product.primary_image_path ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "")}/${product.primary_image_path}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {product.code}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedIds.includes(product.id)
                          ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                      }`}
                    >
                      {selectedIds.includes(product.id) ? "Remove" : "Add"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Selected Products */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Selected Products ({selectedIds.length})
          </p>
          {selectedIds.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <Box className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">No products selected yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {results
                .filter((p) => selectedIds.includes(p.id))
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {product.primary_image_path ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "")}/${product.primary_image_path}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {product.code}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomCheckbox = ({ id, checked, onCheckedChange }) => {
  return (
    <div
      onClick={() => onCheckedChange(!checked)}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
        checked
          ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20"
          : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-indigo-400"
      }`}
    >
      {checked && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={() => {}}
        className="sr-only"
      />
    </div>
  );
};

export default function CreateProductPage() {
  const containerRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  // MAIN DATA STORE
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category_id: "",
    brand_id: "",
    type: "physical",
    status: "draft",
    short_description: "",
    full_description: "",
    is_featured: false,
    is_trending: false,
    is_active: true,
    bundled_product_ids: [],
    compatible_product_ids: [],
  });

  // MEDIA STATE
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);

  // VARIANTS STATE
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    variant_name: "Brand New",
    sku: "",
    barcode: "",
    storage_size: "",
    ram_size: "",
    color: "",
    price: "",
    sales_price: "",
    stock_quantity: "",
    low_stock_threshold: "5",
    is_offer: false,
    offer_price: "",
    is_trending: false,
    is_active: true,
    is_featured: false,
  });

  // INPUT BUFFERS
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [specInput, setSpecInput] = useState({
    specification_name: "",
    specification_value: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  // Tag/Feature autocomplete
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showFeatureSuggestions, setShowFeatureSuggestions] = useState(false);

  // Product Relationship Search State
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);

  // Debounce product search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [productSearchTerm]);

  // Fetch products for relationship search
  const { data: searchResponse } = useSWR(
    session?.accessToken && debouncedProductSearch.length > 2
      ? [
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products?search=${debouncedProductSearch}`,
          session.accessToken,
        ]
      : null,
    ([url]) => fetcher(url)
  );

  React.useEffect(() => {
    if (searchResponse?.data?.data) {
      setProductSearchResults(searchResponse.data.data);
    }
  }, [searchResponse]);

  // --- API FETCHING ---
  const fetcher = async (url) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };

  const { data: categoriesData } = useSWR(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/categories`,
          session.accessToken,
        ]
      : null,
    ([url]) => fetcher(url),
  );

  const { data: brandsData } = useSWR(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/brands`,
          session.accessToken,
        ]
      : null,
    ([url]) => fetcher(url),
  );

  const { data: tagsData } = useSWR(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/get/tags`,
          session.accessToken,
        ]
      : null,
    ([url]) => fetcher(url),
  );

  const { data: featuresData } = useSWR(
    session?.accessToken
      ? [
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/get/features`,
          session.accessToken,
        ]
      : null,
    ([url]) => fetcher(url),
  );

  const categories = categoriesData?.data?.data || [];
  const brands = brandsData?.data?.data || [];
  const availableTags = tagsData?.data || [];
  const availableFeatures = featuresData?.data || [];

  // Filter suggestions based on input
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.find((t) => t.id === tag.id),
  );

  const filteredFeatures = availableFeatures.filter(
    (feature) =>
      feature.name.toLowerCase().includes(featureInput.toLowerCase()) &&
      !selectedFeatures.find((f) => f.id === feature.id),
  );

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

  // Code Generator
  const generateCode = () => {
    const code = formData.name
      .toUpperCase()
      .replace(/[^A-Z0-9 -]/g, "")
      .replace(/\\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 20);
    setFormData((prev) => ({ ...prev, code }));
  };

  // Image Handlers
  const handleHeroUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setGalleryImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const moveGalleryImage = (index, direction) => {
    const newFiles = [...galleryImageFiles];
    const newPreviews = [...galleryImagePreviews];

    if (direction === "left" && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [
        newFiles[index - 1],
        newFiles[index],
      ];
      [newPreviews[index], newPreviews[index - 1]] = [
        newPreviews[index - 1],
        newPreviews[index],
      ];
    } else if (direction === "right" && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [
        newFiles[index + 1],
        newFiles[index],
      ];
      [newPreviews[index], newPreviews[index + 1]] = [
        newPreviews[index + 1],
        newPreviews[index],
      ];
    }

    setGalleryImageFiles(newFiles);
    setGalleryImagePreviews(newPreviews);
  };

  // Tag Handler with autocomplete
  const handleAddTag = (tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const handleTagInputChange = (value) => {
    setTagInput(value);
    setShowTagSuggestions(value.length > 0);
  };

  // Feature Handler with autocomplete
  const handleAddFeature = (feature) => {
    if (!selectedFeatures.find((f) => f.id === feature.id)) {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
    setFeatureInput("");
    setShowFeatureSuggestions(false);
  };

  const handleFeatureInputChange = (value) => {
    setFeatureInput(value);
    setShowFeatureSuggestions(value.length > 0);
  };

  // Specification Handler
  const handleAddSpec = () => {
    if (specInput.specification_name && specInput.specification_value) {
      setSpecifications([...specifications, specInput]);
      setSpecInput({ specification_name: "", specification_value: "" });
    }
  };

  // Variant Handler
  const addVariant = () => {
    if (
      !currentVariant.variant_name ||
      !currentVariant.sku ||
      !currentVariant.price
    ) {
      toast.error("Variant name, SKU, and price are required");
      return;
    }

    const variantToAdd = { ...currentVariant };
    if (variantToAdd.ram_size && !variantToAdd.ram_size.toUpperCase().endsWith("GB")) {
      variantToAdd.ram_size = `${variantToAdd.ram_size}GB`;
    }

    setVariants([...variants, { ...variantToAdd, id: Date.now() }]);
    setCurrentVariant({
      variant_name: "Brand New",
      sku: "",
      barcode: "",
      storage_size: "",
      ram_size: "",
      color: "",
      price: "",
      sales_price: "",
      stock_quantity: "",
      low_stock_threshold: "5",
      is_offer: false,
      offer_price: "",
      is_trending: false,
      is_active: true,
      is_featured: false,
    });
  };

  // Build FormData for API
  const buildFormData = () => {
    const data = new FormData();

    // Basic fields
    data.append("name", formData.name);
    data.append("code", formData.code);
    data.append("category_id", formData.category_id);
    data.append("brand_id", formData.brand_id);
    data.append("type", formData.type);
    data.append("status", formData.status);
    data.append("short_description", formData.short_description);
    data.append("full_description", formData.full_description);
    data.append("is_trending", formData.is_trending ? "1" : "0");
    data.append("is_active", formData.is_active ? "1" : "0");
    data.append("is_featured", formData.is_featured ? "1" : "0");

    // Images
    if (heroImageFile) {
      data.append("primary_image_path", heroImageFile);
    }
    galleryImageFiles.forEach((file) => {
      data.append("images[]", file);
    });

    // Features (comma-separated names)
    if (selectedFeatures.length > 0) {
      data.append(
        "feature_name",
        selectedFeatures.map((f) => f.name).join(","),
      );
    }

    // Tags (comma-separated)
    if (selectedTags.length > 0) {
      data.append("tags", selectedTags.map((t) => t.name).join(","));
    }

    // Specifications
    specifications.forEach((spec, index) => {
      data.append(
        `specifications[${index}][specification_name]`,
        spec.specification_name,
      );
      data.append(
        `specifications[${index}][specification_value]`,
        spec.specification_value,
      );
    });

    // Variants
    variants.forEach((variant, index) => {
      data.append(`variants[${index}][variant_name]`, variant.variant_name);
      data.append(`variants[${index}][sku]`, variant.sku);
      data.append(`variants[${index}][barcode]`, variant.barcode || "");
      data.append(
        `variants[${index}][storage_size]`,
        variant.storage_size || "",
      );
      data.append(`variants[${index}][ram_size]`, variant.ram_size || "");
      data.append(`variants[${index}][color]`, variant.color || "");
      data.append(`variants[${index}][price]`, variant.price);
      data.append(
        `variants[${index}][sales_price]`,
        variant.sales_price || variant.price,
      );
      data.append(
        `variants[${index}][stock_quantity]`,
        variant.stock_quantity || "0",
      );
      data.append(
        `variants[${index}][low_stock_threshold]`,
        variant.low_stock_threshold || "5",
      );
      data.append(`variants[${index}][is_offer]`, variant.is_offer ? "1" : "0");
      data.append(`variants[${index}][offer_price]`, variant.offer_price || "");
      data.append(
        `variants[${index}][is_trending]`,
        variant.is_trending ? "1" : "0",
      );
      data.append(
        `variants[${index}][is_active]`,
        variant.is_active ? "1" : "0",
      );
      data.append(
        `variants[${index}][is_featured]`,
        variant.is_featured ? "1" : "0",
      );
    });

    // Product Relationships
    formData.bundled_product_ids.forEach((id) => {
      data.append("bundled_product_ids[]", id);
    });
    formData.compatible_product_ids.forEach((id) => {
      data.append("compatible_product_ids[]", id);
    });

    return data;
  };

  // Save Function
  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});

    // Basic validation
    if (
      !formData.name ||
      !formData.code ||
      !formData.category_id ||
      !formData.brand_id
    ) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (!heroImageFile) {
      toast.error("Please upload a primary image");
      setIsLoading(false);
      return;
    }

    if (variants.length === 0) {
      toast.error("Please add at least one variant");
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Creating product...");

    try {
      const formDataPayload = buildFormData();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            Accept: "application/json",
          },
          body: formDataPayload,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      toast.success("Product created successfully!", { id: loadingToast });
      router.push("/app/products");
    } catch (error) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsLoading(false);
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
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Create Product
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span
                    className={`w-2 h-2 rounded-full ${formData.status === "published" ? "bg-green-500" : "bg-amber-500"}`}
                  ></span>
                  {formData.status} Mode
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormData({ ...formData, status: "draft" })}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold"
              >
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
              { id: "buy_together", label: "Buy Together", icon: ShoppingCart },
              { id: "related", label: "Related Items", icon: Box },
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
            {/* TAB CONTENT: GENERAL */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-up">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-all dark:text-white"
                        placeholder="e.g. Apple iPhone 15 Pro"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">
                          Product Code *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.code}
                            onChange={(e) =>
                              setFormData({ ...formData, code: e.target.value })
                            }
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-600 dark:text-slate-300 text-sm"
                            placeholder="APL-IP15P-TIT"
                          />
                          <button
                            onClick={generateCode}
                            className="px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold"
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">
                          Product Type *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                        >
                          <option value="physical">Physical Product</option>
                          <option value="digital">Digital Asset</option>
                          <option value="service">Service</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">
                          Category *
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category_id: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">
                          Brand *
                        </label>
                        <select
                          value={formData.brand_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              brand_id: e.target.value,
                            })
                          }
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                        >
                          <option value="">Select Brand</option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Short Description (Excerpt)
                      </label>
                      <textarea
                        rows="2"
                        value={formData.short_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            short_description: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white"
                        placeholder="Brief summary for list views..."
                        maxLength="160"
                      ></textarea>
                      <p className="text-[10px] text-right text-slate-400">
                        {formData.short_description.length}/160
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                        Full Description
                      </label>
                      <textarea
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none text-sm dark:text-white"
                        placeholder="Write your full product description here..."
                        value={formData.full_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_description: e.target.value,
                          })
                        }
                        rows="8"
                      ></textarea>
                    </div>

                    {/* Badges */}
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                        Product Badges
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <CustomCheckbox
                            id="is_featured"
                            checked={formData.is_featured}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                is_featured: !!checked,
                              })
                            }
                          />
                          <span className="text-sm">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <CustomCheckbox
                            id="is_trending"
                            checked={formData.is_trending}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                is_trending: !!checked,
                              })
                            }
                          />
                          <span className="text-sm">Trending</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <CustomCheckbox
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                is_active: !!checked,
                              })
                            }
                          />
                          <span className="text-sm">Active</span>
                        </label>
                      </div>
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
                    <Star className="w-4 h-4 text-amber-500" /> Primary Image *
                  </h3>
                  <div className="flex gap-6 items-start">
                    <div className="w-40 h-40 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center relative overflow-hidden group">
                      {heroImagePreview ? (
                        <img
                          src={heroImagePreview}
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

                  {galleryImagePreviews.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        No extra images added yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {galleryImagePreviews.map((img, idx) => (
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
                              onClick={() => {
                                setGalleryImageFiles(
                                  galleryImageFiles.filter((_, i) => i !== idx),
                                );
                                setGalleryImagePreviews(
                                  galleryImagePreviews.filter(
                                    (_, i) => i !== idx,
                                  ),
                                );
                              }}
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
                {/* Features with Autocomplete */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                    Key Features
                  </h3>
                  <div className="relative mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none dark:text-white"
                        placeholder="Type to search features..."
                        value={featureInput}
                        onChange={(e) =>
                          handleFeatureInputChange(e.target.value)
                        }
                        onFocus={() =>
                          setShowFeatureSuggestions(featureInput.length > 0)
                        }
                      />
                      <button
                        onClick={() => {
                          if (featureInput && filteredFeatures.length > 0) {
                            handleAddFeature(filteredFeatures[0]);
                          }
                        }}
                        className="bg-indigo-600 text-white px-4 rounded-xl"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Autocomplete Suggestions */}
                    {showFeatureSuggestions && filteredFeatures.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                        {filteredFeatures.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => handleAddFeature(feature)}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm transition-colors"
                          >
                            {feature.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((feat) => (
                      <span
                        key={feat.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-medium"
                      >
                        {feat.name}
                        <button
                          onClick={() =>
                            setSelectedFeatures(
                              selectedFeatures.filter((f) => f.id !== feat.id),
                            )
                          }
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags with Autocomplete */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                    Product Tags
                  </h3>
                  <div className="relative mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none dark:text-white"
                        placeholder="Type to search tags..."
                        value={tagInput}
                        onChange={(e) => handleTagInputChange(e.target.value)}
                        onFocus={() =>
                          setShowTagSuggestions(tagInput.length > 0)
                        }
                      />
                      <button
                        onClick={() => {
                          if (tagInput && filteredTags.length > 0) {
                            handleAddTag(filteredTags[0]);
                          }
                        }}
                        className="bg-indigo-600 text-white px-4 rounded-xl"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Autocomplete Suggestions */}
                    {showTagSuggestions && filteredTags.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                        {filteredTags.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => handleAddTag(tag)}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm transition-colors"
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
                      >
                        <Tag className="w-3 h-3" />
                        {tag.name}
                        <button
                          onClick={() =>
                            setSelectedTags(
                              selectedTags.filter((t) => t.id !== tag.id),
                            )
                          }
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
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
                        placeholder="e.g. Display"
                        value={specInput.specification_name}
                        onChange={(e) =>
                          setSpecInput({
                            ...specInput,
                            specification_name: e.target.value,
                          })
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
                        placeholder="e.g. 6.1-inch OLED"
                        value={specInput.specification_value}
                        onChange={(e) =>
                          setSpecInput({
                            ...specInput,
                            specification_value: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      onClick={handleAddSpec}
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
                        {specifications.map((spec, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                              {spec.specification_name}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                              {spec.specification_value}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() =>
                                  setSpecifications(
                                    specifications.filter((_, i) => i !== idx),
                                  )
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
            {activeTab === "buy_together" && (
              <div className="space-y-6 animate-fade-up">
                <ProductRelationshipSelector
                  title="Buy Together Products"
                  description="Select products that are frequently bought together with this one (e.g. accessories)."
                  selectedIds={formData.bundled_product_ids}
                  onUpdate={(ids) =>
                    setFormData({ ...formData, bundled_product_ids: ids })
                  }
                  searchTerm={productSearchTerm}
                  onSearchChange={setProductSearchTerm}
                  results={productSearchResults}
                />
              </div>
            )}

            {/* TAB CONTENT: RELATED ITEMS */}
            {activeTab === "related" && (
              <div className="space-y-6 animate-fade-up">
                <ProductRelationshipSelector
                  title="Related Products"
                  description="Select products that are similar or compatible with this one."
                  selectedIds={formData.compatible_product_ids}
                  onUpdate={(ids) =>
                    setFormData({ ...formData, compatible_product_ids: ids })
                  }
                  searchTerm={productSearchTerm}
                  onSearchChange={setProductSearchTerm}
                  results={productSearchResults}
                />
              </div>
            )}

            {/* TAB CONTENT: VARIANTS */}
            {activeTab === "variants" && (
              <div className="space-y-6 animate-fade-up">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                    Manage Variants *
                  </h3>

                  {/* Variant Adder */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Condition
                        </label>
                        <select
                          value={currentVariant.variant_name}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              variant_name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="Brand New">Brand New</option>
                          <option value="Used">Used</option>
                          <option value="Refurbished">Refurbished</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          SKU *
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
                          placeholder="IP15P-256-NT"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Barcode
                        </label>
                        <input
                          type="text"
                          value={currentVariant.barcode}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              barcode: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="195949000123"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Storage
                        </label>
                        <input
                          type="text"
                          value={currentVariant.storage_size}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              storage_size: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="256GB"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          RAM
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={currentVariant.ram_size}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || Number(val) >= 0) {
                                setCurrentVariant({
                                  ...currentVariant,
                                  ram_size: val,
                                });
                              }
                            }}
                            className="w-full px-3 py-2 pr-10 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                            GB
                          </span>
                        </div>
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
                          placeholder="Natural Titanium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Price *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={currentVariant.price}
                            onChange={(e) =>
                              setCurrentVariant({
                                ...currentVariant,
                                price: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pl-10 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="149900"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                            Rs.
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Sales Price
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={currentVariant.sales_price}
                            onChange={(e) =>
                              setCurrentVariant({
                                ...currentVariant,
                                sales_price: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pl-10 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="144900"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                            Rs.
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={currentVariant.stock_quantity}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              stock_quantity: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                          Low Stock Alert
                        </label>
                        <input
                          type="number"
                          value={currentVariant.low_stock_threshold}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              low_stock_threshold: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="5"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <CustomCheckbox
                          id="variant_is_offer"
                          checked={currentVariant.is_offer}
                          onCheckedChange={(checked) =>
                            setCurrentVariant({
                              ...currentVariant,
                              is_offer: !!checked,
                            })
                          }
                        />
                        <span className="text-sm">On Offer</span>
                      </label>
                      {currentVariant.is_offer && (
                        <div className="relative">
                          <input
                            type="number"
                            value={currentVariant.offer_price}
                            onChange={(e) =>
                              setCurrentVariant({
                                ...currentVariant,
                                offer_price: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pl-10 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="799.00"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                            Rs.
                          </span>
                        </div>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <CustomCheckbox
                          id="variant_is_trending"
                          checked={currentVariant.is_trending}
                          onCheckedChange={(checked) =>
                            setCurrentVariant({
                              ...currentVariant,
                              is_trending: !!checked,
                            })
                          }
                        />
                        <span className="text-sm">Trending</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <CustomCheckbox
                          id="variant_is_featured"
                          checked={currentVariant.is_featured}
                          onCheckedChange={(checked) =>
                            setCurrentVariant({
                              ...currentVariant,
                              is_featured: !!checked,
                            })
                          }
                        />
                        <span className="text-sm">Featured</span>
                      </label>
                    </div>

                    <button
                      onClick={addVariant}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Variant
                    </button>
                  </div>

                  {/* Variants List */}
                  {variants.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-slate-600 dark:text-slate-400">
                        Added Variants ({variants.length})
                      </h4>
                      {variants.map((variant, idx) => (
                        <div
                          key={variant.id}
                          className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-slate-900 dark:text-white">
                                {variant.variant_name}
                              </h5>
                              <p className="text-xs text-slate-500 font-mono">
                                {variant.sku}
                              </p>
                              <div className="mt-2 flex gap-4 text-sm">
                                <span>Price: ${variant.price}</span>
                                <span>Stock: {variant.stock_quantity}</span>
                                {variant.is_offer && (
                                  <span className="text-amber-600">
                                    On Offer
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setVariants(
                                  variants.filter((_, i) => i !== idx),
                                )
                              }
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT SIDEBAR (4 cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-32">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Publish Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                    Quick Stats
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          Variants
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {variants.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          Images
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {galleryImagePreviews.length +
                          (heroImagePreview ? 1 : 0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          Specs
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {specifications.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
