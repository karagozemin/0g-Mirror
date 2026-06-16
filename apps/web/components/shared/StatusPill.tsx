import type { VerificationStatus } from "@/lib/schemas/decision-trace";

const styles: Record<VerificationStatus | "Local" | "OnChain", { class: string; pulse?: boolean }> = {
  Pending: { class: "border-silver/20 bg-white/[0.04] text-silver/75" },
  Verified: { class: "border-mint/45 bg-mint/10 text-mint", pulse: true },
  Inconsistent: { class: "border-danger/45 bg-danger/10 text-danger", pulse: true },
  MissingEvidence: { class: "border-warn/45 bg-warn/10 text-warn" },
  Local: { class: "border-warn/45 bg-warn/10 text-warn" },
  OnChain: { class: "border-cyan/45 bg-cyan/10 text-cyan", pulse: true }
};

export function StatusPill({ status }: { status: VerificationStatus | "Local" | "OnChain" }) {
  const style = styles[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${style.class}`}>
      {style.pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {status}
    </span>
  );
}
