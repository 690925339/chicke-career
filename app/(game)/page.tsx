"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/store/user.store";
import { CAREERS } from "@/lib/careers";
import AnimatedChicken, { ChickenState } from "@/components/game/AnimatedChicken";

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
    checkIn, 
    lastCheckInDate,
    setCurrentSkill,
    useAura,
    recoverAura,
    checkAuraRecovery,
    addAffection
  } = useUserStore();
  
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState("");
  const [chickenTrigger, setChickenTrigger] = useState<{ state: ChickenState; key: number } | null>(null);
  const [isNight, setIsNight] = useState(false);
  const triggerKeyRef = useRef(0);

  // 昼夜检测
  useEffect(() => {
    const hours = new Date().getHours();
    setIsNight(hours >= 19 || hours < 6);
  }, []);

  // 定期检查灵气恢复
  useEffect(() => {
    checkAuraRecovery();
    const timer = setInterval(checkAuraRecovery, 60000);
    return () => clearInterval(timer);
  }, [checkAuraRecovery]);

  const currentCareer = CAREERS.find((c) => c.id === currentCareerId) ?? CAREERS[0];
  const currentSkill = currentCareer.skills.find(s => s.id === currentSkillId) ?? currentCareer.skills[0];
  
  const todayStr = new Date().toDateString();
  const checkedInToday = lastCheckInDate === todayStr;

  const triggerChicken = (state: ChickenState) => {
    setChickenTrigger({ state, key: ++triggerKeyRef.current });
    if (state === "tap") addAffection(1);
  };

  const handleCheckIn = () => {
    const { success, reward } = checkIn();
    if (success) {
      setCheckInMsg(`签到成功！获得 ${reward} 鸡币`);
      triggerChicken("checkin");
      addAffection(5);
    } else {
      setCheckInMsg("今天已经签到过啦~");
      triggerChicken("tap");
    }
    setShowCheckIn(true);
    setTimeout(() => setShowCheckIn(false), 2000);
  };

  const handleUseSkill = () => {
    if (useAura(1)) {
      triggerChicken("skill");
      addAffection(2);
      setTimeout(() => router.push(`/skill/${currentSkill.id}`), 500);
    } else {
      setShowRecoveryModal(true);
      triggerChicken("sleep");
    }
  };

  const handleShare = () => {
    // 模拟分享逻辑
    setCheckInMsg("分享成功！灵气已补满 ✨");
    setShowCheckIn(true);
    recoverAura(maxAura);
    setShowRecoveryModal(false);
    addAffection(10);
    setTimeout(() => setShowCheckIn(false), 2000);
  };

  return (
    <div className={`scene-bg ${isNight ? "night-mode" : ""}`}>
      {/* 灵气光晕 (中景) */}
      <div className="aura-glow" style={{ opacity: isNight ? 0.4 : 0.8 }} />
      
      {/* 漂浮粒子 (近景) */}
      {[...Array(12)].map((_, i) => (
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
        <Image src="/images/scene/cloud.svg" alt="" width={80} height={48} />
      </div>
      <div className="animate-drift" style={{ position: "absolute", top: 80, left: "45%", opacity: 0.4, animationDelay: "3s" }}>
        <Image src="/images/scene/cloud.svg" alt="" width={50} height={30} />
      </div>

      {/* 装饰建筑 (中景) */}
      <div style={{ position: "absolute", bottom: "18%", left: 12, opacity: 0.7 }}>
        <Image src="/images/scene/trees.svg" alt="" width={80} height={110} />
      </div>
      <div style={{ position: "absolute", bottom: "20%", right: 24, opacity: 0.7 }}>
        <Image src="/images/scene/windmill.svg" alt="" width={50} height={70} />
      </div>

      {/* 草地 (近景 - 增加深度感) */}
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
        <Image src="/images/scene/grass.svg" alt="" width={480} height={40} style={{ width: "100%", height: 40, position: "absolute", top: -20, opacity: 0.9 }} />
      </div>

      {/* 顶部状态栏 */}
      {/* 顶部状态栏 (冰晶毛玻璃质感) */}
      <div className="glass-header" style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px 20px 10px",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: isNight ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
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

          <button
            onClick={handleCheckIn}
            className={`game-btn ${checkedInToday ? "btn-disabled" : "btn-primary"}`}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 800,
              boxShadow: checkedInToday ? "none" : "0 4px 12px rgba(76, 29, 149, 0.3)",
              transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
          >
            {checkedInToday ? "已签" : "✨ 每日签到"}
          </button>
        </div>

        {/* 好感度/心情条 */}
        <div style={{ display: "flex", gap: 16, padding: "0 4px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB7185" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)" />
            </svg>
            <div style={{ flex: 1, height: 8, background: "rgba(0,0,0,0.1)", borderRadius: 4, overflow: "hidden" }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${affection}%` }}
                style={{ height: "100%", background: "linear-gradient(90deg, #F43F5E, #FF8A9B)", borderRadius: 4 }} 
              />
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>😊</span>
            <div style={{ flex: 1, height: 8, background: "rgba(0,0,0,0.1)", borderRadius: 4, overflow: "hidden" }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${mood}%` }}
                style={{ height: "100%", background: "linear-gradient(90deg, #FBBF24, #FDE68A)", borderRadius: 4 }} 
              />
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
        {/* 职业名牌 */}
        <div
          className="glass-card"
          style={{
            borderRadius: 24,
            padding: "6px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: currentCareer.color, boxShadow: `0 0 8px ${currentCareer.color}` }} />
          <span style={{ fontSize: 15, fontWeight: 800, color: currentCareer.color }}>{currentCareer.name}</span>
          <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{currentCareer.title}</span>
        </div>

        {/* 角色展示台 */}
        <div style={{ position: "relative" }}>
           {/* 底层光晕 */}
          <div style={{ 
            position: "absolute", 
            top: "50%", left: "50%", 
            transform: "translate(-50%, -50%)",
            width: 220, height: 220, 
            background: `radial-gradient(circle, ${currentCareer.color}33 0%, transparent 70%)`,
            zIndex: 0 
          }} />
          <AnimatedChicken
            careerColor={currentCareer.color}
            externalState={chickenTrigger?.state ?? null}
          />
        </div>

        {/* 技能切换区域 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div
            className="glass-card"
            style={{
              borderRadius: 20,
              padding: "12px 24px",
              textAlign: "center",
              minWidth: 200,
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280", fontWeight: 500, opacity: 0.8 }}>当前使用技能</p>
            <p style={{ margin: "4px 0 2px", fontSize: 16, fontWeight: 800, color: "#4B2D8F" }}>
              {currentSkill.name}
            </p>
          </div>
          
          {/* 多技能切换小点 */}
          {currentCareer.skills.length > 1 && (
            <div style={{ display: "flex", gap: 10 }}>
              {currentCareer.skills.map(s => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSkill(s.id)}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: currentSkillId === s.id ? currentCareer.color : "rgba(0,0,0,0.15)",
                    border: currentSkillId === s.id ? `2px solid #fff` : "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    boxShadow: currentSkillId === s.id ? `0 0 8px ${currentCareer.color}` : "none",
                    transform: currentSkillId === s.id ? "scale(1.2)" : "scale(1)"
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 底部操作区 (浮岛式底栏) */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: "calc(100% - 32px)",
          maxWidth: 420,
        }}
      >
        <div style={{
          background: isNight ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
          borderRadius: 44,
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isNight ? "0 12px 50px rgba(0,0,0,0.5)" : "0 12px 50px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255,255,255,0.3)"
        }}>
          {/* 旅行按钮 */}
          <button
            className="game-btn shadow-vibrant"
            onClick={() => router.push("/travel")}
            style={{
              width: 58,
              height: 58,
              borderRadius: 22,
              background: isNight ? "rgba(15, 23, 42, 0.5)" : "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              border: `2px solid ${isNight ? "rgba(255,255,255,0.15)" : "#F3F4F6"}`,
              transition: "all 0.2s ease"
            }}
          >
            <Image src="/images/icons/chest.svg" alt="旅行" width={28} height={28} />
            <span style={{ fontSize: 10, color: "#065F46", fontWeight: 800 }}>环游</span>
          </button>

          {/* 中间主按钮：触发当前技能 (更大更圆润) */}
          <div style={{ position: "relative" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: `2px dotted ${currentCareer.color}88`,
                opacity: 0.5
              }}
            />
            <button
              className="game-btn main-action-btn pulse-glow"
              onClick={handleUseSkill}
              style={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${currentCareer.color}, #4C1D95)`,
                border: "5px solid rgba(255,255,255,1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                boxShadow: `0 12px 30px ${currentCareer.color}99`,
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* 星光背景装饰 */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }}>
                <div className="sparkle" style={{ top: "15%", left: "15%" }} />
                <div className="sparkle" style={{ top: "70%", right: "15%" }} />
              </div>
              
              <div style={{ position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 38, height: 38, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.7))" }}>
                  <path d="M18 11V7C18 5.89543 17.1046 5 16 5C15.717 5 15.451 5.05852 15.2105 5.16391C14.8966 3.92131 13.7634 3 12.41 3C11.5161 3 10.7135 4.39086 10.2312 4.49845C9.897 4.18375 9.4442 4 8.947 4C7.84243 4 6.947 4.89543 6.947 6V11.454C6.2647 11.2315 5.5147 11.396 5 11.9101L3 13.9101L10.027 20.9371C10.59 21.5 11.353 21.815 12.148 21.815H17.414C18.739 21.815 19.899 20.899 20.201 19.613L21.365 14.665C21.733 13.104 20.767 11.55 19.167 11.127C18.784 11.025 18.391 11.001 18 11.034V11Z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11V15" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M9 13L9 16" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ position: "absolute", width: 24, height: 24, background: "white", filter: "blur(14px)", borderRadius: "50%", zIndex: -1 }}
                />
              </div>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 900, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>{currentSkill.name}</span>
            </button>
          </div>

          {/* 仓库/物资按钮 */}
          <button
            className="game-btn shadow-vibrant"
            style={{
              width: 58,
              height: 58,
              borderRadius: 22,
              background: isNight ? "rgba(15, 23, 42, 0.5)" : "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              border: `2px solid ${isNight ? "rgba(255,255,255,0.15)" : "#F3F4F6"}`,
              transition: "all 0.2s ease"
            }}
          >
            <Image src="/images/icons/bag.svg" alt="物品" width={28} height={28} />
            <span style={{ fontSize: 10, color: "#B45309", fontWeight: 800 }}>物资</span>
          </button>
        </div>
      </div>

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
            background: "rgba(255,255,255,0.95)"
          }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#4C1D95" }}>灵气不足啦</h3>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
                主角鸡累得睡着了...<br/>通过分享来唤醒它并补满灵气吧！
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button 
                className="game-btn main-action-btn"
                onClick={handleShare}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: 16,
                  borderRadius: 20
                }}
              >
                🌟 分享给好友补满
              </button>
              <button 
                className="game-btn"
                onClick={() => setShowRecoveryModal(false)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  background: "transparent",
                  border: "none"
                }}
              >
                晚点再说
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
