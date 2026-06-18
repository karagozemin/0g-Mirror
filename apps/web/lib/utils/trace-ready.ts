import type { DecisionTrace } from "@/lib/schemas/decision-trace";

export function isTraceAppealReady(trace: DecisionTrace | null | undefined): boolean {
  if (!trace) return false;

  return Boolean(
    trace.storage?.uri &&
      trace.attestation?.traceId &&
      trace.verification.status !== "Pending" &&
      trace.verification.replayResult
  );
}
