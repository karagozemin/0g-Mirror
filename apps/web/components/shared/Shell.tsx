"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Swords } from "lucide-react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/mirror", label: "Mirror Core" },
  { href: "/arena", label: "Olympus Arena" }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="relative min-h-screen bg-radial-grid text-silver">
      <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400 }}>
              <Image
                src="/0g-mirror-logo.png"
                alt="0G Mirror"
                width={140}
                height={44}
                className="h-9 w-auto transition-opacity group-hover:opacity-90 sm:h-10"
                priority
              />
            </motion.div>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-xl border border-line bg-white/[0.03] p-1 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-silver/60 hover:text-silver"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg border border-cyan/30 bg-cyan/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </span>
              <span className="font-mono text-xs text-silver/50">Galileo · 16602</span>
            </div>

            <Link
              href="/arena"
              className="btn-shimmer group inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-gold/70 hover:bg-gold/15 hover:shadow-glow-gold"
            >
              <Swords className="h-4 w-4 text-gold transition group-hover:rotate-12" />
              Arena
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
