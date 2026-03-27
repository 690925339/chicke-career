"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/store/user.store";
import { CAREERS } from "@/lib/careers";
import { DESTINATIONS, MASTERPIECES, Masterpiece } from "@/lib/masterpieces";
import { SFX, playSFX } from "@/lib/audio";
import AnimatedChicken, { ChickenState } from "@/components/game/AnimatedChicken";
import MagicDoor from "@/components/game/MagicDoor";

export default function HomePage() {
  const router = useRouter();
  const { 
    chickenCoin, 
    aura, 
    maxAura, 
    currentCareerId, 
    currentSkillId,
    affection,
    mood,
    setCurrentSkill,
    useAura,
    recoverAura,
    checkAuraRecovery,
    addAffection,
    travelState,
    currentTrip,
    checkTravelStatus,
    claimTravelReward,
    eggs,
    skillPoints,
    hunger,
    feedChicken,
    exchangeEggsForPoints,
    useSkillPoint,
    startTravel,
    stopTravel
  } = useUserStore();
  
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showEggAnim, setShowEggAnim] = useState<{ x: number; y: number } | null>(null);
  const [travelReward, setTravelReward] = useState<Masterpiece | null>(null);
  const [checkInMsg, setCheckInMsg] = useState("");
  const [chickenTrigger, setChickenTrigger] = useState<{ state: ChickenState; key: number } | null>(null);
  const [isNight, setIsNight] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerKeyRef = useRef(0);

  // 挂载检测
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 昼夜检测
  useEffect(() => {
    const hours = new Date().getHours();
    setIsNight(hours >= 19 || hours < 6);
  }, []);

  // 定期检查灵气恢复与旅行状态
  useEffect(() => {
    checkAuraRecovery();
    checkTravelStatus();
    const timer = setInterval(() => {
      checkAuraRecovery();
      checkTravelStatus();
    }, 60000);
    return () => clearInterval(timer);
  }, [checkAuraRecovery, checkTravelStatus]);

  const currentCareer = CAREERS.find((c) => c.id === currentCareerId) ?? CAREERS[0];
  const currentSkill = currentCareer.skills.find(s => s.id === currentSkillId) ?? currentCareer.skills[0];
  

  const triggerChicken = (state: ChickenState) => {
    setChickenTrigger({ state, key: ++triggerKeyRef.current });
    if (state === "tap") addAffection(1);
  };


  const handleFeed = (e: React.MouseEvent) => {
    if (travelState === 'traveling') {
      setCheckInMsg("小鸡在旅行中，暂时不能喂食哦~ ✨");
      setShowCheckIn(true);
      playSFX(SFX.TAP);
      setTimeout(() => setShowCheckIn(false), 2000);
      return;
    }
    const res = feedChicken();
    if (res.success) {
      playSFX(SFX.TAP);
      triggerChicken("eating");
      setShowEggAnim({ x: e.clientX, y: e.clientY });
      setTimeout(() => setShowEggAnim(null), 1000);
    } else {
      setCheckInMsg("没米啦，休息下再喂吧~ ✨");
      setShowCheckIn(true);
      playSFX(SFX.TAP);
      setTimeout(() => setShowCheckIn(false), 2000);
    }
  };

  const handleUseSkill = () => {
    if (useSkillPoint(1)) {
      triggerChicken("skill");
      addAffection(2);
      playSFX(SFX.SKILL);
      // "打工" 实际上是进入技能结果页
      setTimeout(() => router.push(`/skill/${currentSkillId}`), 1000);
    } else {
      setCheckInMsg("技能点不足，快去换取吧！🥚");
      setShowCheckIn(true);
      playSFX(SFX.TAP);
      setTimeout(() => setShowCheckIn(false), 2000);
    }
  };

  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 去探险实时倒计时
  useEffect(() => {
    if (travelState !== 'traveling' || !currentTrip) {
      setTimeLeft(0);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(currentTrip.startTime).getTime();
      const diff = Math.max(0, (currentTrip.duration * 1000) - (now - start));
      setTimeLeft(Math.floor(diff / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [travelState, currentTrip]);

  const formatTimeFull = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartTravel = () => {
    if (startTravel()) {
      triggerChicken("skill"); // 使用一下技能动作表示出发
      playSFX(SFX.SUCCESS);
    } else {
      setCheckInMsg("技能点不足或已在途中 ✨");
      setShowCheckIn(true);
      setTimeout(() => setShowCheckIn(false), 2000);
    }
  };

  const handleShare = () => {
    // 模拟分享逻辑
    setCheckInMsg("分享成功！灵气已补满 ✨");
    setShowCheckIn(true);
    if (recoverAura) recoverAura(maxAura);
    setShowRecoveryModal(false);
    addAffection(10);
    playSFX(SFX.SUCCESS);
    setTimeout(() => setShowCheckIn(false), 2000);
  };

  return (
    <div className={`scene-bg ${isNight ? "night-mode" : ""}`}>
      {/* 灵气光晕 (中景) */}
      <div className="aura-glow" style={{ opacity: isNight ? 0.4 : 0.8 }} />
      
      {/* 10/10 环境特效: 昼间光线 / 夜间萤火虫 */}
      {!isNight ? (
        <div className="god-rays" />
      ) : (
        [...Array(8)].map((_, i) => (
          <div 
            key={`firefly-${i}`} 
            className="firefly" 
            style={{ 
              left: `${10 + Math.random() * 80}%`, 
              top: `${20 + Math.random() * 60}%`, 
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }} 
          />
        ))
      )}

      {/* 漂浮粒子 (近景) - 仅在客户端渲染以避免水合不一致 */}
      {isMounted && [...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="particle" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5
          }} 
        />
      ))}

      {/* 云朵 (远景) */}
      <div className="animate-drift" style={{ position: "absolute", top: 24, left: "10%", opacity: 0.6 }}>
        <Image src="/images/scene/cloud.svg" alt="" width={80} height={48} style={{ height: "auto" }} />
      </div>
      <div className="animate-drift" style={{ position: "absolute", top: 80, left: "45%", opacity: 0.4, animationDelay: "3s" }}>
        <Image src="/images/scene/cloud.svg" alt="" width={50} height={30} style={{ height: "auto" }} />
      </div>

      {/* 装饰建筑 (中景) */}
      <div style={{ position: "absolute", bottom: "18%", left: 12, opacity: 0.7 }}>
        <Image src="/images/scene/trees.svg" alt="" width={80} height={110} style={{ width: 80, height: "auto" }} />
      </div>
      <div style={{ position: "absolute", bottom: "20%", right: 24, opacity: 0.7 }}>
        <Image src="/images/scene/windmill.svg" alt="" width={50} height={70} style={{ width: 50, height: "auto" }} />
      </div>

      {/* 草地 (近景) */}
      <div 
        style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: "18%", 
          background: "linear-gradient(180deg, #98D06E 0%, #5D8A3C 100%)", 
          zIndex: 1,
          boxShadow: "0 -10px 40px rgba(0,0,0,0.05)"
        }}
      >
        <Image 
          src="/images/scene/grass.svg" 
          alt="" 
          width={480} 
          height={40} 
          priority
          style={{ width: "100%", height: "auto", position: "absolute", top: -20, opacity: 0.9 }} 
        />
      </div>

      {/* 顶部状态栏 (冰晶毛玻璃质感) */}
      <div className="glass-header" style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "16px 20px 10px",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: isNight ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div 
              className="status-pill" 
              onClick={() => setShowExchangeModal(true)}
              style={{ cursor: "pointer" }}
            >
              <span style={{ fontSize: 16, marginRight: 4 }}>🥚</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: isNight ? "#E2E8F0" : "#4B5563" }}>{eggs}</span>
            </div>
            <div 
              className="status-pill" 
              onClick={() => setShowExchangeModal(true)}
              style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", cursor: "pointer" }}
            >
              <span style={{ fontSize: 16, marginRight: 4 }}>✍️</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#4F46E5" }}>{skillPoints}</span>
            </div>
            <div className="status-pill">
              <Image src="/images/icons/coin.svg" alt="鸡币" width={18} height={18} />
              <span style={{ fontSize: 14, fontWeight: 700, color: isNight ? "#E2E8F0" : "#4B5563" }}>{chickenCoin}</span>
            </div>
            <div className="status-pill">
              <div 
                style={{ 
                  width: 14, 
                  height: 14, 
                  borderRadius: "50%", 
                  background: aura > 0 ? "#10B981" : "#9CA3AF",
                  boxShadow: aura > 0 ? "0 0 8px #10B981" : "none"
                }} 
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: isNight ? "#E2E8F0" : "#4B5563" }}>{aura}/{maxAura}</span>
            </div>
          </div>

        </div>

        {/* 好感度/心情条 */}
        <div style={{ display: "flex", gap: 16, padding: "0 4px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FB7185" />
            </svg>
            <div style={{ flex: 1, height: 8, background: "rgba(0,0,0,0.1)", borderRadius: 4, overflow: "hidden" }}>
              <motion.div animate={{ width: `${affection}%` }} style={{ height: "100%", background: "#F43F5E" }} />
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>😊</span>
            <div style={{ flex: 1, height: 8, background: "rgba(0,0,0,0.1)", borderRadius: 4, overflow: "hidden" }}>
              <motion.div animate={{ width: `${mood}%` }} style={{ height: "100%", background: "#FBBF24" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 签到提示 */}
      {showCheckIn && (
        <div
          className="animate-bounce-in"
          style={{
            position: "absolute",
            top: 100,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.95)",
            color: "#92400E",
            borderRadius: 24,
            padding: "12px 32px",
            fontSize: 15,
            fontWeight: 800,
            zIndex: 150,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            border: "2px solid #FCD34D",
          }}
        >
          {checkInMsg}
        </div>
      )}

      {/* 左侧导航标签 (垂直 Dock) */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: "45%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 10,
        }}
      >
        {[
          { icon: "/images/icons/bag.svg", label: "职业", path: "/career", color: "#6366F1" },
          { icon: "/images/icons/scroll.svg", label: "历史", path: "/history", color: "#EC4899" },
          { icon: "/images/icons/chest.svg", label: "成就", path: "/achievement", color: "#F59E0B" },
        ].map((item) => (
          <button
            key={item.path}
            className="game-btn feature-card"
            onClick={() => router.push(item.path)}
            style={{
              width: 56,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.5)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: item.color }} />
            <Image src={item.icon} alt={item.label} width={28} height={28} />
            <span style={{ fontSize: 10, color: "#1F2937", fontWeight: 800 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 主角色区域 - 绝对居中 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          zIndex: 5,
        }}
      >
        {/* 角色展示台 */}
        <div style={{ position: "relative" }}>
           {/* 底层光晕 */}
          <div style={{ 
            position: "absolute", 
            top: "50%", left: "50%", 
            transform: "translate(-50%, -50%)",
            width: 280, height: 280, 
            background: `radial-gradient(circle, ${CAREERS.find(c => c.id === currentCareerId)?.color}33 0%, transparent 70%)`,
            zIndex: 0 
          }} />
          
          <AnimatePresence mode="wait">
            {travelState === 'traveling' ? (
                <motion.div
                  key="traveling"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setShowRecallModal(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <MagicDoor 
                    countdown={formatTimeFull(timeLeft)} 
                    destination={DESTINATIONS.find(d => d.id === currentTrip?.destinationId)?.name || '未知目的地'} 
                  />
                </motion.div>
            ) : travelState === 'returned' ? (
              <motion.div
                key="returned"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  const reward = claimTravelReward();
                  if (reward) {
                    setTravelReward(reward);
                    setShowRewardModal(true);
                  }
                }}
                style={{ cursor: 'pointer', position: "relative" }}
              >
                <div style={{ position: "relative" }}>
                  <AnimatedChicken
                    careerColor={CAREERS.find(c => c.id === currentCareerId)?.color || "#FCD34D"}
                    externalState="idle"
                  />
                  {/* 回来后的礼物气泡 */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ 
                      position: "absolute", 
                      top: -60, left: "50%", 
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #F59E0B, #D97706)",
                      color: "#fff",
                      padding: "10px 20px", 
                      borderRadius: 24,
                      fontSize: 15, 
                      fontWeight: 900,
                      boxShadow: "0 10px 25px rgba(245, 158, 11, 0.4)",
                      whiteSpace: "nowrap",
                      border: "3px solid #fff",
                      zIndex: 10
                    }}
                  >
                    探险归来！🎁 点击领奖
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chicken"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ position: "relative" }}
              >
                <AnimatedChicken
                  careerColor={CAREERS.find(c => c.id === currentCareerId)?.color || "#FCD34D"}
                  externalState={chickenTrigger?.state ?? null}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 底部操作区 (清爽纯文字版) */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: "calc(100% - 24px)",
          maxWidth: 440,
        }}
      >
        {/* 中间按钮上方的提示文字 */}
        <div style={{
          position: "absolute",
          top: -26,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#E8F5E9",
          padding: "2px 16px",
          borderRadius: "10px 10px 0 0",
          fontSize: 11,
          fontWeight: 800,
          color: "#4B7A2E",
          whiteSpace: "nowrap",
          border: "2px solid #FFF",
          borderBottom: "none",
          zIndex: 5
        }}>
          喂越多，明早收毛越多
        </div>

        <div style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          gap: 6,
        }}>
          {/* 左侧小按钮: 去探险 */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="game-btn"
            onClick={handleStartTravel}
            style={{
              width: 82,
              height: 64,
              borderRadius: "32px 14px 14px 32px",
              background: "linear-gradient(180deg, #FF8E61 0%, #FF5A4A 100%)",
              position: "relative",
              overflow: "hidden",
              border: "3px solid #FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0
            }}
          >
            <div style={{
              position: "absolute", top: "-15%", left: "-10%", width: "120%", height: "50%",
              background: "rgba(255,255,255,0.25)", borderRadius: "50%", pointerEvents: "none"
            }} />
            <span style={{ 
              fontSize: 18, 
              fontWeight: 900, 
              color: "#FFF", 
              zIndex: 1,
              textShadow: "1px 1.5px 0 #9E1F1F, -1px -1px 0 #9E1F1F, 1px -1px 0 #9E1F1F, -1px 1.5px 0 #9E1F1F, 0 2px 4px rgba(0,0,0,0.3)"
            }}>去探险</span>
          </motion.button>

          {/* 中间主按钮: 喂大米 */}
          <div style={{ position: "relative", flex: 1, height: 64 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFeed}
              disabled={travelState === 'traveling'}
              style={{
                width: "100%", height: "100%", borderRadius: 14,
                background: travelState === 'traveling'
                  ? "linear-gradient(180deg, #D1D5DB 0%, #9CA3AF 100%)"
                  : "linear-gradient(180deg, #FFD84D 0%, #FBBF24 100%)",
                border: "3px solid #FFF", position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: travelState === 'traveling' ? "not-allowed" : "pointer"
              }}
            >
              <div style={{
                position: "absolute", top: "-20%", left: "-5%", width: "110%", height: "55%",
                background: "rgba(255,255,255,0.25)", borderRadius: "50%", pointerEvents: "none"
              }} />
              
              <div style={{ 
                fontSize: 22, fontWeight: 900, color: "#FFF", zIndex: 2,
                textShadow: "1.5px 2px 0 #8F5300, -1.5px -1.5px 0 #8F5300, 1.5px -1.5px 0 #8F5300, -1.5px 2px 0 #8F5300, 0 3px 6px rgba(0,0,0,0.2)"
              }}>
                喂大米
              </div>
            </motion.button>

            {/* 29 角标 */}
            <div style={{
              position: "absolute", right: -4, top: -8,
              minWidth: 26, height: 26, borderRadius: 13,
              background: "linear-gradient(180deg, #FF7B7B 0%, #F44336 100%)",
              border: "2px solid #FFF", color: "#FFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, zIndex: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }}>
              {eggs > 99 ? "99+" : eggs}
            </div>
          </div>

          {/* 右侧小按钮: 赚大米 */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="game-btn"
            onClick={() => router.push("/career")}
            style={{
              width: 82,
              height: 64,
              borderRadius: "14px 32px 32px 14px",
              background: "linear-gradient(180deg, #4ADE80 0%, #22C55E 100%)",
              position: "relative",
              overflow: "hidden",
              border: "3px solid #FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0
            }}
          >
            <div style={{
              position: "absolute", top: "-15%", left: "-10%", width: "120%", height: "50%",
              background: "rgba(255,255,255,0.25)", borderRadius: "50%", pointerEvents: "none"
            }} />
            <span style={{ 
              fontSize: 18, 
              fontWeight: 900, 
              color: "#FFF", 
              zIndex: 1,
              textShadow: "1px 1.5px 0 #1B5E20, -1px -1px 0 #1B5E20, 1px -1px 0 #1B5E20, -1px 1.5px 0 #1B5E20, 0 2px 4px rgba(0,0,0,0.3)"
            }}>赚大米</span>
          </motion.button>
        </div>
      </div>

      {/* 下蛋动画层 */}
      {showEggAnim && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -100, scale: 1.5 }}
          style={{
            position: "fixed",
            left: showEggAnim.x - 20,
            top: showEggAnim.y - 40,
            zIndex: 1000,
            fontSize: 40,
            pointerEvents: "none"
          }}
        >
          🥚
        </motion.div>
      )}

      {/* 奖励弹窗 */}
      {showRewardModal && travelReward && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: 24
        }}>
          <div className="glass-card animate-bounce-in" style={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 32,
            padding: 40,
            textAlign: "center",
            background: "#fff"
          }}>
            <h2 style={{ color: "#F59E0B", fontWeight: 900, marginBottom: 20 }}>探险大发现！</h2>
            <div style={{ fontSize: 80, marginBottom: 20 }}>{travelReward.image}</div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{travelReward.name}</h3>
            <p style={{ color: "#6B7280", margin: "10px 0 30px" }}>{travelReward.quote}</p>
            <button 
              className="game-btn main-action-btn"
              onClick={() => setShowRewardModal(false)}
              style={{ width: "100%", padding: "16px", borderRadius: 20 }}
            >
              收下礼物
            </button>
          </div>
        </div>
      )}

      {/* 灵气恢复弹窗 */}
      {showRecoveryModal && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 24
        }}>
          <div className="glass-card animate-bounce-in" style={{
            width: "100%",
            maxWidth: 320,
            borderRadius: 32,
            padding: 32,
            textAlign: "center",
            background: "#fff"
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#4C1D95" }}>灵气不足啦</h3>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#6B7280" }}>
              主角鸡累得睡着了...<br/>通过分享来唤醒它并补满灵气吧！
            </p>
            <button 
              className="game-btn main-action-btn"
              onClick={handleShare}
              style={{ width: "100%", padding: "16px", borderRadius: 20, marginTop: 20 }}
            >
              🌟 分享给好友补满
            </button>
            <button 
              className="game-btn"
              onClick={() => setShowRecoveryModal(false)}
              style={{ width: "100%", marginTop: 12, color: "#9CA3AF" }}
            >
              晚点再说
            </button>
          </div>
        </div>
      )}

      {/* 召回确认弹窗 (精调版，匹配截图风格) */}
      {showRecallModal && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 300,
          padding: 20
        }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card" 
            style={{
              width: "100%",
              maxWidth: 340,
              borderRadius: 28,
              padding: "40px 24px 30px",
              textAlign: "center",
              background: "#FFF",
              position: "relative",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              border: "4px solid #FDF2F2"
            }}
          >
            {/* 关闭按钮 */}
            <button 
              onClick={() => setShowRecallModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                fontSize: 24,
                color: "#9CA3AF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✕
            </button>

            <h3 style={{ 
              margin: "0 0 10px", 
              fontSize: 18, 
              fontWeight: 900, 
              color: "#92400E",
              lineHeight: 1.4,
              padding: "0 10px"
            }}>
              主角鸡正在探险中，现在召回可能会失去礼物哦！
            </h3>

            {/* 中间角色区域 */}
            <div style={{ 
              height: 160, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              position: "relative",
              margin: "10px 0"
            }}>
              {/* 装饰背景山脉/云朵 (模拟截图) */}
              <div style={{ position: "absolute", bottom: 20, width: "100%", opacity: 0.5, pointerEvents: "none" }}>
                <Image src="/images/scene/cloud.svg" alt="" width={60} height={36} style={{ position: "absolute", left: 0, top: -20 }} />
                <Image src="/images/scene/trees.svg" alt="" width={40} height={60} style={{ position: "absolute", right: 0, bottom: 0 }} />
              </div>
              
              <AnimatedChicken
                careerColor={CAREERS.find(c => c.id === currentCareerId)?.color || "#FCD34D"}
                externalState="sad"
              />
            </div>

            {/* 按钮群 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
              <button 
                className="game-btn"
                onClick={() => {
                  stopTravel();
                  setShowRecallModal(false);
                  playSFX(SFX.TAP);
                }}
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  borderRadius: 25, 
                  background: "#FFF", 
                  border: "3px solid #E5E7EB",
                  color: "#4B5563",
                  fontSize: 18,
                  fontWeight: 900,
                  boxShadow: "0 4px 0 #E5E7EB"
                }}
              >
                确认召回
              </button>
              <button 
                className="game-btn"
                onClick={() => setShowRecallModal(false)}
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  borderRadius: 25, 
                  background: "linear-gradient(180deg, #FFD84D 0%, #FBBF24 100%)", 
                  border: "3px solid #FFF",
                  color: "#FFF",
                  fontSize: 18,
                  fontWeight: 900,
                  boxShadow: "0 4px 12px rgba(251, 191, 36, 0.4)",
                  textShadow: "1px 1px 0 #8F5300, -1px -1px 0 #8F5300, 1px -1px 0 #8F5300, -1px 1px 0 #8F5300"
                }}
              >
                继续探险
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 鸡蛋兑换弹窗 */}
      {showExchangeModal && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 110,
          padding: 24
        }}>
          <div className="glass-card animate-bounce-in" style={{
            width: "100%",
            maxWidth: 320,
            borderRadius: 32,
            padding: 32,
            textAlign: "center",
            background: "#fff"
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🥚 → ✍️</div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#4F46E5" }}>鸡蛋兑换处</h3>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#6B7280" }}>
              消耗 10 个鸡蛋获得 1 点技能点
            </p>
            <button 
              className="game-btn btn-primary"
              onClick={() => {
                if (exchangeEggsForPoints(10)) {
                  setShowExchangeModal(false);
                }
              }}
              style={{ width: "100%", padding: "16px", borderRadius: 20, marginTop: 20 }}
            >
              立即兑换
            </button>
            <button 
              className="game-btn"
              onClick={() => setShowExchangeModal(false)}
              style={{ width: "100%", marginTop: 12, color: "#9CA3AF" }}
            >
              返回
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
