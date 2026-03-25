"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GamePageHeader from "@/components/ui/GamePageHeader";
import { useUserStore } from "@/store/user.store";
import { MASTERPIECES } from "@/lib/masterpieces";
import { v4 as uuidv4 } from "uuid";

export default function TravelPage() {
  const router = useRouter();
  const { 
    aura, 
    travelStartTime, 
    travelEndTime, 
    masterpieces, 
    startTravel, 
    collectTravelReward,
    cancelTravel
  } = useUserStore();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!travelEndTime) {
      setTimeLeft(0);
      setIsReady(false);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(travelEndTime).getTime();
      const diff = Math.max(0, end - now);
      setTimeLeft(Math.floor(diff / 1000));
      if (diff === 0) {
        setIsReady(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [travelEndTime]);

  const handleStart = (mins: number) => {
    if (aura < 2) {
      alert("灵气不足，无法远行哦~");
      return;
    }
    startTravel(mins);
  };

  const handleCollect = () => {
    // 随机抽取一个名画
    const randomIdx = Math.floor(Math.random() * MASTERPIECES.length);
    const mockData = MASTERPIECES[randomIdx];
    
    collectTravelReward({
      id: uuidv4(),
      ...mockData,
      collectedAt: new Date().toISOString()
    });
    setIsReady(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ height: "100%", background: "#F0FDF4", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <GamePageHeader title="灵鸡环游记" />
      
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", paddingBottom: 100 }}>
        {/* 当前状态卡片 */}
        <div className="glass-card" style={{ 
          borderRadius: 32, 
          padding: 24, 
          textAlign: "center", 
          marginBottom: 24,
          background: "rgba(255,255,255,0.8)",
          border: "2px solid #DCFCE7"
        }}>
          {travelStartTime ? (
            <>
              <div className="animate-float" style={{ fontSize: 64, marginBottom: 16 }}>🌍</div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#065F46" }}>
                {isReady ? "旅行归来！" : "正在环游世界中..."}
              </h3>
              <p style={{ margin: "8px 0 20px", fontSize: 13, color: "#6B7280" }}>
                {isReady ? "主角鸡带回了珍贵的礼物" : `预计还需要 ${formatTime(timeLeft)} 后回到温暖的家`}
              </p>
              
              {isReady ? (
                <button 
                  className="game-btn main-action-btn"
                  onClick={handleCollect}
                  style={{ width: "100%", padding: "16px", borderRadius: 20, fontSize: 16 }}
                >
                  🎁 领取名画与奖励
                </button>
              ) : (
                <button 
                  onClick={cancelTravel}
                  style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 13, textDecoration: "underline" }}
                >
                  中止旅行 (不返还灵气)
                </button>
              )}
            </>
          ) : (
            <>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#065F46" }}>主角鸡正在休息</h3>
              <p style={{ margin: "8px 0 20px", fontSize: 13, color: "#6B7280" }}>想要让它出门带回名画吗？</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button 
                  className="game-btn"
                  onClick={() => handleStart(1)} // 1 min for demo
                  style={{ 
                    padding: 16, 
                    borderRadius: 20, 
                    background: "#DCFCE7", 
                    border: "2px solid #BBF7D0",
                    color: "#065F46",
                    fontWeight: 700
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🥨</div>
                  短途旅行 (1'min)
                </button>
                <button 
                  className="game-btn"
                  onClick={() => handleStart(30)}
                  style={{ 
                    padding: 16, 
                    borderRadius: 20, 
                    background: "#FEF3C7", 
                    border: "2px solid #FDE68A",
                    color: "#92400E",
                    fontWeight: 700
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🗼</div>
                  长途旅行 (30'min)
                </button>
              </div>
              <p style={{ marginTop: 12, fontSize: 11, color: "#9CA3AF" }}>消耗 2 点灵气</p>
            </>
          )}
        </div>

        {/* 收藏室标题 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "0 8px" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1F2937" }}>名画收藏室</h3>
          <span style={{ fontSize: 13, color: "#6B7280" }}>已收集 {masterpieces.length} / {MASTERPIECES.length}</span>
        </div>

        {/* 收藏展示区 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {masterpieces.length === 0 ? (
            <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", background: "#fff", borderRadius: 24, border: "2px dashed #E5E7EB" }}>
              <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>目前还没有收藏，快让灵鸡去旅行吧~</p>
            </div>
          ) : (
            masterpieces.map(item => (
              <div key={item.id} className="glass-card" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #fff" }}>
                <div style={{ position: "relative", width: "100%", paddingTop: "120%", background: "#F3F4F6" }}>
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill 
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                  />
                </div>
                <div style={{ padding: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h4>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "#9CA3AF" }}>{item.originalArtist}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 底部填充 */}
      <div style={{ height: 40 }} />
    </div>
  );
}
