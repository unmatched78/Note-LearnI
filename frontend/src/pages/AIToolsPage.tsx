import React, { useState, useRef, ChangeEvent } from "react";
import { useApi } from "@/api/api";
import AIToolsPanel from "@/components/AIToolsPanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface Resource {
  id: number;
  name: string;
  type: string;
}

type QuizQuestion = { question: string; options: string[]; answer: string };
type QuizFeedback = { question: string; student_answer: string; correct_answer: string; is_correct: boolean };

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
                {generatedContent.type === "flashcards" && Array.isArray(generatedContent.content) && (
                  <ul className="space-y-4">
                    {generatedContent.content.map((c: any, i: number) => (
                      <li key={i} className="p-4 border rounded">
                        <p className="font-semibold">{c.front}</p>
                        <Badge>{c.back}</Badge>
                      </li>
                    ))}
                  </ul>
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
                    <div className="space-y-2">
                      {generatedContent.content.map((f: QuizFeedback, i: number) => (
                        <div
                          key={i}
                          className={f.is_correct ? "text-green-600" : "text-red-600"}
                        >
                          <p className="font-semibold">{f.question}</p>
                          <p>
                            Your answer: {f.student_answer} —{' '}
                            {f.is_correct
                              ? '✅'
                              : `❌ (Correct: ${f.correct_answer})`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                {['summarize', 'transcribe'].includes(
                  generatedContent.type
                ) && (
                    <ScrollArea className="h-96 p-4 border rounded">
                      <pre className="whitespace-pre-wrap">
                        {typeof generatedContent.content === 'string'
                          ? generatedContent.content
                          : Array.isArray(
                            generatedContent.content
                          )
                            ? generatedContent.content.join('\n\n')
                            : String(generatedContent.content)}
                      </pre>
                    </ScrollArea>
                  )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
