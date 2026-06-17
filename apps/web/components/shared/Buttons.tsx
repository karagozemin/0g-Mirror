"use client";

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
};

const variants = {
  primary:
    "border-beam/35 bg-[linear-gradient(135deg,rgba(168,85,247,0.2),rgba(76,29,149,0.16))] text-white shadow-[0_0_34px_rgba(168,85,247,0.2)] hover:border-beam/65 hover:bg-[linear-gradient(135deg,rgba(168,85,247,0.24),rgba(76,29,149,0.2))] hover:shadow-[0_0_52px_rgba(168,85,247,0.26)]",
  secondary: "border-white/10 bg-white/[0.04] text-silver hover:border-white/18 hover:bg-white/[0.06]",
  ghost: "border-transparent bg-transparent text-silver/72 hover:bg-white/[0.05] hover:text-white",
  danger:
    "border-danger/40 bg-danger/10 text-white hover:border-danger/60 hover:bg-danger/15 hover:shadow-[0_0_30px_rgba(248,113,113,0.2)]",
  gold:
    "border-gold/40 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(217,119,6,0.14))] text-white shadow-[0_0_34px_rgba(251,191,36,0.18)] hover:border-gold/65 hover:bg-[linear-gradient(135deg,rgba(251,191,36,0.22),rgba(217,119,36,0.18))] hover:shadow-[0_0_52px_rgba(251,191,36,0.24)]"
};

const sizes = {
  sm: "min-h-9 px-3.5 py-1.5 text-xs",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-14 px-7 py-3.5 text-base"
};

export function Button({
  className = "",
  variant = "secondary",
  size = "md",
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const shimmer = variant === "primary" || variant === "gold";

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border font-semibold tracking-[-0.01em] transition-all duration-300 will-change-transform active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${shimmer ? "btn-shimmer" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
