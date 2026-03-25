"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GamePageHeader from "@/components/ui/GamePageHeader";
import { useUserStore } from "@/store/user.store";
import { CAREERS } from "@/lib/careers";

export default function CareerPage() {
  const router = useRouter();
  const { chickenCoin, currentCareerId, unlockedCareerIds, unlockCareer, setCurrentCareer } = useUserStore();

  const handleSelect = (careerId: string, cost: number, unlocked: boolean) => {
    if (unlocked) {
      setCurrentCareer(careerId);
      router.push("/");
    } else {
      if (chickenCoin >= cost) {
        const ok = unlockCareer(careerId, cost);
        if (ok) {
          setCurrentCareer(careerId);
          router.push("/");
        }
      }
    }
  };

  return (
    <div style={{ height: "100%", background: "#F5F3FF", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <GamePageHeader title="职业选择" />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6B7280", textAlign: "center" }}>
          选择你的职业，解锁独特AI技能
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CAREERS.map((career) => {
            const unlocked = unlockedCareerIds.includes(career.id);
            const isCurrent = currentCareerId === career.id;
            const canAfford = chickenCoin >= career.unlockCost;

            return (
              <div
                key={career.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 16,
                  border: isCurrent ? `2px solid ${career.color}` : "2px solid transparent",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  {/* 头像 */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: career.bgColor,
                      border: `3px solid ${career.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {unlocked ? (
                      <Image src="/images/characters/fortune-chicken.png" alt={career.name} width={40} height={40} />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={career.color} opacity={0.4}>
                        <path d="M12 1C8.676 1 6 3.676 6 7v1H4v14h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                      </svg>
                    )}
                  </div>

                  {/* 信息 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#1F2937" }}>{career.name}</span>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#fff",
                            background: career.color,
                            borderRadius: 8,
                            padding: "1px 6px",
                          }}
                        >
                          当前
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6B7280" }}>{career.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                      {career.skills.map(skill => (
                        <span
                          key={skill.id}
                          style={{
                            fontSize: 10,
                            color: career.color,
                            background: `${career.color}11`,
                            border: `1px solid ${career.color}33`,
                            borderRadius: 6,
                            padding: "1px 6px",
                          }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <button
                    onClick={() => handleSelect(career.id, career.unlockCost, unlocked)}
                    style={{
                      flexShrink: 0,
                      padding: "8px 14px",
                      borderRadius: 12,
                      border: "none",
                      background: isCurrent
                        ? "#E5E7EB"
                        : unlocked
                        ? career.color
                        : canAfford
                        ? "linear-gradient(135deg, #FCD34D, #F59E0B)"
                        : "#E5E7EB",
                      color: isCurrent ? "#9CA3AF" : unlocked || canAfford ? "#fff" : "#9CA3AF",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: isCurrent ? "default" : "pointer",
                    }}
                  >
                    {isCurrent ? "使用中" : unlocked ? "切换" : canAfford ? `${career.unlockCost}币` : "不足"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
