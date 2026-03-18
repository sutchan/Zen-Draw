// app/layout.tsx v2.1.0
import type {Metadata} from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'ZenDraw | 禅抽 v2.1.0',
  description: 'A professional, full-screen random draw application with customizable rules, history, and multi-language support. Perfect for lucky draws, classroom activities, and games.',
  keywords: ['ZenDraw', '禅抽', 'random draw', 'lucky draw', 'randomizer', '抽签', '随机数', '抽奖', 'roller', 'slot machine'],
  authors: [{ name: 'Sut' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body suppressHydrationWarning>
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
