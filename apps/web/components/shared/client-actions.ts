"use client";

import type { CourtVerdict } from "@/lib/schemas/court-verdict";
import type { DecisionTrace } from "@/lib/schemas/decision-trace";
import { hashJson, shortHash } from "@/lib/utils/hash";
import { localNumericId } from "@/lib/utils/ids";
import { saveTrace, saveVerdict } from "@/lib/utils/local-store";

export const LOCAL_DEMO_MESSAGE = "Local demo mode — connect 0G credentials for real storage.";

type ApiError = {
  error?: string;
  code?: string;
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = (await response.json().catch(() => ({}))) as T & ApiError;

  if (!response.ok) {
    const message = payload.code === "MISSING_CONFIG" ? LOCAL_DEMO_MESSAGE : payload.error ?? "Request failed";
    throw new Error(message);
  }

  return payload;
}

// Local fallback behaviors removed: attestation must be performed by the connected wallet.

export async function ensureStoredTrace(trace: DecisionTrace) {
  if (trace.storage) return { trace, notice: null as string | null };
  // Attempt to upload to configured storage. If upload fails, return the error
  // notice — do not create or persist a local fallback storage location.
  try {
    const storage = await postJson<DecisionTrace["storage"]>("/api/storage/upload", {
      data: trace
    });
    const nextTrace = { ...trace, storage };
    saveTrace(nextTrace);
    return { trace: nextTrace, notice: null };
  } catch (error) {
    return { trace, notice: error instanceof Error ? error.message : "Storage upload failed" };
  }
}

export async function ensureRegisteredTrace(trace: DecisionTrace) {
  if (trace.attestation) return { trace, notice: null as string | null };
  if (!trace.storage) {
    const stored = await ensureStoredTrace(trace);
    trace = stored.trace;
    if (stored.notice) return { trace, notice: stored.notice };
  }

  // Attestation must be performed by the connected wallet. Do not fabricate
  // a local attestation here — return an instructive notice so the UI can
  // surface the proper wallet action.
  return { trace, notice: "Trace not attested. Connect your wallet and use the Register On-chain action to sign the attestation." };
}

export async function ensureStoredAndRegisteredTrace(trace: DecisionTrace) {
  const stored = await ensureStoredTrace(trace);
  const registered = await ensureRegisteredTrace(stored.trace);
  return {
    trace: registered.trace,
    notice: registered.notice ?? stored.notice
  };
}

export async function updateTraceStatus(trace: DecisionTrace) {
  // Do not persist a fabricated on-chain status locally. Persist the trace
  // record but instruct the user to submit verification status with their
  // connected wallet when the attestation exists.
  saveTrace(trace);
  return { trace, notice: trace.attestation ? "Submit verification status on-chain with your connected wallet." : "Trace is not attested — connect your wallet to submit status on-chain." };
}

export async function storeAndAttestVerdict(
  verdict: CourtVerdict,
  traceA: DecisionTrace,
  traceB: DecisionTrace,
  onProgress?: (phase: "storage" | "chain") => void
) {
  let nextVerdict = verdict;
  let notice: string | null = null;

  try {
    onProgress?.("storage");
    const storage = await postJson<CourtVerdict["storage"]>("/api/storage/upload", {
      data: verdict
    });
    nextVerdict = { ...nextVerdict, storage };
  } catch (error) {
    notice = error instanceof Error ? error.message : "Storage upload failed";
    // Do not generate a local storage fallback — return notice so the UI can
    // surface the error and require the user to retry with configured storage.
    return { verdict: nextVerdict, notice };
  }

  const traceIdA = traceA.attestation?.traceId;
  const traceIdB = traceB.attestation?.traceId;
  const winnerTraceId =
    verdict.verdict.winner === traceA.agent.name ? traceIdA : traceIdB;

  // Attestation must be performed by the connected wallet. Do not attempt to
  // synthesize or POST chain attestations from the client. Return the stored
  // verdict (if storage succeeded) and instruct the user to register the
  // verdict on-chain with their connected wallet.
  return { verdict: nextVerdict, notice: notice ?? "Connect your wallet and register the court verdict on-chain." };

  saveVerdict(nextVerdict);
  return { verdict: nextVerdict, notice };
}
