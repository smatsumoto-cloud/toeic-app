import Link from "next/link";

export default function Part7Page() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/test"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Part 7</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">
          <span className="text-3xl font-bold text-purple-500">7</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">近日公開予定</h2>
        <p className="text-sm text-gray-500 mb-1">Part 7（読解問題）は現在開発中です。</p>
        <p className="text-sm text-gray-400 mb-8">しばらくお待ちください。</p>
        <Link
          href="/test"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm"
        >
          テストページへ戻る
        </Link>
      </div>
    </div>
  );
}
