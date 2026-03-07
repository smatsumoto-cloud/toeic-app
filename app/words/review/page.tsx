"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { allWords, wordCategories, type Word } from "@/data/wordData";
import {
  getWordStatuses,
  saveWordStatuses,
  addStudyLog,
  type WordStatus,
} from "@/lib/storage";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s.toString().padStart(2, "0")}秒`;
}

const POS_COLOR: Record<string, string> = {
  名詞: "bg-blue-100 text-blue-600",
  動詞: "bg-green-100 text-green-600",
  形容詞: "bg-purple-100 text-purple-600",
  副詞: "bg-orange-100 text-orange-600",
};

const CAT_COLOR: Record<string, string> = {
  blue: "bg-blue-50 text-blue-500",
  green: "bg-green-50 text-green-500",
  orange: "bg-orange-50 text-orange-500",
  purple: "bg-purple-50 text-purple-500",
  red: "bg-red-50 text-red-500",
};

export default function ReviewPage() {
  const [statuses, setStatuses] = useState<Record<string, WordStatus>>({});
  const [cards, setCards] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStatuses, setSessionStatuses] = useState<Record<string, WordStatus>>({});
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionType, setSessionType] = useState<"learning" | "new">("learning");

  useEffect(() => {
    const loaded = getWordStatuses();
    setStatuses(loaded);

    const learningWords = allWords.filter((w) => loaded[w.id] === "learning");
    if (learningWords.length > 0) {
      setCards(learningWords);
      setSessionType("learning");
    } else {
      // 復習単語がない場合は未学習から最大20枚
      const newWords = allWords.filter((w) => !loaded[w.id] || loaded[w.id] === "new").slice(0, 20);
      setCards(newWords);
      setSessionType("new");
    }
  }, []);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [finished]);

  const handleChoice = useCallback(
    (status: "known" | "learning") => {
      const word = cards[currentIndex];
      if (!word) return;

      const newSessionStatuses = { ...sessionStatuses, [word.id]: status };
      setSessionStatuses(newSessionStatuses);
      const newStatuses = { ...statuses, [word.id]: status };
      setStatuses(newStatuses);
      saveWordStatuses(newStatuses);

      if (currentIndex + 1 >= cards.length) {
        addStudyLog({
          wordsStudied: cards.length,
          minutesStudied: Math.max(1, Math.ceil((Date.now() - startTime) / 60000)),
        });
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setFlipped(false);
      }
    },
    [cards, currentIndex, sessionStatuses, statuses, startTime]
  );

  if (cards.length === 0) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-lg font-bold text-gray-700 mb-2">復習する単語がありません</p>
        <p className="text-sm text-gray-500 mb-6">各カテゴリから単語を学習しましょう</p>
        <Link href="/words" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm">
          単語ページへ
        </Link>
      </div>
    );
  }

  if (finished) {
    const knownCount = Object.values(sessionStatuses).filter((s) => s === "known").length;
    const learningCount = Object.values(sessionStatuses).filter((s) => s === "learning").length;
    const rate = Math.round((knownCount / cards.length) * 100);
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/words" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">復習完了</h1>
        </div>
        <div className={`rounded-2xl p-6 mb-5 text-center ${rate >= 70 ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
          <p className="text-sm text-gray-500 mb-2">習得率</p>
          <p className={`text-6xl font-bold mb-1 ${rate >= 70 ? "text-green-600" : "text-blue-600"}`}>{rate}%</p>
          <p className="text-sm text-gray-500">所要時間: {formatTime(elapsedSeconds)}</p>
          <p className="mt-3 text-sm font-semibold text-gray-700">
            {rate >= 70 ? "よく覚えられています！" : "引き続き復習しましょう！"}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-gray-700">{cards.length}</div>
            <div className="text-xs text-gray-400 mt-1">学習枚数</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">{knownCount}</div>
            <div className="text-xs text-green-500 mt-1">覚えた</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
            <div className="text-2xl font-bold text-orange-500">{learningCount}</div>
            <div className="text-xs text-orange-400 mt-1">もう一度</div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/words" className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">
            単語ページへ
          </Link>
          {learningCount > 0 && (
            <button
              onClick={() => {
                const reviewCards = cards.filter((c) => sessionStatuses[c.id] === "learning");
                setCards(reviewCards);
                setCurrentIndex(0);
                setFlipped(false);
                setSessionStatuses({});
                setFinished(false);
              }}
              className="flex-1 py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold"
            >
              もう一度 ({learningCount})
            </button>
          )}
        </div>
      </div>
    );
  }

  const word = cards[currentIndex];
  const cat = wordCategories.find((c) => c.id === word.categoryId);
  const catColorClass = cat ? CAT_COLOR[cat.color] : "bg-gray-50 text-gray-400";

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/words" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">
              {sessionType === "learning" ? "復習セッション" : "新出単語"}
            </span>
            <span className="text-gray-400">{currentIndex + 1} / {cards.length}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 rounded-full h-1.5 transition-all"
              style={{ width: `${(currentIndex / cards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${catColorClass}`}>
          {cat?.name ?? ""}
        </span>
        <span className="text-xs text-gray-400">{formatTime(elapsedSeconds)}</span>
      </div>

      <div style={{ perspective: "1000px" }} className="w-full mb-5">
        <div
          onClick={() => setFlipped((f) => !f)}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.45s ease",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            height: "260px",
            cursor: "pointer",
          }}
        >
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-6 select-none"
          >
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${POS_COLOR[word.partOfSpeech] ?? "bg-gray-100 text-gray-500"}`}>
              {word.partOfSpeech}
            </span>
            <span className="text-4xl font-bold text-gray-900 text-center mb-2">{word.word}</span>
            <span className="text-xs text-blue-400 mt-6">タップして意味を確認</span>
          </div>
          <div
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 bg-blue-600 rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 select-none"
          >
            <span className="text-3xl font-bold text-white text-center mb-3">{word.meaning}</span>
            <div className="border-t border-blue-500 w-full my-3" />
            <p className="text-sm text-blue-100 text-center leading-relaxed">{word.exampleEn}</p>
            <p className="text-xs text-blue-300 text-center mt-2 leading-relaxed">{word.exampleJa}</p>
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleChoice("learning")}
            className="flex-1 py-4 rounded-2xl border-2 border-orange-300 bg-orange-50 text-orange-600 font-bold text-sm active:bg-orange-100 transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={() => handleChoice("known")}
            className="flex-1 py-4 rounded-2xl bg-green-500 text-white font-bold text-sm active:bg-green-600 transition-colors shadow-sm"
          >
            覚えた！
          </button>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-sm active:bg-blue-700 transition-colors shadow-sm"
        >
          答えを見る
        </button>
      )}

      <div className="flex gap-3 mt-4">
        <div className="flex-1 bg-green-50 rounded-xl p-2 text-center">
          <span className="text-lg font-bold text-green-600">
            {Object.values(sessionStatuses).filter((s) => s === "known").length}
          </span>
          <span className="text-xs text-green-400 block">覚えた</span>
        </div>
        <div className="flex-1 bg-orange-50 rounded-xl p-2 text-center">
          <span className="text-lg font-bold text-orange-500">
            {Object.values(sessionStatuses).filter((s) => s === "learning").length}
          </span>
          <span className="text-xs text-orange-400 block">もう一度</span>
        </div>
        <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
          <span className="text-lg font-bold text-gray-500">
            {cards.length - currentIndex - 1}
          </span>
          <span className="text-xs text-gray-400 block">残り</span>
        </div>
      </div>
    </div>
  );
}
