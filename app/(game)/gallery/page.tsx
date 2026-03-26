"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GamePageHeader from "@/components/ui/GamePageHeader";
import { useUserStore } from "@/store/user.store";
import { MASTERPIECES, Masterpiece } from "@/lib/masterpieces";

export default function GalleryPage() {
  const router = useRouter();
  const { collectedMasterpieceIds } = useUserStore();
  const [selectedArt, setSelectedArt] = useState<Masterpiece | null>(null);

  // 获取所有已收集的名画对象
  const myMasterpieces = MASTERPIECES.filter(m => collectedMasterpieceIds.includes(m.id));

  return (
    <div style={{ height: "100%", background: "#FDFCF0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <GamePageHeader title="灵鸡名画馆" />
      
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", paddingBottom: 100 }}>
        {myMasterpieces.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.3 }}>🖼️</div>
            <p style={{ color: "#9CA3AF", fontSize: 16, fontWeight: 500 }}>
              这里空空如也...<br/>快去派主角鸡环游世界吧！
            </p>
            <button 
              className="game-btn btn-primary"
              onClick={() => router.push("/travel")}
              style={{ marginTop: 24, padding: "12px 24px", borderRadius: 20 }}
            >
              立即出发
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {myMasterpieces.map((m) => (
              <motion.div
                key={m.id}
                layoutId={`art-${m.id}`}
                onClick={() => setSelectedArt(m)}
                className="glass-card"
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  border: "4px solid #F3F4F6"
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", background: "#fcfcfc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                   🖼️
                </div>
                <div style={{ padding: 12, textAlign: "center" }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#1F2937" }}>{m.name}</h4>
                  <div style={{ 
                    display: "inline-block",
                    marginTop: 6,
                    padding: "2px 8px",
                    borderRadius: 8,
                    background: m.rarity === 'SSR' ? '#FEF3C7' : m.rarity === 'S' ? '#F5F3FF' : '#F3F4F6',
                    fontSize: 10,
                    fontWeight: 800,
                    color: m.rarity === 'SSR' ? '#D97706' : m.rarity === 'S' ? '#7C3AED' : '#6B7280'
                  }}>
                    {m.rarity} 级收藏
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 详情大图弹窗 */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArt(null)}
            style={{ 
              position: "absolute", 
              inset: 0, 
              zIndex: 200, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              padding: 24, 
              background: "rgba(0,0,0,0.85)", 
              backdropFilter: "blur(10px)" 
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{ width: "100%", maxWidth: 380, borderRadius: 32, padding: 24, background: "#fff" }}
            >
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: 2 }}>{selectedArt.artist} · 作品</span>
                <h2 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#1F2937" }}>《{selectedArt.name}》</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>原作：{selectedArt.originalName}</p>
              </div>

              <div style={{ 
                position: "relative", 
                width: "100%", 
                aspectRatio: "1/1", 
                borderRadius: 24, 
                background: "#fcfcfc", 
                marginBottom: 24, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: 80, 
                border: "12px solid #272727",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}>
                🖼️
              </div>

              <div style={{ 
                background: "rgba(124, 58, 237, 0.05)",
                padding: 20,
                borderRadius: 20,
                border: "1px dashed rgba(124, 58, 237, 0.2)",
                marginBottom: 24
              }}>
                <p style={{ margin: 0, fontSize: 15, color: "#4B2D8F", fontStyle: "italic", lineHeight: 1.7, textAlign: "center" }}>
                  "{selectedArt.quote}"
                </p>
              </div>

              <button 
                className="game-btn btn-primary"
                onClick={() => setSelectedArt(null)}
                style={{ width: "100%", padding: "16px", borderRadius: 20, fontSize: 16 }}
              >
                收起图卷
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
