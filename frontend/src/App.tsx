// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import LandingPage from "./pages/LandingPage";
import QuizPage from "./pages/QuizPage";
import HomePage from "./pages/Dashboard";
import AuthPage from "./components/AuthPage";
import AIToolsPanel from "./pages/AIToolsPage"
import ResourceViewer from "./pages/ResourcePage"

export default function App() {
  const { isLoaded, isSignedIn } = useUser();

  // 1) Clerk is initializing: show spinner
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2) Clerk loaded: render routes
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />

        {/* Protected: /quiz */}
        <Route
          path="/quiz"
          element={
            isSignedIn ? (
              <QuizPage />
            ) : (
              <Navigate to="/sign-in" replace state={{ from: "/quiz" }} />
            )
          }
        />

        {/* Protected: /dashboard */}
        <Route
          path="/dashboard"
          element={
            isSignedIn ? (
              <HomePage />
            ) : (
              <Navigate to="/sign-in" replace state={{ from: "/dashboard" }} />
            )
          }
        />

        <Route
          path="/ai-tools"
          element={
            isSignedIn ? (
              <AIToolsPanel />
            ) : (
              <Navigate to="/sign-in" replace state={{ from: "/ai-tools" }} />
            )
          }
        />

        <Route
          path="/resources"
          element={
            isSignedIn ? (
              <ResourceViewer />
            ) : (
              <Navigate to="/sign-in" replace state={{ from: "/resources" }} />
            )
          }
        />

        {/* Catch‑all: redirect based on auth */}
        <Route
          path="*"
          element={
            isSignedIn ? (
              <Navigate to="/quiz" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
