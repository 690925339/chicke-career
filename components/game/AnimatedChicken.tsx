"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export type ChickenState = "idle" | "hover" | "tap" | "checkin" | "skill" | "sleep";

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

interface AnimatedChickenProps {
  externalState?: ChickenState | null;
  onChickenClick?: () => void;
  careerColor?: string;
}

// State overlay effects
function StateOverlay({ state }: { state: ChickenState }) {
  const isSleep = state === "sleep";
  const isSkill = state === "skill";

  // --- Skill sparkles ---
  const sparkles = isSkill && (
    <>
      <div className="animate-skill-spark" style={{ position: "absolute", top: "10%", left: "5%", width: 8, height: 8, borderRadius: "50%", background: "#FFD700" }} />
      <div className="animate-skill-spark" style={{ position: "absolute", top: "5%", right: "10%", width: 6, height: 6, borderRadius: "50%", background: "#FFD700", animationDelay: "0.2s" }} />
      <div className="animate-skill-spark" style={{ position: "absolute", bottom: "20%", left: "3%", width: 6, height: 6, borderRadius: "50%", background: "#FFD700", animationDelay: "0.4s" }} />
      <div className="animate-skill-spark" style={{ position: "absolute", bottom: "25%", right: "5%", width: 8, height: 8, borderRadius: "50%", background: "#FFD700", animationDelay: "0.1s" }} />
    </>
  );

  // --- Sleep zzz ---
  const sleepZzz = isSleep && (
    <>
      <span className="animate-zzz" style={{ position: "absolute", top: "5%", right: "15%", fontSize: 11, color: "#9CA3AF", fontWeight: "bold" }}>z</span>
      <span className="animate-zzz" style={{ position: "absolute", top: "0%", right: "5%", fontSize: 14, color: "#9CA3AF", fontWeight: "bold", animationDelay: "0.7s" }}>z</span>
      <span className="animate-zzz" style={{ position: "absolute", top: "-8%", right: "-5%", fontSize: 17, color: "#9CA3AF", fontWeight: "bold", animationDelay: "1.4s" }}>Z</span>
    </>
  );

  return (
    <>
      {sparkles}
      {sleepZzz}
    </>
  );
}

export default function AnimatedChicken({
  externalState,
  onChickenClick,
}: AnimatedChickenProps) {
  const [state, setState] = useState<ChickenState>("idle");
  const [particles, setParticles] = useState<Particle[]>([]);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleIdRef = useRef(0);

  // Reset sleep timer on any activity
  const resetSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepTimerRef.current = setTimeout(() => {
      setState("sleep");
    }, 5000);
  }, []);

  useEffect(() => {
    resetSleepTimer();
    const handleActivity = () => {
      if (state === "sleep") setState("idle");
      resetSleepTimer();
    };
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("touchstart", handleActivity);
    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("touchstart", handleActivity);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [state, resetSleepTimer]);

  // React to external triggers (checkin, skill)
  useEffect(() => {
    if (!externalState) return;
    setState(externalState);
    resetSleepTimer();
    if (externalState === "checkin") {
      spawnParticles("🪙", 6);
    } else if (externalState === "skill") {
      spawnParticles("⚡", 4);
    }
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalState]);

  const spawnParticles = (emoji: string, count: number) => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: particleIdRef.current++,
      emoji,
      x: (Math.random() - 0.5) * 120,
      y: -(Math.random() * 80 + 20),
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  };

  const handleClick = () => {
    if (state === "sleep") {
      setState("idle");
      resetSleepTimer();
      return;
    }
    setState("tap");
    spawnParticles("❤️", 5);
    resetSleepTimer();
    onChickenClick?.();
    setTimeout(() => setState("idle"), 800);
  };

  // Framer motion variants
  const chickenVariants = {
    idle: {
      y: [0, -8, 0],
      rotate: 0,
      scale: 1,
      transition: {
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
        rotate: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    hover: {
      y: [0, -6, 0],
      rotate: [-3, 3, -3],
      scale: 1.05,
      transition: {
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
        rotate: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const },
        scale: { duration: 0.2 },
      },
    },
    tap: {
      y: [-20, 0],
      rotate: [0, -10, 10, 0],
      scale: [1.1, 1],
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
    checkin: {
      x: [-6, 6, -6, 6, -4, 4, 0],
      y: [-4, 0, -4, 0],
      scale: 1.1,
      transition: { duration: 0.6, ease: "easeInOut" as const },
    },
    skill: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      y: [-10, 0],
      transition: {
        rotate: { duration: 0.6, ease: "easeOut" as const },
        scale: { duration: 0.6, ease: "easeInOut" as const },
        y: { duration: 0.3 },
      },
    },
    sleep: {
      y: [0, -3, 0],
      rotate: [-5, 0],
      scale: 0.95,
      transition: {
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
        scale: { duration: 0.5 },
      },
    },
  };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 130, height: 173, overflow: "visible" }}>
      {/* Particle layer */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" as const }}
            style={{ position: "absolute", fontSize: 22, pointerEvents: "none", zIndex: 20, userSelect: "none" }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Chicken body - PNG image */}
      <motion.div
        animate={state}
        variants={chickenVariants}
        onHoverStart={() => { if (state === "idle") setState("hover"); }}
        onHoverEnd={() => { if (state === "hover") setState("idle"); }}
        onClick={handleClick}
        style={{ cursor: "pointer", zIndex: 5, userSelect: "none", position: "relative" }}
        whileTap={state !== "sleep" ? { scale: 0.92 } : {}}
      >
        <div style={{ position: "relative", width: 130, height: 173 }}>
          <Image
            src="/images/characters/main-chicken.png"
            alt="主角鸡"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
          <StateOverlay state={state} />
        </div>
      </motion.div>
    </div>
  );
}
