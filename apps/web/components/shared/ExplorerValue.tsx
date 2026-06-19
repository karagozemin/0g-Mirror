"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MotionLink = motion(Link);

export function ExplorerValue({
  href,
  children,
  className = "",
  title,
  external = true,
  copyValue
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  external?: boolean;
  copyValue?: string;
}) {
  const [copied, setCopied] = useState(false);
  const valueToCopy = copyValue ?? title ?? (typeof children === "string" ? children : "");
  const sharedClassName = `group inline-flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-beam/20 bg-beam/8 px-3 py-2 text-left transition hover:border-beam/40 hover:bg-beam/12 ${className}`;

  async function copy() {
    if (!valueToCopy) return;
    await navigator.clipboard?.writeText(valueToCopy);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  const content = (
    <>
      <span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold text-white/90">{children}</span>
      {href ? (
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-beam/80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-beam" />
      ) : null}
    </>
  );

  return (
    <span className="inline-flex min-w-0 w-full items-center gap-2">
      {href && !external ? (
      <MotionLink
        href={href}
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 520, damping: 28 }}
        className={sharedClassName}
        title={title}
        target="_blank"
        data-new-tab="true"
      >
        {content}
      </MotionLink>
      ) : href ? (
        <motion.a
          href={href}
          target="_blank"
          rel="noreferrer"
          data-new-tab="true"
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 520, damping: 28 }}
          className={sharedClassName}
          title={title}
        >
          {content}
        </motion.a>
      ) : (
        <motion.span
          whileHover={{ y: -1, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 520, damping: 28 }}
          className={sharedClassName}
          title={title}
        >
          {content}
        </motion.span>
      )}
      {valueToCopy ? (
        <motion.button
          type="button"
          onClick={copy}
          whileHover={{ y: -1, scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-silver/65 transition hover:border-beam/35 hover:bg-beam/10 hover:text-beam"
          title={copied ? "Copied" : "Copy value"}
          aria-label={copied ? "Copied" : "Copy value"}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-mint" /> : <Copy className="h-3.5 w-3.5" />}
        </motion.button>
      ) : null}
    </span>
  );
}
