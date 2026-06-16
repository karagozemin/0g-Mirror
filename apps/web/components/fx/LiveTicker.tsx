const items = [
  { label: "Chain ID", value: "16602 · Galileo" },
  { label: "Trace #1", value: "Verified ✓" },
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
    <div className="relative overflow-hidden border-y border-line bg-void/80 py-3 backdrop-blur-sm">
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-void to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-void to-transparent" />

      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={`${item.label}-${i}`} className="mx-6 inline-flex items-center gap-2 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan/60">{item.label}</span>
            <span className="font-mono text-silver/80">{item.value}</span>
            <span className="text-line">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
