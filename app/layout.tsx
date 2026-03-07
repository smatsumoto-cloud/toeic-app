import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOEIC学習アプリ",
  description: "TOEIC対策のための総合学習アプリ。Part5・Part6演習、単語フラッシュカード、分析機能搭載。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TOEIC学習",
  },
  openGraph: {
    title: "TOEIC学習アプリ",
    description: "TOEIC対策のための総合学習アプリ。Part5・Part6演習、単語フラッシュカード、分析機能搭載。",
    type: "website",
    locale: "ja_JP",
    siteName: "TOEIC学習アプリ",
  },
  twitter: {
    card: "summary",
    title: "TOEIC学習アプリ",
    description: "TOEIC対策のための総合学習アプリ",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={geist.className}>
        <main className="min-h-screen pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
