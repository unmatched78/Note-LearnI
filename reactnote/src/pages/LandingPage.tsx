// src/pages/LandingPage.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ModeToggle } from '@/components/mode-toggle'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold">QuizGen</h1>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <>
              <span className="hidden sm:inline">Hi, {user.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to QuizGen</CardTitle>
            <CardDescription>
              Upload your study materials and let AI generate quizzes for you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 dark:text-gray-300">
              {user
                ? "Go to the quiz dashboard to start creating."
                : "Please login or register to continue."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-2">
            {user ? (
              <Link to="/quiz">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
