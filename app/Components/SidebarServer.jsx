
import React from "react";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import SidebarClient from "./SidebarClient";
import { authOptions } from "@/lib/auth";
// We pass icon names as strings to avoid "Functions cannot be passed directly to Client Components" errors

// --- MENU DATA ---
const ALL_MENU_GROUPS = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: "LayoutDashboard", href: "/app", permission: "view-dashboard" },
      { title: "Analytics", icon: "BarChart3", href: "/app/analytics", permission: "view-analytics" },
    ],
  },
  {
    label: "Product Catalog",
    items: [
      {
        title: "Products",
        icon: "ShoppingBag",
        href: "/app/products",
        permission: "view-products",
        submenu: [
          { title: "All Products", href: "/app/products" },
          { title: "Add Product", href: "/app/products/new" },
        ],
      },
      { title: "Categories", icon: "Layers", href: "/app/categories", permission: "view-categories" },
      { title: "Brands", icon: "Tag", href: "/app/brand", permission: "view-brands" },
    ],
  },
  {
    label: "Sales Management",
    items: [
      { title: "Orders", icon: "ShoppingCart", href: "/app/orders", badge: "12", permission: "view-orders" },
      { title: "Reviews", icon: "MessageSquare", href: "/app/reviews", permission: "view-reviews" },
    ],
  },
  {
    label: "Promotions",
    items: [
      { title: "Coupons", icon: "Tag", href: "/app/coupons", permission: "view-coupons" },
    ],
  },
  {
    label: "User Management",
    items: [
      { title: "Customers", icon: "Users", href: "/app/customers", permission: "view-customers" },
      { title: "Staff", icon: "ShieldCheck", href: "/app/users", permission: "manage-users" },
    ],
  },
  {
    label: "Design & Content",
    items: [
      {
        title: "Home Page",
        icon: "Monitor",
        href: "#",
        permission: "manage-cms",
        submenu: [
          { title: "Hero Banners", href: "/app/cms/hero" },
          { title: "Collections Grid", href: "/app/cms/collections" },
          { title: "Flash Sales", href: "/app/cms/flash-sales" },
          { title: "Promo Banners", href: "/app/cms/featured-sections" },
          { title: "Promises", href: "/app/cms/promises" },
          { title: "Product Showcase", href: "/app/cms/product-showcase" },
          { title: "Delivery Process", href: "/app/cms/delivery-process" },
          { title: "FAQs", href: "/app/cms/faqs" },
          { title: "Header", href: "/app/cms/header" },
          { title: "Footer", href: "/app/cms/footer" },
        ],
      },
      {
        title: "Shop Page",
        icon: "Monitor",
        href: "#",
        permission: "manage-cms",
        submenu: [
          { title: "Shop Hero", href: "/app/cms/shop" },
        ],
      },
      {
        title: "Contact Page",
        icon: "Monitor",
        href: "#",
        permission: "manage-cms",
        submenu: [
          { title: "Contact Hero", href: "/app/cms/contact" },
        ],
      },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Settings", icon: "Settings", href: "/app/settings", permission: "manage-settings" },
      { title: "Activity Logs", icon: "History", href: "/app/logs", permission: "view-logs" },
      { title: "Roles", icon: "ShieldCheck", href: "/app/roles", permission: "manage-roles" },
      { title: "Permissions", icon: "Lock", href: "/app/permissions", permission: "manage-permissions" },
    ],
  },
];

const SidebarServer = async ({ isOpen }) => {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar_collapsed")?.value === "true";

  // RBAC Filtering
  const userRoles = session?.user?.roles || [];
  const isAdmin = userRoles.some(role => role.name === "Admin" || role.name === "Super Admin");

  const filteredGroups = ALL_MENU_GROUPS.map(group => {
    const filteredItems = group.items.filter(item => {
      if (isAdmin) return true;
      
      // If item has no permission specified, show it to everyone (or define default behavior)
      if (!item.permission) return true;

      // Check if user has the specific permission
      // In this system, permissions seem to be attached to roles.
      // We'll check if any of the user's roles have the required permission.
      return userRoles.some(role => 
        role.permissions?.some(p => p.name === item.permission)
      );
    });

    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);

  return (
    <SidebarClient 
      menuGroups={filteredGroups} 
      initialCollapsed={isCollapsed} 
      session={session}
      isOpen={isOpen}
    />
  );
};

export default SidebarServer;
