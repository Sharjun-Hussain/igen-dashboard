"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  LayoutGrid,
  List as ListIcon,
  Package,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    sku: "AUD-001",
    category: "Audio",
    price: 349.0,
    stock: 45,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    sku: "LAP-002",
    category: "Laptops",
    price: 1999.0,
    stock: 12,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&q=80",
  },
  {
    id: 3,
    name: "Fujifilm X-T5",
    sku: "CAM-045",
    category: "Cameras",
    price: 1699.0,
    stock: 3,
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
  },
  {
    id: 4,
    name: "Keychron Q1 Pro",
    sku: "ACC-099",
    category: "Accessories",
    price: 199.0,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
  },
  {
    id: 5,
    name: "Herman Miller Aeron",
    sku: "FUR-101",
    category: "Furniture",
    price: 1250.0,
    stock: 8,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
  },
  {
    id: 6,
    name: "iPad Air 5",
    sku: "TAB-202",
    category: "Tablets",
    price: 599.0,
    stock: 120,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
  },
];

export default function ProductsPage() {
  const containerRef = useRef(null);
  const [viewMode, setViewMode] = useState("list"); // 'grid' | 'list'
  const [searchTerm, setSearchTerm] = useState("");

  // --- ANIMATIONS ---
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Header & Stats staggered entry
      tl.fromTo(
        ".animate-up",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05 },
      );
    },
    { scope: containerRef },
  );

  // View Mode Switch Animation
  useGSAP(() => {
    gsap.killTweensOf(".product-item");

    gsap.fromTo(
      ".product-item",
      { y: 15, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: "expo.out",
        clearProps: "all",
      },
    );
  }, [viewMode, searchTerm]);

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Draft":
        return "text-slate-500 bg-slate-100 border-slate-200";
      case "Low Stock":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "Out of Stock":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-slate-500 bg-slate-100";
    }
  };

  const getStockColor = (count) => {
    if (count === 0) return "bg-red-500";
    if (count < 10) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50  font-sans text-slate-900"
    >
      {/* 1. HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="animate-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Products
            </h1>
            <p className="text-slate-500 font-medium">
              Manage inventory, pricing, and product details.
            </p>
          </div>

          <div className="animate-up">
            <Link
              href="/app/products/new"
              className="group flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 will-change-transform"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Products",
              val: "1,240",
              icon: Package,
              color: "text-indigo-600",
            },
            {
              label: "Low Stock",
              val: "12",
              icon: AlertTriangle,
              color: "text-amber-600",
            },
            {
              label: "Out of Stock",
              val: "4",
              icon: XCircle,
              color: "text-red-600",
            },
            {
              label: "Avg Price",
              val: "$245.00",
              icon: Clock,
              color: "text-emerald-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="animate-up bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {stat.label}
                </p>
                <h4 className="text-2xl font-bold text-slate-900">
                  {stat.val}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* 3. TOOLBAR */}
        <div className="animate-up sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-slate-200/50 rounded-2xl p-2 flex flex-col sm:flex-row gap-3 items-center justify-between mb-8">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-transparent rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:bg-slate-50 transition-all"
              placeholder="Search by name, SKU..."
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto p-1">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <div className="flex bg-slate-100/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. CONTENT AREA */}
        <div className="min-h-[500px]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl animate-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No products found
              </h3>
            </div>
          ) : (
            <>
              {viewMode === "list" ? (
                // --- LIST VIEW ---
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 pl-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="p-4 pr-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="product-item group hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                <img
                                  src={product.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {product.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {product.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono text-slate-500">
                            {product.sku}
                          </td>
                          <td className="p-4">
                            <div className="w-32">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-700">
                                  {product.stock} in stock
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getStockColor(product.stock)}`}
                                  style={{
                                    width: `${Math.min(product.stock, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-bold text-slate-900">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(product.status)}`}
                            >
                              {product.status === "Published" && (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {product.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // --- GRID VIEW ---
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-item group bg-white rounded-3xl border border-slate-100 p-3 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300"
                    >
                      <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden mb-3">
                        <img
                          src={product.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={product.name}
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(product.status)}`}
                          >
                            {product.status}
                          </span>
                        </div>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="px-1 pb-2">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-slate-900 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="font-bold text-indigo-600">
                            ${product.price}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                          <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                            {product.sku}
                          </span>
                          <span>{product.category}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                          <div
                            className={`w-2 h-2 rounded-full ${getStockColor(product.stock)}`}
                          ></div>
                          <span className="text-xs font-medium text-slate-600">
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
