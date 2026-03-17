"use client";

import React, { useRef, useState } from "react";
import { Lock, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthInput from "../../../components/auth/AuthInput";
import { gsap } from "gsap";

const ResetPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Simulate API call and success animation
    gsap.to(".form-content", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setIsSubmitted(true);
        gsap.fromTo(
          ".success-content",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
        );
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="success-content text-center space-y-6 w-full max-w-md">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50 dark:ring-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Password updated
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Your password has been successfully reset. Click below to log in securely.
          </p>
        </div>

        <div className="pt-6">
          <a
            href="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 dark:shadow-none transition-all active:scale-[0.98] group"
          >
            Continue to Login
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative">
      <div className="form-content space-y-8">
        <div className="mb-8 stagger-in">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Set new password
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Your new password must be different from previous used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 stagger-in">
          <AuthInput
            ref={passwordRef}
            label="New Password"
            type="password"
            placeholder="Create new password"
            icon={Lock}
            required
            autoComplete="new-password"
          />

          <AuthInput
            ref={confirmPasswordRef}
            label="Confirm Password"
            type="password"
            placeholder="Repeat new password"
            icon={Lock}
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 dark:shadow-none transition-all active:scale-[0.98] group mt-2"
          >
            Reset Password
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="text-center stagger-in">
          <a
            href="/login"
            className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
