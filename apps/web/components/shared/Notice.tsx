"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

export function Notice({
  children,
  variant = "warn"
}: {
  children: React.ReactNode;
  variant?: "warn" | "success" | "info";
}) {
  const styles = {
    warn: {
      wrapper: "border-warn/25 bg-[linear-gradient(180deg,rgba(251,191,36,0.1),rgba(251,191,36,0.04))] text-warn",
      icon: "border-warn/25 bg-warn/12 text-warn"
    },
    success: {
      wrapper: "border-mint/25 bg-[linear-gradient(180deg,rgba(52,211,153,0.1),rgba(52,211,153,0.04))] text-mint",
      icon: "border-mint/25 bg-mint/12 text-mint"
    },
    info: {
      wrapper: "border-cyan/25 bg-[linear-gradient(180deg,rgba(34,211,238,0.1),rgba(34,211,238,0.04))] text-cyan",
      icon: "border-cyan/25 bg-cyan/12 text-cyan"
    }
  };
  const icons = {
    warn: AlertTriangle,
    success: CheckCircle2,
    info: Info
  };
  const Icon = icons[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        className={`flex items-start gap-3 overflow-hidden rounded-[22px] border px-4 py-3.5 text-sm shadow-panel backdrop-blur-xl ${styles[variant].wrapper}`}
      >
        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${styles[variant].icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="leading-relaxed text-silver/90">{children}</span>
      </motion.div>
    </AnimatePresence>
  );
}
