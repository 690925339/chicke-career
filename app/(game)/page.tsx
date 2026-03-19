"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/store/user.store";
import { CAREERS } from "@/lib/careers";

export default function HomePage() {
  const router = useRouter();
  const { chickenCoin, diamond, currentCareerId, checkIn, lastCheckInDate } = useUserStore();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState("");

  const currentCareer = CAREERS.find((c) => c.id === currentCareerId) ?? CAREERS[0];
  const todayStr = new Date().toDateString();
  const checkedInToday = lastCheckInDate === todayStr;

  const handleCheckIn = () => {
    const { success, reward } = checkIn();
    if (success) {
      setCheckInMsg(`签到成功！获得 ${reward} 鸡币`);
    } else {
      setCheckInMsg("今天已经签到过啦~");
    }
    setShowCheckIn(true);
    setTimeout(() => setShowCheckIn(false), 2000);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #87CEEB 0%, #B0E0FF 40%, #98D06E 70%, #5D8A3C 100%)",
      }}
    >
      {/* 云朵 */}
      <div className="animate-drift" style={{ position: "absolute", top: 24, left: "10%", opacity: 0.9 }}>
        <Image src="/images/scene/cloud.svg" alt="" width={80} height={48} />
      </div>
      <div className="animate-drift" style={{ position: "absolute", top: 40, right: "8%", opacity: 0.7, animationDelay: "1.5s", animationDuration: "5s" }}>
        <Image src="/images/scene/cloud.svg" alt="" width={60} height={36} />
      </div>
      <div className="animate-drift" style={{ position: "absolute", top: 80, left: "45%", opacity: 0.6, animationDelay: "3s" }}>
        <Image src="/images/scene/cloud.svg" alt="" width={50} height={30} />
      </div>

      {/* 树木 */}
      <div style={{ position: "absolute", bottom: 120, left: 8 }}>
        <Image src="/images/scene/trees.svg" alt="" width={80} height={110} />
      </div>
      <div style={{ position: "absolute", bottom: 120, right: 8 }}>
        <Image src="/images/scene/trees.svg" alt="" width={70} height={96} style={{ transform: "scaleX(-1)" }} />
      </div>

      {/* 风车 */}
      <div style={{ position: "absolute", bottom: 130, right: 70 }}>
        <Image src="/images/scene/windmill.svg" alt="" width={50} height={70} />
      </div>

      {/* 草地 */}
      <div style={{ position: "absolute", bottom: 110, left: 0, right: 0 }}>
        <Image src="/images/scene/grass.svg" alt="" width={480} height={40} style={{ width: "100%", height: 40 }} />
      </div>

      {/* 顶部状态栏 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "12px 16px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* 用户信息 */}
        <div
          className="glass-card"
          style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 20, padding: "4px 12px 4px 4px" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #A78BFA, #7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src="/images/characters/chicken-base.svg" alt="鸡" width={22} height={22} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#4B2D8F" }}>鸡鸡大师</span>
        </div>

        {/* 资源栏 */}
        <div style={{ display: "flex", gap: 6 }}>
          <div
            className="glass-card"
            style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 16, padding: "4px 10px" }}
          >
            <Image src="/images/icons/coin.svg" alt="金币" width={18} height={18} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>{chickenCoin}</span>
          </div>
          <div
            className="glass-card"
            style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 16, padding: "4px 10px" }}
          >
            <Image src="/images/icons/diamond.svg" alt="钻石" width={18} height={18} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>{diamond}</span>
          </div>
          {/* 签到按钮 */}
          <button
            className="game-btn"
            onClick={handleCheckIn}
            style={{
              background: checkedInToday
                ? "rgba(255,255,255,0.7)"
                : "linear-gradient(135deg, #FCD34D, #F59E0B)",
              border: "none",
              borderRadius: 16,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <Image src="/images/icons/checkin.svg" alt="签到" width={18} height={18} />
            <span style={{ fontSize: 12, fontWeight: 600, color: checkedInToday ? "#9CA3AF" : "#92400E" }}>
              {checkedInToday ? "已签" : "签到"}
            </span>
          </button>
        </div>
      </div>

      {/* 签到提示 */}
      {showCheckIn && (
        <div
          className="animate-bounce-in"
          style={{
            position: "absolute",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            borderRadius: 20,
            padding: "8px 20px",
            fontSize: 13,
            zIndex: 50,
            whiteSpace: "nowrap",
          }}
        >
          {checkInMsg}
        </div>
      )}

      {/* 左侧导航标签 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 10,
        }}
      >
        {[
          { icon: "/images/icons/bag.svg", label: "职业", path: "/career" },
          { icon: "/images/icons/scroll.svg", label: "历史", path: "/history" },
          { icon: "/images/icons/chest.svg", label: "成就", path: "/achievement" },
        ].map((item) => (
          <button
            key={item.path}
            className="game-btn"
            onClick={() => router.push(item.path)}
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "none",
              borderRadius: "0 12px 12px 0",
              padding: "8px 10px 8px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <Image src={item.icon} alt={item.label} width={22} height={22} />
            <span style={{ fontSize: 10, color: "#5B21B6", fontWeight: 600 }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 主角色区域 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* 职业名牌 */}
        <div
          className="glass-card"
          style={{
            borderRadius: 20,
            padding: "4px 16px",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: currentCareer.color }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: currentCareer.color }}>{currentCareer.name}</span>
          <span style={{ fontSize: 11, color: "#6B7280" }}>{currentCareer.title}</span>
        </div>

        {/* 角色展示台 */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 35%, ${currentCareer.bgColor}, ${currentCareer.color}44)`,
            border: `4px solid ${currentCareer.color}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 32px ${currentCareer.color}44, 0 0 0 8px ${currentCareer.bgColor}88`,
          }}
        >
          <div className="animate-float">
            <Image src="/images/characters/chicken-base.svg" alt="鸡鸡" width={110} height={110} />
          </div>
        </div>

        {/* 技能信息 */}
        <div
          className="glass-card"
          style={{
            marginTop: 12,
            borderRadius: 16,
            padding: "8px 16px",
            textAlign: "center",
            minWidth: 180,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>当前技能</p>
          <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: "#4B2D8F" }}>
            {currentCareer.skill.name}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            每日免费 {currentCareer.skill.dailyFreeQuota} 次
          </p>
        </div>
      </div>

      {/* 底部操作区 */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 20,
          padding: "0 20px",
          zIndex: 10,
        }}
      >
        {/* 左按钮：职业 */}
        <button
          className="game-btn"
          onClick={() => router.push("/career")}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fff 0%, #EDE9FE 100%)",
            border: "3px solid #A78BFA",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
          }}
        >
          <Image src="/images/icons/bag.svg" alt="职业" width={28} height={28} />
          <span style={{ fontSize: 10, color: "#7C3AED", fontWeight: 600 }}>职业</span>
        </button>

        {/* 中间主按钮：使用技能 */}
        <button
          className="game-btn"
          onClick={() => router.push(`/skill/${currentCareer.skill.id}`)}
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${currentCareer.color}, #4C1D95)`,
            border: "4px solid #fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            cursor: "pointer",
            boxShadow: `0 6px 24px ${currentCareer.color}66, 0 0 0 4px ${currentCareer.color}33`,
          }}
        >
          <Image src="/images/characters/chicken-base.svg" alt="使用技能" width={40} height={40} style={{ filter: "brightness(10)" }} />
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{currentCareer.skill.name}</span>
        </button>

        {/* 右按钮：历史 */}
        <button
          className="game-btn"
          onClick={() => router.push("/history")}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fff 0%, #FEF3C7 100%)",
            border: "3px solid #F59E0B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
          }}
        >
          <Image src="/images/icons/scroll.svg" alt="历史" width={28} height={28} />
          <span style={{ fontSize: 10, color: "#B45309", fontWeight: 600 }}>历史</span>
        </button>
      </div>
    </div>
  );
}
