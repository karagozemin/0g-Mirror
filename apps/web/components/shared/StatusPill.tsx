import type { VerificationStatus } from "@/lib/schemas/decision-trace";

const styles: Record<VerificationStatus | "Local" | "OnChain", { class: string; pulse?: boolean }> = {
  Pending: { class: "border-white/10 bg-white/[0.04] text-silver/70" },
  Verified: { class: "border-mint/30 bg-mint/10 text-mint", pulse: true },
  Inconsistent: { class: "border-danger/30 bg-danger/10 text-danger", pulse: true },
  MissingEvidence: { class: "border-warn/30 bg-warn/10 text-warn" },
  Local: { class: "border-warn/30 bg-warn/10 text-warn" },
  OnChain: { class: "border-cyan/30 bg-cyan/10 text-cyan", pulse: true }
};

export function StatusPill({ status }: { status: VerificationStatus | "Local" | "OnChain" }) {
  const style = styles[status];
  const label = status
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace("On Chain", "On-chain")
    .replace("Missing Evidence", "Missing Evidence");

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${style.class}`}>
      {style.pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {label}
    </span>
  );
}
