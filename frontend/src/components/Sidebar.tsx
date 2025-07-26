// import React, { useState, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Brain,
//   History,
//   BookOpen,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Plus
// } from 'lucide-react';
// import { ModeToggle } from '@/components/mode-toggle';
// import { motion } from 'framer-motion';

// interface QuizAttempt {
//   id: number;
//   quiz: { quiz_title: string };
//   score: number;
//   total_questions: number;
//   created_at: string;
// }

// interface Module {
//   name: string;
//   code: string;
// }

// interface SidebarProps {
//   user: any;
//   recentQuizzes: QuizAttempt[];
//   onLogout: () => void;
// }

// export default function Sidebar({ user, recentQuizzes, onLogout }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [modules, setModules] = useState<Module[]>([
//     { name: 'Module A', code: '@A1' },
//     { name: 'Module B', code: '@B2' },
//     { name: 'Module C', code: '@C3' }
//   ]);

//   // Divider drag state
//   const [dividerPercent, setDividerPercent] = useState(60);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const isDragging = useRef(false);

//   const startDrag = () => { isDragging.current = true; };
//   const stopDrag = () => { isDragging.current = false; };
//   const onDrag = (e: React.MouseEvent) => {
//     if (!isDragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const offsetY = e.clientY - rect.top;
//     const percent = Math.min(Math.max((offsetY / rect.height) * 100, 10), 90);
//     setDividerPercent(percent);
//   };

//   const addModule = () => {
//     const name = prompt('Enter module name:');
//     if (!name) return;
//     const codeInput = prompt('Enter module code (e.g. @XYZ123):');
//     const code = codeInput || `@${name.replace(/\s+/g, '').substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
//     setModules(prev => [...prev, { name, code }]);
//   };

//   return (
//     <motion.div
//       animate={{ width: isCollapsed ? 64 : 320 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white dark:bg-gray-900 border-r flex flex-col h-full relative overflow-hidden"
//       ref={containerRef}
//       onMouseMove={onDrag}
//       onMouseUp={stopDrag}
//       onMouseLeave={stopDrag}
//     >
//       {/* Toggle */}
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className="absolute top-4 right-[-12px] z-20 p-1 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg"
//         aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//       >
//         {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//       </Button>

//       {/* Upper & Lower split */}
//       <div className="flex-1 flex flex-col">
//         {/* Upper panel */}
//         <div style={{ height: `${dividerPercent}%` }} className="flex flex-col px-4 pt-6">
//           <div className="flex items-center mb-4">
//             <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//             {!isCollapsed && <h3 className="ml-2 font-medium text-gray-900 dark:text-white">Recent Quizzes</h3>}
//           </div>
//           <ScrollArea className="flex-1">
//             {recentQuizzes.length > 0 ? (
//               recentQuizzes.map(attempt => (
//                 <div
//                   key={attempt.id}
//                   className="mb-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
//                   onClick={() => window.alert(`View quiz ${attempt.id}`)}
//                   title={`${attempt.quiz.quiz_title}: ${attempt.score}/${attempt.total_questions}`}
//                 >
//                   <div className="flex justify-between items-start mb-1">
//                     <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
//                       {attempt.quiz.quiz_title}
//                     </h4>
//                     <Badge variant={attempt.score >= attempt.total_questions * 0.7 ? 'default' : 'secondary'}>
//                       {attempt.score}/{attempt.total_questions}
//                     </Badge>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {new Date(attempt.created_at).toLocaleDateString()}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//                 <BookOpen className="h-8 w-8 mx-auto mb-2" />
//                 <p className="text-sm">No quizzes taken yet</p>
//               </div>
//             )}
//           </ScrollArea>
//         </div>

//         {/* Draggable Divider */}
//         <div
//           className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize"
//           onMouseDown={startDrag}
//           title="Drag to resize"
//         />

