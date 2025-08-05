import { useState, useRef, ChangeEvent } from "react";
import { useApi } from "@/api/api";
import AIToolsPanel from "@/components/AIToolsPanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FlashcardsList from "@/components/FlashcardsList";
import MarkdownDisplay from "@/components/MarkdownDisplay";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import SidebarContainer from "@/components/SidebarContainer";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Upload, Zap, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/clerk-react";

interface Resource { id: number; name: string; type: string; }

type QuizQuestion = { question: string; options: string[]; answer: string };
type QuizFeedback = {
  question: string;
  student_answer: string;
  correct_answer: string;
  is_correct: boolean;
};

export default function AIToolsPage() {
  const { fetchJson } = useApi();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [generatedContent, setGeneratedContent] = useState<{
    type: string;
    content: any;
  } | null>(null);
  const [quizMeta, setQuizMeta] = useState<{
    quizId: number;
    questions: QuizQuestion[];
  } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadResource = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetchJson<{ id: number; text_chunks: string[] }>(
        "/documents/",
        { method: "POST", body: fd }
      );
      setSelectedResource({ id: res.id, name: file.name, type: "Document" });
      setGeneratedContent(null);
      setQuizMeta(null);
      setAnswers({});
    } catch {
      alert("Upload failed");
    }
  };

  const cardAccent = "border-l-4 border-purple-500 hover:shadow-lg transition";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-700">AI Study Hub</h1>
        <nav className="flex items-center gap-4">
          {[
            { to: "/dashboard", icon: FileText, label: "Dashboard" },
            { to: "/resources", icon: BookOpen, label: "Resources" },
            { to: "/ai-tools", icon: Zap, label: "AI Tools" },
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
            onClick={() => fetchJson("/auth/logout")}
          >
            <LogOut className="h-5 w-5 text-red-600" />
          </Button>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-88 bg-card border-r p-6 space-y-6 overflow-auto">
          <div className="space-y-2">
            <p className="font-medium text-gray-700">Upload Resource</p>
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mr-2" /> Choose File
            </Button>
            <Input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.pptx,.txt"
              className="hidden"
              onChange={uploadResource}
            />
            {selectedResource && (
              <Card className={`${cardAccent} bg-card`}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Selected
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <span className="truncate">{selectedResource.name}</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {selectedResource.type}
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
          <AIToolsPanel
            selectedResource={selectedResource || undefined}
            onGenerateContent={(payload) => {
              setGeneratedContent(payload);
              if (payload.type !== "quiz") {
                setQuizMeta(null);
                setAnswers({});
              }
            }}
            onQuizMeta={(meta) => setQuizMeta(meta)}
          />
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-auto">
          <SidebarContainer />

          {!generatedContent ? (
            <Card className={`${cardAccent}`}>
              <CardHeader>
                <CardTitle>No Content Yet</CardTitle>
                <CardDescription>
                  Select a tool on the left to get started.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card className={`${cardAccent}`}>
              <CardHeader className="flex items-center gap-2">
                <FileText className="text-purple-700" />
                <CardTitle className="capitalize">
                  {generatedContent.type}
                </CardTitle>
              </CardHeader>
              <Separator className="my-2" />
              <CardContent>
                {generatedContent.type === "flashcards" && (
                  <FlashcardsList
                    cards={generatedContent.content}
                    tiltAngle={15}
                    tiltScale={1.02}
                    flipDuration={0.6}
                    springStiffness={300}
                    springDamping={20}
                  />
                )}

                {generatedContent.type === "quiz" && quizMeta && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const resp = await fetchJson<{ feedback: QuizFeedback[] }>(
                        "/attempts/",
                        {
                          method: "POST",
                          body: JSON.stringify({
                            quiz_id: quizMeta.quizId,
                            student_answers: answers,
                          }),
                        }
                      );
                      setGeneratedContent({
                        type: "quizResult",
                        content: resp.feedback,
                      });
                    }}
                  >
                    {quizMeta.questions.map((q, i) => (
                      <fieldset key={i} className="mb-4">
                        <legend className="font-semibold mb-2">{q.question}</legend>
                        <div className="space-y-1">
                          {q.options.map((opt) => (
                            <label key={opt} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`Q${i}`}
                                value={opt}
                                checked={answers[`Q${i}`] === opt}
                                onChange={() =>
                                  setAnswers((a) => ({ ...a, [`Q${i}`]: opt }))
                                }
                                className="accent-purple-600"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                    <Button className="bg-purple-600 text-white hover:bg-purple-700">
                      Submit
                    </Button>
                  </form>
                )}

                {generatedContent.type === "quizResult" &&
                  Array.isArray(generatedContent.content) && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold">
                        Score:{" "}
                        {
                          (generatedContent.content as QuizFeedback[]).filter(
                            (f) => f.is_correct
                          ).length
                        }
                        /{(generatedContent.content as QuizFeedback[]).length}
                      </h2>
                      {(generatedContent.content as QuizFeedback[]).map(
                        (f, i) => (
                          <div
                            key={i}
                            className="p-4 border rounded-lg bg-gray-50"
                          >
                            <p className="font-semibold mb-2">
                              Q{i + 1}: {f.question}
                            </p>
                            <ul className="mb-2 space-y-1">
                              {[...new Set([
                                f.correct_answer,
                                f.student_answer,
                              ])].map((opt) => {
                                const isCorrect = opt === f.correct_answer;
                                const isSelected =
                                  opt === f.student_answer;
                                const bg = isCorrect
                                  ? "bg-green-100 text-green-800"
                                  : isSelected
                                  ? "bg-red-100 text-red-800"
                                  : "";
                                return (
                                  <li
                                    key={opt}
                                    className={`px-2 py-1 rounded ${bg}`}
                                  >
                                    {opt}
                                    {isCorrect && " ✓"}
                                    {isSelected && !f.is_correct && " ✗"}
                                  </li>
                                );
                              })}
                            </ul>
                            <p className="text-sm">
                              {f.is_correct ? (
                                <span className="text-green-700">
                                  Correct!
                                </span>
                              ) : (
                                <span className="text-red-700">
                                  Your answer: {f.student_answer}
                                </span>
                              )}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {generatedContent.type === "summarize" && (
                  <MarkdownDisplay content={generatedContent.content} />
                )}

                {generatedContent.type === "transcribe" && (
                  <TranscriptDisplay
                    transcript={generatedContent.content.transcript}
                    summary={generatedContent.content.summary}
                    media_url={generatedContent.content.media_url}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
