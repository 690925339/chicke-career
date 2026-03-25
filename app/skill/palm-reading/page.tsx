"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSkillStore } from "@/store/skill.store";
import { useUserStore } from "@/store/user.store";
import ImageUploader from "@/components/skill/ImageUploader";
import { v4 as uuidv4 } from "uuid";
import { PalmReadingResult } from "@/types";

const MOCK_RESULT: PalmReadingResult = {
  overall: "您的掌纹显示您天生具有领导气质，生命线深长清晰，预示着旺盛的生命力。智慧线延伸至月丘，代表您拥有丰富的想象力和创造力。",
  career: "事业线清晰明朗，35岁前后将迎来重要转折点。您适合从事需要创意和沟通的工作，管理才能突出。",
  love: "感情线呈弧形上扬，感情丰富而专一。桃花运在春季最旺，缘分往往出现在意想不到的场合。",
  wealth: "财运线延伸至木星丘，财运稳健，适合长期投资理财。中年后财富积累加速，晚年生活富足。",
  health: "生命线光滑饱满，健康状况良好。需注意肠胃保养，保持规律作息，避免过度劳累。",
  luckyNumber: 8,
  luckyColor: "紫色",
  advice: "把握眼前机遇，勇于迈出第一步。贵人运强，多与正能量的人交流，会有意外收获。",
};

