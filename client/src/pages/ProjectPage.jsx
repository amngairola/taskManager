import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import API from "../context/axios";

export default function ProjectPage() {
  const { isAdmin, loading } = useAuth();
  const { id: projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const columns = ["todo", "in-progress", "done"];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get(`/tasks?projectId=${projectId}`);
        setTasks(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  // 🔹 Update status
  const updateStatus = async (taskId, status) => {
    try {
      const res = await API.put(`/tasks/${taskId}`, { status });

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.data : t))
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl mb-6">Project Tasks</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column} className="bg-slate-900 p-4 rounded-lg">
            <h2 className="mb-4 font-bold capitalize">{column}</h2>

            {tasks
              .filter((t) => t.status === column)
              .map((task) => (
                <div key={task._id} className="bg-slate-800 p-3 mb-3 rounded">
                  <h3>{task.title}</h3>
                  <p className="text-sm text-slate-400">{task.description}</p>

                  {/* 🔥 Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="mt-2 bg-slate-700 p-1 text-sm"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              ))}

            {/* Admin Only */}
            {isAdmin && (
              <button className="mt-3 w-full bg-indigo-600 py-2 rounded">
                + Add Task
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
