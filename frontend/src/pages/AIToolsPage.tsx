import { useState, useRef, ChangeEvent } from "react";
import { useApi } from "@/api/api";
import AIToolsPanel from "@/components/AIToolsPanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { BookOpen, FileText, Upload, Zap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { LogOut } from "lucide-react";

interface Resource {
  id: number;
  name: string;
  type: string;
}

type QuizQuestion = { question: string; options: string[]; answer: string };
type QuizFeedback = { question: string; student_answer: string; correct_answer: string; is_correct: boolean };
// extract the 11-char ID from a YouTube URL
function extractVideoId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}

export default function AIToolsPage() {
  const { fetchJson } = useApi();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{ type: string; content: any } | null>(null);

  const [quizMeta, setQuizMeta] = useState<{ quizId: number; questions: QuizQuestion[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const fileRef = useRef<HTMLInputElement>(null);

  const uploadResource = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetchJson<{ id: number; text_chunks: string[] }>("/documents/", {
        method: "POST",
        body: fd,
      });
      setSelectedResource({ id: res.id, name: file.name, type: "Document" });
      setGeneratedContent(null);
      setQuizMeta(null);
      setAnswers({});
    } catch (err) {
      console.error(err);
      alert("Failed to upload resource");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto p-4 flex justify-between">
          <h1 className="text-2xl font-bold">AI Study Hub</h1>
          <nav className="ml-140 flex flex-row flex-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
              <FileText size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/resources" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
              <BookOpen size={18} />
              <span>Resources</span>
            </Link>
            <Link to="/ai-tools" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
              <Zap size={18} />
              <span>AI Tools</span>
            </Link>
           <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
            <UserButton />
            <ModeToggle />
          </div>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 bg-white border-r p-6 space-y-6 overflow-auto">
          <div className="space-y-2">
            <p className="font-medium">Upload Resource</p>
            <Button onClick={() => fileRef.current?.click()}>
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
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-sm">Selected</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <span className="truncate">{selectedResource.name}</span>
                  <Badge>{selectedResource.type}</Badge>
                </CardContent>
              </Card>
            )}
          </div>
          <AIToolsPanel
            selectedResource={selectedResource || undefined}
            onGenerateContent={payload => {
              setGeneratedContent(payload);
              if (payload.type !== "quiz") {
                setQuizMeta(null);
                setAnswers({});
              }
            }}
            onQuizMeta={meta => setQuizMeta(meta)}
          />
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          <SidebarContainer />
          {!generatedContent ? (
            <Card>
              <CardHeader>
                <CardTitle>No Content Yet</CardTitle>
              </CardHeader>
              <CardContent>Select a tool to begin</CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <FileText className="text-primary" />
                <CardTitle className="capitalize">{generatedContent.type}</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                {/* {generatedContent.type === "flashcards" && Array.isArray(generatedContent.content) && (
                  <ul className="space-y-4">
                    {generatedContent.content.map((c: any, i: number) => (
                      <li key={i} className="p-4 border rounded">
                        <p className="font-semibold">{c.front}</p>
                        <Badge>{c.back}</Badge>
                      </li>
                    ))}
                  </ul>
                )} */}

                {/* only show flashcards when type === 'flashcards' */}
                {generatedContent.type === "flashcards" && (
                  <FlashcardsList
                    cards={generatedContent.content as Array<{ front: string; back: string }>}
                    tiltAngle={20}
                    tiltScale={1.05}
                    flipDuration={0.8}
                    springStiffness={400}
                    springDamping={25}
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
                      setGeneratedContent({ type: "quizResult", content: resp.feedback });
                    }}
                  >
                    {quizMeta.questions.map((q, i) => {
                      const key = `Q${i + 1}`;
                      return (
                        <fieldset key={i} className="mb-4">
                          <legend className="font-semibold">{q.question}</legend>
                          {q.options.map((opt) => (
                            <label key={opt} className="block">
                              <input
                                type="radio"
                                name={key}
                                value={opt}
                                checked={answers[key] === opt}
                                onChange={() =>
                                  setAnswers((a) => ({ ...a, [key]: opt }))
                                }
                              />
                              {opt}
                            </label>
                          ))}
                        </fieldset>
                      );
                    })}
                    <Button type="submit">Submit Answers</Button>
                  </form>
                )}

                {generatedContent.type === "quizResult" &&
                  Array.isArray(generatedContent.content) && (
                    <div className="space-y-6">
                      {/* Total Score */}
                      <div className="text-xl font-bold">
                        Score: {generatedContent.content.filter((f: QuizFeedback) => f.is_correct).length}
                        /{generatedContent.content.length}
                      </div>

                      {/* Detailed per-question feedback */}
                      {generatedContent.content.map((f: QuizFeedback, i: number) => (
                        <div key={i} className="p-4 border rounded">
                          <p className="font-semibold mb-2">Q{i + 1}: {f.question}</p>

                          {/* Show all choices */}
                          <ul className="space-y-1 mb-2">
                            {f.options.map(opt => {
                              const isCorrect = opt === f.correct_answer;
                              const isSelected = opt === f.student_answer;
                              let style = "";
                              if (isCorrect) style = "bg-green-100 text-green-800";
                              else if (isSelected && !f.is_correct) style = "bg-red-100 text-red-800";
                              return (
                                <li
                                  key={opt}
                                  className={`px-2 py-1 rounded ${style}`}
                                >
                                  {opt}
                                  {isCorrect && " ✓"}
                                  {isSelected && !f.is_correct && " ✗"}
                                </li>
                              );
                            })}
                          </ul>

                          {/* Summary message */}
                          <div className="text-sm">
                            {f.is_correct ? (
                              <span className="text-green-600">You got this right!</span>
                            ) : (
                              <span className="text-red-600">
                                Your answer: {f.student_answer} — Correct: {f.correct_answer}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                {generatedContent.type === "summarize" && (
                  <MarkdownDisplay
                    title="Summary"
                    content={generatedContent.content as string}
                  />
                )}

                {/* Transcript */}
                {generatedContent?.type === "transcribe" && (
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
