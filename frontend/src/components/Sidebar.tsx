// src/components/Sidebar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  History,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { motion } from 'framer-motion';
import { useApi } from '@/api/api';
import { useUser, useAuth } from '@clerk/clerk-react';

interface QuizAttempt {
  id: number;
  quiz: { quiz_title: string };
  score: number;
  total_questions: number;
  created_at: string;
}

interface Module {
  id: number;
  title: string;
  code: string;
}

interface SidebarProps {
  recentQuizzes: QuizAttempt[];
}

export default function Sidebar({ recentQuizzes }: SidebarProps) {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { fetchJson } = useApi();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [dividerPercent, setDividerPercent] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // load modules
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchJson<{ results: Module[] }>('/modules/');
        setModules(data.results);
      } catch (e) {
        console.error('Failed to load modules:', e);
      }
    }
    load();
  }, [fetchJson]);

  // divider drag handlers
  const startDrag = () => { isDragging.current = true; };
  const stopDrag = () => { isDragging.current = false; };
  const onDragPanel = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const { top, height } = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientY - top) / height) * 100;
    setDividerPercent(Math.min(Math.max(pct, 10), 90));
  };

  // add module
  const addModule = async () => {
    const title = prompt('Module name:');
    if (!title) return;
    const code = prompt('Module code (e.g. @XYZ123):') || '';
    try {
      const newMod = await fetchJson<Module>('/modules/', {
        method: 'POST',
        body: JSON.stringify({ title, code })
      });
      setModules(m => [newMod, ...m]);
    } catch (err) {
      console.error('Create module failed:', err);
      alert('Create module failed');
    }
  };

  // drag-and-drop handlers
  const onQuizDragStart = (e: React.DragEvent, quizId: number) => {
    e.dataTransfer.setData('quizId', quizId.toString());
  };
  const onModuleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const onModuleDrop = async (e: React.DragEvent, moduleId: number) => {
    e.preventDefault();
    const quizId = e.dataTransfer.getData('quizId');
    if (!quizId) return;
    try {
      await fetchJson('/modules/add_quiz/', {
        method: 'POST',
        body: JSON.stringify({ module_id: moduleId, quiz_id: Number(quizId) })
      });
      alert(`Quiz ${quizId} added to module ${moduleId}`);
    } catch (err) {
      console.error('Failed to add quiz:', err);
      alert('Failed to add quiz');
    }
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={onDragPanel}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      animate={{ width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border-r flex flex-col h-full relative overflow-hidden"
    >
      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(x => !x)}
        className="absolute top-4 right-[-12px] z-20 p-1 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg"
        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      <div className="flex-1 flex flex-col">
        {/* Recent Quizzes */}
        <div style={{ height: `${dividerPercent}%` }} className="flex flex-col px-4 pt-6">
          <div className="flex items-center mb-4">
            <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {!isCollapsed && <h3 className="ml-2 font-medium text-gray-900 dark:text-white">Recent Quizzes</h3>}
          </div>
          <ScrollArea className="flex-1">
            {recentQuizzes.length ? recentQuizzes.map(a => (
              <div
                key={a.id}
                draggable
                onDragStart={e => onQuizDragStart(e, a.id)}
                className="mb-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-grab"
                title={`${a.quiz.quiz_title}: ${a.score}/${a.total_questions}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                    {a.quiz.quiz_title}
                  </h4>
                  <Badge variant={a.score >= a.total_questions * 0.7 ? 'default' : 'secondary'}>
                    {a.score}/{a.total_questions}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No quizzes taken yet</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Resizable divider */}
        <div
          className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize"
          onMouseDown={startDrag}
          title="Drag to resize"
        />

        {/* Modules */}
        <div style={{ height: `${100 - dividerPercent}%` }} className="flex flex-col px-4 pt-4 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            {!isCollapsed && <h3 className="font-medium text-gray-900 dark:text-white">Modules</h3>}
            <Button
              variant="ghost"
              size={isCollapsed ? 'icon' : 'sm'}
              onClick={addModule}
              className="p-2"
              title="Add Module"
            >
              <Plus className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">New Module</span>}
            </Button>
          </div>
          <ul className="space-y-2">
            {modules.map(m => (
              <li key={m.id}>
                <Button
                  variant="outline"
                  size={isCollapsed ? 'icon' : 'sm'}
                  className="w-full justify-between"
                  onDragOver={onModuleDragOver}
                  onDrop={e => onModuleDrop(e, m.id)}
                  title={`${m.title} (${m.code})`}
                >
                  <span className="truncate">{isCollapsed ? m.code : m.title}</span>
                  {!isCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{m.code}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Profile & Logout */}
      <div className="px-4 pt-4 pb-6 border-t">
        <div
          className="flex items-center mb-4 cursor-pointer"
          title={user?.username}
          onClick={() => alert('Open Profile')}
        >
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="font-medium text-gray-900 dark:text-white">{user?.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign Out">
            <LogOut />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
