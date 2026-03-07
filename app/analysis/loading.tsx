export default function Loading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-48 mb-6" />
      <div className="h-32 bg-gray-200 rounded-2xl mb-5" />
      <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
      <div className="space-y-3 mb-5">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-5 bg-gray-200 rounded w-28 mb-3" />
      <div className="space-y-2 mb-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-5 bg-gray-200 rounded w-36 mb-3" />
      <div className="h-32 bg-gray-100 rounded-2xl" />
    </div>
  );
}
