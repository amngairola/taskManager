import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../context/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, isAdmin, loading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    overdue: 0,
  });

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Fetch projects
        const projectRes = await API.get("/projects");
        const projectData = projectRes.data.data;
        setProjects(projectData);

        // 🔹 Fetch tasks for stats (optional but good)
        const tasksRes = await API.get("/tasks?projectId=");
        const tasks = tasksRes.data.data;

        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === "done").length;
        const overdue = tasks.filter(
          (t) => new Date(t.dueDate) < new Date() && t.status !== "done"
        ).length;

        setStats({ total, completed, overdue });
      } catch (err) {
        console.log(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <span>{user?.name}</span>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 🔹 Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 p-4 rounded">
            Total Tasks: {stats.total}
          </div>
          <div className="bg-slate-900 p-4 rounded">
            Completed: {stats.completed}
          </div>
          <div className="bg-slate-900 p-4 rounded">
            Overdue: {stats.overdue}
          </div>
        </div>

        {/* 🔹 Projects */}
        <div className="flex justify-between mb-6">
          <h2>Projects</h2>

          {isAdmin && (
            <button className="bg-indigo-600 px-4 py-2 rounded">
              + New Project
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-slate-900 p-4 rounded">
              <h3 className="text-lg">{project.title}</h3>
              <p className="text-sm text-slate-400">{project.description}</p>

              <Link
                to={`/project/${project._id}`}
                className="text-indigo-400 text-sm"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
