"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Plus, Search, Edit3, Trash2, UploadCloud, 
  X, Filter, MoreHorizontal, CheckCircle2, 
  AlertCircle, Image as ImageIcon, Loader2
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// --- MOCK DATA ---
const INITIAL_BRANDS = [
  { id: 1, name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png", products: 142, status: "Active", website: "nike.com" },
  { id: 2, name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png", products: 89, status: "Active", website: "samsung.com" },
  { id: 3, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png", products: 245, status: "Active", website: "apple.com" },
  { id: 4, name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/2560px-Sony_logo.svg.png", products: 56, status: "Inactive", website: "sony.com" },
];

export default function BrandManagementPage() {
  const containerRef = useRef(null);
  
  // --- STATE ---
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- ANIMATIONS ---
  useGSAP(() => {
    gsap.fromTo(".brand-row", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
  }, [brands]); // Re-animate when list changes

  // --- HANDLERS ---
  
  // 1. Delete
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands(prev => prev.filter(b => b.id !== id));
    }
  };

  // 2. Open Modal (Add or Edit)
  const openModal = (brand = null) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  // 3. Save (Create or Update)
  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const newBrand = {
      id: editingBrand ? editingBrand.id : Date.now(),
      name: formData.get("name"),
      website: formData.get("website"),
      status: formData.get("status"),
      products: editingBrand ? editingBrand.products : 0,
      // Simulate logo upload (using a placeholder if empty)
      logo: editingBrand?.logo || "https://placehold.co/400x400/png?text=Brand", 
    };

    // Simulate Network Request
    setTimeout(() => {
      if (editingBrand) {
        setBrands(prev => prev.map(b => b.id === newBrand.id ? newBrand : b));
      } else {
        setBrands(prev => [newBrand, ...prev]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
      setEditingBrand(null);
    }, 800);
  };

  // Filter Logic
  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-slate-900  font-sans transition-colors duration-300">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Brands</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your product brands and partners.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {/* 2. TOOLBAR */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search brands..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-indigo-500 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* 3. BRANDS TABLE */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Brand Name</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Products</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="brand-row hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center">
                          <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{brand.name}</p>
                          <a href={`https://${brand.website}`} target="_blank" className="text-xs text-slate-500 hover:text-indigo-500 dark:text-slate-400">
                            {brand.website}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                      {brand.products} Items
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        brand.status === 'Active' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {brand.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                        {brand.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(brand)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(brand.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm font-medium">No brands found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL (CREATE / UPDATE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Brand Logo</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer relative group">
                  {editingBrand?.logo ? (
                     <div className="relative w-20 h-20">
                        <img src={editingBrand.logo} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                           <UploadCloud className="w-6 h-6 text-white" />
                        </div>
                     </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mb-2">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload</p>
                      <p className="text-xs text-slate-400">SVG, PNG, JPG (Max 2MB)</p>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Brand Name</label>
                <input 
                  name="name"
                  type="text" 
                  required
                  defaultValue={editingBrand?.name}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Website</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">https://</span>
                   <input 
                    name="website"
                    type="text" 
                    defaultValue={editingBrand?.website}
                    className="w-full pl-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <select 
                  name="status" 
                  defaultValue={editingBrand?.status || "Active"}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBrand ? "Update Brand" : "Create Brand"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}