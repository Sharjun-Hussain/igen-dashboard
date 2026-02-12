"use client";

import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useSWR, { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";
import { fetcher as globalFetcher } from "../../../lib/fetcher";
import { toast } from "sonner";
import {
  Ticket,
  Plus,
  Search,
  Copy,
  Calendar,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  Trash2,
  Edit3,
  Percent,
  DollarSign,
  Wand2,
  Scissors,
  BarChart3,
  Clock,
  Package,
  Layers,
  MoreVertical,
} from "lucide-react";
import { Suspense } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Filter } from "lucide-react";

// --- MOCK PRODUCT DATA (For Search) ---
const MOCK_PRODUCTS_DB = [
  {
    id: 101,
    name: "Samsung Galaxy S24 Ultra",
    image: "https://placehold.co/50",
  },
  { id: 102, name: "iPhone 15 Pro Max", image: "https://placehold.co/50" },
  { id: 103, name: "Sony WH-1000XM5", image: "https://placehold.co/50" },
  { id: 104, name: "MacBook Air M3", image: "https://placehold.co/50" },
  { id: 105, name: "Nike Air Jordan 1", image: "https://placehold.co/50" },
];

// --- MOCK COUPONS ---


function CouponsContent() {
  const containerRef = useRef(null);

  // --- STATE ---
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const formSheetRef = useRef(null);
  const formOverlayRef = useRef(null);

  // --- API FETCHING ---
  const fetcher = async (url) => {
    const data = await globalFetcher(url, session?.accessToken);
    return data;
  };
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("All"); // percentage, fixed, tiered
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const searchParams = useSearchParams();

  // --- API DATA ---
  const { data: apiResponse, error, isLoading } = useSWR(
    session?.accessToken
      ? [`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons`, session.accessToken]
      : null,
    ([url]) => fetcher(url),
    {
      keepPreviousData: true,
    }
  );

  const coupons = (apiResponse?.data?.data || []).map(item => ({
    id: item.id,
    code: item.code,
    type: item.type === 'tiered_percentage' ? 'Tiered' : (item.type === 'percentage' ? 'Percentage' : 'Fixed'),
    value: item.value || (item.tiers?.length ? `Up to ${Math.max(...item.tiers.map(t => parseFloat(t.percentage)))}%` : 0),
    minSpend: parseFloat(item.min_purchase_amount || 0),
    usage: item.used_count || 0,
    limit: item.usage_limit || "∞",
    status: item.is_active ? "Active" : "Inactive",
    expiry: new Date(item.expiry_date).toLocaleDateString(),
    description: item.description || item.name,
    appliesTo: "all", // defaulting to all as API doesn't specify yet
    productIds: [],
  }));

  // Form State
  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage", // percentage, fixed, tiered_percentage
    value: "",
    min_purchase_amount: "",
    start_date: "",
    expiry_date: "",
    usage_limit: "",
    usage_limit_per_user: "",
    tiers: [{ min_amount: "", max_amount: "", percentage: "" }],
    appliesTo: "all",
    is_active: true
  });

  // Product Selection State
  const [productQuery, setProductQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      );
      tl.fromTo(
        ".coupon-card",
        { y: 20, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          clearProps: "all",
        },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  useGSAP(() => {
    if (isSheetOpen) {
      gsap.fromTo(formOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(formSheetRef.current, { x: "100%" }, { x: "0%", duration: 0.4, ease: "power3.out" });
    }
  }, [isSheetOpen]);

  // --- HANDLERS ---

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData({ ...formData, code: result });
  };

  // Product Selection Handlers
  const addProduct = (product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setProductQuery("");
    setShowProductDropdown(false);
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  // Tier Handlers
  const addTier = () => {
    setFormData({
      ...formData,
      tiers: [...formData.tiers, { min_amount: "", max_amount: "", percentage: "" }]
    });
  };

  const removeTier = (index) => {
    const newTiers = [...formData.tiers];
    newTiers.splice(index, 1);
    setFormData({ ...formData, tiers: newTiers });
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...formData.tiers];
    newTiers[index][field] = value;
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleEdit = (coupon) => {
    setIsEditMode(true);
    setEditingCouponId(coupon.id);
    
    // Find original coupon data from API response to get exact fields
    const rawCoupon = apiResponse?.data?.data?.find(c => c.id === coupon.id);
    if (!rawCoupon) return;

    setFormData({
        code: rawCoupon.code,
        name: rawCoupon.name,
        description: rawCoupon.description || "",
        type: rawCoupon.type,
        value: rawCoupon.value || "",
        min_purchase_amount: rawCoupon.min_purchase_amount || "",
        start_date: rawCoupon.start_date?.split('T')[0] || "",
        expiry_date: rawCoupon.expiry_date?.split('T')[0] || "",
        usage_limit: rawCoupon.usage_limit || "",
        usage_limit_per_user: rawCoupon.usage_limit_per_user || "",
        tiers: rawCoupon.tiers?.length ? rawCoupon.tiers.map(t => ({
            min_amount: t.min_amount,
            max_amount: t.max_amount,
            percentage: t.percentage
        })) : [{ min_amount: "", max_amount: "", percentage: "" }],
        appliesTo: "all", // TODO: Update when API supports product links
        is_active: rawCoupon.is_active
    });
    
    setIsSheetOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const payload = {
            code: formData.code,
            name: formData.name,
            description: formData.description,
            type: formData.type,
            start_date: formData.start_date,
            expiry_date: formData.expiry_date,
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
            usage_limit_per_user: formData.usage_limit_per_user ? parseInt(formData.usage_limit_per_user) : null,
            is_active: formData.is_active,
            // products logic if needed later
        };

        if (formData.type === 'tiered_percentage') {
            payload.tiers = formData.tiers.map(t => ({
                min_amount: parseFloat(t.min_amount),
                max_amount: parseFloat(t.max_amount),
                percentage: parseFloat(t.percentage)
            }));
        } else {
            payload.value = parseFloat(formData.value);
            payload.min_purchase_amount = parseFloat(formData.min_purchase_amount);
        }

        const url = isEditMode 
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons/${editingCouponId}`
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons`;
            
        const method = isEditMode ? 'PUT' : 'POST';

        const res = await globalFetcher(url, session?.accessToken, {
            method: method,
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res) {
            toast.success(`Coupon ${isEditMode ? 'updated' : 'created'} successfully`);
            handleCloseSheet();
            mutate([`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons`, session?.accessToken]);
            
            // Reset form
            setFormData({
                code: "",
                name: "",
                description: "",
                type: "percentage",
                value: "",
                min_purchase_amount: "",
                start_date: "",
                expiry_date: "",
                usage_limit: "",
                usage_limit_per_user: "",
                tiers: [{ min_amount: "", max_amount: "", percentage: "" }],
                appliesTo: "all",
                is_active: true
            });
            setIsEditMode(false);
            setEditingCouponId(null);
        }
    } catch (err) {
        toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} coupon`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCloseSheet = () => {
    const tl = gsap.timeline({ onComplete: () => setIsSheetOpen(false) });
    tl.to(formSheetRef.current, { x: "100%", duration: 0.3, ease: "power3.in" });
    tl.to(formOverlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");
  };

  // Handle Quick Action from Header
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsSheetOpen(true);
      // Clean up URL to prevent re-opening on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleDelete = async (id) => {
    if (confirm("Delete this coupon?")) {
        try {
            await globalFetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons/${id}`, session?.accessToken, {
                method: 'DELETE'
            });
            toast.success("Coupon deleted successfully");
            mutate([`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons`, session?.accessToken]);
            if (selectedCouponId === id) setSelectedCouponId(null);
        } catch (err) {
            toast.error(err.message || "Failed to delete coupon");
        }
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesStatus = filterStatus === "All" || coupon.status === filterStatus;
    const matchesType = filterType === "All" || coupon.type === filterType;
    const matchesSearch = 
        coupon.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        coupon.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Expired":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 dark:bg-slate-900 p-6 font-sans text-slate-900 dark:text-white pb-20"
    >
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-header">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Coupons
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage discount codes and product-specific offers.
          </p>
        </div>
          <button
            onClick={() => {
                setIsEditMode(false);
                setFormData({
                    code: "",
                    name: "",
                    description: "",
                    type: "percentage",
                    value: "",
                    min_purchase_amount: "",
                    start_date: "",
                    expiry_date: "",
                    usage_limit: "",
                    usage_limit_per_user: "",
                    tiers: [{ min_amount: "", max_amount: "", percentage: "" }],
                    appliesTo: "all",
                    is_active: true
                });
                setIsSheetOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create Coupon
        </button>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="animate-header bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
              Active Coupons
            </p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
              {coupons.filter((c) => c.status === "Active").length}
            </h4>
          </div>
        </div>
        <div className="animate-header bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
              Total Redemptions
            </p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">1,443</h4>
          </div>
        </div>
        <div className="animate-header bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
              Discount Volume
            </p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Rs. 1.2M</h4>
          </div>
        </div>
      </div>
      
      {/* 2.5 TOOLBAR */}
      <div className="animate-header sticky top-4 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-2xl p-2 flex flex-col sm:flex-row gap-3 items-center justify-between mb-8">
        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 bg-transparent rounded-xl text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900 transition-all border border-transparent focus:border-slate-200 dark:focus:border-slate-700"
            placeholder="Search coupons (code or description)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-2 px-3 border-r border-slate-200 dark:border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filters</span>
          </div>
          
          <div className="flex items-center gap-1 px-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer pr-2"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-1 px-2 border-l border-slate-200 dark:border-slate-700">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer pr-2"
            >
              <option value="All">All Types</option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed</option>
              <option value="Tiered">Tiered</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. COUPON GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse" />
          ))}
        </div>
      ) : filteredCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => setSelectedCouponId(coupon.id)}
              className="coupon-card bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-wide">
                      {coupon.code}
                    </h3>
                    <button
                      onClick={() => handleCopy(coupon.code, coupon.id)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {copiedId === coupon.id ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {coupon.description}
                  </p>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(coupon.status)}`}
                >
                  {coupon.status}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Discount
                    </p>
                    <p className="text-lg font-bold text-indigo-600">
                      {coupon.type === "Percentage"
                        ? `${coupon.value}% OFF`
                        : (coupon.type === "Tiered" ? coupon.value : `Rs. ${coupon.value} OFF`)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                      Applies To
                    </p>
                    <div className="flex justify-end mt-1">
                      {coupon.appliesTo === "specific" ? (
                        <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">
                          <Package className="w-3 h-3" />{" "}
                          {coupon.productIds.length} Products
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded border border-blue-100 dark:border-blue-800">
                          <Layers className="w-3 h-3" /> Site-wide
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Usage Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Usage</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {coupon.usage} / {coupon.limit}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${(coupon.usage / (coupon.limit === "∞" ? 10000 : coupon.limit)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-700">
                  <Clock className="w-3.5 h-3.5" /> Expires:{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {coupon.expiry}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(coupon.id); }}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg shadow-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-header flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm text-center px-6">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Ticket className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No coupons created yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
            Boost your sales by creating your first discount code or tiered promotion.
          </p>
          <button
            onClick={() => {
                setIsEditMode(false);
                setFormData({
                    code: "",
                    name: "",
                    description: "",
                    type: "percentage",
                    value: "",
                    min_purchase_amount: "",
                    start_date: "",
                    expiry_date: "",
                    usage_limit: "",
                    usage_limit_per_user: "",
                    tiers: [{ min_amount: "", max_amount: "", percentage: "" }],
                    appliesTo: "all",
                    is_active: true
                });
                setIsSheetOpen(true);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            Create Your First Coupon
          </button>
        </div>
      )}

      {/* 6. DETAILS SHEET */}
      {selectedCouponId && (
        <CouponDetailsSheet 
            couponId={selectedCouponId} 
            onClose={() => setSelectedCouponId(null)} 
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
      )}

      {/* 5. CREATE/EDIT SHEET */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            ref={formOverlayRef}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleCloseSheet}
          />
          
          <div 
            ref={formSheetRef}
            className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-950/95 z-10 backdrop-blur transition-colors">
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {isEditMode ? "Edit Coupon" : "Create Coupon"}
              </h3>
              <button 
                onClick={handleCloseSheet}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Code Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. SUMMER2026"
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-mono font-bold uppercase focus:border-indigo-500 outline-none dark:text-white transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                  >
                    <Wand2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Summer Sale"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="e.g. 10% Off for new users"
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm resize-none"
                  />
                </div>
              </div>

              {/* PRODUCT SELECTION LOGIC */}
              <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block tracking-wider">
                  Applies To
                </label>

                <div className="flex bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, appliesTo: "all" })
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      formData.appliesTo === "all" 
                        ? "bg-indigo-600 text-white shadow-lg" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, appliesTo: "specific" })
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      formData.appliesTo === "specific" 
                        ? "bg-indigo-600 text-white shadow-lg" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    Specific Products
                  </button>
                </div>

                {formData.appliesTo === "specific" && (
                  <div className="space-y-3 pt-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        autoFocus
                        value={productQuery}
                        onChange={(e) => {
                          setProductQuery(e.target.value);
                          setShowProductDropdown(true);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:border-indigo-500 outline-none dark:text-white shadow-sm"
                      />
                      {/* Dropdown */}
                      {showProductDropdown && productQuery && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                          {MOCK_PRODUCTS_DB.filter((p) =>
                            p.name
                              .toLowerCase()
                              .includes(productQuery.toLowerCase()),
                          ).map((prod) => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => addProduct(prod)}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 transition-colors dark:text-slate-200"
                            >
                              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-slate-400" />
                              </div>
                              {prod.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 dark:border-indigo-800/50 transition-all"
                        >
                          {prod.name}
                          <button
                            type="button"
                            onClick={() => removeProduct(prod.id)}
                            className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Value & Type */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Discount Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["percentage", "fixed", "tiered_percentage"].map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`py-2.5 text-xs font-bold rounded-xl border transition-all capitalize shadow-sm ${
                            formData.type === type
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {type.replace("_", " ")}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {formData.type === "tiered_percentage" ? (
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Discount Tiers
                      </label>
                      <button
                        type="button"
                        onClick={addTier}
                        className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 active:scale-95"
                      >
                        + Add Tier
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.tiers.map((tier, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-end animate-in slide-in-from-right-2 fade-in duration-300 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                          <div className="flex-1 space-y-1.5">
                            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 ml-1">
                              Min (Rs)
                            </p>
                            <input
                              type="number"
                              placeholder="Min"
                              value={tier.min_amount}
                              onChange={(e) =>
                                updateTier(index, "min_amount", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white transition-all font-bold"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 ml-1">
                              Max (Rs)
                            </p>
                            <input
                              type="number"
                              placeholder="Max"
                              value={tier.max_amount}
                              onChange={(e) =>
                                updateTier(index, "max_amount", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white transition-all font-bold"
                            />
                          </div>
                          <div className="w-20 space-y-1.5">
                            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 ml-1">
                              Disc %
                            </p>
                            <input
                              type="number"
                              placeholder="%"
                              value={tier.percentage}
                              onChange={(e) =>
                                updateTier(index, "percentage", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white transition-all font-bold"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTier(index)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Value
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="number"
                          value={formData.value}
                          onChange={(e) =>
                            setFormData({ ...formData, value: e.target.value })
                          }
                          placeholder="0"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm font-bold"
                        />
                        <div className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
                          {formData.type === "percentage" ? (
                            <Percent className="w-4 h-4" />
                          ) : (
                            <DollarSign className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Min Spend
                      </label>
                      <input
                        type="number"
                        value={formData.min_purchase_amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            min_purchase_amount: e.target.value,
                          })
                        }
                        placeholder="0"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Limits */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Total Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, usage_limit: e.target.value })
                    }
                    placeholder="∞"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Per User
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit_per_user}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usage_limit_per_user: e.target.value,
                      })
                    }
                    placeholder="1"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm color-scheme-light dark:color-scheme-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry_date: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm color-scheme-light dark:color-scheme-dark"
                  />
                </div>
              </div>
            </form>

            <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 transition-colors">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSave}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}{" "}
                {isEditMode ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}


function CouponDetailsSheet({ couponId, onClose, onEdit, onDelete }) {
  const { data: session } = useSession();
  
  const { data: apiResponse, isLoading } = useSWR(
    session?.accessToken && couponId
      ? [`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons/${couponId}`, session.accessToken]
      : null,
    ([url]) => globalFetcher(url, session?.accessToken)
  );

  const coupon = apiResponse?.data;

  // Animation
  const sheetRef = useRef(null);
  const overlayRef = useRef(null);
  
  useGSAP(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(sheetRef.current, { x: "100%" }, { x: "0%", duration: 0.4, ease: "power3.out" });
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(sheetRef.current, { x: "100%", duration: 0.3, ease: "power3.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");
  };

  if (!coupon && !isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div 
        ref={sheetRef}
        className="absolute inset-y-0 right-0 w-full max-w-md bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
      >
        {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        ) : (
            <>
                {/* Header */}
                <div className="px-6 py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start sticky top-0 z-10 transition-colors">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{coupon.code}</h2>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${coupon.is_active ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}>
                                {coupon.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{coupon.name}</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Main Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-indigo-500" /> Coupon Details
                        </h3>
                        <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Type</p>
                                    <p className="font-medium text-slate-900 dark:text-slate-200 capitalize">{coupon.type.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Value</p>
                                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                        {coupon.type === 'tiered_percentage' 
                                            ? 'Tiered' 
                                            : (coupon.type === 'percentage' ? `${parseFloat(coupon.value)}%` : `Rs. ${parseFloat(coupon.value)}`)}
                                    </p>
                                </div>
                            </div>
                            {coupon.description && (
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Description</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{coupon.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tiers Section (Only for tiered_percentage) */}
                    {coupon.type === 'tiered_percentage' && coupon.tiers && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Layers className="w-4 h-4 text-amber-500" /> Discount Tiers
                            </h3>
                            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <table className="w-full text-sm text-left transition-colors">
                                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Min Spend</th>
                                            <th className="px-4 py-3">Max Spend</th>
                                            <th className="px-4 py-3 text-right">Discount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                                        {coupon.tiers.map(tier => (
                                            <tr key={tier.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Rs. {parseFloat(tier.min_amount).toLocaleString()}</td>
                                                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">Rs. {parseFloat(tier.max_amount).toLocaleString()}</td>
                                                <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400 text-right">{parseFloat(tier.percentage)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Limits & Dates */}
                    <div className="space-y-4">
                         <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-500" /> Limits & Dates
                        </h3>
                        <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                             <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Usage</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{coupon.used_count} / {coupon.usage_limit}</p>
                                </div>
                                <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                                     <div className="h-full bg-emerald-500" style={{ width: `${(coupon.used_count / coupon.usage_limit) * 100}%` }}></div>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Start Date</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{new Date(coupon.start_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Expiry Date</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">{new Date(coupon.expiry_date).toLocaleDateString()}</p>
                                </div>
                             </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
                    <button onClick={handleClose} className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Close
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
}



export default function CouponsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50/50 p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <CouponsContent />
    </Suspense>
  );
}

