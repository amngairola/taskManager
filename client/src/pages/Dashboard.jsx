import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { Link } from "react-router-dom";
import api from "./../context/axios";

export default function Dashboard() {
  const { user, isAdmin, loading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 🔹 Handle Form Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!form.title) return alert("Title required");

    try {
      const res = await api.post("/projects", form);

      setProjects((prev) => [res.data.data, ...prev]);

      setForm({ title: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.log(err);
      alert("Failed to create project");
    }
  };

  if (loading || pageLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between p-4 bg-slate-900">
        <h1>Dashboard</h1>
        <span>{user?.name}</span>
      </nav>

      <main className="p-6">
        {/* 🔹 Header */}
        <div className="flex justify-between mb-6">
          <h2>Projects</h2>

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 px-4 py-2 rounded"
            >
              + New Project
            </button>
          )}
        </div>

        {/* 🔹 Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <form
              onSubmit={handleCreateProject}
              className="bg-slate-900 p-6 rounded w-96"
            >
              <h3 className="mb-4 text-lg">Create Project</h3>

              <input
                name="title"
                placeholder="Project title"
                value={form.title}
                onChange={handleChange}
                className="w-full mb-3 p-2 bg-slate-800"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full mb-3 p-2 bg-slate-800"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 px-3 py-1"
                >
                  Cancel
                </button>

                <button type="submit" className="bg-indigo-600 px-3 py-1">
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 🔹 Projects */}
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-slate-900 p-4 rounded">
              <h3>{project.title}</h3>
              <p className="text-sm text-slate-400">{project.description}</p>

              <Link to={`/project/${project._id}`} className="text-indigo-400">
                View →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
