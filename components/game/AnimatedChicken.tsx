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

const DIALOGUES: Record<ChickenState, string[]> = {
  idle: ["好想去旅行啊~", "摸摸我有惊喜哦", "灵气满满的一天！", "今天也要加油哦！"],
  hover: ["要做什么呢？", "别挠我痒痒~", "嘿嘿~"],
  tap: ["哎呀！", "好轻柔呀~", "❤️"],
  checkin: ["签到成功！又是努力的一天", "鸡币拿好哦！"],
  skill: ["灵气爆发！", "看我大显身威！", "命运...已觉醒！"],
  sleep: ["呼... 咕...", "zZZ...", "梦到好多虫子..."],
};

// Dialogue Bubble Component
function DialogueBubble({ text }: { text: string | null }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          style={{
            position: "absolute",
            top: -50,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.95)",
            padding: "8px 16px",
            borderRadius: "16px 16px 16px 4px",
            fontSize: 13,
            fontWeight: 700,
            color: "#4C1D95",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 30,
            whiteSpace: "nowrap",
            border: "1px solid #DDD6FE",
          }}
        >
          {text}
          {/* Bubble tail */}
          <div style={{
            position: "absolute",
            bottom: -6,
            left: 10,
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid rgba(255, 255, 255, 0.95)",
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AnimatedChicken({
  externalState,
  onChickenClick,
}: AnimatedChickenProps) {
  const [state, setState] = useState<ChickenState>("idle");
  const [speech, setSpeech] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<Record<string, string>>({});
  const [particles, setParticles] = useState<Particle[]>([]);
  const [headOffset, setHeadOffset] = useState({ x: 0, y: 0, rotate: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleIdRef = useRef(0);

  // 视线追踪逻辑
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || state === "sleep") return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = (e.clientX - centerX) / 20;
      const dy = (e.clientY - centerY) / 20;
      
      // 限制偏移量
      const range = 8;
      const limitedX = Math.max(-range, Math.min(range, dx));
      const limitedY = Math.max(-range, Math.min(range, dy));
      
      setHeadOffset({ 
        x: limitedX, 
        y: limitedY,
        rotate: limitedX * 0.5 
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [state]);

  const showSpeech = useCallback((text?: string) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    const options = DIALOGUES[state];
    const newText = text || options[Math.floor(Math.random() * options.length)];
    setSpeech(newText);
    speechTimerRef.current = setTimeout(() => setSpeech(null), 3000);
  }, [state]);

  // Random idle speech
  useEffect(() => {
    if (state !== "idle") return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) showSpeech();
    }, 8000);
    return () => clearInterval(interval);
  }, [state, showSpeech]);

  // Mapping state to image paths
  const imageMap: Record<ChickenState, string> = {
    idle: "/images/characters/chicken-idle.png",
    hover: "/images/characters/chicken-hover.png",
    tap: "/images/characters/chicken-tap.png",
    checkin: "/images/characters/chicken-checkin.png",
    skill: "/images/characters/chicken-skill.png",
    sleep: "/images/characters/chicken-sleep.png",
  };

  // Helper to remove white background using Canvas
  const processImage = useCallback((url: string) => {
    if (processedImages[url]) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove near-white pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 245 && g > 245 && b > 245) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImages(prev => ({ ...prev, [url]: canvas.toDataURL() }));
    };
  }, [processedImages]);

  // Pre-process ALL images on mount
  useEffect(() => {
    Object.values(imageMap).forEach(url => processImage(url));
  }, [processImage]);

  // Reset sleep timer on any activity
  const resetSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepTimerRef.current = setTimeout(() => {
      setState("sleep");
    }, 15000); // 15s to sleep
  }, []);

  useEffect(() => {
    resetSleepTimer();
    const handleActivity = () => {
      if (state === "sleep") {
        setState("idle");
        showSpeech("醒啦！灵气满满~");
      }
      resetSleepTimer();
    };
    document.addEventListener("mousedown", handleActivity);
    document.addEventListener("touchstart", handleActivity);
    return () => {
      document.removeEventListener("mousedown", handleActivity);
      document.removeEventListener("touchstart", handleActivity);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [state, resetSleepTimer, showSpeech]);

  // React to external triggers (checkin, skill)
  useEffect(() => {
    if (!externalState) return;
    setState(externalState);
    showSpeech();
    resetSleepTimer();
    if (externalState === "checkin") {
      spawnParticles("coin", 6);
    } else if (externalState === "skill") {
      spawnParticles("bolt", 4);
    }
    const timer = setTimeout(() => setState("idle"), 2500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalState]);

  const spawnParticles = (type: "heart" | "coin" | "bolt", count: number) => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: particleIdRef.current++,
      emoji: type, // Reusing emoji field as 'type'
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
      showSpeech("太阳晒屁股啦~");
      resetSleepTimer();
      return;
    }
    setState("tap");
    showSpeech();
    spawnParticles("heart", 5);
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
      y: [-25, 0],
      rotate: [0, -10, 10, 0],
      scale: [1.15, 1],
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
      scale: [1, 1.3, 1],
      y: [-20, 0],
      transition: {
        rotate: { duration: 0.6, ease: "easeOut" as const },
        scale: { duration: 0.6, ease: "easeInOut" as const },
        y: { duration: 0.3 },
      },
    },
    sleep: {
      y: [0, -3, 0],
      rotate: [-5, 0],
      scale: 0.92,
      transition: {
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
        scale: { duration: 0.5 },
      },
    },
  };

  const currentImgSrc = processedImages[imageMap[state]] || imageMap[state];

  return (
    <div 
      ref={containerRef}
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 130, height: 173, overflow: "visible" }}
    >
      {/* Speech Bubble */}
      <DialogueBubble text={speech} />
      
      {/* Particle layer */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.5, rotate: p.x > 0 ? 45 : -45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" as const }}
            style={{ position: "absolute", pointerEvents: "none", zIndex: 20, userSelect: "none" }}
          >
            {p.emoji === "heart" && (
              <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, filter: "drop-shadow(0 0 4px rgba(251, 113, 133, 0.6))" }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FB7185" />
              </svg>
            )}
            {p.emoji === "bolt" && (
              <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))" }}>
                <path d="M13 3L4 14H11V21L20 10H13V3Z" fill="#FBBF24" />
              </svg>
            )}
            {p.emoji === "coin" && (
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))" }}>
                <circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                <path d="M12 7V17M9 12H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Chicken body - Pre-render Image Stack for Instant Swap (Flash-like) */}
      <motion.div
        key={state} // Trigger animation on state change
        initial={{ scale: 0.9, y: 5 }}
        animate={{
          ...chickenVariants[state],
          x: headOffset.x,
          // 这里的 y 包含了 variant 的基础值和 headOffset 的偏移
          y: (Array.isArray((chickenVariants[state] as any).y) ? 0 : ((chickenVariants[state] as any).y || 0)) + headOffset.y,
          rotate: (Array.isArray((chickenVariants[state] as any).rotate) ? 0 : ((chickenVariants[state] as any).rotate || 0)) + headOffset.rotate,
          // 如果 variants 里没有 scale，默认为 1
          scale: (chickenVariants[state] as any).scale || 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 20,
          scale: { type: "spring", stiffness: 500, damping: 15 }
        }}
        onHoverStart={() => { if (state === "idle") { setState("hover"); showSpeech(); } }}
        onHoverEnd={() => { if (state === "hover") setState("idle"); }}
        onClick={handleClick}
        style={{ cursor: "pointer", zIndex: 5, userSelect: "none", position: "relative" }}
        whileTap={state !== "sleep" ? { scale: 0.95 } : {}}
      >
        <div style={{ position: "relative", width: 130, height: 173 }}>
          {/* 所有图片预渲染，解决白底闪烁与加载延迟 */}
          {(Object.entries(imageMap) as [ChickenState, string][]).map(([s, url]) => (
            <div 
              key={s} 
              style={{ 
                position: "absolute", 
                inset: 0, 
                display: state === s ? "block" : "none",
                // 这里的关键：即使隐藏也会利用 processedImages 缓存
              }}
            >
              <Image
                src={processedImages[url] || url}
                alt={s}
                fill
                style={{ 
                  objectFit: "contain",
                  filter: !processedImages[url] ? "brightness(1.1) contrast(1.1) multiply" : "none" 
                }}
                priority={s === "idle" || s === state}
              />
            </div>
          ))}
          <StateOverlay state={state} />
        </div>
      </motion.div>
    </div>
  );
}
