import React from "react";
import { ShieldCheck } from "lucide-react";
import AuthAnimationWrapper from "./AuthAnimationWrapper";

/**
 * Server Component: AuthLayout
 * Provides the visual structure for auth pages.
 * Minimal client-side JS is used via AuthAnimationWrapper.
 */
const AuthLayout = ({ 
  children, 
  logoUrl, 
  dashboardTitle, 
  footerText,
  tagline = "Premium Tech, \nPersonalized Service.",
  description = "Experience the next level of mobile shopping with Igen. Quality products, reliable support, and a seamless shopping experience.",
  showTag = false,
  tagLabel = "Secure Access"
}) => {
  return (
    <AuthAnimationWrapper>
      {/* --- LEFT PANEL: BRANDING --- */}
      <div className="left-panel w-full lg:w-[45%] bg-[#1e293b] text-white p-8 lg:p-16 flex flex-col justify-between relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight stagger-in">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20 overflow-hidden p-1.5">
            <img 
              src={logoUrl || "/igen_mobiles_logo.png"} 
              alt={dashboardTitle || "Igen"} 
              className="w-full h-full object-contain" 
            />
          </div>
          {dashboardTitle || "Igen"}
        </div>

        {/* Middle Content */}
        <div className="max-w-md stagger-in my-12 lg:my-0">
          {showTag && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" /> {tagLabel}
            </div>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight whitespace-pre-line">
            {tagline}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {description}
          </p>
          <div className="mt-12 stagger-in">
            <a 
              href="https://igen.lk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-900/30"
            >
              Visit igen.lk
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-500 stagger-in">
          {footerText}
        </div>
      </div>

      {/* --- RIGHT PANEL --- */}
      <div className="right-panel w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center items-center bg-white dark:bg-slate-950">
        {children}
      </div>
    </AuthAnimationWrapper>
  );
};

export default AuthLayout;
