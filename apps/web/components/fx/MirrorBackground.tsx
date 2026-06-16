"use client";

export function MirrorBackground({ variant = "default" }: { variant?: "default" | "arena" | "subtle" }) {
  const accent = variant === "arena" ? "rgba(251,191,36,0.06)" : "rgba(34,211,238,0.06)";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 hex-grid animate-hex-drift opacity-60" />
      <div className="absolute inset-0 hex-grid opacity-40" />

      <div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.05), transparent 70%)" }}
      />

      {variant !== "subtle" ? (
        <>
          <div className="mirror-beam left-1/2 -translate-x-1/2 opacity-60" />
          <div className="scan-line" />
        </>
      ) : null}

      <div className="absolute inset-0 subtle-grid opacity-30" />
    </div>
  );
}
