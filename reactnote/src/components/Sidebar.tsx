import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  History,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border-r transition-all duration-300 ease-in-out relative ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-white dark:bg-gray-900 shadow-md hover:shadow-lg"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            {!isCollapsed && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    QuizMaster
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI-Powered Learning
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Student
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Quizzes */}
        {!isCollapsed && (
          <div className="flex-1 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <History className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Recent Quizzes
              </h3>
            </div>
            
            <ScrollArea className="h-64">
              {recentQuizzes.map((attempt) => (
                <div key={attempt.id} className="mb-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                      {attempt.quiz.quiz_title}
                    </h4>
                    <Badge variant={attempt.score >= attempt.total_questions * 0.7 ? "default" : "secondary"} className="ml-2">
                      {attempt.score}/{attempt.total_questions}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {recentQuizzes.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No quizzes taken yet
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 border-t mt-auto">
          <div className={`${isCollapsed ? 'flex flex-col space-y-2' : 'flex items-center justify-between'}`}>
            {isCollapsed ? (
              <>
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-full p-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}