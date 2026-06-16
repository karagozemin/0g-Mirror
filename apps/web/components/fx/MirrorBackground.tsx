"use client";

export function MirrorBackground({ variant = "default" }: { variant?: "default" | "arena" | "subtle" }) {
  const palette =
    variant === "arena"
      ? {
          primary: "rgba(251,191,36,0.15)",
          secondary: "rgba(251,146,60,0.1)",
          tertiary: "rgba(34,211,238,0.05)"
        }
      : variant === "subtle"
        ? {
            primary: "rgba(34,211,238,0.08)",
            secondary: "rgba(251,191,36,0.05)",
            tertiary: "rgba(255,255,255,0.03)"
          }
        : {
            primary: "rgba(34,211,238,0.14)",
            secondary: "rgba(251,191,36,0.08)",
            tertiary: "rgba(52,211,153,0.06)"
          };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 subtle-grid opacity-20" />
      <div className="absolute inset-0 hex-grid animate-hex-drift opacity-28 mix-blend-screen" />

      <div className="absolute left-1/2 top-10 h-[calc(100%-5rem)] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 opacity-35 animate-spin-slow [animation-duration:42s]" />

      <div
        className="absolute -left-1/4 -top-[10%] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${palette.primary}, transparent 72%)` }}
      />
      <div
        className="absolute -right-1/4 top-[18%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent 72%)` }}
      />
      <div
        className="absolute -bottom-1/4 left-[14%] h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${palette.tertiary}, transparent 72%)` }}
      />

      {variant !== "subtle" ? (
        <>
          <div className="mirror-beam left-1/2 -translate-x-1/2 opacity-75" />
          <div className="scan-line" />
          <div className="absolute inset-x-[10%] top-[22%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </>
      ) : null}

      {variant === "arena" ? (
        <div className="absolute inset-x-[14%] bottom-[18%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      ) : null}

      <div className="absolute inset-0 subtle-grid opacity-30" />
    </div>
  );
}
