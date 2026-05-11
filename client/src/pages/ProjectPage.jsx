import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../context/axios";
import TaskCard from "../components/TaskCard";

import { useQueryClient, QueryClient, useQuery } from "@tanstack/react-query";
export default function ProjectPage() {
  const { isAdmin, loading } = useAuth();
  const { id: projectId } = useParams();

  // ─── State ───────────────────────────────────────────────────────────────────
  // const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("todo");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "todo",
  });
  const queryClient = useQueryClient();
  // ─── Constants ───────────────────────────────────────────────────────────────
  const columns = [
    { id: "todo", label: "To Do", color: "bg-zinc-500" },
    { id: "in-progress", label: "In Progress", color: "bg-amber-500" },
    { id: "done", label: "Completed", color: "bg-emerald-500" },
  ];

  // ─── API Calls ───────────────────────────────────────────────────────────────
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`);
      return res.data.data;
    } catch (err) {
      console.error("Fetch tasks error:", err);
      toast.error("Failed to load tasks");
    } finally {
      setPageLoading(false);
    }
  };

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["task", projectId],
    queryFn: fetchTasks,

    staleTime: 1000 * 60 * 2,
  });

  const searchTasks = async (taskName) => {
    try {
      const res = await api.get(
        `/admin/tasks/search?projectId=${projectId}&query=${taskName}`
      );
      setTasks(res.data.data);
    } catch (err) {
      console.error("Search task error:", err);
      toast.error("Failed to search tasks");
    }
  };

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

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) return toast.error("Task title is required");

    try {
      const res = await api.post("/admin/create/task", {
        ...taskForm,
        projectId,
      });
      // setTasks((prev) => [res.data.data, ...prev]);

      queryClient.invalidateQueries({
        queryKey: ["task", projectId],
      });
      setTaskForm({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "todo",
      });
      setShowTaskForm(false);
      toast.success("Task created successfully");
    } catch (err) {
      console.error("Create task error:", err);
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/admin/delete/task/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      console.error("Delete task error:", err);
      toast.error("Failed to delete task");
    }
  };

  // ─── Effects ─────────────────────────────────────────────────────────────────
  // useEffect(() => {
  //   if (!projectId) return;
  //   fetchTasks();
  // }, [projectId]);

  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          const res = await api.get("/admin/getAllusers");
          setUsers(res.data.data);
        } catch (err) {
          console.error("Fetch users error:", err);
        }
      };
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      search.trim() ? searchTasks(search) : fetchTasks();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  //  Open task form for specific column
  const openTaskForm = (columnId) => {
    setSelectedColumn(columnId);
    setTaskForm({ title: "", description: "", status: columnId });
    setShowTaskForm(true);
  };

  if (isLoading || loading || pageLoading) {
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

  const TaskSkeleton = () => (
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
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-12">
      {/* Board Header */}

      <header className="border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          {/* Left Side: Title & Back Link */}
          <div className="flex items-center gap-4 shrink-0">
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
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                Project Board
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.1em] mt-1">
                Workspace / {projectId.slice(-6)}
              </p>
            </div>
          </div>

          {/* Center Side: Integrated Search Bar */}
          {isAdmin && (
            <div className="flex-1 max-w-md relative group hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-500/50 transition-all"
              />
            </div>
          )}

          {/* Right Side: Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex -space-x-2 mr-2">
              {/* User Avatars Placeholder */}
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400"
                >
                  U{i}
                </div>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => openTaskForm("todo")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span>
                <span className="hidden sm:inline">Create Task</span>
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
                  Assign To
                </label>

                <select
                  value={taskForm.assignedTo}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      assignedTo: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select User</option>

                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
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
                    <TaskCard
                      key={task._id}
                      isAdmin={isAdmin}
                      task={task}
                      handleDeleteTask={handleDeleteTask}
                      updateStatus={updateStatus}
                    />
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
      <style>{`
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
