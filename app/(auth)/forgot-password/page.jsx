"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

// --- REUSABLE INPUT ---
const Input = ({ label, className, icon: Icon, ...props }) => (
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
        className={`flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all duration-200 ${
          Icon ? "pl-12" : ""
        } ${className}`}
        {...props}
      />
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function ForgotPasswordPage() {
  const containerRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

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

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    if (email) {
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
    }
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
            <ShieldCheck className="w-4 h-4" /> Secure Recovery
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Don't worry, it happens to the best of us.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            We'll send you a secure link to reset your password and get you back
            to shopping in no time.
          </p>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-500 stagger-in">
          © 2026 IgenShop LK. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT PANEL: FORM AREA (White) --- */}
      <div className="right-panel w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center items-center bg-white relative">
        <div className="max-w-md w-full relative">
          {/* Back Button */}
          <a
            href="/login"
            className="absolute -top-20 left-0 text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors stagger-in"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </a>

          {!isSubmitted ? (
            /* --- STATE 1: EMAIL FORM --- */
            <div className="form-content space-y-8">
              <div className="mb-8 stagger-in">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <KeyRound className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-slate-500">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 stagger-in">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] group"
                >
                  Send Reset Link
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          ) : (
            /* --- STATE 2: SUCCESS MESSAGE --- */
            <div className="success-content text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Check your email
                </h2>
                <p className="text-slate-500 mb-2">
                  We sent a password reset link to
                </p>
                <p className="font-bold text-slate-900 text-lg">{email}</p>
              </div>

              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  try again
                </button>
                .
              </p>

              <div className="pt-6">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Log In
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
