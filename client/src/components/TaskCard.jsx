import React from "react";

const TaskCard = ({ isAdmin, task, handleDeleteTask, updateStatus }) => {
  const isDone = task.status === "done";
  const isInProgress = task.status === "in-progress";

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      handleDeleteTask(id);
    }
  };

  return (
    <div
      className={`group bg-zinc-900 border border-zinc-800 p-5 rounded-xl transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40 relative overflow-hidden ${
        isDone ? "opacity-75" : "opacity-100"
      }`}
    >
      {/* Dynamic Status Indicator Border */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1 transition-colors duration-300 ${
          isDone
            ? "bg-emerald-500"
            : isInProgress
            ? "bg-amber-500"
            : "bg-indigo-500"
        }`}
      ></div>

      <div className="flex justify-between items-start mb-2 gap-4">
        <div className="flex items-center gap-2">
          <h3
            className={`font-semibold text-zinc-100 leading-tight transition-all duration-300 ${
              isDone
                ? "line-through text-zinc-500"
                : "group-hover:text-indigo-400"
            }`}
          >
            {task.title}
          </h3>
          {isDone && (
            <div className="bg-emerald-500/10 p-0.5 rounded-full">
              <svg
                className="w-3.5 h-3.5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {isAdmin && (
          <button
            onClick={() => deleteTask(task._id)}
            className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 border border-transparent hover:border-red-500/20"
            title="Delete task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <p
        className={`text-sm mb-6 leading-relaxed transition-colors duration-300 ${
          isDone ? "text-zinc-600" : "text-zinc-400"
        }`}
      >
        {task.description || "No description provided."}
      </p>

      {/* Task Metadata Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {task.assignedTo && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/50 border border-zinc-800 rounded-md text-[11px] text-zinc-400">
            <svg
              className="w-3 h-3 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{task.assignedTo.name}</span>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/50 border border-zinc-800 rounded-md text-[11px] text-zinc-400">
            <svg
              className="w-3 h-3 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
        <div className="relative group/select">
          <select
            value={task.status}
            onChange={(e) => updateStatus(task._id, e.target.value)}
            className="appearance-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer outline-none transition-colors border border-zinc-700/50 focus:border-indigo-500/50 pr-8"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-600">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-tighter">
            Syncing
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
