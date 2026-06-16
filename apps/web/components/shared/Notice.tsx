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
    warn: "border-warn/30 bg-warn/8 text-warn",
    success: "border-mint/30 bg-mint/8 text-mint",
    info: "border-cyan/30 bg-cyan/8 text-cyan"
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
        className={`flex items-start gap-3 overflow-hidden rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{children}</span>
      </motion.div>
    </AnimatePresence>
  );
}
