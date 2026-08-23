import React from "react";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
}) => {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-1/3 h-5" />
      <Skeleton variant="circular" className="w-6 h-6" />
    </div>
    <Skeleton variant="text" className="w-3/4 h-4" />
    <Skeleton variant="text" className="w-1/2 h-4" />
    <div className="flex items-center justify-between pt-2">
      <Skeleton variant="circular" className="w-7 h-7" />
      <Skeleton variant="text" className="w-20 h-4" />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <tr className="border-b border-slate-100 dark:border-slate-800">
    <td className="px-6 py-4"><Skeleton variant="text" className="w-24 h-4" /></td>
    <td className="px-6 py-4"><Skeleton variant="text" className="w-48 h-4" /></td>
    <td className="px-6 py-4"><Skeleton variant="circular" className="w-8 h-8" /></td>
    <td className="px-6 py-4"><Skeleton variant="text" className="w-16 h-4" /></td>
  </tr>
);
