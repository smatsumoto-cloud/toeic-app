"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { wordCategories, allWords } from "@/data/wordData";
import { getWordStatuses, type WordStatus } from "@/lib/storage";

const colorMap: Record<string, { bg: string; text: string; bar: string; card: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", bar: "bg-blue-500", card: "bg-blue-50 border-blue-100" },
  green: { bg: "bg-green-100", text: "text-green-600", bar: "bg-green-500", card: "bg-green-50 border-green-100" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", bar: "bg-orange-500", card: "bg-orange-50 border-orange-100" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", bar: "bg-purple-500", card: "bg-purple-50 border-purple-100" },
  red: { bg: "bg-red-100", text: "text-red-600", bar: "bg-red-500", card: "bg-red-50 border-red-100" },
};

export default function WordsPage() {
  const [statuses, setStatuses] = useState<Record<string, WordStatus>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStatuses(getWordStatuses());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-36 bg-gray-200 rounded-2xl mb-5" />
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const totalWords = allWords.length;
  const knownCount = allWords.filter((w) => statuses[w.id] === "known").length;
  const learningCount = allWords.filter((w) => statuses[w.id] === "learning").length;
  const completionRate = Math.round((knownCount / totalWords) * 100);

  const reviewWords = allWords.filter((w) => statuses[w.id] === "learning");
  const newWords = allWords.filter((w) => !statuses[w.id] || statuses[w.id] === "new");

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">単語</h1>
        <p className="text-sm text-gray-500 mt-1">フラッシュカードで効率的に覚えよう</p>
      </div>

      {/* 今日の復習バナー */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-5 mb-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🔁</span>
          <span className="font-semibold">今日の復習</span>
        </div>
        <p className="text-sm text-green-100 mb-1">
          復習中の単語: <strong>{reviewWords.length}単語</strong>
        </p>
        <p className="text-sm text-green-100 mb-4">
          未学習: <strong>{newWords.length}単語</strong>
        </p>
        {reviewWords.length > 0 ? (
          <Link
            href="/words/review"
            className="inline-block bg-white text-green-600 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-green-50 transition-colors"
          >
            復習スタート ({reviewWords.length})
          </Link>
        ) : newWords.length > 0 ? (
          <Link
            href="/words/review"
            className="inline-block bg-white text-green-600 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-green-50 transition-colors"
          >
            新出単語を学習する
          </Link>
        ) : (
          <span className="text-sm text-green-200">すべて学習済みです！</span>
        )}
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-xl font-bold text-gray-800">{knownCount}</div>
          <div className="text-xs text-gray-400">習得済み</div>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-xl font-bold text-gray-800">{totalWords}</div>
          <div className="text-xs text-gray-400">合計単語</div>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
          <div className="text-xl font-bold text-green-600">{completionRate}%</div>
          <div className="text-xs text-gray-400">完了率</div>
        </div>
      </div>

      {/* カテゴリ */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">カテゴリ別</h2>
      <div className="space-y-3">
        {wordCategories.map((cat) => {
          const c = colorMap[cat.color];
          const catWords = allWords.filter((w) => w.categoryId === cat.id);
          const catKnown = catWords.filter((w) => statuses[w.id] === "known").length;
          const catLearning = catWords.filter((w) => statuses[w.id] === "learning").length;
          const rate = Math.round((catKnown / catWords.length) * 100);
          return (
            <Link
              key={cat.id}
              href={`/words/flashcard/${cat.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg} ${c.text} text-sm font-bold`}>
                {cat.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800 text-sm">{cat.name}</span>
                  <span className={`text-sm font-semibold ${c.text}`}>{rate}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5 mb-1">
                  <div className={`${c.bar} rounded-full h-1.5 transition-all`} style={{ width: `${rate}%` }} />
                </div>
                <div className="text-xs text-gray-400">
                  {catKnown}/{catWords.length} 習得
                  {catLearning > 0 && (
                    <span className="ml-2 text-orange-400">復習中 {catLearning}</span>
                  )}
                </div>
              </div>
              <svg className="text-gray-300 w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
