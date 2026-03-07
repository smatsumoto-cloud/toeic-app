"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuizResults, type QuizResult } from "@/lib/storage";

const parts = [
  { id: 5, name: "Part 5", desc: "短文穴埋め問題", questions: 20, color: "blue", href: "/test/part5", available: true, note: "40問からランダム出題" },
  { id: 6, name: "Part 6", desc: "長文穴埋め問題", questions: 16, color: "green", href: "/test/part6", available: true, note: "" },
  { id: 7, name: "Part 7", desc: "読解問題", questions: 54, color: "purple", href: "/test/part7", available: false, note: "" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
};

function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${parseInt(m)}月${parseInt(d)}日`;
}

export default function TestPage() {
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const results = getQuizResults().slice(0, 5);
    setRecentResults(results);
    setMounted(true);
  }, []);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">テスト</h1>
        <p className="text-sm text-gray-500 mt-1">パート別・模擬テストで実力を測ろう</p>
      </div>

      {/* パート別練習 */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">パート別練習</h2>
      <div className="space-y-3 mb-5">
        {parts.map((part) =>
          part.available ? (
            <Link
              key={part.id}
              href={part.href}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${colorMap[part.color]}`}>
                P{part.id}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{part.name}</div>
                <div className="text-xs text-gray-400">{part.desc} · {part.questions}問{part.note ? ` · ${part.note}` : ""}</div>
              </div>
              <svg className="text-gray-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div
              key={part.id}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 opacity-50"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${colorMap[part.color]}`}>
                P{part.id}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm">{part.name}</div>
                <div className="text-xs text-gray-400">{part.desc} · {part.questions}問{part.note ? ` · ${part.note}` : ""}</div>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">近日公開</span>
            </div>
          )
        )}
      </div>

      {/* 最近の結果 */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">最近の結果</h2>
      {!mounted ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : recentResults.length > 0 ? (
        <div className="space-y-2">
          {recentResults.map((result) => {
            const rate = Math.round((result.correct / result.total) * 100);
            return (
              <div
                key={result.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100"
              >
                <div className="text-xs text-gray-400 w-12">{formatDate(result.date)}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {result.part === "part5" ? "Part 5" : "Part 6"}
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className={`rounded-full h-1.5 ${rate >= 75 ? "bg-green-500" : rate >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {result.correct}/{result.total}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-400">まだ演習結果がありません</p>
          <p className="text-xs text-gray-400 mt-1">テストを受けると結果が表示されます</p>
        </div>
      )}
    </div>
  );
}
