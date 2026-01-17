"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Bell, Search, ChevronRight } from "lucide-react";
import Sidebar from "../Components/SideBar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">

        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <div className="flex items-center gap-4">
            {/* Mobile Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center text-sm font-medium text-slate-500">
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
                      <span className="text-slate-900 font-semibold capitalize">
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

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-slate-500 focus-within:ring-2 ring-blue-500/20 ring-offset-2 transition-all ml-4">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}