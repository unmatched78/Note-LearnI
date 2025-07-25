// src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/context/AuthContext';
import { FaBookOpen, FaBrain, FaRocket } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold">LearnAI</h1>
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

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 text-foreground"
            variants={childVariants}
          >
            Welcome to LearnAI
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-muted-foreground"
            variants={childVariants}
          >
            Your AI-powered learning companion—master concepts with personalized quizzes, smart notes, and instant insights.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            variants={childVariants}
          >
            <Button asChild className="btn-hover">
              <Link to={user ? "/dashboard" : "/login"}>Get Started</Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" className="btn-hover">
                <Link to="/register">Sign Up</Link>
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
          variants={containerVariants}
        >
          <motion.div
            className="glass p-6 rounded-2xl text-center"
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
          >
            <FaBookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold">Interactive Learning</h3>
            <p className="text-muted-foreground">
              Engage with videos, documents, and AI-generated quizzes.
            </p>
          </motion.div>

          <motion.div
            className="glass p-6 rounded-2xl text-center"
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
          >
            <FaBrain className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold">AI Insights</h3>
            <p className="text-muted-foreground">
              Summaries, transcripts, and instant Q&A at your fingertips.
            </p>
          </motion.div>

          <motion.div
            className="glass p-6 rounded-2xl text-center"
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
          >
            <FaRocket className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold">Boost Productivity</h3>
            <p className="text-muted-foreground">
              Organize modules, track progress, and stay on schedule.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
