import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import { useAuth } from "./context/AuthContext";

// 🔹 Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return user ? children : <Navigate to="/login" replace />;
}

// 🔹 Public Route (prevent logged-in users from going to login/register)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return !user ? children : <Navigate to="/dashboard" replace />;
}

// 🔹 404 Page
function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
      <h1 className="text-4xl font-extrabold text-indigo-500 mb-2">404</h1>
      <p className="text-lg text-slate-400 mb-6">
        Page not found or still in development.
      </p>

      <Link
        to="/dashboard"
        className="px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm hover:bg-indigo-700"
      >
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 🔹 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />

        {/* 🔹 Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 🔹 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
