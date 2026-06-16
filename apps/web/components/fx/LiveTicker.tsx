const items = [
  { label: "Chain", value: "Galileo · 16602" },
  { label: "Trace #1", value: "Verified" },
  { label: "MirrorRegistry", value: "0x8c5C…9858" },
  { label: "Decision Hash", value: "0x7f17…a884" },
  { label: "0G Storage", value: "0g://0xe589…4aee" },
  { label: "Register Tx", value: "0x439d…23de" },
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
          <span
            key={`${item.label}-${i}`}
            className="mx-3 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver/45">{item.label}</span>
            <span className="font-mono text-sm text-white/88">{item.value}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_12px_rgba(34,211,238,0.65)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
