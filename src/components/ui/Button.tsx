import React, { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:ring-offset-1 border text-sm disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

    const variantStyles = {
      primary:
        "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:text-white dark:border-blue-600 dark:hover:bg-blue-500 shadow-xs",
      secondary:
        "bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700/80 dark:hover:bg-slate-700",
      danger:
        "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 shadow-xs",
      outline:
        "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800",
      ghost:
        "bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
    };

    const sizeStyles = {
      sm: "px-2.5 py-1.5 text-xs gap-1.5",
      md: "px-3.5 py-2 text-sm gap-2",
      lg: "px-4.5 py-2.5 text-base gap-2.5",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
