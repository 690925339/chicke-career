"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GamePageHeader from "@/components/ui/GamePageHeader";
import { useUserStore } from "@/store/user.store";

export default function HistoryPage() {
  const { skillRecords } = useUserStore();

  return (
    <div style={{ height: "100%", background: "#FFFBEB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <GamePageHeader title="历史记录" />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        {skillRecords.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 300,
              gap: 12,
            }}
          >
            <Image src="/images/icons/scroll.svg" alt="" width={60} height={60} style={{ opacity: 0.3 }} />
            <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>暂无记录，去使用技能吧~</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {skillRecords.map((record) => (
              <div
                key={record.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Image src="/images/icons/scroll.svg" alt="" width={32} height={32} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1F2937" }}>手相解读报告</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>
                      {new Date(record.createdAt).toLocaleString("zh-CN")} · {record.inputs.gender === "male" ? "男" : "女"} · {record.inputs.age}岁
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    background: "#F5F3FF",
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 13,
                    color: "#4B5563",
                    lineHeight: 1.6,
                  }}
                >
                  {record.result.overall}
                </div>
                <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "事业", value: record.result.career },
                    { label: "感情", value: record.result.love },
                    { label: "财富", value: record.result.wealth },
                    { label: "健康", value: record.result.health },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "#FAFAFA", borderRadius: 8, padding: "6px 10px" }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{item.label}</span>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#374151", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
