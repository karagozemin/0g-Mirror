import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"]
      },
      colors: {
        ink: "#030508",
        void: "#070b14",
        panel: "rgba(9, 14, 26, 0.82)",
        line: "rgba(148, 180, 255, 0.12)",
        "line-bright": "rgba(103, 232, 249, 0.35)",
        silver: "#c8d8f8",
        chrome: "#e2ebff",
        cyan: "#22d3ee",
        "cyan-dim": "#0891b2",
        gold: "#fbbf24",
        "gold-dim": "#d97706",
        mint: "#34d399",
        danger: "#f87171",
        warn: "#fbbf24",
        arena: "#a78bfa"
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.22)",
        "glow-lg": "0 0 80px rgba(34, 211, 238, 0.28)",
        "glow-gold": "0 0 40px rgba(251, 191, 36, 0.25)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.5)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.14), transparent), radial-gradient(ellipse 60% 40% at 90% 20%, rgba(167,139,250,0.08), transparent), linear-gradient(180deg, #030508 0%, #070b14 50%, #030508 100%)",
        shimmer:
          "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)",
        "beam-v":
          "linear-gradient(180deg, transparent, rgba(34,211,238,0.9) 45%, rgba(34,211,238,0.9) 55%, transparent)"
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "beam-pulse": "beamPulse 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "spin-slow": "spin 20s linear infinite",
        "ticker": "ticker 40s linear infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "scan": "scan 8s linear infinite",
        "hex-drift": "hexDrift 30s linear infinite",
        "border-flow": "borderFlow 3s linear infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" }
        },
        beamPulse: {
          "0%, 100%": { opacity: "0.5", filter: "blur(0px)" },
          "50%": { opacity: "1", filter: "blur(1px)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        hexDrift: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-44px, -44px)" }
        },
        borderFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        }
      }
    }
  },
  plugins: []
};

export default config;
