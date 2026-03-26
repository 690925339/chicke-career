"use client";
import Image from "next/image";
import GamePageHeader from "@/components/ui/GamePageHeader";
import { useUserStore } from "@/store/user.store";

import { MASTERPIECES } from "@/lib/masterpieces";

const ACHIEVEMENT_LIST = [
  { id: "first-reading", title: "初次打工", description: "完成第一次职业技能使用", reward: { chickenCoin: 50 } },
  { id: "ten-readings", title: "职场达人", description: "累计完成10次职场打工", reward: { chickenCoin: 200 } },
  { id: "check-in-7", title: "七日虔诚", description: "连续签到7天", reward: { chickenCoin: 100, diamond: 1 } },
  { id: "rich-chicken", title: "富贵鸡", description: "拥有1000枚鸡币", reward: { diamond: 2 } },
];

export default function AchievementPage() {
  const { chickenCoin, diamond, skillRecords, checkInStreak, collectedMasterpieceIds } = useUserStore();

  const isUnlocked = (id: string) => {
    if (id === "first-reading") return skillRecords.length >= 1;
    if (id === "ten-readings") return skillRecords.length >= 10;
    if (id === "check-in-7") return checkInStreak >= 7;
    if (id === "rich-chicken") return chickenCoin >= 1000;
    return false;
  };

  const unlockedCount = ACHIEVEMENT_LIST.filter((a) => isUnlocked(a.id)).length;

  return (
    <div style={{ height: "100%", background: "#FFF7ED", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <GamePageHeader title="成就与图鉴" />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, paddingBottom: 100, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        {/* 资源概览 */}
        <div
          style={{
            background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
            borderRadius: 24,
            padding: 20,
            marginBottom: 24,
            display: "flex",
            gap: 16,
            boxShadow: "0 10px 30px rgba(76, 29, 149, 0.2)"
          }}
        >
          {[
            { icon: "/images/icons/coin.svg", label: "鸡币", value: chickenCoin },
            { icon: "/images/icons/diamond.svg", label: "钻石", value: diamond },
            { icon: "/images/icons/chest.svg", label: "名画", value: `${collectedMasterpieceIds.length}/${MASTERPIECES.length}` },
          ].map((item) => (
            <div key={item.label} style={{ flex: 1, textAlign: "center" }}>
              <Image src={item.icon} alt={item.label} width={28} height={28} style={{ margin: "0 auto" }} />
              <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 700, color: "#fff" }}>{item.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* 成就列表 */}
        <h4 style={{ margin: "0 8px 12px", fontSize: 16, fontWeight: 800, color: "#1F2937" }}>职场成就</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {ACHIEVEMENT_LIST.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            return (
              <div
                key={achievement.id}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  border: unlocked ? "2px solid #FEF3C7" : "1px solid #F3F4F6",
                  opacity: unlocked ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: unlocked ? "linear-gradient(135deg, #FCD34D, #F59E0B)" : "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Image src="/images/icons/chest.svg" alt="" width={28} height={28} style={{ opacity: unlocked ? 1 : 0.3 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{achievement.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6B7280" }}>{achievement.description}</p>
                </div>
                {unlocked && (
                  <div style={{ background: "#D1FAE5", borderRadius: 8, padding: "3px 8px", fontSize: 11, color: "#065F46", fontWeight: 600 }}>
                    已达成
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 世界名画图鉴 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 8px" }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1F2937" }}>世界名画图鉴</h4>
          <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 700 }}>
            {collectedMasterpieceIds.length} / {MASTERPIECES.length}
          </span>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {MASTERPIECES.map((masterpiece) => {
            const isCollected = collectedMasterpieceIds.includes(masterpiece.id);
            return (
              <div
                key={masterpiece.id}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 12,
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  border: isCollected ? "2px solid #FCD34D" : "1px solid #F3F4F6",
                  filter: isCollected ? "none" : "grayscale(1) opacity(0.5)"
                }}
              >
                <div style={{ 
                  aspectRatio: "1/1", 
                  background: "#F3F4F6", 
                  borderRadius: 12, 
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48
                }}>
                  {isCollected ? "🖼️" : "❓"}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 800, color: isCollected ? "#1F2937" : "#9CA3AF" }}>
                  {isCollected ? masterpiece.name : "未解锁"}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "#6B7280" }}>
                  {isCollected ? masterpiece.artist : "探索神秘目的地解锁"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
