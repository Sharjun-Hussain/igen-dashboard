"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
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
} from "lucide-react";

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
const INITIAL_COUPONS = [
  {
    id: 1,
    code: "WELCOME2026",
    type: "Percentage",
    value: 10,
    minSpend: 2500,
    usage: 145,
    limit: 500,
    status: "Active",
    expiry: "2026-12-31",
    description: "New user sign up bonus",
    appliesTo: "all", // 'all' or 'specific'
    productIds: [],
  },
  {
    id: 2,
    code: "SAMSUNG500",
    type: "Fixed",
    value: 500,
    minSpend: 0,
    usage: 12,
    limit: 100,
    status: "Active",
    expiry: "2026-03-01",
    description: "Discount on Samsung Phones",
    appliesTo: "specific",
    productIds: [101], // Only applies to Samsung S24
  },
];

export default function CouponsPage() {
  const containerRef = useRef(null);

  // --- STATE ---
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const searchParams = useSearchParams();

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "Percentage",
    value: "",
    minSpend: "",
    limit: "",
    expiry: "",
    appliesTo: "all", // Default to store-wide
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

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const newCoupon = {
        id: Date.now(),
        ...formData,
        usage: 0,
        status: "Active",
        limit: formData.limit || "∞",
        productIds:
          formData.appliesTo === "specific"
            ? selectedProducts.map((p) => p.id)
            : [],
      };

      setCoupons([newCoupon, ...coupons]);
      setIsLoading(false);
      setIsModalOpen(false);
      // Reset
      setFormData({
        code: "",
        description: "",
        type: "Percentage",
        value: "",
        minSpend: "",
        limit: "",
        expiry: "",
        appliesTo: "all",
      });
      setSelectedProducts([]);
    }, 1000);
  };

  // Handle Quick Action from Header
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsModalOpen(true);
      // Clean up URL to prevent re-opening on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleDelete = (id) => {
    if (confirm("Delete this coupon?"))
      setCoupons(coupons.filter((c) => c.id !== id));
  };

  const filteredCoupons = coupons.filter(
    (c) => filterStatus === "All" || c.status === filterStatus,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Expired":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900 pb-20"
    >
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 animate-header">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Coupons
          </h1>
          <p className="text-slate-500 font-medium">
            Manage discount codes and product-specific offers.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Create Coupon
        </button>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="animate-header bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">
              Active Coupons
            </p>
            <h4 className="text-2xl font-bold text-slate-900">
              {coupons.filter((c) => c.status === "Active").length}
            </h4>
          </div>
        </div>
        <div className="animate-header bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">
              Total Redemptions
            </p>
            <h4 className="text-2xl font-bold text-slate-900">1,443</h4>
          </div>
        </div>
        <div className="animate-header bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">
              Discount Volume
            </p>
            <h4 className="text-2xl font-bold text-slate-900">Rs. 1.2M</h4>
          </div>
        </div>
      </div>

      {/* 3. COUPON GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className="coupon-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-slate-900 font-mono tracking-wide">
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
                <p className="text-xs text-slate-500 font-medium">
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
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Discount
                  </p>
                  <p className="text-lg font-bold text-indigo-600">
                    {coupon.type === "Percentage"
                      ? `${coupon.value}% OFF`
                      : `Rs. ${coupon.value} OFF`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Applies To
                  </p>
                  <div className="flex justify-end mt-1">
                    {coupon.appliesTo === "specific" ? (
                      <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">
                        <Package className="w-3 h-3" />{" "}
                        {coupon.productIds.length} Products
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                        <Layers className="w-3 h-3" /> Site-wide
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-500">Usage</span>
                  <span className="font-bold text-slate-900">
                    {coupon.usage} / {coupon.limit}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${(coupon.usage / (coupon.limit === "∞" ? 10000 : coupon.limit)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-50">
                <Clock className="w-3.5 h-3.5" /> Expires:{" "}
                <span className="font-bold text-slate-700">
                  {coupon.expiry}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDelete(coupon.id)}
                className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-red-600 rounded-lg shadow-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 bg-white/95 z-10 backdrop-blur">
              <h3 className="text-lg font-bold text-slate-900">
                Create New Coupon
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Code Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">
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
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold uppercase focus:border-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <Wand2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g. 10% Off for new users"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              {/* PRODUCT SELECTION LOGIC */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 uppercase block">
                  Applies To
                </label>

                {/* Toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, appliesTo: "all" })
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.appliesTo === "all" ? "bg-white border-indigo-200 text-indigo-600 shadow-sm" : "border-transparent text-slate-500 hover:bg-white hover:shadow-sm"}`}
                  >
                    All Products
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, appliesTo: "specific" })
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.appliesTo === "specific" ? "bg-white border-indigo-200 text-indigo-600 shadow-sm" : "border-transparent text-slate-500 hover:bg-white hover:shadow-sm"}`}
                  >
                    Specific Products
                  </button>
                </div>

                {/* Specific Product Search */}
                {formData.appliesTo === "specific" && (
                  <div className="space-y-2 animate-in fade-in zoom-in-95">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={productQuery}
                        onChange={(e) => {
                          setProductQuery(e.target.value);
                          setShowProductDropdown(true);
                        }}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                      />
                      {/* Dropdown */}
                      {showProductDropdown && productQuery && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                          {MOCK_PRODUCTS_DB.filter((p) =>
                            p.name
                              .toLowerCase()
                              .includes(productQuery.toLowerCase()),
                          ).map((prod) => (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => addProduct(prod)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                            >
                              <div className="w-6 h-6 bg-slate-100 rounded"></div>
                              {prod.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected Chips */}
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold"
                        >
                          {prod.name}
                          <button
                            type="button"
                            onClick={() => removeProduct(prod.id)}
                            className="hover:text-indigo-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {selectedProducts.length === 0 && (
                        <p className="text-[10px] text-slate-400 italic">
                          No products selected yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Value & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                  >
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400">
                      {formData.type === "Percentage" ? (
                        <Percent className="w-4 h-4" />
                      ) : (
                        <DollarSign className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.limit}
                    onChange={(e) =>
                      setFormData({ ...formData, limit: e.target.value })
                    }
                    placeholder="∞"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Expiry
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.expiry}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}{" "}
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
