import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast"; // ✅ Add this import
import api from "../context/axios";

export default function ProjectPage() {
  const { isAdmin, loading } = useAuth();
  const { id: projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false); // ✅ Form visibility
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "todo",
  });
  const [selectedColumn, setSelectedColumn] = useState("todo");

  const columns = [
    { id: "todo", label: "To Do", color: "bg-zinc-500" },
    { id: "in-progress", label: "In Progress", color: "bg-amber-500" },
    { id: "done", label: "Completed", color: "bg-emerald-500" },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks?projectId=${projectId}`);
        setTasks(res.data.data);
      } catch (err) {
        console.error("Fetch tasks error:", err);
        toast.error("Failed to load tasks");
      } finally {
        setPageLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  // Update task status
  const updateStatus = async (taskId, status) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.data : t))
      );
      toast.success("Task status updated");
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Failed to update status");
    }
  };

  // Create new task (Admin only)
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) {
      return toast.error("Task title is required");
    }
    //  const res = await api.post("/admin/create/projects", form);

    try {
      const res = await api.post("/admin/create/task", {
        ...taskForm,
        projectId,
      });

      setTasks((prev) => [res.data.data, ...prev]);
      toast.success("Task created successfully");

      setTaskForm({ title: "", description: "", status: "todo" });
      setShowTaskForm(false);
    } catch (err) {
      console.error("Create task error:", err);
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  // Delete task (Admin only)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await api.delete(`/admin//delete/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      console.error("Delete task error:", err);
      toast.error("Failed to delete task");
    }
  };

  //  Open task form for specific column
  const openTaskForm = (columnId) => {
    setSelectedColumn(columnId);
    setTaskForm({ title: "", description: "", status: columnId });
    setShowTaskForm(true);
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-zinc-800 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-zinc-500 text-sm font-medium animate-pulse">
            Loading board...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-12">
      {/* Board Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Project Board
              </h1>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                Workspace / {projectId.slice(-6)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold"
                >
                  U{i}
                </div>
              ))}
            </div>
            {isAdmin && (
              <button
                onClick={() => openTaskForm("todo")} // ✅ Opens form for "To Do" column
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                Create Task
              </button>
            )}
          </div>
        </div>
      </header>

      {/*  Task Creation Form Modal (Admin Only) */}
      {showTaskForm && isAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Task title"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  rows="3"
                  placeholder="Task description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Status
                </label>
                <select
                  value={taskForm.status}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, status: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col max-h-full">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                  <h2 className="font-bold text-sm tracking-wide text-zinc-300 uppercase">
                    {column.label}
                  </h2>
                  <span className="ml-2 px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[11px] font-bold rounded-full">
                    {tasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1">
                {tasks
                  .filter((t) => t.status === column.id)
                  .map((task) => (
                    <div
                      key={task._id}
                      className="group bg-zinc-900 border border-zinc-800 p-5 rounded-xl transition-all duration-200 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-zinc-100 leading-tight group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </h3>

                        {/*  Delete button (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded text-red-500 hover:text-red-400"
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

                      <p className="text-zinc-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {task.description || "No description provided."}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                        <div className="relative">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateStatus(task._id, e.target.value)
                            }
                            className="appearance-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer outline-none transition-colors border border-transparent focus:border-indigo-500/50"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 text-zinc-600">
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
                          <span className="text-[10px] font-medium">
                            Updated
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Empty State */}
                {tasks.filter((t) => t.status === column.id).length === 0 && (
                  <div className="py-12 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600">
                    <p className="text-xs font-medium uppercase tracking-widest">
                      No tasks here
                    </p>
                  </div>
                )}

                {/*Add Task Button (Admin only) */}
                {isAdmin && (
                  <button
                    onClick={() => openTaskForm(column.id)} // ✅ Opens form with pre-selected column
                    className="w-full mt-2 py-3 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm font-medium hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-300 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">+</span>
                    Add Task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
