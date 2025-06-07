import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  History,
  BookOpen,
  LogOut
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface QuizAttempt {
  id: number;
  quiz: {
    quiz_title: string;
  };
  score: number;
  total_questions: number;
  created_at: string;
}

interface SidebarProps {
  user: any;
  recentQuizzes: QuizAttempt[];
  onLogout: () => void;
}

export default function Sidebar({ user, recentQuizzes, onLogout }: SidebarProps) {
  return (
    <div className="w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QuizMaster
          </h1>
          <p className="text-sm text-slate-500">AI-Powered Learning</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{user?.username}</p>
          <p className="text-xs text-slate-500">Student</p>
        </div>
        <ModeToggle />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Quizzes
          </h3>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {recentQuizzes.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate flex-1">
                      {attempt.quiz.quiz_title}
                    </p>
                    <Badge variant={attempt.score >= attempt.total_questions * 0.7 ? "default" : "secondary"} className="ml-2">
                      {attempt.score}/{attempt.total_questions}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {recentQuizzes.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No quizzes taken yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}