//         {/* Lower panel */}
//         <div style={{ height: `${100 - dividerPercent}%` }} className="flex flex-col px-4 pt-4 overflow-auto">
//           <div className="flex items-center justify-between mb-2">
//             {!isCollapsed && <h3 className="font-medium text-gray-900 dark:text-white">Modules</h3>}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={addModule}
//               className="p-2"
//               title="Add Module"
//             >
//               <Plus className="h-5 w-5" />
//               {!isCollapsed && <span className="ml-2">New Module</span>}
//             </Button>
//           </div>
//           <ul className="space-y-2">
//             {[...modules].reverse().map((mod, idx) => (
//               <li key={idx}>
//                 <Button
//                   variant="outline"
//                   size={isCollapsed ? 'icon' : 'sm'}
//                   className="w-full justify-between"
//                   onClick={() => window.alert(`Load module code ${mod.code}`)}
//                   title={`${mod.name} (${mod.code})`}
//                 >
//                   <span className="truncate">
//                     {isCollapsed ? mod.code : mod.name}
//                   </span>
//                   {!isCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{mod.code}</span>}
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Profile & Footer */}
//       <div className="px-4 pt-4 pb-6 border-t">
//         <div
//           className="flex items-center mb-4 cursor-pointer"
//           title={user?.username}
//           onClick={() => window.alert('Open Profile')}
//         >
//           <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//             {user?.username?.charAt(0).toUpperCase()}
//           </div>
//           {!isCollapsed && (
//             <div className="ml-3">
//               <p className="font-medium text-gray-900 dark:text-white">
//                 {user?.username}
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
//             </div>
//           )}
//         </div>
//         <div className="flex items-center justify-between">
//           <ModeToggle />
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onLogout}
//             aria-label="Sign Out"
//           >
//             <LogOut />
//             {!isCollapsed && <span className="ml-2">Sign Out</span>}
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
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
import api from '@/api/api';

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
  user: any;
  recentQuizzes: QuizAttempt[];
  onLogout: () => void;
}

export default function Sidebar({ user, recentQuizzes, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [dividerPercent, setDividerPercent] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // fetch modules on mount
  useEffect(() => {
    api.get<{ results: Module[] }>('/modules/')
      .then(resp => setModules(resp.data.results))
      .catch(console.error);
  }, []);

  // drag‐to‐resize handlers
  const startDrag = () => { isDragging.current = true; };
  const stopDrag  = () => { isDragging.current = false; };
  const onDrag    = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const { top, height } = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientY - top) / height) * 100;
    setDividerPercent(Math.min(Math.max(pct, 10), 90));
  };

  // create new module
  const addModule = async () => {
    const title = prompt('Module name:');
    if (!title) return;
    const code  = prompt('Module code (e.g. @XYZ123):') || '';
    try {
      const resp = await api.post<Module>('/modules/', { title, code });
      setModules(prev => [resp.data, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Could not create module');
    }
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={onDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag}
      animate={{ width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border-r flex flex-col h-full relative overflow-hidden"
    >
      {/* collapse toggle */}
      <Button
        variant="ghost" size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-[-12px] z-20 p-1 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg"
        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      {/* split content */}
      <div className="flex-1 flex flex-col">
        {/* recent quizzes panel */}
        <div style={{ height: `${dividerPercent}%` }} className="flex flex-col px-4 pt-6">
          <div className="flex items-center mb-4">
            <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {!isCollapsed && <h3 className="ml-2 font-medium text-gray-900 dark:text-white">Recent Quizzes</h3>}
          </div>
          <ScrollArea className="flex-1">
            {recentQuizzes.length ? recentQuizzes.map(a => (
              <div
                key={a.id}
                className="mb-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                onClick={() => alert(`View quiz ${a.id}`)}
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

        {/* draggable divider */}
        <div
          className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize"
          onMouseDown={startDrag}
          title="Drag to resize"
        />

        {/* modules panel */}
        <div style={{ height: `${100 - dividerPercent}%` }} className="flex flex-col px-4 pt-4 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            {!isCollapsed && <h3 className="font-medium text-gray-900 dark:text-white">Modules</h3>}
            <Button
              variant="ghost" size={isCollapsed ? 'icon' : 'sm'}
              onClick={addModule}
              className="p-2"
              title="Add Module"
            >
              <Plus className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">New Module</span>}
            </Button>
          </div>
          <ul className="space-y-2">
            {[...modules].map(m => (
              <li key={m.id}>
                <Button
                  variant="outline"
                  size={isCollapsed ? 'icon' : 'sm'}
                  className="w-full justify-between"
                  onClick={() => alert(`Load ${m.code}`)}
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

      {/* profile & logout */}
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
          <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Sign Out">
            <LogOut />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
