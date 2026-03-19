export default function PalmReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#F5F3FF", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {children}
    </div>
  );
}
