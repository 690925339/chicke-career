"use client";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
}

export default function GamePageHeader({ title }: Props) {
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        background: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        flexShrink: 0,
        zIndex: 30,
        minHeight: 52,
      }}
    >
      <button
        onClick={() => router.push("/")}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#F3F4F6",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          zIndex: 31,
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 14L7 9l4-5" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: 16,
          fontWeight: 700,
          color: "#1F2937",
          marginLeft: -40,
          pointerEvents: "none",
        }}
      >
        {title}
      </span>
      <div style={{ width: 40, flexShrink: 0 }} />
    </div>
  );
}
