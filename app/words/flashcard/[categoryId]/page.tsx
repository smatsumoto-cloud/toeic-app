"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getWordsByCategory, wordCategories, type Word } from "@/data/wordData";
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

export default function FlashcardPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const category = wordCategories.find((c) => c.id === categoryId);
  const allCategoryWords = getWordsByCategory(categoryId);

  const [statuses, setStatuses] = useState<Record<string, WordStatus>>({});
  const [cards, setCards] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStatuses, setSessionStatuses] = useState<Record<string, WordStatus>>({});
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // localStorage から単語ステータスを読み込み
  useEffect(() => {
    const loaded = getWordStatuses();
    setStatuses(loaded);
    // learning → known でない単語を優先して並べる
    const sorted = [...allCategoryWords].sort((a, b) => {
      const sa = loaded[a.id] ?? "new";
      const sb = loaded[b.id] ?? "new";
      const order = { new: 0, learning: 1, known: 2 };
      return order[sa] - order[sb];
    });
    setCards(sorted);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // タイマー
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
        // セッション終了：学習ログ保存
        const knownCount = Object.values(newSessionStatuses).filter((s) => s === "known").length;
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

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  if (!category || cards.length === 0) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto text-center">
        <p className="text-gray-500">カテゴリが見つかりません。</p>
        <Link href="/words" className="text-blue-500 text-sm mt-2 inline-block">
          単語ページに戻る
        </Link>
      </div>
    );
  }

  // ===== 終了画面 =====
  if (finished) {
    const knownCount = Object.values(sessionStatuses).filter((s) => s === "known").length;
    const learningCount = Object.values(sessionStatuses).filter((s) => s === "learning").length;
    const rate = Math.round((knownCount / cards.length) * 100);

    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/words"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">セッション終了</h1>
        </div>

        <div className={`rounded-2xl p-6 mb-5 text-center ${rate >= 70 ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}>
          <p className="text-sm text-gray-500 mb-2">習得率</p>
          <p className={`text-6xl font-bold mb-1 ${rate >= 70 ? "text-green-600" : "text-blue-600"}`}>
            {rate}%
          </p>
          <p className="text-sm text-gray-500">所要時間: {formatTime(elapsedSeconds)}</p>
          <p className="mt-3 text-sm font-semibold text-gray-700">
            {rate >= 70 ? "よく覚えられています！" : "引き続き復習しましょう！"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
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

        {/* もう一度（learning のみ） */}
        {learningCount > 0 && (
          <button
            onClick={() => {
              const reviewCards = cards.filter(
                (c) => sessionStatuses[c.id] === "learning"
              );
              setCards(reviewCards);
              setCurrentIndex(0);
              setFlipped(false);
              setSessionStatuses({});
              setFinished(false);
            }}
            className="w-full py-3.5 bg-orange-500 text-white font-semibold rounded-xl text-sm mb-3"
          >
            苦手な {learningCount} 単語を復習する
          </button>
        )}
        <div className="flex gap-3">
          <Link
            href="/words"
            className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium"
          >
            単語ページへ
          </Link>
          <button
            onClick={() => {
              setCards([...allCategoryWords]);
              setCurrentIndex(0);
              setFlipped(false);
              setSessionStatuses({});
              setFinished(false);
            }}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            もう一度全部
          </button>
        </div>
      </div>
    );
  }

  // ===== 学習画面 =====
  const word = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;
  const currentStatus = statuses[word.id] ?? "new";

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/words"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-600">{category.name}</span>
            <span className="text-gray-400">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 rounded-full h-1.5 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ステータスバッジ */}
      <div className="flex items-center gap-2 mb-4">
        {currentStatus === "known" && (
          <span className="text-xs bg-green-100 text-green-600 px-2.5 py-1 rounded-full font-medium">
            ✓ 習得済み
          </span>
        )}
        {currentStatus === "learning" && (
          <span className="text-xs bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-medium">
            復習中
          </span>
        )}
        {currentStatus === "new" && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
            未学習
          </span>
        )}
        <span className="text-xs text-gray-400">{formatTime(elapsedSeconds)}</span>
      </div>

      {/* フラッシュカード（3D flip） */}
      <div style={{ perspective: "1000px" }} className="w-full mb-5">
        <div
          onClick={handleFlip}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.45s ease",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            height: "260px",
            cursor: "pointer",
          }}
        >
          {/* 表面：英単語 */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-6 select-none"
          >
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${POS_COLOR[word.partOfSpeech] ?? "bg-gray-100 text-gray-500"}`}
            >
              {word.partOfSpeech}
            </span>
            <span className="text-4xl font-bold text-gray-900 text-center mb-2">
              {word.word}
            </span>
            <span className="text-xs text-blue-400 mt-6">タップして意味を確認</span>
          </div>

          {/* 裏面：日本語・例文 */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 bg-blue-600 rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 select-none"
          >
            <span className="text-3xl font-bold text-white text-center mb-3">
              {word.meaning}
            </span>
            <div className="border-t border-blue-500 w-full my-3" />
            <p className="text-sm text-blue-100 text-center leading-relaxed">
              {word.exampleEn}
            </p>
            <p className="text-xs text-blue-300 text-center mt-2 leading-relaxed">
              {word.exampleJa}
            </p>
          </div>
        </div>
      </div>

      {/* 操作ボタン */}
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
          onClick={handleFlip}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-sm active:bg-blue-700 transition-colors shadow-sm"
        >
          答えを見る
        </button>
      )}

      {/* 進捗サマリー（現セッション） */}
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
