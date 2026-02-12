"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ShoppingCart,
  Settings,
  ChevronRight,
  LogOut,
  BarChart3,
  Megaphone,
  X,
  Layers,
  CreditCard,
  Truck,
  Sun,
  Moon,
  Lock,
  Monitor,
  Image as ImageIcon,
  Tag,
  MessageSquare,
  FileText,
  HelpCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Layers3 } from "lucide-react";

import { useGlobalSettings } from "../app/context/GlobalSettingsContext";

// --- CUSTOM SCROLLBAR CSS ---
const SCROLLBAR_STYLES = `
  .custom-tiny-scrollbar::-webkit-scrollbar {
    width: 3px;
  }
  .custom-tiny-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-tiny-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 20px;
  }
  .dark .custom-tiny-scrollbar::-webkit-scrollbar-thumb {
    background-color: #1e293b;
  }
  .custom-tiny-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }
`;

// --- MENU DATA ---
const MENU_GROUPS = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/app" },
      { title: "Analytics", icon: BarChart3, href: "/app/analytics" },
    ],
  },
  {
    label: "Storefront (CMS)",
    items: [
      {
        title: "Landing Page",
        icon: Monitor,
        href: "#",
        submenu: [
          { title: "Hero Banners", href: "/app/cms/hero" }, // Top slider management
          { title: "New Arrivals", href: "/app/cms/" },
          { title: "Flash Sales", href: "/app/cms/flash-sales" },
          { title: "Featured Sections", href: "/app/cms/featured-sections" },
          { title: "Promises", href: "/app/cms/promises" },
          { title: "Product Showcase", href: "/app/cms/product-showcase" },
          { title: "Delivery Process", href: "/app/cms/delivery-process" },
          { title: "FAQs", href: "/app/cms/faqs" },
          { title: "Header", href: "/app/cms/header" },
          { title: "Footer", href: "/app/cms/footer" },
        ],
      },
      // {
      //   title: "Content Hub",
      //   icon: FileText,
      //   href: "#",
      //   submenu: [
      //     { title: "Tech Blog", href: "/app/blog" },
      //     { title: "Pages (About/Terms)", href: "/app/pages" },
      //     { title: "FAQs", href: "/app/faqs" },
      //   ],
      // },
      { title: "Testimonials", icon: MessageSquare, href: "/app/reviews" },
    ],
  },
  {
    label: "Catalog Management",
    items: [
      {
        title: "Products",
        icon: ShoppingBag,
        href: "/app/products",
        submenu: [
          { title: "All Products", href: "/app/products" },
          { title: "Add Product", href: "/app/products/new" },
        ],
      },
      { title: "Categories", icon: Layers, href: "/app/categories" },
      { title: "Brands", icon: Tag, href: "/app/brand" },
    ],
  },
  {
    label: "Sales & Orders",
    items: [
      { title: "Orders", icon: ShoppingCart, href: "/app/orders", badge: "12" },
      // { title: "Shipments", icon: Truck, href: "/app/shipments" },
      // { title: "Returns/Refunds", icon: CreditCard, href: "/app/returns" },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        title: "Promotions",
        icon: Megaphone,
        href: "#",
        submenu: [
          // { title: "Flash Deals", href: "/app/marketing/flash-sales" }, // For 'Deals of the Week' countdowns
          { title: "Coupons", href: "/app/coupons" },
          // { title: "Bundles", href: "/app/marketing/bundles" },
        ],
      },
      { title: "Customers", icon: Users, href: "/app/customers" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", icon: Settings, href: "/app/settings" },
      { title: "Roles", icon: ShieldCheck, href: "/app/roles" },
      { title: "Permissions", icon: Lock, href: "/app/permissions" },
      { title: "Staff", icon: ShieldCheck, href: "/app/users" },
    ],
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { businessName, logoUrl, footerText } = useGlobalSettings();
  const [openSubmenu, setOpenSubmenu] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-expand menu based on current path
  useEffect(() => {
    for (const group of MENU_GROUPS) {
      for (const item of group.items) {
        if (item.submenu && item.submenu.some((sub) => sub.href === pathname)) {
          setOpenSubmenu(item.title);
        }
      }
    }
  }, [pathname]);

  const toggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? "" : title);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style>{SCROLLBAR_STYLES}</style>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-white dark:bg-slate-950 
          border-r border-slate-200 dark:border-slate-800
          text-slate-600 dark:text-slate-300
          transition-transform duration-300 ease-in-out shadow-2xl
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* 1. BRAND LOGO */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link href="/app" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={businessName} className="w-full h-full object-cover" />
              ) : (
                <Layers className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none text-slate-900 dark:text-white truncate max-w-[120px]">
                {businessName}
              </h1>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
                Admin Dashboard
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-tiny-scrollbar">
          {MENU_GROUPS.map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, index) => {
                  const isActive = pathname === item.href;
                  const hasSubmenu = item.submenu;
                  const isSubmenuOpen = openSubmenu === item.title;
                  const isParentActive =
                    hasSubmenu &&
                    item.submenu.some((sub) => sub.href === pathname);

                  return (
                    <div key={index}>
                      {/* Main Item */}
                      {hasSubmenu ? (
                        <button
                          onClick={() => toggleSubmenu(item.title)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                            ${
                              isSubmenuOpen || isParentActive
                                ? "bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-white"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              className={`w-5 h-5 ${isParentActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-white"}`}
                            />
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isSubmenuOpen
                                ? "rotate-90 text-indigo-600 dark:text-indigo-400"
                                : "text-slate-400"
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                            ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-white"}`}
                            />
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}

                      {/* Submenu Items */}
                      {hasSubmenu && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isSubmenuOpen
                              ? "max-h-96 opacity-100 mt-1"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pl-[1.35rem] ml-2.5 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                            {item.submenu.map((sub, idx) => (
                              <Link
                                key={idx}
                                href={sub.href}
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors relative
                                  ${
                                    pathname === sub.href
                                      ? "text-indigo-600 dark:text-white font-medium bg-slate-50 dark:bg-slate-800/50 before:absolute before:left-[-11px] before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-600 dark:before:bg-indigo-500"
                                      : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                  }`}
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. USER FOOTER & THEME TOGGLE */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer group mb-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop"
                alt="Admin"
                loading="lazy"
                className="w-9 h-9 rounded-lg object-cover"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {session?.user?.email || "admin@igen.com"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Moon className="w-4 h-4" /> Dark Mode
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" /> Light Mode
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
