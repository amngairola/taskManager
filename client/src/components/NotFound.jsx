import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Large 404 Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <span className="text-[30rem] font-bold">404</span>
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Icon Container */}
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <svg
            className="w-10 h-10 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-zinc-100 tracking-tight mb-4">
          Lost in the cloud?
        </h1>

        <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl border border-zinc-800 transition-all active:scale-[0.98]"
          >
            Previous Page
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-16 pt-8 border-t border-zinc-800/50">
          <p className="text-zinc-600 text-sm">
            Think this is a mistake?{" "}
            <Link
              to="/support"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
