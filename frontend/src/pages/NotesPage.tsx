// src/pages/NotesPage.tsx
import { useEffect, useState, Suspense, lazy } from "react";
import { useApi } from "@/api/api";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "react-hot-toast";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
import { BookOpen, FileText, LogOut, Zap, Plus as PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
// Lazy-load Markdown editor for React
const MDEditor = lazy(() => import('@uiw/react-md-editor'));

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// If API response is paginated, it may return { results: Note[] }
type NotesResponse = Note[] | { results: Note[] };

export default function NotesPage() {
  const { fetchJson } = useApi();
  const { signOut } = useClerk();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(true);
  const [editorContent, setEditorContent] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  // Fetch notes on mount
  useEffect(() => {
    (async () => {
      setIsLoadingNotes(true);
      try {
        const raw = await fetchJson<NotesResponse>("/notes/");
        const list = Array.isArray(raw) ? raw : raw.results;
        setNotes(list);
      } catch {
        toast.error("Failed to load notes.");
      } finally {
        setIsLoadingNotes(false);
      }
    })();
  }, []);

  function startNew() {
    setIsCreatingNew(true);
    setSelectedNote(null);
    setEditorContent("");
    setEditorTitle("");
  }

  async function submitNew() {
    if (!editorContent.trim()) {
      toast.error("Cannot create an empty note.");
      return;
    }
    setIsSaving(true);
    try {
      const created = await fetchJson<Note>("/notes/", {
        method: "POST",
        body: JSON.stringify({ title: editorTitle || "Untitled", content: editorContent }),
      });
      setNotes(prev => [created, ...prev]);
      toast.success("Note created.");
      startNew();
    } catch {
      toast.error("Failed to create note.");
    } finally {
      setIsSaving(false);
    }
  }

  function selectNote(note: Note) {
    setIsCreatingNew(false);
    setSelectedNote(note);
    setEditorContent(note.content);
    setEditorTitle(note.title);
  }

  async function saveNote() {
    if (!selectedNote) return;
    if (!editorContent.trim()) {
      toast.error("Cannot save an empty note.");
      return;
    }
    setIsSaving(true);
    try {
      const updated = await fetchJson<Note>(`/notes/${selectedNote.id}/`, {
        method: "PUT",
        body: JSON.stringify({ title: editorTitle, content: editorContent }),
      });
      setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
      toast.success("Saved.");
      setSelectedNote(updated);
    } catch {
      toast.error("Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteNote() {
    if (!selectedNote) return;
    try {
      await fetchJson(`/notes/${selectedNote.id}/`, { method: "DELETE" });
      setNotes(prev => prev.filter(n => n.id !== selectedNote.id));
      toast.success("Deleted.");
      startNew();
    } catch {
      toast.error("Failed to delete note.");
    }
  }

  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <SidebarInset className="h-screen">
        <div className="flex h-full flex-col">
          <header className="bg-card shadow px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-700">AI Study Hub</h1>
            <nav className="flex items-center gap-4">
              {[
                { to: "/dashboard", icon: FileText, label: "Dashboard" },
                { to: "/resources", icon: BookOpen, label: "Resources" },
                { to: "/ai-tools", icon: Zap, label: "AI Tools" },
                { to: "/notes", icon: FileText, label: "Notes" },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-1 px-3 py-2 rounded hover:bg-muted transition text-muted-foreground"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <UserButton />
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-100"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5 text-red-600" />
              </Button>
            </nav>
          </header>
          {/* <header className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center space-x-2">
              {/* <SidebarTrigger /> 

          </header> */}
          <div className="flex flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={25} minSize={15} className="border-r flex flex-col">
                <div className="px-4 py-3 flex items-center justify-between border-b">
                  <h2 className="text-lg font-semibold">Your Notes</h2>
                  <Button size="icon" variant="outline" onClick={startNew} disabled={isSaving}>
                    <PlusIcon className="h-5 w-5" />
                    <span className="sr-only">New note</span>
                  </Button>
                </div>
                <ScrollArea className="flex-1 px-2 py-2">
                  {isLoadingNotes ? (
                    <p className="text-center text-sm">Loading…</p>
                  ) : notes.length === 0 ? (
                    <p className="text-center text-sm">No notes yet. Click “+” to create one.</p>
                  ) : (
                    <ul className="space-y-1">
                      {notes.map(note => (
                        <li key={note.id} className="bg-transparent hover:text-blue-700 font-bold transition duration-200">
                          <button
                            onClick={() => selectNote(note)}
                            className={`w-full text-left px-3 py-2 rounded-md transition 
                              ${selectedNote?.id === note.id && !isCreatingNew ? "bg-gray-200" : "hover:bg-gray-100"}`}
                          >
                            <span className="block truncate font-medium ">{note.title}</span>
                            <span className="text-xs text-gray-500 italic">
                              {(note.updated_at ? new Date(note.updated_at) : new Date(note.created_at)).toLocaleDateString()}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75} className="flex flex-col">
                <div className="flex h-full flex-col p-6">
                  <input
                    className="text-2xl font-semibold mb-4 p-2 border rounded"
                    placeholder="Title (optional)"
                    value={editorTitle}
                    onChange={e => setEditorTitle(e.target.value)}
                  />
                  <div className="flex-1 mb-4">
                    <Suspense fallback={<div className="text-center">Loading editor...</div>}>
                      <MDEditor
                        value={editorContent}
                        onChange={(value) => setEditorContent(value ?? "")}
                        preview="edit"
                      />
                    </Suspense>
                  </div>
                  <div className="flex justify-end space-x-2">
                    {isCreatingNew ? (
                      <>
                        <Button variant="outline" size="sm" onClick={startNew} disabled={isSaving}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={submitNew} disabled={isSaving}>
                          {isSaving ? "Saving…" : "Submit"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="destructive" size="sm" onClick={deleteNote} disabled={isSaving}>
                          Delete
                        </Button>
                        <Button size="sm" onClick={saveNote} disabled={isSaving}>
                          {isSaving ? "Saving…" : "Save"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
