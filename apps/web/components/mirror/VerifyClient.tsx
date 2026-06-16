"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, ShieldCheck } from "lucide-react";
import { applyVerification } from "@/lib/ai/verifier";
import type { DecisionTrace } from "@/lib/schemas/decision-trace";
import { getTrace, saveTrace } from "@/lib/utils/local-store";
import { shortHash } from "@/lib/utils/hash";
import { Button } from "@/components/shared/Buttons";
import { Notice } from "@/components/shared/Notice";
import { Shell } from "@/components/shared/Shell";
import { StatusPill } from "@/components/shared/StatusPill";
import { TraceCard } from "@/components/shared/TraceCard";
import { MirrorBackground } from "@/components/fx/MirrorBackground";
import { updateTraceStatus } from "@/components/shared/client-actions";

export function VerifyClient({ traceId }: { traceId: string }) {
  const [trace, setTrace] = useState<DecisionTrace | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTrace(getTrace(traceId));
    setLoaded(true);
  }, [traceId]);

  async function replay() {
    if (!trace) return;
    setBusy(true);
    const verified = applyVerification(trace);
    const updated = await updateTraceStatus(verified);
    saveTrace(updated.trace);
    setTrace(updated.trace);
    setNotice(updated.notice ?? "Replay verification complete.");
    setBusy(false);
  }

  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-line">
        <MirrorBackground variant="subtle" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/mirror"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition hover:text-cyan/75"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Mirror
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan/70">Trace Verifier</p>
              <h1 className="mt-3 font-display text-4xl font-bold text-white">Replay Decision Trace</h1>
              <p className="mt-2 font-mono text-sm text-silver/45">ID: {traceId}</p>
            </div>
            {trace ? <StatusPill status={trace.verification.status} /> : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {notice ? (
          <div className="mb-6">
            <Notice variant="success">{notice}</Notice>
          </div>
        ) : null}

        {loaded && !trace ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-10 text-center"
          >
            <ShieldCheck className="mx-auto h-10 w-10 text-silver/30" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">Trace not found</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-silver/55">
              This verifier reads traces generated in this browser. Create a trace in Mirror Core or Olympus Arena first.
            </p>
            <Link href="/mirror" className="mt-6 inline-block">
              <Button variant="primary">Go to Mirror Core</Button>
            </Link>
          </motion.div>
        ) : null}

        {trace ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Meta label="Trace ID" value={trace.traceId} />
                <Meta label="Storage URI" value={trace.storage?.uri ?? "pending"} />
                <Meta label="Decision hash" value={shortHash(trace.hashes.decisionHash, 8)} />
                <Meta label="Attestation" value={String(trace.attestation?.traceId ?? "pending")} />
              </div>
              <Button onClick={replay} loading={busy} variant="primary" size="lg" className="mt-5">
                <RotateCcw className="h-4 w-4" />
                Replay Verification
              </Button>
            </div>

            <TraceCard trace={trace} />
          </motion.div>
        ) : null}
      </section>
    </Shell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-line/60 bg-black/20 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver/40">{label}</p>
      <p className="mt-1 truncate font-mono text-sm font-semibold text-white" title={value}>
        {value}
      </p>
    </div>
  );
}
