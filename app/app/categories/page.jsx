"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  X,
  UploadCloud,
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";

// --- MOCK DATA ---
const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Smartphones",
    slug: "smartphones",
    parent: "None",
    count: 120,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff75?w=500&q=80",
  },
  {
    id: 2,
    name: "Laptops",
    slug: "laptops",
    parent: "None",
    count: 45,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80",
  },
  {
    id: 3,
    name: "Audio Gear",
    slug: "audio-gear",
    parent: "None",
    count: 80,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
  },
  {
    id: 4,
    name: "Headphones",
    slug: "headphones",
    parent: "Audio Gear",
    count: 32,
    status: "Hidden",
    image: null,
  },
  {
    id: 5,
    name: "Gaming",
    slug: "gaming",
    parent: "None",
    count: 15,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80",
  },
  {
    id: 6,
    name: "Cameras",
    slug: "cameras",
    parent: "None",
    count: 12,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
  },
];

export default function SmoothCategoriesPage() {
  const containerRef = useRef(null);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // --- MODAL STATES ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- REFS ---
  const formOverlayRef = useRef(null);
  const formContentRef = useRef(null);
  const deleteOverlayRef = useRef(null);
  const deleteContentRef = useRef(null);

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent: "None",
    status: "Active",
    description: "",
  });

  // ------------------------------------------------------------------
  // 1. PAGE LOAD ANIMATION
  // ------------------------------------------------------------------
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Header elements slide down smoothly
      tl.fromTo(
        ".animate-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      );

      // Toolbar fades in
      tl.fromTo(
        ".animate-toolbar",
        { y: 10, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  // ------------------------------------------------------------------
  // 2. GRID/LIST SWITCH ANIMATION (The key to smoothness)
  // ------------------------------------------------------------------
  useGSAP(() => {
    // Kill any existing animations on these items to prevent glitches
    gsap.killTweensOf(".category-item");

    // Animate items in with a satisfying "pop" and stagger
    gsap.fromTo(
      ".category-item",
      {
        y: 20,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.04, // Very tight stagger for premium feel
        ease: "expo.out", // Starts fast, settles very slowly (Smooth!)
        clearProps: "all", // Cleanup CSS after animation
      },
    );
  }, [viewMode, categories, searchTerm]);

  // ------------------------------------------------------------------
  // 3. FORM DRAWER ANIMATION
  // ------------------------------------------------------------------
  useGSAP(() => {
    if (isFormOpen && formContentRef.current) {
      // Overlay Fade
      gsap.fromTo(
        formOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
      );
      // Drawer Slide (Elastic-ish but professional)
      gsap.fromTo(
        formContentRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.6, ease: "power4.out" },
      );
    }
  }, [isFormOpen]);

  // ------------------------------------------------------------------
  // 4. DELETE MODAL ANIMATION
  // ------------------------------------------------------------------
  useGSAP(() => {
    if (isDeleteOpen && deleteContentRef.current) {
      gsap.fromTo(
        deleteOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
      gsap.fromTo(
        deleteContentRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" },
      );
    }
  }, [isDeleteOpen]);

  // --- HANDLERS WITH EXIT ANIMATIONS ---

  const closeFormWithAnim = () => {
    if (!formContentRef.current) return;
    const tl = gsap.timeline({ onComplete: () => setIsFormOpen(false) });

    // Slide out slightly faster than slide in
    tl.to(formContentRef.current, {
      x: "100%",
      duration: 0.4,
      ease: "power3.in",
    }).to(formOverlayRef.current, { opacity: 0, duration: 0.3 }, "-=0.2");
  };

  const closeDeleteWithAnim = () => {
    if (!deleteContentRef.current) return;
    const tl = gsap.timeline({ onComplete: () => setIsDeleteOpen(false) });

    tl.to(deleteContentRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    }).to(deleteOverlayRef.current, { opacity: 0, duration: 0.2 }, "<");
  };

  const handleOpenCreate = () => {
    setFormMode("create");
    setFormData({
      name: "",
      slug: "",
      parent: "None",
      status: "Active",
      description: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category) => {
    setFormMode("edit");
    setSelectedCategory(category);
    setFormData({ ...category, description: "Sample description..." });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === "create") {
      const newId = Math.max(...categories.map((c) => c.id)) + 1;
      setCategories([
        ...categories,
        { id: newId, count: 0, image: null, ...formData },
      ]);
    } else {
      setCategories(
        categories.map((c) =>
          c.id === selectedCategory.id ? { ...c, ...formData } : c,
        ),
      );
    }
    closeFormWithAnim();
  };

  const handleDeleteConfirm = () => {
    // Animate the item out before removing it from state?
    // For simplicity in this demo, we just remove and the list re-renders.
    // The "stagger" effect in the useGSAP hook will handle the re-layout smoothly.
    setCategories(categories.filter((c) => c.id !== selectedCategory.id));
    closeDeleteWithAnim();
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: val
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, ""),
    }));
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden"
    >
      {/* 1. TOP BAR */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="animate-header">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Category Manager
            </h1>
            <p className="text-slate-500 font-medium">
              Manage your product hierarchy and catalog organization.
            </p>
          </div>

          <div className="animate-header flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="group flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 will-change-transform"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* 2. TOOLBAR */}
        <div className="animate-toolbar sticky top-4 z-30 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-slate-200/50 rounded-2xl p-2 flex flex-col sm:flex-row gap-3 items-center justify-between will-change-transform">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 bg-transparent rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:bg-slate-50 transition-all"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto p-1 bg-slate-100/50 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600 scale-100" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
            >
              <LayoutGrid className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600 scale-100" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
            >
              <ListIcon className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* 3. CONTENT AREA */}
        <div className="mt-8 min-h-[500px]">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl animate-header">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No categories found
              </h3>
              <p className="text-slate-500 mt-1">
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="category-item group relative bg-white rounded-3xl p-4 border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-500 ease-out cursor-pointer flex flex-col h-full will-change-transform"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-slate-300">
                            <UploadCloud className="w-10 h-10" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`backdrop-blur-md bg-white/90 px-2.5 py-1 rounded-full text-xs font-bold border ${cat.status === "Active" ? "text-green-600 border-green-100" : "text-slate-500 border-slate-100"}`}
                          >
                            {cat.status}
                          </span>
                        </div>
                      </div>

                      {/* Text Area */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
                            {cat.slug}
                          </span>
                          {cat.parent !== "None" && (
                            <span className="text-indigo-500 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-indigo-400"></span>{" "}
                              {cat.parent}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer / Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                        <span className="text-xs font-bold text-slate-400">
                          {cat.count} products
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(cat);
                            }}
                            className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDelete(cat);
                            }}
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="p-5 pl-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Parent
                        </th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                          Items
                        </th>
                        <th className="p-5 pr-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCategories.map((cat) => (
                        <tr
                          key={cat.id}
                          className="category-item group hover:bg-slate-50/80 transition-colors duration-200"
                        >
                          <td className="p-4 pl-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                {cat.image ? (
                                  <img
                                    src={cat.image}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <UploadCloud className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {cat.name}
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                  {cat.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-600">
                            {cat.parent === "None" ? (
                              <span className="opacity-30">—</span>
                            ) : (
                              cat.parent
                            )}
                          </td>
                          <td className="p-4">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cat.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                            >
                              {cat.status === "Active" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <CircleDashed className="w-3 h-3" />
                              )}
                              {cat.status}
                            </div>
                          </td>
                          <td className="p-4 text-right text-sm font-bold text-slate-700">
                            {cat.count}
                          </td>
                          <td className="p-4 pr-8 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => handleOpenEdit(cat)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenDelete(cat)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- DRAWER / SIDE PANEL FORM --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            ref={formOverlayRef}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={closeFormWithAnim}
          />

          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <div
              ref={formContentRef}
              className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-100"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {formMode === "create"
                      ? "Create Category"
                      : "Edit Category"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Configure category details and hierarchy.
                  </p>
                </div>
                <button
                  onClick={closeFormWithAnim}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Image Uploader */}
                <div className="group relative w-full aspect-[2/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                  {selectedCategory?.image ? (
                    <img
                      src={selectedCategory.image}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                      <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Click to upload cover
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Category Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      placeholder="e.g. Wireless Headphones"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formData.slug}
                        className="w-full bg-slate-100 border-transparent text-slate-500 rounded-xl px-4 py-3 text-sm cursor-not-allowed outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none appearance-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Parent Category
                    </label>
                    <select
                      value={formData.parent}
                      onChange={(e) =>
                        setFormData({ ...formData, parent: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                    >
                      <option value="None">No Parent (Top Level)</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                      placeholder="Add a description for this category..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex gap-3">
                <button
                  type="button"
                  onClick={closeFormWithAnim}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="flex-[2] py-3 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
                >
                  {formMode === "create" ? "Create Category" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE DIALOG --- */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            ref={deleteOverlayRef}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeDeleteWithAnim}
          />
          <div
            ref={deleteContentRef}
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
          >
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Delete Category?
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">
                "{selectedCategory?.name}"
              </span>
              ? All products within this category will be uncategorized.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteWithAnim}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
