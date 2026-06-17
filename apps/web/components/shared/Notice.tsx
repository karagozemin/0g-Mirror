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
      wrapper: "border-beam/25 bg-[linear-gradient(180deg,rgba(168,85,247,0.1),rgba(76,29,149,0.05))] text-silver",
      icon: "border-beam/25 bg-beam/12 text-beam"
    },
    success: {
      wrapper: "border-beam/25 bg-[linear-gradient(180deg,rgba(168,85,247,0.1),rgba(76,29,149,0.05))] text-silver",
      icon: "border-beam/25 bg-beam/12 text-beam"
    },
    info: {
      wrapper: "border-beam/25 bg-[linear-gradient(180deg,rgba(168,85,247,0.1),rgba(76,29,149,0.05))] text-silver",
      icon: "border-beam/25 bg-beam/12 text-beam"
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
