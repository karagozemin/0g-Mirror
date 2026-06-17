"use client";

import { motion } from "framer-motion";
import { chainExplorerAddressUrl, txExplorerHref } from "@/lib/0g/explorer";

const items = [
  { label: "Chain", value: "Galileo · 16602" },
  { label: "Trace #1", value: "Verified" },
  { label: "MirrorRegistry", value: "0x8c5C403994CC7a5A469bBF82904e504060109858", href: chainExplorerAddressUrl("0x8c5C403994CC7a5A469bBF82904e504060109858") },
  { label: "Decision Hash", value: "0x7f1775e02212e8764cefc347a09df82aa33ebe05d377e2bb496fb9c2fe1da884" },
  { label: "0G Storage", value: "0g://0xe589…4aee" },
  { label: "Register Tx", value: "0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1cc996a76e45137f3b23de", href: txExplorerHref("0x439d5a8bca2bd17b051738d12124b90a0c5cb3ab5c1cc996a76e45137f3b23de") },
  { label: "Status", value: "On-chain attested" },
  { label: "Replay", value: "Consistent" }
];

export function LiveTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/8 bg-[rgba(5,9,16,0.82)] py-4 backdrop-blur-xl">
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#050916] to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#050916] to-transparent" />

      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <motion.a
            key={`${item.label}-${i}`}
            href={item.href}
            target={item.href ? "_blank" : undefined}
            rel={item.href ? "noreferrer" : undefined}
            whileHover={item.href ? { y: -1, scale: 1.01 } : undefined}
            whileTap={item.href ? { scale: 0.985 } : undefined}
            transition={{ type: "spring", stiffness: 520, damping: 30 }}
            className={`mx-3 inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${item.href ? "border-white/10 bg-white/[0.04] text-white/85 hover:border-beam/35 hover:bg-white/[0.06]" : "border-white/10 bg-white/[0.04] text-silver/80"}`}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver/45">{item.label}</span>
            <span className={`font-mono text-sm ${item.href ? "text-white/92" : "text-white/88"}`}>{item.value}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${item.href ? "bg-gold shadow-[0_0_12px_rgba(251,191,36,0.55)]" : "bg-white/40"}`} />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
