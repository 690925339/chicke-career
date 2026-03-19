import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鸡鸡养成记",
  description: "让你的鸡鸡成为命运预言师！",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, padding: 0, width: "100%", height: "100dvh", overflow: "hidden" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", height: "100%", position: "relative", overflow: "hidden" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
