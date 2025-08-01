// src/components/SidebarContent.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { useApi } from '@/api/api';
import { useUser, useAuth, UserButton } from '@clerk/clerk-react';

interface QuizAttempt { id: number; quiz: { quiz_title: string }; score: number; total_questions: number; created_at: string; }
interface Module { id: number; title: string; code: string; }
interface DocumentItem { id: number; title: string; }
interface FlashcardSet { id: number; document: { title: string }; created_at: string; }
interface SidebarContentProps { onProfileToggle: (open: boolean) => void; profileOpen: boolean; }

export default function SidebarContent({ onProfileToggle, profileOpen }: SidebarContentProps) {
    const { user } = useUser();
    const { signOut } = useAuth();
    const { fetchJson } = useApi();

    const [recentQuizzes, setRecentQuizzes] = useState<QuizAttempt[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [recentDocs, setRecentDocs] = useState<DocumentItem[]>([]);
    const [recentFlashcards, setRecentFlashcards] = useState<FlashcardSet[]>([]);
    const [dividerPercent, setDividerPercent] = useState(60);
    const [docsOpen, setDocsOpen] = useState(true);
    const [flashOpen, setFlashOpen] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        fetchJson<{ results: QuizAttempt[] }>(`/attempts/?ordering=-created_at&limit=5`)
            .then(data => setRecentQuizzes(data.results))
            .catch(console.error);
        fetchJson<{ results: Module[] }>(`/modules/`)
            .then(data => setModules(data.results))
            .catch(console.error);
        fetchJson<{ results: DocumentItem[] }>(`/documents/?ordering=-created_at&limit=5`)
            .then(data => setRecentDocs(data.results))
            .catch(console.error);
        fetchJson<{ results: FlashcardSet[] }>(`/flashcards/?ordering=-created_at&limit=5`)
            .then(data => setRecentFlashcards(data.results))
            .catch(console.error);
    }, [fetchJson]);

    const startDrag = () => { isDragging.current = true; };
    const stopDrag = () => { isDragging.current = false; };
    const onDragPanel = (e: React.MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        const { top, height } = containerRef.current.getBoundingClientRect();
        const pct = ((e.clientY - top) / height) * 100;
        setDividerPercent(Math.min(Math.max(pct, 10), 90));
    };

    const addModule = async () => {
        const title = prompt('Module name:'); if (!title) return;
        const code = prompt('Module code:') || '';
        try {
            const newMod = await fetchJson<Module>('/modules/', { method: 'POST', body: JSON.stringify({ title, code }) });
            setModules(m => [newMod, ...m]);
        } catch { alert('Create module failed'); }
    };

    const onQuizDragStart = (e: React.DragEvent, quizId: number) => e.dataTransfer.setData('quizId', quizId.toString());
    const onModuleDragOver = (e: React.DragEvent) => e.preventDefault();
    const onModuleDrop = async (e: React.DragEvent, moduleId: number) => {
        e.preventDefault();
        const quizId = Number(e.dataTransfer.getData('quizId'));
        if (!quizId) return;
        try {
            await fetchJson('/modules/add_quiz/', { method: 'POST', body: JSON.stringify({ module_id: moduleId, quiz_id: quizId }) });
            alert('Quiz added');
        } catch { alert('Failed to add quiz'); }
    };

    const toggleProfile = () => { onProfileToggle(!profileOpen); };

    return (
        <div
            ref={containerRef}
            onMouseMove={onDragPanel}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            className="bg-white dark:bg-gray-900 border-r flex flex-col h-full overflow-hidden"
        >
            <div style={{ height: `${dividerPercent}%` }} className="px-4 pt-6 overflow-auto">
                <h3 className="font-medium mb-2">Recent Quizzes</h3>
                <ScrollArea className="max-h-48 mb-4">
                    {recentQuizzes.map(a => (
                        <div key={a.id} draggable onDragStart={e => onQuizDragStart(e, a.id)} className="mb-2 p-2 rounded-lg border hover:shadow-md transition">
                            <div className="flex justify-between">
                                <span className="text-sm">{a.quiz.quiz_title}</span>
                                <Badge variant={a.score >= a.total_questions * 0.7 ? 'default' : 'secondary'}>{a.score}/{a.total_questions}</Badge>
                            </div>
                            <p className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </ScrollArea>

                <button onClick={() => setDocsOpen(o => !o)} className="flex items-center mb-2 font-medium focus:outline-none">
                    {docsOpen ? <ChevronUp className="mr-1" /> : <ChevronDown className="mr-1" />}Recent Documents
                </button>
                {docsOpen &&
                    <ul className="list-disc list-inside mb-4">
                        {recentDocs.map(d => <li key={d.id} className="text-sm truncate">{d.title}</li>)}
                    </ul>
                }

                <button onClick={() => setFlashOpen(o => !o)} className="flex items-center mb-2 font-medium focus:outline-none">
                    {flashOpen ? <ChevronUp className="mr-1" /> : <ChevronDown className="mr-1" />}Recent Flashcards
                </button>
                {flashOpen &&
                    <ul className="list-disc list-inside">
                        {recentFlashcards.map(f => <li key={f.id} className="text-sm truncate">{f.document.title}</li>)}
                    </ul>
                }
            </div>

            <div className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize" onMouseDown={startDrag} />

            <div style={{ height: `${100 - dividerPercent}%` }} className="px-4 pt-4 overflow-auto">
                <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Modules</h3>
                    <Button size="sm" className="animate-pulse hover:shadow-lg transition" onClick={addModule}><Plus /></Button>
                </div>
                <ul className="space-y-2">
                    {modules.map(m => (
                        <li key={m.id} onDragOver={onModuleDragOver} onDrop={e => onModuleDrop(e, m.id)}>
                            <Button variant="outline" size="sm" className="w-full flex justify-between hover:shadow-lg transition">
                                <span>{m.title}</span><span className="text-xs text-gray-500">{m.code}</span>
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="px-4 pt-4 pb-6 border-t flex flex-col">
                <div className="flex items-center justify-between">
                    <div
                        className="flex items-center mb-4 cursor-pointer"
                    >

                        <UserButton />

                    </div>
                    <div className="flex items-center">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="hover:shadow-lg transition" onClick={() => signOut()}><LogOut /></Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
