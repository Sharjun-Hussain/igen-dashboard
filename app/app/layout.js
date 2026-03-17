import AdminLayoutClient from "./Components/AdminLayoutClient";
import SidebarServer from "../Components/SidebarServer";
import { cookies } from "next/headers";

// --- SERVER-SIDE METADATA ---
// This ensures that the title and favicon are stable from the first byte of HTML.
export async function generateMetadata() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const BASE_URL = API_BASE ? new URL(API_BASE).origin : "";

  try {
    // If you have a public endpoint, use it here. 
    // Otherwise, this will fetch at request time.
    const res = await fetch(`${API_BASE}/admin/settings`, {
      cache: 'no-store', // or 'force-cache' for build-time if the API is open
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data || {};
      const title = data.admin_dashboard_title || "Admin Dashboard";
      const favicon = data.site_favicon ? (data.site_favicon.startsWith('http') ? data.site_favicon : `${BASE_URL}/${data.site_favicon}`) : "/favicon.ico";

      return {
        title: title,
        icons: {
          icon: favicon,
          shortcut: favicon,
        }
      };
    }
  } catch (err) {
    console.error("Failed to fetch metadata server-side:", err);
  }

  return {
    title: "Admin Dashboard | Igen",
  };
}

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar_collapsed")?.value === "true";

  return (
    <AdminLayoutClient
      initialCollapsed={isCollapsed}
      sidebar={<SidebarServer />}
    >
      {children}
    </AdminLayoutClient>
  );
}