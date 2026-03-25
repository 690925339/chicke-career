"use client";
import { useRef } from "react";
import Image from "next/image";

interface Props {
  preview: string | null;
  label: string;
  onSelect: (file: File, preview: string) => void;
}

export default function ImageUploader({ preview, label, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onSelect(file, ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleChange} />
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          width: "100%",
          height: 160,
          borderRadius: 16,
          border: "2px dashed #A78BFA",
          background: preview ? "transparent" : "#F5F3FF",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="预览" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Image src="/images/icons/checkin.svg" alt="" width={40} height={40} style={{ opacity: 0.5 }} />
            <span style={{ fontSize: 14, color: "#7C3AED" }}>{label}</span>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>点击选择图片</span>
          </div>
        )}
      </button>
      {preview && (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            marginTop: 8,
            width: "100%",
            padding: "8px",
            background: "none",
            border: "1px solid #A78BFA",
            borderRadius: 8,
            color: "#7C3AED",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          重新上传
        </button>
      )}
    </div>
  );
}
