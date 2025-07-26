// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Brain,
//   History,
//   BookOpen,
//   LogOut,
//   ChevronLeft,
//   ChevronRight
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

// interface SidebarProps {
//   user: any;
//   recentQuizzes: QuizAttempt[];
//   onLogout: () => void;
// }

// export default function Sidebar({ user, recentQuizzes, onLogout }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <motion.div
//       animate={{ width: isCollapsed ? 64 : 320 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white dark:bg-gray-900 border-r flex flex-col h-full relative overflow-hidden"
//     >
//       {/* Toggle */}
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className="absolute top-4 right-[-12px] z-20 p-1 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg"
//         aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//         title={isCollapsed ? 'Expand' : 'Collapse'}
//       >
//         {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//       </Button>

//       <div className="flex-1 flex flex-col pt-6">
//         {/* Logo & Title */}
//         <div className="flex items-center px-4 mb-6">
//           <div
//             className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg cursor-pointer"
//             title="Dashboard"
//           >
//             <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//           </div>
//           {!isCollapsed && (
//             <div className="ml-3">
//               <h1 className="text-xl font-bold text-gray-900 dark:text-white">
//                 QuizMaster
//               </h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 AI-Powered Learning
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Recent Quizzes */}
//         <motion.div
//           animate={{ opacity: isCollapsed ? 0 : 1 }}
//           transition={{ duration: 0.2 }}
//           className="flex-1 px-4"
//         >
//           <div className="flex items-center mb-4">
//             <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//             <h3 className="ml-2 font-medium text-gray-900 dark:text-white">
//               Recent Quizzes
//             </h3>
//           </div>
//           <ScrollArea className="h-full">
//             {recentQuizzes.length > 0 ? (
//               recentQuizzes.map((attempt) => (
//                 <div
//                   key={attempt.id}
//                   className="mb-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
//                   title={`${attempt.quiz.quiz_title}: ${attempt.score}/${attempt.total_questions}`}
//                   onClick={() => window.alert(`View quiz ${attempt.id}`)}
//                 >
//                   <div className="flex justify-between items-start mb-1">
//                     <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
//                       {attempt.quiz.quiz_title}
//                     </h4>
//                     <Badge
//                       variant={
//                         attempt.score >= attempt.total_questions * 0.7
//                           ? 'default'
//                           : 'secondary'
//                       }
//                     >
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
//         </motion.div>

//         {/* Spacer pushes profile to bottom */}
//         <div className="flex-shrink-0" />
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
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Student
//               </p>
//             </div>
//           )}
//         </div>
//         <div className="flex items-center justify-between">
//           <div title="Toggle Theme">
//             <ModeToggle />
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onLogout}
//             aria-label="Sign Out"
//             title="Sign Out"
//           >
//             <LogOut />
//             {!isCollapsed && <span className="mr-7 ">Sign Out</span>}
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
import React, { useState, useRef } from 'react';
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

interface QuizAttempt {
  id: number;
  quiz: { quiz_title: string };
  score: number;
  total_questions: number;
  created_at: string;
}

interface Module {
  name: string;
  code: string;
}

interface SidebarProps {
  user: any;
  recentQuizzes: QuizAttempt[];
  onLogout: () => void;
}

export default function Sidebar({ user, recentQuizzes, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modules, setModules] = useState<Module[]>([
    { name: 'Module A', code: '@A1' },
    { name: 'Module B', code: '@B2' },
    { name: 'Module C', code: '@C3' }
  ]);

  // Divider drag state
  const [dividerPercent, setDividerPercent] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const startDrag = () => { isDragging.current = true; };
  const stopDrag = () => { isDragging.current = false; };
  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const percent = Math.min(Math.max((offsetY / rect.height) * 100, 10), 90);
    setDividerPercent(percent);
  };

  const addModule = () => {
    const name = prompt('Enter module name:');
    if (!name) return;
    const codeInput = prompt('Enter module code (e.g. @XYZ123):');
    const code = codeInput || `@${name.replace(/\s+/g, '').substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    setModules(prev => [...prev, { name, code }]);
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 border-r flex flex-col h-full relative overflow-hidden"
      ref={containerRef}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-[-12px] z-20 p-1 rounded-full bg-white dark:bg-gray-900 shadow-md hover:shadow-lg"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      {/* Upper & Lower split */}
      <div className="flex-1 flex flex-col">
        {/* Upper panel */}
        <div style={{ height: `${dividerPercent}%` }} className="flex flex-col px-4 pt-6">
          <div className="flex items-center mb-4">
            <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {!isCollapsed && <h3 className="ml-2 font-medium text-gray-900 dark:text-white">Recent Quizzes</h3>}
          </div>
          <ScrollArea className="flex-1">
            {recentQuizzes.length > 0 ? (
              recentQuizzes.map(attempt => (
                <div
                  key={attempt.id}
                  className="mb-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => window.alert(`View quiz ${attempt.id}`)}
                  title={`${attempt.quiz.quiz_title}: ${attempt.score}/${attempt.total_questions}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                      {attempt.quiz.quiz_title}
                    </h4>
                    <Badge variant={attempt.score >= attempt.total_questions * 0.7 ? 'default' : 'secondary'}>
                      {attempt.score}/{attempt.total_questions}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No quizzes taken yet</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Draggable Divider */}
        <div
          className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize"
          onMouseDown={startDrag}
          title="Drag to resize"
        />

        {/* Lower panel */}
        <div style={{ height: `${100 - dividerPercent}%` }} className="flex flex-col px-4 pt-4 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            {!isCollapsed && <h3 className="font-medium text-gray-900 dark:text-white">Modules</h3>}
            <Button
              variant="ghost"
              size="sm"
              onClick={addModule}
              className="p-2"
              title="Add Module"
            >
              <Plus className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">New Module</span>}
            </Button>
          </div>
          <ul className="space-y-2">
            {modules.reverse().map((mod, idx) => (
              <li key={idx}>
                <Button
                  variant="outline"
                  size={isCollapsed ? 'icon' : 'sm'}
                  className="w-full justify-between"
                  onClick={() => window.alert(`Load module code ${mod.code}`)}
                  title={`${mod.name} (${mod.code})`}
                >
                  <span className="truncate">
                    {isCollapsed ? mod.code : mod.name}
                  </span>
                  {!isCollapsed && <span className="text-xs text-gray-500 dark:text-gray-400">{mod.code}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Profile & Footer */}
      <div className="px-4 pt-4 pb-6 border-t">
        <div
          className="flex items-center mb-4 cursor-pointer"
          title={user?.username}
          onClick={() => window.alert('Open Profile')}
        >
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            aria-label="Sign Out"
          >
            <LogOut />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
