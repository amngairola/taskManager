import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

//  Lazy Loaded Pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
import { useAuth } from "./context/AuthContext";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PageSkeleton from "./components/skeleton/PageSkeleton";
import NotFound from "./components/NotFound";

// Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageSkeleton />;

  return user ? children : <Navigate to="/login" replace />;
}

// Public Route
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageSkeleton />;

  return !user ? children : <Navigate to="/dashboard" replace />;
}

//  404 Page
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/*  Public Routes */}
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

          {/*  Protected Routes */}
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

          {/*  Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/*  404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        theme="colored"
      />
    </BrowserRouter>
  );
}
