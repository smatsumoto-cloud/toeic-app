"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { part5Questions, type Part5Question, type Choice } from "@/data/part5Questions";
import {
  saveQuizResult,
  getPart5Session,
  savePart5Session,
  clearPart5Session,
} from "@/lib/storage";

// ===== 日付ベースの決定的シャッフル =====

function getDateSeed(): number {
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = ((seed * 31) + dateStr.charCodeAt(i)) | 0;
  }
  return seed >>> 0;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = ((s * 1664525) + 1013904223) | 0;
    const j = (s >>> 0) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDailyQuestions(count = 20): Part5Question[] {
  return seededShuffle(part5Questions, getDateSeed()).slice(0, count);
}

// ===== 定数 =====

type Phase = "quiz" | "answer" | "summary";

const CATEGORY_COLOR: Record<string, string> = {
  語彙: "bg-orange-100 text-orange-600",
  時制: "bg-blue-100 text-blue-600",
  品詞: "bg-purple-100 text-purple-600",
  前置詞: "bg-green-100 text-green-600",
  接続詞: "bg-pink-100 text-pink-600",
};

const DIFFICULTY_LABEL: Record<number, string> = { 2: "易", 3: "中", 4: "難" };
const DIFFICULTY_COLOR: Record<number, string> = {
  2: "text-green-600",
  3: "text-yellow-600",
  4: "text-red-500",
};
const CHOICE_KEYS: Choice[] = ["A", "B", "C", "D"];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s.toString().padStart(2, "0")}秒`;
}

function splitSentence(sentence: string) {
  const parts = sentence.split("_____");
  return { before: parts[0] ?? "", after: parts[1] ?? "" };
}

// ===== コンポーネント =====

export default function Part5Page() {
  // 日付ベース：同じ日は常に同じ問題セット
  const [sessionQuestions] = useState<Part5Question[]>(() => pickDailyQuestions(20));

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [results, setResults] = useState<boolean[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<"explanation" | "choices">("explanation");
  const [savedResult, setSavedResult] = useState(false);
  const [mounted, setMounted] = useState(false);
  // 途中再開バナー用
  const [resumedFrom, setResumedFrom] = useState<number | null>(null);

  const totalQuestions = sessionQuestions.length;
  const question = sessionQuestions[current];
  const isAnswered = phase === "answer";
  const isSummary = phase === "summary";

  // マウント時：今日のセッション進捗を復元
  useEffect(() => {
    const saved = getPart5Session();
    if (saved && saved.results.length > 0) {
      const currentIds = sessionQuestions.map((q) => q.id);
      const sameSet =
        saved.questionIds.length === currentIds.length &&
        saved.questionIds.every((id, i) => id === currentIds[i]);

      if (sameSet) {
        setResults(saved.results);
        setElapsedSeconds(saved.elapsedSeconds);
        if (saved.phase === "summary") {
          // 既に完了したセッションを復元
          setPhase("summary");
          setCurrent(totalQuestions - 1);
          setSavedResult(true); // 分析データは保存済み
        } else {
          // 途中から再開
          const resumeIndex = saved.results.length;
          setCurrent(resumeIndex);
          setPhase("quiz");
          setResumedFrom(resumeIndex);
        }
      }
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // タイマー（未完了中のみ）
  useEffect(() => {
    if (!mounted || isSummary) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [mounted, isSummary]);

  // サマリー時に分析データ保存 + セッションを完了済みとして記録
  useEffect(() => {
    if (isSummary && !savedResult && results.length === totalQuestions) {
      const categoryBreakdown: Record<string, { correct: number; total: number }> = {};
      sessionQuestions.forEach((q, i) => {
        if (!categoryBreakdown[q.category])
          categoryBreakdown[q.category] = { correct: 0, total: 0 };
        categoryBreakdown[q.category].total += 1;
        if (results[i]) categoryBreakdown[q.category].correct += 1;
      });
      saveQuizResult({
        part: "part5",
        correct: results.filter(Boolean).length,
        total: totalQuestions,
        timeSeconds: elapsedSeconds,
        categoryBreakdown,
      });
      setSavedResult(true);
      savePart5Session({
        date: new Date().toISOString().slice(0, 10),
        questionIds: sessionQuestions.map((q) => q.id),
        results,
        elapsedSeconds,
        phase: "summary",
      });
    }
  }, [isSummary, savedResult, results, totalQuestions, elapsedSeconds, sessionQuestions]);

  const handleSelect = useCallback(
    (choice: Choice) => {
      if (isAnswered) return;
      const isCorrect = choice === question.answer;
      const newResults = [...results, isCorrect];
      setSelected(choice);
      setPhase("answer");
      setResults(newResults);
      setResumedFrom(null);
      // 進捗を保存（途中離脱に備えて）
      savePart5Session({
        date: new Date().toISOString().slice(0, 10),
        questionIds: sessionQuestions.map((q) => q.id),
        results: newResults,
        elapsedSeconds,
        phase: "answer",
      });
    },
    [isAnswered, question.answer, results, elapsedSeconds, sessionQuestions]
  );

  const handleNext = useCallback(() => {
    if (current + 1 >= totalQuestions) {
      setPhase("summary");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase("quiz");
      setActiveTab("explanation");
    }
  }, [current, totalQuestions]);

  // ローディング中はスケルトン
  if (!mounted) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="flex-1 h-3 bg-gray-200 rounded" />
        </div>
        <div className="h-32 bg-gray-200 rounded-2xl mb-5" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ===== サマリー画面 =====
  if (isSummary) {
    const correct = results.filter(Boolean).length;
    const rate = Math.round((correct / totalQuestions) * 100);
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/test"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">結果</h1>
        </div>

        <div
          className={`rounded-2xl p-6 mb-5 text-center ${
            rate >= 80
              ? "bg-green-50 border border-green-200"
              : rate >= 60
              ? "bg-blue-50 border border-blue-200"
              : "bg-orange-50 border border-orange-200"
          }`}
        >
          <p className="text-sm font-medium text-gray-500 mb-2">正答率</p>
          <p
            className={`text-6xl font-bold mb-1 ${
              rate >= 80 ? "text-green-600" : rate >= 60 ? "text-blue-600" : "text-orange-500"
            }`}
          >
            {rate}%
          </p>
          <p className="text-sm text-gray-500">
            {correct} / {totalQuestions} 問正解
          </p>
          <p className="text-sm text-gray-400 mt-1">所要時間: {formatTime(elapsedSeconds)}</p>
          <p className="mt-3 text-base font-semibold text-gray-700">
            {rate >= 80 ? "素晴らしい！" : rate >= 60 ? "あと一歩！" : "復習が必要です"}
          </p>
        </div>

        <h2 className="text-base font-semibold text-gray-700 mb-3">カテゴリ別結果</h2>
        <div className="space-y-2 mb-5">
          {(["品詞", "時制", "前置詞", "接続詞", "語彙"] as const).map((cat) => {
            const qs = sessionQuestions.filter((q) => q.category === cat);
            if (qs.length === 0) return null;
            const correctCount = qs.filter(
              (q) => results[sessionQuestions.indexOf(q)] === true
            ).length;
            const catRate = Math.round((correctCount / qs.length) * 100);
            return (
              <div
                key={cat}
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100"
              >
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOR[cat]}`}>
                  {cat}
                </span>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`rounded-full h-1.5 ${
                        catRate >= 75 ? "bg-green-500" : catRate >= 50 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                      style={{ width: `${catRate}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700 w-20 text-right">
                  {correctCount}/{qs.length} ({catRate}%)
                </span>
              </div>
            );
          })}
        </div>

        <h2 className="text-base font-semibold text-gray-700 mb-3">問題ごとの結果</h2>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {results.map((ok, i) => (
            <div
              key={i}
              className={`rounded-xl p-2 text-center text-xs font-bold ${
                ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}
            >
              <div>{i + 1}</div>
              <div>{ok ? "○" : "✕"}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link
            href="/test"
            className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium"
          >
            テストに戻る
          </Link>
          <button
            onClick={() => {
              clearPart5Session();
              setCurrent(0);
              setSelected(null);
              setPhase("quiz");
              setResults([]);
              setElapsedSeconds(0);
              setActiveTab("explanation");
              setSavedResult(false);
              setResumedFrom(null);
            }}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            もう一度
          </button>
        </div>
      </div>
    );
  }

  // ===== クイズ画面 =====
  const { before, after } = splitSentence(question.sentence);
  const correctAnswer = question.answer;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/test"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-500">
              {current + 1} / {totalQuestions}
            </span>
            <span className="text-sm text-gray-400">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 rounded-full h-1.5 transition-all"
              style={{ width: `${((current + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 途中再開バナー */}
      {resumedFrom !== null && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-blue-600 font-medium">
            {resumedFrom}問目まで完了済み。{resumedFrom + 1}問目から再開します。
          </span>
        </div>
      )}

      {/* カテゴリ・難易度バッジ */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLOR[question.category]}`}>
          {question.category}
        </span>
        <span className={`text-xs font-semibold ${DIFFICULTY_COLOR[question.difficulty]}`}>
          難易度: {DIFFICULTY_LABEL[question.difficulty]}
        </span>
      </div>

      {/* 問題文 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <p className="text-gray-400 text-xs mb-3">次の英文の空欄に入る最も適切なものを選んでください。</p>
        <p className="text-gray-800 leading-relaxed text-base">
          {before}
          <span
            className={`inline-block mx-1 px-3 py-0.5 rounded-lg font-bold border-b-2 min-w-[80px] text-center ${
              isAnswered
                ? selected === correctAnswer
                  ? "bg-green-100 text-green-700 border-green-400"
                  : "bg-red-100 text-red-600 border-red-400"
                : "bg-blue-50 text-blue-500 border-blue-300 animate-pulse"
            }`}
          >
            {isAnswered ? `(${selected}) ${question.choices[selected!]}` : "_____"}
          </span>
          {after}
        </p>
      </div>

      {/* 選択肢 */}
      <div className="space-y-2.5 mb-5">
        {CHOICE_KEYS.map((key) => {
          let style = "border-gray-200 bg-white text-gray-700 active:bg-gray-50";
          if (isAnswered) {
            if (key === correctAnswer) style = "border-green-400 bg-green-50 text-green-800";
            else if (key === selected) style = "border-red-400 bg-red-50 text-red-700";
            else style = "border-gray-100 bg-gray-50 text-gray-400";
          }
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={isAnswered}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${style}`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isAnswered
                    ? key === correctAnswer
                      ? "bg-green-500 text-white"
                      : key === selected
                      ? "bg-red-400 text-white"
                      : "bg-gray-200 text-gray-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {key}
              </span>
              <span className="text-sm font-medium">{question.choices[key]}</span>
              {isAnswered && key === correctAnswer && (
                <svg className="ml-auto w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isAnswered && key === selected && key !== correctAnswer && (
                <svg className="ml-auto w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* 解説 */}
      {isAnswered && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div
            className={`px-5 py-3 flex items-center gap-2 ${
              selected === correctAnswer ? "bg-green-500 text-white" : "bg-red-400 text-white"
            }`}
          >
            {selected === correctAnswer ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">正解！</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">
                  不正解 — 正解は ({correctAnswer}) {question.choices[correctAnswer]}
                </span>
              </>
            )}
          </div>

          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "explanation"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              解説
            </button>
            <button
              onClick={() => setActiveTab("choices")}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === "choices"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
            >
              選択肢の解説
            </button>
          </div>

          <div className="p-4">
            {activeTab === "explanation" ? (
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
            ) : (
              <div className="space-y-3">
                {CHOICE_KEYS.map((key) => (
                  <div key={key} className="flex gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                        key === correctAnswer ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {key}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <span className="font-medium text-gray-800">{question.choices[key]}</span>{" "}
                      — {question.choiceExplanations[key]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 次へボタン */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors"
        >
          {current + 1 >= totalQuestions ? "結果を見る" : "次の問題"}
        </button>
      )}
    </div>
  );
}
