import React from "react";

const TaskSkeleton = () => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl animate-pulse space-y-4">
      <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-800 rounded"></div>
        <div className="h-3 w-5/6 bg-zinc-800 rounded"></div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
        <div className="h-6 w-16 bg-zinc-800 rounded"></div>
        <div className="h-4 w-12 bg-zinc-800 rounded"></div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
