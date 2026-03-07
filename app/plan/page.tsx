"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPlanGoal, savePlanGoal, getStudyLog, type PlanGoal } from "@/lib/storage";

const schedule = [
  { day: "月", tasks: ["Part 5 練習 (20問)", "単語 12語"] },
  { day: "火", tasks: ["単語復習", "Part 6 練習 (8問)"] },
  { day: "水", tasks: ["Part 5 練習 (20問)", "単語 12語"] },
  { day: "木", tasks: ["弱点トピック集中", "単語復習"] },
  { day: "金", tasks: ["Part 6 練習 (8問)", "単語 12語"] },
  { day: "土", tasks: ["模擬テスト"] },
  { day: "日", tasks: ["復習・振り返り"] },
];

function calcRemainingDays(examDate: string): number {
  const exam = new Date(examDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function getTodayDayIndex(): number {
  // 0=月, 1=火, ..., 6=日
  const dow = new Date().getDay(); // 0=Sun
  return (dow + 6) % 7;
}

export default function PlanPage() {
  const [goal, setGoal] = useState<PlanGoal>({ targetScore: 900, examDate: "2026-05-25", dailyMinutes: 60 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PlanGoal>(goal);
  const [streak, setStreak] = useState(0);
  const [weeklyRate, setWeeklyRate] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loaded = getPlanGoal();
    setGoal(loaded);
    setDraft(loaded);

    // 連続学習日数と週間達成率を計算
    const log = getStudyLog();
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (log[key]?.minutesStudied > 0) s++;
      else if (i > 0) break;
    }
    setStreak(s);
    setMounted(true);

    // 今週の達成日数 / 7
    const weekDays: string[] = [];
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dow + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push(d.toISOString().slice(0, 10));
    }
    const achieved = weekDays.filter((k) => (log[k]?.minutesStudied ?? 0) > 0).length;
    setWeeklyRate(Math.round((achieved / 7) * 100));
  }, []);

  if (!mounted) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24 mb-6" />
        <div className="h-40 bg-gray-200 rounded-2xl mb-5" />
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="h-20 bg-gray-100 rounded-2xl" />
          <div className="h-20 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  const remainingDays = calcRemainingDays(goal.examDate);
  const todayIndex = getTodayDayIndex();

  function handleSave() {
    setGoal(draft);
    savePlanGoal(draft);
    setEditing(false);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プラン</h1>
          <p className="text-sm text-gray-500 mt-1">目標達成に向けた学習計画</p>
        </div>
        <Link
          href="/settings"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 mt-1"
          aria-label="設定"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>

      {/* 目標設定 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">目標設定</span>
          <button onClick={() => { setDraft(goal); setEditing(true); }} className="text-xs text-blue-500 font-medium">
            編集
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">目標スコア</span>
            <span className="text-sm font-bold text-blue-600">{goal.targetScore}点</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">試験日</span>
            <span className="text-sm font-semibold text-gray-700">{formatDate(goal.examDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">残り日数</span>
            <span className={`text-sm font-bold ${remainingDays <= 30 ? "text-red-500" : "text-orange-500"}`}>
              {remainingDays}日
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">1日の目標学習時間</span>
            <span className="text-sm font-semibold text-gray-700">{goal.dailyMinutes}分</span>
          </div>
        </div>
      </div>

      {/* 進捗 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{weeklyRate}%</div>
          <div className="text-xs text-blue-500 mt-1">週間目標達成率</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <div className="text-2xl font-bold text-green-600">{streak}日</div>
          <div className="text-xs text-green-500 mt-1">連続学習中</div>
        </div>
      </div>

      {/* 今週のスケジュール */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">今週のスケジュール</h2>
      <div className="space-y-2">
        {schedule.map((s, i) => {
          const isToday = i === todayIndex;
          const isPast = i < todayIndex;
          return (
            <div
              key={i}
              className={`rounded-2xl p-4 border transition-all ${
                isToday
                  ? "bg-blue-50 border-blue-200"
                  : isPast
                  ? "bg-gray-50 border-gray-100"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${isToday ? "bg-blue-600 text-white" : isPast ? "bg-gray-200 text-gray-500" : "bg-gray-100 text-gray-600"}`}>
                  {s.day}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {isToday && "今日 · "}
                  {s.day}曜日
                </span>
                {isPast && (
                  <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium">
                    経過
                  </span>
                )}
              </div>
              <ul className="ml-11 space-y-0.5">
                {s.tasks.map((task, j) => (
                  <li key={j} className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full inline-block ${isToday ? "bg-blue-400" : isPast ? "bg-gray-300" : "bg-gray-300"}`} />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* 編集モーダル */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 pb-10 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-900">目標を編集</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* 目標スコア */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">目標スコア</label>
                <div className="flex gap-2 flex-wrap">
                  {[600, 700, 730, 800, 860, 900, 990].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDraft((d) => ({ ...d, targetScore: s }))}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${draft.targetScore === s ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* 試験日 */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">試験日</label>
                <input
                  type="date"
                  value={draft.examDate}
                  onChange={(e) => setDraft((d) => ({ ...d, examDate: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* 1日の目標時間 */}
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  1日の目標学習時間: <span className="text-blue-600 font-bold">{draft.dailyMinutes}分</span>
                </label>
                <input
                  type="range"
                  min={15}
                  max={120}
                  step={15}
                  value={draft.dailyMinutes}
                  onChange={(e) => setDraft((d) => ({ ...d, dailyMinutes: parseInt(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>15分</span><span>60分</span><span>120分</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl text-sm"
            >
              保存する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
