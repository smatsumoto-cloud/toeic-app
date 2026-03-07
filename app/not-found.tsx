import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 max-w-lg mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-5">
        📖
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        ページが見つかりません
      </h1>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        お探しのページは存在しないか、<br />移動した可能性があります。
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