export default function PalmReadingPage() {
  const router = useRouter();
  const { step, age, gender, leftHandPreview, rightHandPreview, result, setStep, setInfo, setHandImage, setResult, reset } = useSkillStore();
  const { addSkillRecord, addCoins } = useUserStore();

  const [localAge, setLocalAge] = useState("");
  const [localGender, setLocalGender] = useState<"male" | "female" | null>(null);

  const handleStartAnalysis = async () => {
    setStep("loading");
    // 模拟 AI 分析延迟
    await new Promise((r) => setTimeout(r, 3000));
    setResult(MOCK_RESULT);
    addSkillRecord({
      id: uuidv4(),
      careerId: "fortune-teller",
      skillId: "palm-reading",
      createdAt: new Date().toISOString(),
      result: MOCK_RESULT,
      inputs: { age: age!, gender: gender! },
    });
    addCoins(20);
  };

  const handleDone = () => {
    reset();
    router.push("/");
  };

  // 步骤1：基本信息
  if (step === "info") {
    return (
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column" }}>
        <button onClick={() => { reset(); router.push("/"); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "#7C3AED", fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          返回
        </button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="animate-float" style={{ display: "inline-block", marginBottom: 12 }}>
            <Image src="/images/characters/fortune-chicken.png" alt="算命鸡" width={80} height={80} />
          </div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#4C1D95" }}>算命鸡为您解读</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6B7280" }}>请提供基本信息，越详细越准确哦</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 20px rgba(124,58,237,0.1)" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>年龄</label>
            <input
              type="number"
              value={localAge}
              onChange={(e) => setLocalAge(e.target.value)}
              placeholder="请输入年龄"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #E5E7EB",
                borderRadius: 12,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#A78BFA")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>性别</label>
            <div style={{ display: "flex", gap: 12 }}>
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setLocalGender(g)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: `2px solid ${localGender === g ? "#7C3AED" : "#E5E7EB"}`,
                    background: localGender === g ? "#EDE9FE" : "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    color: localGender === g ? "#7C3AED" : "#6B7280",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {g === "male" ? "男生" : "女生"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              if (!localAge || !localGender) return;
              setInfo(Number(localAge), localGender);
              setStep("left-hand");
            }}
            disabled={!localAge || !localGender}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background: localAge && localGender ? "linear-gradient(135deg, #7C3AED, #4C1D95)" : "#E5E7EB",
              color: localAge && localGender ? "#fff" : "#9CA3AF",
              fontSize: 16,
              fontWeight: 700,
              cursor: localAge && localGender ? "pointer" : "default",
              transition: "all 0.2s",
            }}
          >
            下一步
          </button>
        </div>
      </div>
    );
  }

  // 步骤2：左手
  if (step === "left-hand") {
    return (
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column" }}>
        <button onClick={() => setStep("info")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "#7C3AED", fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          上一步
        </button>
        <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#4C1D95" }}>上传左手照片</h2>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6B7280" }}>请将左手掌心朝上，在自然光下拍摄</p>
        <ImageUploader
          preview={leftHandPreview}
          label="拍摄或选择左手照片"
          onSelect={(file, preview) => setHandImage("left", file, preview)}
        />
        <button
          onClick={() => setStep("right-hand")}
          disabled={!leftHandPreview}
          style={{
            marginTop: "auto",
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: leftHandPreview ? "linear-gradient(135deg, #7C3AED, #4C1D95)" : "#E5E7EB",
            color: leftHandPreview ? "#fff" : "#9CA3AF",
            fontSize: 16,
            fontWeight: 700,
            cursor: leftHandPreview ? "pointer" : "default",
          }}
        >
          下一步
        </button>
      </div>
    );
  }

  // 步骤3：右手
  if (step === "right-hand") {
    return (
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column" }}>
        <button onClick={() => setStep("left-hand")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "#7C3AED", fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          上一步
        </button>
        <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#4C1D95" }}>上传右手照片</h2>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6B7280" }}>请将右手掌心朝上，在自然光下拍摄</p>
        <ImageUploader
          preview={rightHandPreview}
          label="拍摄或选择右手照片"
          onSelect={(file, preview) => setHandImage("right", file, preview)}
        />
        <button
          onClick={() => setStep("confirm")}
          disabled={!rightHandPreview}
          style={{
            marginTop: "auto",
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: rightHandPreview ? "linear-gradient(135deg, #7C3AED, #4C1D95)" : "#E5E7EB",
            color: rightHandPreview ? "#fff" : "#9CA3AF",
            fontSize: 16,
            fontWeight: 700,
            cursor: rightHandPreview ? "pointer" : "default",
          }}
        >
          下一步
        </button>
      </div>
    );
  }

  // 步骤4：确认
  if (step === "confirm") {
    return (
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column" }}>
        <button onClick={() => setStep("right-hand")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6, color: "#7C3AED", fontSize: 14 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          上一步
        </button>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#4C1D95" }}>确认信息</h2>

        <div style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(124,58,237,0.1)", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, background: "#F5F3FF", borderRadius: 12, padding: 12, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>年龄</p>
              <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#4C1D95" }}>{age}岁</p>
            </div>
            <div style={{ flex: 1, background: "#F5F3FF", borderRadius: 12, padding: 12, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>性别</p>
              <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#4C1D95" }}>{gender === "male" ? "男" : "女"}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[leftHandPreview, rightHandPreview].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src!} alt={i === 0 ? "左手" : "右手"} style={{ flex: 1, height: 100, objectFit: "cover", borderRadius: 12 }} />
            ))}
          </div>
        </div>

        <button
          onClick={handleStartAnalysis}
          style={{
            marginTop: "auto",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(124,58,237,0.4)",
          }}
        >
          开始解读命运
        </button>
      </div>
    );
  }

  // 步骤5：加载中
  if (step === "loading") {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: "linear-gradient(180deg, #EDE9FE 0%, #F5F3FF 100%)",
        }}
      >
        <div className="animate-float">
          <Image src="/images/characters/fortune-chicken.png" alt="算命鸡" width={100} height={100} />
        </div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#4C1D95" }}>算命鸡正在解读中...</h3>
        <p style={{ margin: 0, fontSize: 13, color: "#6B7280", textAlign: "center", maxWidth: 240 }}>正在深度分析您的掌纹，感知命运脉络，请稍候</p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#7C3AED",
                animation: "float 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // 步骤6：结果
  if (step === "result" && result) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* 头部 */}
        <div
          style={{
            background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
            padding: "24px 20px 32px",
            textAlign: "center",
          }}
        >
          <Image src="/images/characters/fortune-chicken.png" alt="算命鸡" width={60} height={60} style={{ filter: "brightness(10)", marginBottom: 10 }} />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>命运解读报告</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            {gender === "male" ? "男" : "女"} · {age}岁 · 幸运数字 {result.luckyNumber} · 幸运色 {result.luckyColor}
          </p>
        </div>

        <div style={{ padding: "0 16px 24px", marginTop: -12 }}>
          {/* 整体运势 */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 4px 16px rgba(124,58,237,0.1)" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#4C1D95" }}>整体运势</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{result.overall}</p>
          </div>

          {/* 分项 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { label: "事业运", content: result.career, color: "#1D4ED8", bg: "#DBEAFE" },
              { label: "感情运", content: result.love, color: "#BE185D", bg: "#FCE7F3" },
              { label: "财富运", content: result.wealth, color: "#B45309", bg: "#FEF3C7" },
              { label: "健康运", content: result.health, color: "#065F46", bg: "#D1FAE5" },
            ].map((item) => (
              <div key={item.label} style={{ background: item.bg, borderRadius: 16, padding: 14 }}>
                <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: item.color }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{item.content}</p>
              </div>
            ))}
          </div>

          {/* 建议 */}
          <div style={{ background: "linear-gradient(135deg, #EDE9FE, #FDE8FF)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#4C1D95" }}>算命鸡的建议</p>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{result.advice}</p>
          </div>

          <button
            onClick={handleDone}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(124,58,237,0.4)",
            }}
          >
            完成，获得 +20 鸡币
          </button>
        </div>
      </div>
    );
  }

  return null;
}
