"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { part7Passages, PART7_TOTAL_QUESTIONS } from "@/data/part7Questions";
import type { Choice } from "@/data/part5Questions";
import { saveQuizResult } from "@/lib/storage";

const CHOICE_KEYS: Choice[] = ["A", "B", "C", "D"];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s.toString().padStart(2, "0")}秒`;
}

function passageTypeLabel(type: string) {
  switch (type) {
    case "email": return "メール";
    case "advertisement": return "広告";
    case "notice": return "お知らせ";
    case "letter": return "手紙";
    case "memo": return "メモ";
    default: return type;
  }
}

type Phase = "quiz" | "answer" | "summary";

export default function Part7Page() {
  const [passageIndex, setPassageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [allResults, setAllResults] = useState<boolean[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<"passage" | "explanation" | "choices">("passage");
  const [savedResult, setSavedResult] = useState(false);

  const passage = part7Passages[passageIndex];
  const question = passage?.questions[questionIndex];
  const isSummary = phase === "summary";

  useEffect(() => {
    if (isSummary) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isSummary]);

  useEffect(() => {
    if (isSummary && !savedResult && allResults.length === PART7_TOTAL_QUESTIONS) {
      const correct = allResults.filter(Boolean).length;
      saveQuizResult({
        part: "part7",
        correct,
        total: PART7_TOTAL_QUESTIONS,
        timeSeconds: elapsedSeconds,
        categoryBreakdown: { "読解問題": { correct, total: PART7_TOTAL_QUESTIONS } },
      });
      setSavedResult(true);
    }
  }, [isSummary, savedResult, allResults, elapsedSeconds]);

  const handleSelect = useCallback(
    (choice: Choice) => {
      if (phase === "answer") return;
      setSelected(choice);
      setPhase("answer");
      setAllResults((prev) => [...prev, choice === question.answer]);
      setActiveTab("explanation");
    },
    [phase, question]
  );

  const handleNext = useCallback(() => {
    const isLastQuestion = questionIndex + 1 >= passage.questions.length;
    const isLastPassage = passageIndex + 1 >= part7Passages.length;

    if (isLastQuestion && isLastPassage) {
      setPhase("summary");
    } else if (isLastQuestion) {
      setPassageIndex((p) => p + 1);
      setQuestionIndex(0);
      setSelected(null);
      setPhase("quiz");
      setActiveTab("passage");
    } else {
      setQuestionIndex((q) => q + 1);
      setSelected(null);
      setPhase("quiz");
      setActiveTab("passage");
    }
  }, [questionIndex, passageIndex, passage.questions.length]);

  // ===== サマリー =====
  if (isSummary) {
    const correct = allResults.filter(Boolean).length;
    const rate = Math.round((correct / PART7_TOTAL_QUESTIONS) * 100);
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/test" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">結果</h1>
        </div>

        <div className={`rounded-2xl p-6 mb-5 text-center ${rate >= 80 ? "bg-green-50 border border-green-200" : rate >= 60 ? "bg-blue-50 border border-blue-200" : "bg-orange-50 border border-orange-200"}`}>
          <p className="text-sm text-gray-500 mb-2">正答率</p>
          <p className={`text-6xl font-bold mb-1 ${rate >= 80 ? "text-green-600" : rate >= 60 ? "text-blue-600" : "text-orange-500"}`}>{rate}%</p>
          <p className="text-sm text-gray-500">{correct} / {PART7_TOTAL_QUESTIONS} 問正解</p>
          <p className="text-sm text-gray-400 mt-1">所要時間: {formatTime(elapsedSeconds)}</p>
          <p className="mt-3 text-base font-semibold text-gray-700">
            {rate >= 80 ? "素晴らしい！" : rate >= 60 ? "あと一歩！" : "復習が必要です"}
          </p>
        </div>

        <h2 className="text-base font-semibold text-gray-700 mb-3">パッセージ別結果</h2>
        <div className="space-y-2 mb-5">
          {part7Passages.map((p, pi) => {
            const qCount = p.questions.length;
            const start = part7Passages.slice(0, pi).reduce((s, pp) => s + pp.questions.length, 0);
            const passageCorrect = allResults.slice(start, start + qCount).filter(Boolean).length;
            const passageRate = Math.round((passageCorrect / qCount) * 100);
            return (
              <div key={pi} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  {passageTypeLabel(p.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium mb-1 truncate">{p.title}</p>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div className={`rounded-full h-1.5 ${passageRate >= 75 ? "bg-green-500" : passageRate >= 50 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${passageRate}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700 w-20 text-right flex-shrink-0">{passageCorrect}/{qCount} ({passageRate}%)</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Link href="/test" className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">
            テストに戻る
          </Link>
          <button
            onClick={() => {
              setPassageIndex(0);
              setQuestionIndex(0);
              setSelected(null);
              setPhase("quiz");
              setAllResults([]);
              setElapsedSeconds(0);
              setSavedResult(false);
              setActiveTab("passage");
            }}
            className="flex-1 py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold"
          >
            もう一度
          </button>
        </div>
      </div>
    );
  }

  // ===== 問題画面 =====
  const globalQuestionNum = part7Passages.slice(0, passageIndex).reduce((s, p) => s + p.questions.length, 0) + questionIndex + 1;
  const isAnswered = phase === "answer";
  const correctAnswer = question.answer;
  const isLastQuestion = questionIndex + 1 >= passage.questions.length;
  const isLastPassage = passageIndex + 1 >= part7Passages.length;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/test" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 font-medium">{globalQuestionNum} / {PART7_TOTAL_QUESTIONS}</span>
            <span className="text-gray-400">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-1.5">
            <div className="bg-purple-500 rounded-full h-1.5 transition-all" style={{ width: `${(globalQuestionNum / PART7_TOTAL_QUESTIONS) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* バッジ */}
      <div className="flex gap-2 mb-3">
        <span className="text-xs bg-purple-100 text-purple-600 px-2.5 py-1 rounded-full font-medium">
          {passageTypeLabel(passage.type)}
        </span>
        <span className="text-xs text-gray-400">パッセージ {passageIndex + 1}/{part7Passages.length} — 設問 {questionIndex + 1}/{passage.questions.length}</span>
      </div>

      {/* タブ切り替え */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("passage")}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === "passage" ? "bg-purple-600 text-white" : "bg-white text-gray-500"}`}
        >
          本文
        </button>
        {isAnswered && (
          <>
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === "explanation" ? "bg-purple-600 text-white" : "bg-white text-gray-500"}`}
            >
              解説
            </button>
            <button
              onClick={() => setActiveTab("choices")}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === "choices" ? "bg-purple-600 text-white" : "bg-white text-gray-500"}`}
            >
              選択肢
            </button>
          </>
        )}
      </div>

      {/* 本文 */}
      {activeTab === "passage" && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-xs text-gray-400 mb-2 font-medium whitespace-pre-line">{passage.header}</p>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{passage.body}</p>
          </div>
        </div>
      )}

      {/* 解説タブ */}
      {activeTab === "explanation" && isAnswered && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">解説</p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* 選択肢の解説タブ */}
      {activeTab === "choices" && isAnswered && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="space-y-3">
            {CHOICE_KEYS.map((key) => (
              <div key={key} className="flex gap-2.5">
                <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${key === correctAnswer ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>{key}</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-800">{question.choices[key]}</span>{" "}— {question.choiceExplanations[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 設問 */}
      <p className="text-sm text-gray-800 font-medium mb-3 leading-relaxed">{question.question}</p>

      {/* 選択肢 */}
      <div className="space-y-2.5 mb-4">
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
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isAnswered ? key === correctAnswer ? "bg-green-500 text-white" : key === selected ? "bg-red-400 text-white" : "bg-gray-200 text-gray-400" : "bg-purple-100 text-purple-600"}`}>
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

      {/* 正解/不正解バナー */}
      {isAnswered && (
        <div className={`rounded-xl px-4 py-3 flex items-center gap-2 mb-4 ${selected === correctAnswer ? "bg-green-500 text-white" : "bg-red-400 text-white"}`}>
          {selected === correctAnswer ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm">正解！</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm">不正解 — 正解は ({correctAnswer}) {question.choices[correctAnswer]}</span>
            </>
          )}
        </div>
      )}

      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-purple-600 text-white font-semibold rounded-xl text-sm hover:bg-purple-700 transition-colors"
        >
          {isLastQuestion && isLastPassage ? "結果を見る" : isLastQuestion ? "次のパッセージへ" : "次の設問"}
        </button>
      )}
    </div>
  );
}
