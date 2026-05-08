import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBtnLoading(true);

    try {
      await login({
        email: email.trim(),
        password: password.trim(),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    <Loading />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] px-4 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px]" />

      <div className="w-full max-w-[400px] z-10">
        {/* Logo/Brand Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-4">
            <span className="text-white text-2xl font-bold italic">T</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Welcome back
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Enter your details to access your account
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl animate-in fade-in slide-in-from-top-2">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    size="sm"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={btnLoading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all shadow-lg active:scale-[0.98] ${
                btnLoading
                  ? "bg-indigo-600/50 cursor-wait overflow-hidden"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {btnLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center">
            <p className="text-sm text-zinc-500 font-medium">
              New to Taskr?{" "}
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[11px] text-zinc-600 uppercase tracking-widest font-medium">
          Secure Cloud Infrastructure • SOC2 Compliant
        </p>
      </div>
    </div>
  );
}
