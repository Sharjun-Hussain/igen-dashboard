"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Chrome,
  Command,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formschema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});

// --- UI COMPONENTS ---

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

const SocialButton = ({ icon: Icon, label }) => (
  <button className="flex items-center justify-center gap-3 w-full h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]">
    <Icon className="w-5 h-5 text-slate-700" />
    <span className="text-sm font-bold text-slate-700">{label}</span>
  </button>
);

// --- MAIN PAGE ---

export default function LoginPage() {
  const containerRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/app");
    }
  }, [status, router]);

  const form = useForm({
    resolver: zodResolver(formschema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully");
        // Check for callbackUrl in URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        const callbackUrl = searchParams.get("callbackUrl") || "/app"; // Default to /app instead of /
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }
  // GSAP Animations
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Panel Entrance
      tl.fromTo(
        ".left-panel",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
      ).fromTo(
        ".right-panel",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "<",
      );

      // Content Stagger
      tl.fromTo(
        ".stagger-in",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

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
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Welcome back to the future of shopping.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            "IgenShop has completely transformed how I buy tech. The delivery to
            Colombo was instant and the quality is unmatched."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
              <img
                src="https://i.pravatar.cc/150?img=33"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold">Dilshan Silva</p>
              <p className="text-sm text-slate-500">Verified Customer</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-500 stagger-in">
          © 2026 IgenShop LK. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT PANEL: LOGIN FORM (White) --- */}
      <div className="right-panel w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center items-center bg-white">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center lg:text-left stagger-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Log in to your account
            </h2>
            <p className="text-slate-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="space-y-6 stagger-in">
            {/* Inputs */}
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  {...form.register("email")}
                  className={form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 font-medium ml-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  {...form.register("password")}
                  className={form.formState.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500 font-medium ml-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="peer h-4 w-4 appearance-none rounded border border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                    />
                    <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-slate-600 cursor-pointer select-none"
                  >
                    Remember for 30 days
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
