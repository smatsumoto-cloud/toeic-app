"use client";

import { useState } from "react";
import Link from "next/link";
import { clearAllData } from "@/lib/storage";

export default function SettingsPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);

  function handleClear() {
    clearAllData();
    setCleared(true);
    setShowConfirm(false);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/plan"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">設定</h1>
      </div>

      {/* アプリ情報 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">アプリ情報</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">アプリ名</span>
            <span className="text-gray-700 font-medium">TOEIC学習アプリ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">バージョン</span>
            <span className="text-gray-700 font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">単語数</span>
            <span className="text-gray-700 font-medium">100語</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Part 5 問題数</span>
            <span className="text-gray-700 font-medium">40問（毎回20問ランダム出題）</span>
          </div>
        </div>
      </div>

      {/* データ管理 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">データ管理</h2>
        <p className="text-xs text-gray-400 mb-4">
          学習データはすべてこのデバイスにのみ保存されています。
        </p>

        {cleared ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-green-700">データをリセットしました</p>
            <p className="text-xs text-green-500 mt-1">すべての学習履歴と設定が削除されました。</p>
            <Link
              href="/"
              className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl"
            >
              ホームへ戻る
            </Link>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold bg-red-50 active:bg-red-100 transition-colors"
          >
            学習データをリセット
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center px-4">
        リセットすると、演習履歴・単語の学習状況・プランの設定がすべて削除されます。
      </p>

      {/* 確認モーダル */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 pb-10">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900 mb-1">データをリセットしますか？</h2>
              <p className="text-sm text-gray-500">
                演習履歴・単語の学習状況・プランの設定がすべて削除されます。この操作は元に戻せません。
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold"
              >
                リセットする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
