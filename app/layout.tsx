// app/layout.tsx v3.3
import type { Metadata, Viewport } from "next";
import "./style.css";
import { Geist, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1 & userScalable: false 会剥夺视障用户双指缩放能力（WCAG 1.4.4）。
  // 此处保留默认行为以符合无障碍标准。
};

export const metadata: Metadata = {
  title: "ZenDraw | 禅抽 v3.3",
  description:
    "A professional, full-screen random draw application with Apple-inspired design, customizable rules, multi-language support, slot-machine style rolling animations, and persistent settings.",
  keywords: [
    "ZenDraw",
    "禅抽",
    "random draw",
    "lucky draw",
    "randomizer",
    "抽签",
    "随机数",
    "抽奖",
    "roller",
    "slot machine",
  ],
  authors: [{ name: "Sut" }],
  robots: { index: false, follow: false }, // 纯工具站点，避免被搜索引擎收录
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, jetBrainsMono.variable, playfairDisplay.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
