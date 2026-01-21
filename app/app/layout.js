"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Bell, Search, ChevronRight, Plus, Box, Layers, Tag, Ticket, Smartphone } from "lucide-react";
import Sidebar from "../Components/SideBar";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white">

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">

        {/* TOP HEADER */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <div className="flex items-center gap-4">
            {/* Mobile Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link href="/app" className="hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              {pathname.split("/").filter(Boolean).slice(1).map((segment, index, array) => {
                const href = `/app/${array.slice(0, index + 1).join("/")}`;
                const isLast = index === array.length - 1;
                return (
                  <React.Fragment key={href}>
                    <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                    {isLast ? (
                      <span className="text-slate-900 dark:text-white font-semibold capitalize">
                        {segment.replace(/-/g, " ")}
                      </span>
                    ) : (
                      <Link href={href} className="hover:text-indigo-600 transition-colors capitalize">
                        {segment.replace(/-/g, " ")}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Quick Create</span>
              </button>

              {quickCreateOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setQuickCreateOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Create New
                    </p>
                    <Link
                      href="/app/products/new"
                      onClick={() => setQuickCreateOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Box className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">Product</span>
                    </Link>
                    <Link
                      href="/app/categories?action=create"
                      onClick={() => setQuickCreateOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">Category</span>
                    </Link>
                    <Link
                      href="/app/brand?action=create"
                      onClick={() => setQuickCreateOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">Brand</span>
                    </Link>
                    <Link
                      href="/app/coupons?action=create"
                      onClick={() => setQuickCreateOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">Offer / Coupon</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 focus-within:ring-2 ring-blue-500/20 ring-offset-2 dark:ring-offset-slate-800 transition-all">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 ">
          {children}
        </main>

      </div >
    </div >
  );
}