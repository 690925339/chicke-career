"use client";
import { motion } from "framer-motion";

interface MagicDoorProps {
  countdown: string;
  destination: string;
}

export default function MagicDoor({ countdown, destination }: MagicDoorProps) {
  return (
    <div style={{ position: "relative", width: 180, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 底部温暖光晕 (Yolk Glow) */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)",
          zIndex: 0,
          top: "35%"
        }}
      />

      <svg width="160" height="220" viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 1, filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))" }}>
        {/* 蛋形门框 (Egg Shape Frame) */}
        <path 
          d="M80 10C40 10 10 60 10 130C10 180 40 210 80 210C120 210 150 180 150 130C150 60 120 10 80 10Z" 
          fill="#FFFBEB" 
          stroke="#FCD34D" 
          strokeWidth="8" 
        />
        
        {/* 鸡冠装饰 (Chicken Comb) */}
        <path 
          d="M65 15C65 5 75 0 80 0C85 0 95 5 95 15L80 25L65 15Z" 
          fill="#EF4444" 
        />

        {/* 内部魔法区域 (Egg Window) */}
        <mask id="eggMask">
          <path d="M80 20C45 20 20 65 20 130C20 175 45 200 80 200C115 200 140 175 140 130C140 65 115 20 80 20Z" fill="white" />
        </mask>
        
        <g mask="url(#eggMask)">
          {/* 背景 (深暖色) */}
          <rect x="0" y="0" width="160" height="220" fill="#78350F" />
          
          {/* 蛋黄魔法波动 (Yolk Portal) */}
          <motion.circle
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 0.9, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            cx="80" cy="110" r="60" fill="url(#yolkGrad)" 
          />
          
          {/* 星光点缀 */}
          <circle cx="50" cy="60" r="2" fill="#fff" opacity="0.6" />
          <circle cx="110" cy="150" r="1.5" fill="#fff" opacity="0.4" />
          <circle cx="80" cy="40" r="1.2" fill="#fff" opacity="0.5" />
        </g>
        
        {/* 鸡爪印作为“门把手” (Footprint handle) */}
        <g transform="translate(115, 130) scale(0.6)" fill="#F59E0B" opacity="0.8">
          <path d="M10 0L12 15L0 20L12 25L10 40L25 25L40 30L25 20L30 5L20 18L10 0Z" />
        </g>

        <defs>
          <radialGradient id="yolkGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 110) rotate(90) scale(90)">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* 倒计时覆盖层 */}
      <div style={{
        position: "absolute",
        zIndex: 10,
        textAlign: "center",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4
      }}>
        <div style={{
          fontSize: 12,
          color: "#FEF3C7",
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: 0.9,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)"
        }}>
          Searching
        </div>
        <div style={{
          fontSize: 22,
          color: "#fff",
          fontWeight: 900,
          fontFamily: "var(--font-mono, monospace)",
          textShadow: "0 0 15px rgba(99, 102, 241, 0.8), 0 2px 4px rgba(0,0,0,0.5)"
        }}>
          {countdown}
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "#6366F1",
            fontWeight: 800,
            background: "rgba(255,255,255,0.9)",
            padding: "2px 10px",
            borderRadius: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          {destination}
        </motion.div>
      </div>
    </div>
  );
}
