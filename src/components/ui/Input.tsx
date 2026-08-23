import React, { forwardRef, useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  showPasswordMeter?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      showPasswordToggle = false,
      showPasswordMeter = false,
      type = "text",
      className = "",
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const actualType =
      showPasswordToggle && type === "password"
        ? isPasswordVisible
          ? "text"
          : "password"
        : type;

    // Password strength logic
    const calculateStrength = (pwd: string) => {
      if (!pwd) return { score: 0, label: "", color: "bg-slate-200" };
      let score = 0;
      if (pwd.length >= 6) score += 1;
      if (pwd.length >= 10) score += 1;
      if (/[A-Z]/.test(pwd)) score += 1;
      if (/[0-9]/.test(pwd)) score += 1;
      if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

      if (score <= 2) return { score, label: "Weak", color: "bg-rose-500" };
      if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
      if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
      return { score, label: "Strong", color: "bg-emerald-500" };
    };

    const strValue = typeof value === "string" ? value : "";
    const strength = showPasswordMeter ? calculateStrength(strValue) : null;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            value={value}
            onChange={onChange}
            className={`block w-full rounded-lg border text-sm transition-colors py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 ${
              leftIcon ? "pl-10" : ""
            } ${showPasswordToggle ? "pr-10" : ""} ${
              error
                ? "border-rose-500 focus:ring-rose-500 dark:border-rose-500"
                : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
            } ${className}`}
            {...props}
          />
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Password Strength Indicator */}
        {showPasswordMeter && strValue && strength && (
          <div className="space-y-1 pt-1">
            <div className="flex h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${(strength.score / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Password strength</span>
              <span className="font-medium">{strength.label}</span>
            </div>
          </div>
        )}

        {error ? (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
