// src/App.tsx
import QuizPage from './pages/QuizPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PrivateRoute from './components/PrivateRoute'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"   element={user ? <Navigate to="/quiz" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/quiz" replace /> : <RegisterPage />} />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <QuizPage />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? '/quiz' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
