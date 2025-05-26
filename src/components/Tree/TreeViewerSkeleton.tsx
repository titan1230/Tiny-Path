const TreeViewerSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-md mx-auto">
        {/* Profile Section Skeleton */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 bg-white/20 rounded-lg w-48 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-white/20 rounded-lg w-32 mx-auto animate-pulse" />
        </div>

        {/* Links Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 animate-pulse"
            >
              <div className="h-6 bg-white/20 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreeViewerSkeleton;
