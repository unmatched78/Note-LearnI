// src/pages/LandingPage.tsx
import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { FaBookOpen, FaBrain, FaRocket } from "react-icons/fa";
// import AnimatedBeamDemo from "@/components/animated-beam-demo";

// Lazy-load Globe
const Globe = React.lazy(() => import("../components/Globe"));

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
};
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  return (
    // removed overflow-hidden so page can scroll
    <div className="relative min-h-screen bg-black">
      {/* Background Globe */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Loading background…
          </div>
        }
      >
        <Globe className="absolute inset-0 w-full h-full opacity-20" />
      </Suspense>

      {/* Page Content — now scrollable */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">LearnAI</h1>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {isSignedIn ? (
              <>
                <span className="hidden sm:inline text-white">Hi, {user?.firstName}</span>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton>
                  <Button variant="ghost" size="sm">Login</Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm">Register</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </header>

        {/* Hero */}
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center text-white">
          <motion.div
            className="max-w-3xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="text-5xl md:text-7xl font-extrabold mb-6" variants={childVariants}>
              Welcome to LearnAI
            </motion.h1>
            <motion.p className="text-xl md:text-2xl mb-8" variants={childVariants}>
              Your AI-powered learning companion—master concepts with personalized quizzes, smart notes, and instant insights.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              variants={childVariants}
            >
              <Button asChild className="btn-hover">
                <Link to={isSignedIn ? "/dashboard" : "/sign-in"}>Get Started</Link>
              </Button>
              {!isSignedIn && (
                <SignUpButton>
                  <Button asChild variant="outline" className="btn-hover">
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </SignUpButton>
              )}
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
            variants={containerVariants}
          >
            {[
              {
                icon: FaBookOpen,
                title: "Interactive Learning",
                desc: "Engage with videos, documents, and AI-generated quizzes.",
              },
              {
                icon: FaBrain,
                title: "AI Insights",
                desc: "Summaries, transcripts, and instant Q&A at your fingertips.",
              },
              {
                icon: FaRocket,
                title: "Boost Productivity",
                desc: "Organize modules, track progress, and stay on schedule.",
              },
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                className="glass p-6 rounded-2xl text-center"
                variants={childVariants}
                whileHover={{ scale: 1.05 }}
              >
                <feat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold">{feat.title}</h3>
                <p className="text-muted-foreground">{feat.desc}</p>
              </motion.div>
            ))}
             {/* <AnimatedBeamDemo /> */}
          </motion.div>

          {/* Only one beam demo */}
          
        </main>
      </div>
    </div>
  );
}
