"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Optimized AuthInput using forwardRef to allow parent components (like LoginForm)
 * to access the input value via useRef instead of tracking every keystroke with useState.
 */
const AuthInput = forwardRef(({ label, icon: Icon, type = "text", error, className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 w-full relative">
      {label && (
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`flex h-12 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent transition-all duration-200 ${
            Icon ? "pl-12" : ""
          } ${isPassword ? "pr-12" : ""} ${
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          } ${className}`}
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
      {error && (
        <p className="text-xs text-red-500 font-medium ml-1">{error}</p>
      )}
    </div>
  );
});

AuthInput.displayName = "AuthInput";

export default AuthInput;
