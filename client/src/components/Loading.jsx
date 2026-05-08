import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-sm font-medium animate-pulse">
          Authenticating...
        </p>
      </div>
    </div>
  );
};

export default Loading;
