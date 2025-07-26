// src/App.tsx
import QuizPage from './pages/QuizPage'
import LandingPage from './pages/LandingPage'
// import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { useUser } from '@clerk/clerk-react';


function App() {
  const { user, isLoaded, isSignedIn } = useUser(); // user

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
        {/* <Route path="/login" element={user ? <Navigate to="/quiz" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/quiz" replace /> : <RegisterPage />} /> */}
        <Route
          path="/quiz"
          element={
            
              <QuizPage />
            
          }
        />



        <Route
          path="/dashboard"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <Dashboard />
              </SignedIn>
            </>
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? '/quiz' : '/sign-in'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
