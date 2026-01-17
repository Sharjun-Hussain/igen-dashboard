"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
} from "lucide-react";

// --- REUSABLE INPUT COMPONENT ---
const Input = ({ label, className, icon: Icon, type = "text", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 w-full relative">
      {label && (
        <label className="text-sm font-semibold text-slate-800">{label}</label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={inputType}
          className={`flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all duration-200 ${
            Icon ? "pl-12" : ""
          } ${isPassword ? "pr-12" : ""} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function ResetPasswordPage() {
  const containerRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // GSAP Entrance
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Panel Entrance
      tl.fromTo(
        ".left-panel",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 }
      ).fromTo(
        ".right-panel",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "<"
      );

      // Content Stagger
      tl.fromTo(
        ".stagger-in",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Animate out form
    gsap.to(".form-content", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setIsSubmitted(true);
        // Animate in success
        gsap.fromTo(
          ".success-content",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
        );
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden font-sans"
    >
      {/* --- LEFT PANEL: BRANDING (Dark Blue) --- */}
      <div className="left-panel w-full lg:w-[45%] bg-[#1e293b] text-white p-8 lg:p-16 flex flex-col justify-between relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight stagger-in">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45" />
          </div>
          IgenShop
        </div>

        {/* Middle Content */}
        <div className="max-w-md stagger-in my-12 lg:my-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4" /> Account Security
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Secure your account.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Create a strong password to protect your personal details and order
            history. We recommend using a mix of letters, numbers, and symbols.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              Minimum 8 characters
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              One special character
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-500 stagger-in">
          © 2026 IgenShop LK. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT PANEL: FORM AREA (White) --- */}
      <div className="right-panel w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center items-center bg-white relative">
        <div className="max-w-md w-full relative">
          {!isSubmitted ? (
            /* --- STATE 1: RESET FORM --- */
            <div className="form-content space-y-8">
              <div className="mb-8 stagger-in">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Set new password
                </h2>
                <p className="text-slate-500">
                  Your new password must be different from previous used
                  passwords.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 stagger-in">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Create new password"
                  icon={Lock}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat new password"
                  icon={Lock}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] group mt-2"
                >
                  Reset Password
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              <div className="text-center stagger-in">
                <a
                  href="/login"
                  className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </a>
              </div>
            </div>
          ) : (
            /* --- STATE 2: SUCCESS MESSAGE --- */
            <div className="success-content text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Password updated
                </h2>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Your password has been successfully reset. Click below to log
                  in securely.
                </p>
              </div>

              <div className="pt-6">
                <a
                  href="/login"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] group"
                >
                  Continue to Login
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
