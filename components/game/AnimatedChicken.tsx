"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SFX, playSFX } from "@/lib/audio";

/**
 * 主角鸡 4x4 雪碧图帧映射 (索引 0-15)
 * [0] 闲置      [1] 右脸被戳   [2] 惊讶      [3] 生气
 * [4] 左脸被戳   [5] 右脸戳(变) [6] 眩晕/发抖  [7] 郁闷
 * [8] 撅嘴      [9] 亲亲      [10] 兴奋/摇摆 [11] 挥手
 * [12] 跑动     [13] 叹气      [14] 思考      [15] 斜眼
 */

export type ChickenState = "idle" | "hover" | "tap" | "checkin" | "skill" | "sleep" | "eating" | "sad";

interface AnimatedChickenProps {
  externalState?: ChickenState | null;
  onChickenClick?: () => void;
  careerColor?: string;
}

// 动画序列：[帧索引, 持续时间ms]
const SEQUENCES: Record<string, [number, number][]> = {
  IDLE: [[0, 3000]],
  FULL_ACTION: [
    [0, 80], [1, 80], [2, 80], [3, 80],
    [4, 80], [5, 80], [6, 80], [7, 80],
    [8, 80], [9, 80], [10, 80], [11, 80],
    [12, 80], [13, 80], [14, 80], [15, 80],
    [0, 0]
  ],
  TAP_REACT: [[1, 150], [2, 400], [0, 0]],
  TAP_LEFT: [[4, 150], [6, 300], [13, 300], [0, 0]],
  ANGRY: [[3, 500], [7, 500], [0, 0]],
  SKILL: [[10, 200], [11, 200], [10, 200], [11, 200], [2, 600], [0, 0]],
  EATING: [[9, 200], [14, 200], [9, 200], [14, 200], [11, 400], [0, 0]],
  SLEEP: [[7, 2000]],
  SAD: [[7, 2000]],
  HOVER: [[15, 200], [0, 200]],
};

const DIALOGUES: Record<string, string[]> = {
  idle: ["好想去探险啊~", "摸摸我有惊喜哦", "灵气满满！"],
  tap: ["哎呀！", "好痒呀~", "别挠我啦~", "❤️"],
  skill: ["灵气爆发！", "看我大显身威！"],
  sleep: ["呼... 咕...", "zZZ..."],
  eating: ["真香！🥚", "吧唧吧唧..."],
  sad: ["呜呜... 别召回我嘛", "我还想继续旅行...", "再待一会儿好不好？"],
};

/**
 * 利用 SVG 容器包裹独立帧图片
 * 保持“矢量化”渲染的同时，使用拆分后的 16 张独立图片
 */
function ChickenFrame({ 
  index, 
  careerColor = "transparent" 
}: { 
  index: number; 
  careerColor?: string 
}) {
  return (
    <div 
      style={{ 
        width: "100%", 
        height: "100%",
        position: "relative",
        filter: "none"
      }}
    >
      <img
        src={`/images/characters/chicken-frame-${index}.png`}
        alt={`frame-${index}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block"
        }}
      />
    </div>
  );
}

export default function AnimatedChicken({
  externalState,
  onChickenClick,
  careerColor = "#FCD34D",
}: AnimatedChickenProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [speech, setSpeech] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const speechTimerRef = useRef<any>(null);
  const animationLock = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 播放动画序列的核心逻辑
  const playSequence = useCallback(async (seqName: keyof typeof SEQUENCES) => {
    if (animationLock.current) return;
    
    animationLock.current = true;
    setIsAnimating(true);
    const seq = SEQUENCES[seqName];
    
    for (const [idx, duration] of seq) {
      setFrameIndex(idx);
      if (duration > 0) {
        await new Promise(resolve => setTimeout(resolve, duration));
      }
    }
    
    setIsAnimating(false);
    animationLock.current = false;
  }, []);

  const showSpeech = useCallback((type: string) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    const options = DIALOGUES[type] || DIALOGUES.idle;
    const text = options[Math.floor(Math.random() * options.length)];
    setSpeech(text);
    speechTimerRef.current = setTimeout(() => setSpeech(null), 3000);
  }, []);

  const handleClick = () => {
    if (animationLock.current) return;
    
    // 连贯动画触发：播放全部 16 帧
    playSequence("FULL_ACTION");
    
    showSpeech("tap");
    playSFX(SFX.TAP);
    onChickenClick?.();
  };

  // 响应外部状态触发器
  useEffect(() => {
    if (!externalState || !isMounted) return;
    
    switch (externalState) {
      case "skill":
        playSequence("SKILL");
        showSpeech("skill");
        break;
      case "eating":
        playSequence("EATING");
        showSpeech("eating");
        break;
      case "sleep":
        playSequence("SLEEP");
        showSpeech("sleep");
        break;
      case "sad":
        playSequence("SAD");
        showSpeech("sad");
        break;
      case "tap":
        handleClick();
        break;
      default:
        setFrameIndex(0);
    }
  }, [externalState, isMounted, playSequence, showSpeech]);

  // 组件清理
  useEffect(() => {
    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, []);

  if (!isMounted) return <div style={{ width: 190, height: 190 }} />;

  const shadowColor = careerColor.startsWith("#") ? `${careerColor}66` : "rgba(0,0,0,0.2)";

  return (
    <div style={{ position: "relative", width: 190, height: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 气泡对话层 */}
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            style={{
              position: "absolute",
              top: -45,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.95)",
              padding: "8px 14px",
              borderRadius: "16px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#4C1D95",
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              zIndex: 20,
              whiteSpace: "nowrap",
              border: "1px solid #DDD6FE"
            }}
          >
            {speech}
            <div style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid white"
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 角色底影 */}
      <motion.div 
        animate={{ 
          scale: isAnimating ? 1.1 : 1,
          opacity: isAnimating ? 0.4 : 0.2
        }}
        style={{
          position: "absolute",
          bottom: 10,
          left: "20%",
          width: "60%",
          height: 8,
          background: "black",
          borderRadius: "50%",
          filter: "blur(4px)",
          zIndex: 1
        }}
      />

      {/* 角色主体 */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        style={{ 
          cursor: "pointer", 
          width: 190, 
          height: 190, 
          zIndex: 5, 
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: careerColor !== "transparent" ? `radial-gradient(circle, ${careerColor}44 0%, transparent 70%)` : "none",
          borderRadius: "50%"
        }}
      >
        <ChickenFrame index={frameIndex} careerColor={careerColor} />
      </motion.div>
    </div>
  );
}
