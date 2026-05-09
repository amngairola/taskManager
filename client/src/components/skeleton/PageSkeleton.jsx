import React from "react";

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#09090b] p-6 space-y-10">
      {/*  Navbar Skeleton */}
      <div className="max-w-7xl mx-auto h-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between px-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-24 bg-zinc-800 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-zinc-800 rounded hidden sm:block" />
          <div className="w-10 h-10 bg-zinc-800 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/*  Header Skeleton */}
        <div className="space-y-3 animate-pulse">
          <div className="h-8 w-48 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-64 bg-zinc-900 rounded" />
        </div>

        {/*  Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col justify-between animate-pulse"
            >
              <div className="h-3 w-20 bg-zinc-800 rounded" />
              <div className="h-8 w-12 bg-zinc-700 rounded" />
            </div>
          ))}
        </div>

        {/*  Content Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-52 rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-5 animate-pulse"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="h-5 w-2/3 bg-zinc-800 rounded" />
                <div className="h-4 w-10 bg-zinc-800 rounded" />
              </div>

              {/* Card Body */}
              <div className="space-y-3">
                <div className="h-3 w-full bg-zinc-800/60 rounded" />
                <div className="h-3 w-4/5 bg-zinc-800/60 rounded" />
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                <div className="h-4 w-24 bg-zinc-800 rounded" />
                <div className="h-4 w-4 bg-zinc-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-pulse {
          background: linear-gradient(
            90deg,
            rgba(24, 24, 27, 0.5) 25%,
            rgba(39, 39, 42, 0.6) 50%,
            rgba(24, 24, 27, 0.5) 75%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default PageSkeleton;
