// app/layout.tsx v5.0.0
import type { Metadata, Viewport } from "next";
import "./style.css";
import { Geist, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageSync } from "@/hooks/use-language";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1 & userScalable: false 会剥夺视障用户双指缩放能力（WCAG 1.4.4）。
  // 此处保留默认行为以符合无障碍标准。
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "ZenDraw v5.0.0 | 禅抽 — Truly Random Draw",
  description:
    "ZenDraw (禅抽) — a professional, full-screen random draw application with Apple-inspired design, customizable rules, multi-language support, slot-machine style rolling animations, and persistent settings.",
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
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang 默认 "zh"（项目默认语言），LanguageSync 会在客户端 hydrate 后修正为用户偏好
  return (
    <html
      lang="zh"
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
          <LanguageSync />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
