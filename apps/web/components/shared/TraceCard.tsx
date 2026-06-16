"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Database, Fingerprint, Network, ShieldAlert } from "lucide-react";
import type { DecisionTrace } from "@/lib/schemas/decision-trace";
import { shortHash } from "@/lib/utils/hash";
import { StatusPill } from "@/components/shared/StatusPill";
import { ExplorerValue } from "@/components/shared/ExplorerValue";
import { traceDetailHref, txExplorerHref } from "@/lib/0g/explorer";

const agentAccent: Record<string, string> = {
  aegis: "border-cyan/30 from-cyan/8",
  nyx: "border-danger/30 from-danger/8",
  hermes: "border-mint/30 from-mint/8"
};

export function TraceCard({ trace, compact = false }: { trace: DecisionTrace; compact?: boolean }) {
  const agentKey = trace.agent.name.toLowerCase();
  const accent = agentAccent[agentKey] ?? "border-cyan/30 from-cyan/8";
  const chainId = trace.attestation?.chainId ?? Number(process.env.NEXT_PUBLIC_0G_CHAIN_ID ?? 16602);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`glass overflow-hidden rounded-2xl bg-gradient-to-br ${accent} to-transparent`}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <AgentAvatar name={trace.agent.name} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver/45">{trace.agent.role}</p>
              <h3 className="font-display text-xl font-bold text-white">{trace.agent.name}</h3>
            </div>
          </div>
          <StatusPill status={trace.verification.status} />
        </div>

        <div className="mt-5 rounded-xl border border-line bg-black/30 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CheckCircle2 className="h-4 w-4 text-cyan" />
            {trace.decision.label}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-silver/80">{trace.decision.output}</p>
          <p className="mt-3 border-t border-line/60 pt-3 text-sm italic text-silver/55">
            {trace.decision.publicRationale}
          </p>
        </div>

        <div className={`mt-4 grid gap-2 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
          <InfoLine
            icon={<Fingerprint className="h-3.5 w-3.5" />}
            label="Decision hash"
            value={shortHash(trace.hashes.decisionHash, 8)}
            href={traceDetailHref(trace.traceId)}
            external={false}
          />
          <InfoLine icon={<Database className="h-3.5 w-3.5" />} label="0G Storage URI" value={trace.storage?.uri ?? "pending"} />
          <InfoLine
            icon={<Network className="h-3.5 w-3.5" />}
            label="Register tx"
            value={shortHash(trace.attestation?.txHash ?? "pending", 8)}
            href={txExplorerHref(trace.attestation?.txHash, chainId)}
          />
          <InfoLine
            icon={<ShieldAlert className="h-3.5 w-3.5" />}
            label="Storage tx"
            value={shortHash(trace.storage?.txHash ?? "pending", 8)}
            href={txExplorerHref(trace.storage?.txHash, chainId)}
          />
          <InfoLine icon={<Network className="h-3.5 w-3.5" />} label="On-chain trace ID" value={String(trace.attestation?.traceId ?? "pending")} />
          <InfoLine icon={<ShieldAlert className="h-3.5 w-3.5" />} label="Replay result" value={trace.verification.replayResult ?? "not replayed"} />
        </div>

        {!compact ? (
          <div className="mt-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-silver/40">Evidence Used</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {trace.evidence.map((item) => (
                <div key={`${item.name}-${item.value}`} className="rounded-lg border border-line/60 bg-white/[0.02] px-3 py-2.5 transition hover:border-cyan/20 hover:bg-white/[0.04]">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-silver/40">{item.type}</p>
                  <p className="text-sm font-medium text-white">
                    {item.name}: <span className="font-mono text-silver/70">{item.value}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

function AgentAvatar({ name }: { name: string }) {
  const id = name.toLowerCase();
  const colors: Record<string, string> = {
    aegis: "from-cyan/30 to-cyan/5 border-cyan/40 text-cyan",
    nyx: "from-danger/30 to-danger/5 border-danger/40 text-danger",
    hermes: "from-mint/30 to-mint/5 border-mint/40 text-mint"
  };
  const cls = colors[id] ?? colors.aegis;

  return (
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br text-lg font-bold ${cls}`}>
      {name[0]}
    </div>
  );
}

function InfoLine({
  icon,
  label,
  value,
  href,
  external = true
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-line/50 bg-black/20 px-3 py-2">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-silver/40">
        <span className="text-cyan/60">{icon}</span>
        {label}
      </div>
      {href ? (
        <div className="mt-1">
          <ExplorerValue href={href} title={value} className="w-full justify-between px-2 py-1.5" external={external}>
            {value}
          </ExplorerValue>
        </div>
      ) : (
        <p className="mt-0.5 truncate font-mono text-xs text-silver/85" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}
