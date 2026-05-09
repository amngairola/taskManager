import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "./../context/axios";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logout successful");

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error("Logout failed");
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
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left Side: Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
              T
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Taskr.io
            </h1>
          </div>

          {/* Right Side: User Profile & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-zinc-200">{user?.email}</p>
              <p className="text-xs text-zinc-500 capitalize">
                {isAdmin ? "Admin" : "Member"}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center text-sm font-bold uppercase text-white">
              {user?.name?.[0]}
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block" />

            {/* Improved Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group"
              title="Sign out"
            >
              <span className="text-sm font-medium hidden md:block">
                Logout
              </span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : projects.length > 0 ? (
            projects.map((project) => {
              const isCompleted = project.status === "done"; // Adjust based on your API logic

              return (
                <div
                  key={project._id}
                  className={`group relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-indigo-500/5 overflow-hidden ${
                    isCompleted ? "opacity-90" : ""
                  }`}
                >
                  {/* Top Status Border */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 transition-colors duration-300 ${
                      isCompleted
                        ? "bg-emerald-500"
                        : "bg-indigo-600 group-hover:bg-indigo-400"
                    }`}
                  />

                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3
                      className={`text-lg font-semibold transition-colors duration-300 ${
                        isCompleted
                          ? "text-zinc-400 line-through"
                          : "text-zinc-100 group-hover:text-indigo-400"
                      }`}
                    >
                      {project.title}
                    </h3>

                    {/* Dynamic Status Indicator Badge */}
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <svg
                            className="w-3 h-3"
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
                          Done
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          Active
                        </>
                      )}
                    </span>
                  </div>

                  <p
                    className={`text-sm leading-relaxed mb-6 line-clamp-2 transition-colors duration-300 ${
                      isCompleted ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    {project.description ||
                      "No description provided for this project."}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <Link
                      to={`/project/${project._id}`}
                      className={`inline-flex items-center text-sm font-semibold transition-colors ${
                        isCompleted
                          ? "text-zinc-500 hover:text-emerald-400"
                          : "text-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      View Workspace
                      <svg
                        className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform"
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

                    {/* Subtle Progress Text */}
                    <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
                      {isCompleted ? "100% complete" : "In Progress"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState />
          )}
        </div>

        {/*   Modal Form */}
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
