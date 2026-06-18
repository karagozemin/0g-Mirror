"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#a855f7", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#e879f9"];

type Particle = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  drift: number;
  rise: number;
};

function createParticles(seed: number): Particle[] {
  return Array.from({ length: 42 }, (_, index) => {
    const random = (offset: number) => {
      const value = Math.sin(seed * 997 + index * 131 + offset * 17) * 10000;
      return value - Math.floor(value);
    };

    return {
      id: index,
      x: random(1) * 100,
      delay: random(2) * 0.2,
      duration: 1.1 + random(3) * 0.7,
      color: COLORS[index % COLORS.length],
      size: 4 + random(4) * 5,
      rotation: random(5) * 360,
      drift: (random(6) - 0.5) * 36,
      rise: 18 + random(7) * 28
    };
  });
}

export function ConfettiBurst({
  active,
  onDone
}: {
  active: boolean;
  onDone?: () => void;
}) {
  const burstKey = active ? Date.now() : 0;
  const particles = useMemo(() => (active ? createParticles(burstKey) : []), [active, burstKey]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => onDone?.(), 2100);
    return () => window.clearTimeout(timer);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={`${burstKey}-${particle.id}`}
          initial={{
            top: "52%",
            left: `${particle.x}%`,
            opacity: 0,
            rotate: particle.rotation,
            scale: 0.4
          }}
          animate={{
            top: `${particle.rise}%`,
            left: `${particle.x + particle.drift}%`,
            opacity: [0, 1, 1, 0],
            rotate: particle.rotation + 220,
            scale: [0.4, 1, 0.8, 0.2]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut"
          }}
          className="absolute rounded-[2px] shadow-[0_0_10px_rgba(168,85,247,0.35)]"
          style={{
            width: particle.size,
            height: particle.size * 0.55,
            backgroundColor: particle.color
          }}
        />
      ))}
    </div>
  );
}
