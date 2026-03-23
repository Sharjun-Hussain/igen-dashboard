import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import DOMPurify from "isomorphic-dompurify";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function sanitizeHtml(html) {
  if (typeof html !== "string") return html;
  return DOMPurify.sanitize(html);
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  // Clean backslashes to forward slashes
  const cleanPath = path.replace(/\\/g, "/");

  // Remove /api/v1 from the base URL if it exists to get the root URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "");

  // Ensure the path starts with a slash if not already present
  const separator = cleanPath.startsWith("/") ? "" : "/";

  return `${baseUrl}${separator}${cleanPath}`;
}
