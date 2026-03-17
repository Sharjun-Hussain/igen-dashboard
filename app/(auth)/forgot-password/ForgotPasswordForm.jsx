"use client";

import React, { useRef, useState } from "react";
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import AuthInput from "../../../components/auth/AuthInput";
import { gsap } from "gsap";

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailValue, setEmailValue] = useState(""); // Still need this for displaying in success state
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setEmailValue(email);
    
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
            Check your email
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            We sent a password reset link to
          </p>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-lg">{emailValue}</p>
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
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative">
      <a
        href="/login"
        className="absolute -top-20 left-0 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors stagger-in"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </a>

      <div className="form-content space-y-8">
        <div className="mb-8 stagger-in">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
            <KeyRound className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Forgot Password?
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 stagger-in">
          <AuthInput
            ref={emailRef}
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            required
            autoComplete="email"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 dark:shadow-none transition-all active:scale-[0.98] group"
          >
            Send Reset Link
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
