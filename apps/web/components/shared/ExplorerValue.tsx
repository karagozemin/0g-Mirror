"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const MotionLink = motion(Link);

export function ExplorerValue({
  href,
  children,
  className = "",
  title,
  external = true
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  external?: boolean;
}) {
  const sharedClassName = `group inline-flex min-w-0 items-center gap-2 rounded-xl border border-beam/20 bg-beam/8 px-3 py-2 text-left transition hover:border-beam/40 hover:bg-beam/12 ${className}`;

  if (!external) {
    return (
      <MotionLink
        href={href}
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 520, damping: 28 }}
        className={sharedClassName}
        title={title}
      >
        <span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-white/90">{children}</span>
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-beam/80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-beam" />
      </MotionLink>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      className={sharedClassName}
      title={title}
    >
      <span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-white/90">{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-beam/80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-beam" />
    </motion.a>
  );
}
