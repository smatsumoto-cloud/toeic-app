"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPlanGoal,
  estimateScore,
  getStudyLog,
  getWordStatuses,
} from "@/lib/storage";
import { allWords } from "@/data/wordData";

function calcStreak(log: Record<string, { wordsStudied: number; minutesStudied: number; quizzesTaken: number }>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = log[key];
    if (entry && (entry.minutesStudied > 0 || entry.wordsStudied > 0)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [targetScore, setTargetScore] = useState(900);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [todayWords, setTodayWords] = useState(0);
  const [todayQuizzes, setTodayQuizzes] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reviewWordCount, setReviewWordCount] = useState(0);

  useEffect(() => {
    const goal = getPlanGoal();
    setTargetScore(goal.targetScore);
    setDailyMinutes(goal.dailyMinutes);

    const score = estimateScore();
    setCurrentScore(score);

    const log = getStudyLog();
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayEntry = log[todayKey];
    setTodayWords(todayEntry?.wordsStudied ?? 0);
    setTodayQuizzes(todayEntry?.quizzesTaken ?? 0);
    setTodayMinutes(todayEntry?.minutesStudied ?? 0);
    setStreak(calcStreak(log));

    const statuses = getWordStatuses();
    const reviewCount = allWords.filter((w) => statuses[w.id] === "learning").length;
    setReviewWordCount(reviewCount);

    setMounted(true);
  }, []);

  const scoreProgress = currentScore !== null
    ? Math.min(100, Math.round((currentScore / targetScore) * 100))
    : 0;

  // ローディング中はスケルトン
  if (!mounted) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-32 mb-6" />
        <div className="h-36 bg-gray-200 rounded-2xl mb-5" />
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">TOEIC学習</h1>
        <p className="text-sm text-gray-500 mt-1">今日も一緒に頑張りましょう</p>
      </div>

      {/* スコア目標カード */}
      <div className="bg-blue-600 rounded-2xl p-5 mb-5 text-white">
        <p className="text-sm font-medium text-blue-100">目標スコア</p>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-5xl font-bold">{targetScore}</span>
          <span className="text-blue-200 mb-1">点</span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm text-blue-100 mb-1">
            <span>現在の推定スコア</span>
            <span>{currentScore !== null ? `${currentScore}点` : "未計測"}</span>
          </div>
          <div className="bg-blue-500 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${scoreProgress}%` }}
            />
          </div>
          {currentScore === null && (
            <p className="text-xs text-blue-200 mt-1">テストを受けるとスコアが表示されます</p>
          )}
        </div>
      </div>

      {/* 今日の学習 */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">今日の学習</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className={`text-2xl font-bold ${todayWords > 0 ? "text-blue-600" : "text-gray-300"}`}>
            {todayWords}
          </div>
          <div className="text-xs text-gray-500 mt-1">単語学習</div>
          <div className="text-xs text-gray-400">目標: 20単語</div>
          {todayWords > 0 && (
            <div className="bg-gray-100 rounded-full h-1 mt-2">
              <div className="bg-blue-400 rounded-full h-1" style={{ width: `${Math.min(100, (todayWords / 20) * 100)}%` }} />
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className={`text-2xl font-bold ${todayQuizzes > 0 ? "text-green-600" : "text-gray-300"}`}>
            {todayQuizzes}
          </div>
          <div className="text-xs text-gray-500 mt-1">練習問題</div>
          <div className="text-xs text-gray-400">目標: 2セット</div>
          {todayQuizzes > 0 && (
            <div className="bg-gray-100 rounded-full h-1 mt-2">
              <div className="bg-green-400 rounded-full h-1" style={{ width: `${Math.min(100, (todayQuizzes / 2) * 100)}%` }} />
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className={`text-2xl font-bold ${todayMinutes > 0 ? "text-orange-500" : "text-gray-300"}`}>
            {todayMinutes}
          </div>
          <div className="text-xs text-gray-500 mt-1">学習時間 (分)</div>
          <div className="text-xs text-gray-400">目標: {dailyMinutes}分</div>
          {todayMinutes > 0 && (
            <div className="bg-gray-100 rounded-full h-1 mt-2">
              <div className="bg-orange-400 rounded-full h-1" style={{ width: `${Math.min(100, (todayMinutes / dailyMinutes) * 100)}%` }} />
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className={`text-2xl font-bold ${streak > 0 ? "text-purple-600" : "text-gray-300"}`}>
            {streak}
          </div>
          <div className="text-xs text-gray-500 mt-1">連続学習</div>
          <div className="text-xs text-gray-400">日間ストリーク</div>
          {streak >= 3 && (
            <div className="text-xs text-purple-400 mt-1">🔥 継続中</div>
          )}
        </div>
      </div>

      {/* クイックスタート */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">クイックスタート</h2>
      <div className="space-y-3">
        <Link
          href="/test/part5"
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
            P5
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm">Part 5 練習</div>
            <div className="text-xs text-gray-400">短文穴埋め · 20問</div>
          </div>
          <svg className="ml-auto text-gray-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href={reviewWordCount > 0 ? "/words/review" : "/words"}
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50"
        >
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-lg">
            📚
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm">単語フラッシュカード</div>
            <div className="text-xs text-gray-400">
              {reviewWordCount > 0
                ? `復習中: ${reviewWordCount}単語`
                : "カテゴリを選んで学習"}
            </div>
          </div>
          <svg className="ml-auto text-gray-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/test/part6"
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50"
        >
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold text-sm">
            P6
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm">Part 6 練習</div>
            <div className="text-xs text-gray-400">長文穴埋め · 16問</div>
          </div>
          <svg className="ml-auto text-gray-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
