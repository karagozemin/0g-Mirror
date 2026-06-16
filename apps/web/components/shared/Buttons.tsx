import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variants = {
  primary:
    "border-cyan/50 bg-cyan/12 text-white shadow-glow hover:border-cyan/80 hover:bg-cyan/18 hover:shadow-glow-lg",
  secondary:
    "border-line bg-white/[0.04] text-silver hover:border-silver/25 hover:bg-white/[0.08]",
  ghost: "border-transparent bg-transparent text-silver/70 hover:bg-white/[0.05] hover:text-white",
  danger: "border-danger/50 bg-danger/10 text-white hover:bg-danger/18 hover:shadow-[0_0_30px_rgba(248,113,113,0.2)]",
  gold: "border-gold/50 bg-gold/10 text-white hover:border-gold/70 hover:bg-gold/15 hover:shadow-glow-gold"
};

const sizes = {
  sm: "min-h-9 px-3 py-1.5 text-xs",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-13 px-7 py-3.5 text-base"
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
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${shimmer ? "btn-shimmer" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}
