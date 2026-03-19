"use client";
import Image from "next/image";
import GamePageHeader from "@/components/ui/GamePageHeader";
import { useUserStore } from "@/store/user.store";

const ACHIEVEMENT_LIST = [
  { id: "first-reading", title: "初次算命", description: "完成第一次手相解读", reward: { chickenCoin: 50 } },
  { id: "ten-readings", title: "命理通", description: "累计完成10次手相解读", reward: { chickenCoin: 200 } },
  { id: "check-in-7", title: "七日虔诚", description: "连续签到7天", reward: { chickenCoin: 100, diamond: 1 } },
  { id: "rich-chicken", title: "富贵鸡", description: "拥有1000枚鸡币", reward: { diamond: 2 } },
];

export default function AchievementPage() {
  const { chickenCoin, diamond, skillRecords, checkInStreak } = useUserStore();

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
      <GamePageHeader title="成就" />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        {/* 资源概览 */}
        <div
          style={{
            background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            display: "flex",
            gap: 16,
          }}
        >
          {[
            { icon: "/chicke-career/images/icons/coin.svg", label: "鸡币", value: chickenCoin },
            { icon: "/chicke-career/images/icons/diamond.svg", label: "钻石", value: diamond },
            { icon: "/chicke-career/images/icons/chest.svg", label: "成就", value: `${unlockedCount}/${ACHIEVEMENT_LIST.length}` },
          ].map((item) => (
            <div key={item.label} style={{ flex: 1, textAlign: "center" }}>
              <Image src={item.icon} alt={item.label} width={28} height={28} style={{ margin: "0 auto" }} />
              <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 700, color: "#fff" }}>{item.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* 成就列表 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ACHIEVEMENT_LIST.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            return (
              <div
                key={achievement.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
                  <Image src="/chicke-career/images/icons/chest.svg" alt="" width={28} height={28} style={{ opacity: unlocked ? 1 : 0.3 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{achievement.title}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6B7280" }}>{achievement.description}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    {achievement.reward.chickenCoin && (
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Image src="/chicke-career/images/icons/coin.svg" alt="" width={14} height={14} />
                        <span style={{ fontSize: 11, color: "#B45309", fontWeight: 600 }}>+{achievement.reward.chickenCoin}</span>
                      </div>
                    )}
                    {achievement.reward.diamond && (
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Image src="/chicke-career/images/icons/diamond.svg" alt="" width={14} height={14} />
                        <span style={{ fontSize: 11, color: "#1E40AF", fontWeight: 600 }}>+{achievement.reward.diamond}</span>
                      </div>
                    )}
                  </div>
                </div>
                {unlocked && (
                  <div
                    style={{
                      background: "#D1FAE5",
                      borderRadius: 8,
                      padding: "3px 8px",
                      fontSize: 11,
                      color: "#065F46",
                      fontWeight: 600,
                    }}
                  >
                    已完成
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
