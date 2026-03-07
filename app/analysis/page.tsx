"use client";

import { useEffect, useState } from "react";
import {
  getQuizResults,
  getCategoryAccuracy,
  getWeeklyLog,
  estimateScore,
  getPart5Accuracy,
  type QuizResult,
} from "@/lib/storage";

export default function AnalysisPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [part5Acc, setPart5Acc] = useState<number | null>(null);
  const [catAcc, setCatAcc] = useState<Record<string, { correct: number; total: number }>>({});
  const [weeklyLog, setWeeklyLog] = useState<{ day: string; minutes: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setResults(getQuizResults());
    setScore(estimateScore());
    setPart5Acc(getPart5Accuracy());
    setCatAcc(getCategoryAccuracy());
    setWeeklyLog(getWeeklyLog());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24 mb-6" />
        <div className="h-32 bg-gray-200 rounded-2xl mb-5" />
        <div className="space-y-3 mb-5">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const part5Results = results.filter((r) => r.part === "part5");
  const part6Results = results.filter((r) => r.part === "part6");

  const avgAcc = (list: QuizResult[]) => {
    if (list.length === 0) return null;
    return Math.round(list.reduce((s, r) => s + (r.correct / r.total) * 100, 0) / list.length);
  };

  const p5Avg = avgAcc(part5Results);
  const p6Avg = avgAcc(part6Results);

  // 弱点カテゴリ（カテゴリ別正答率 昇順TOP4）
  const weakCategories = Object.entries(catAcc)
    .filter(([, v]) => v.total > 0)
    .map(([cat, v]) => ({ cat, accuracy: Math.round((v.correct / v.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4);

  const maxMinutes = Math.max(...weeklyLog.map((d) => d.minutes), 60);
  const hasAnyData = results.length > 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">分析</h1>
        <p className="text-sm text-gray-500 mt-1">弱点を把握して効率よく学習しよう</p>
      </div>

      {/* 推定スコア */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-600">推定スコア</span>
          <span className="text-xs text-gray-400">演習結果から算出</span>
        </div>
        {score !== null ? (
          <>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-blue-600">{score}</span>
              <span className="text-gray-400 mb-1">/ 990</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2 mt-3">
              <div className="bg-blue-500 rounded-full h-2 transition-all" style={{ width: `${(score / 990) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">※ Part5練習の正答率をもとにした概算値です</p>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-gray-300">--</p>
            <p className="text-xs text-gray-400 mt-2">テストを受けるとスコアが表示されます</p>
          </div>
        )}
      </div>

      {/* パート別正答率 */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">パート別正答率</h2>
      <div className="space-y-3 mb-5">
        {[
          { label: "Part 5", desc: "短文穴埋め", acc: p5Avg, count: part5Results.length },
          { label: "Part 6", desc: "長文穴埋め", acc: p6Avg, count: part6Results.length },
        ].map((p) => (
          <div key={p.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-gray-800">{p.label}</span>
                <span className="text-xs text-gray-400 ml-2">{p.desc}</span>
              </div>
              {p.acc !== null ? (
                <span className="text-sm font-semibold text-gray-700">{p.acc}%</span>
              ) : (
                <span className="text-xs text-gray-400">未受験</span>
              )}
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              {p.acc !== null ? (
                <div
                  className={`rounded-full h-2 transition-all ${p.acc >= 75 ? "bg-green-500" : p.acc >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                  style={{ width: `${p.acc}%` }}
                />
              ) : (
                <div className="rounded-full h-2 bg-gray-200" style={{ width: "0%" }} />
              )}
            </div>
            {p.count > 0 && (
              <p className="text-xs text-gray-400 mt-1">{p.count}回受験</p>
            )}
          </div>
        ))}
      </div>

      {/* 弱点トピック */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">弱点トピック</h2>
      <div className="space-y-2 mb-5">
        {weakCategories.length > 0 ? (
          weakCategories.map((w, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
              <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <span className="flex-1 text-sm text-gray-700">{w.cat}</span>
              <span className="text-sm font-semibold text-red-500">{w.accuracy}%</span>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">
              {hasAnyData
                ? "カテゴリデータがありません"
                : "テストを受けると弱点が表示されます"}
            </p>
          </div>
        )}
      </div>

      {/* 今週の学習時間 */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">今週の学習時間（分）</h2>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-end gap-1.5 justify-between h-20">
          {weeklyLog.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`rounded-t-sm w-full transition-all ${d.minutes > 0 ? "bg-blue-500" : "bg-gray-200"}`}
                style={{ height: `${maxMinutes > 0 ? (d.minutes / maxMinutes) * 100 : 0}%`, minHeight: d.minutes > 0 ? "4px" : "0" }}
              />
              <span className="text-xs text-gray-400">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">
            今週合計: <strong className="text-gray-600">{weeklyLog.reduce((s, d) => s + d.minutes, 0)}分</strong>
          </span>
          <span className="text-xs text-gray-400">
            {weeklyLog.filter((d) => d.minutes > 0).length}日学習
          </span>
        </div>
      </div>

      {/* 直近の演習履歴 */}
      {results.length > 0 && (
        <>
          <h2 className="text-base font-semibold text-gray-700 mb-3 mt-5">最近の演習</h2>
          <div className="space-y-2">
            {results.slice(0, 5).map((r) => {
              const rate = Math.round((r.correct / r.total) * 100);
              return (
                <div key={r.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                  <div className="text-xs text-gray-400 w-12">{r.date.slice(5).replace("-", "/")}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700">
                      {r.part === "part5" ? "Part 5" : "Part 6"}
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5 mt-1">
                      <div className={`rounded-full h-1.5 ${rate >= 75 ? "bg-green-500" : rate >= 60 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{r.correct}/{r.total}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
