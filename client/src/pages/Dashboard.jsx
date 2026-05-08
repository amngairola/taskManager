import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "./../context/axios";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user, isAdmin, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    console.log("clicked---", form);

    if (!form.title) return toast.error("Title required");

    try {
      const res = await api.post("/admin/create/projects", form);
      toast.success("New Project created!");
      setProjects((prev) => [res.data.data, ...prev]);
      setForm({ title: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  const SkeletonCard = () => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 animate-pulse">
      <div className="h-5 w-2/3 bg-zinc-800 rounded mb-3"></div>
      <div className="h-3 w-full bg-zinc-800 rounded mb-2"></div>
      <div className="h-3 w-4/5 bg-zinc-800 rounded mb-5"></div>
      <div className="h-4 w-12 bg-zinc-800 rounded"></div>
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
      <div className="bg-zinc-800 p-4 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-zinc-300">No projects yet</h3>
      <p className="text-zinc-500 mt-1">
        Get started by creating your first workspace.
      </p>
      {isAdmin && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Create Project &rarr;
        </button>
      )}
    </div>
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchProjects();
  }, []);
  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/*  Premium Navbar */}
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">
              T
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Taskr.io</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-zinc-500 capitalize">
                {isAdmin ? "Admin" : "Member"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center text-sm font-bold uppercase">
              {user?.name?.[0]}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/*  Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Projects</h2>
            <p className="text-zinc-500 mt-1">
              Manage and track your ongoing workspaces.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <span className="mr-2 text-xl">+</span>
              New Project
            </button>
          )}
        </header>

        {/*  Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="group relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-indigo-500/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <span className="px-2 py-1 bg-zinc-800 text-[10px] uppercase tracking-wider rounded font-bold text-zinc-400">
                    Active
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {project.description ||
                    "No description provided for this project."}
                </p>

                <Link
                  to={`/project/${project._id}`}
                  className="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View Workspace
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* 🔹 Modern Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Create New Project</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
                    Project Title
                  </label>
                  <input
                    name="title"
                    autoFocus
                    placeholder="e.g. Q3 Marketing Campaign"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Outline the goals and scope..."
                    value={form.description}
                    onChange={handleChange}
                    className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-600 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
