// src/pages/AIToolsPage.tsx
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

export default function AIToolsPage() {
  const { fetchJson } = useApi();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{
    type: string;
    content: any;
  } | null>(null);

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
    } catch (err) {
      console.error(err);
      alert("Failed to upload resource");
    }
  };

  const isArray = (v: any): v is any[] => Array.isArray(v);

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
            onGenerateContent={setGeneratedContent}
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
                {generatedContent.type === "flashcards" && isArray(generatedContent.content) && (
                  <ul className="space-y-4">
                    {generatedContent.content.map((c: any, i: number) => (
                      <li key={i} className="p-4 border rounded">
                        <p className="font-semibold">{c.front}</p>
                        <Badge>{c.back}</Badge>
                      </li>
                    ))}
                  </ul>
                )}

                {generatedContent.type === "quiz" && isArray(generatedContent.content) && (
                  <ul className="space-y-4">
                    {generatedContent.content.map((q: any, i: number) => (
                      <li key={i} className="p-4 border rounded">
                        <p className="font-semibold">
                          Q{i + 1}: {q.question}
                        </p>
                        <ul className="list-disc ml-5">
                          {q.options.map((o: string, idx: number) => (
                            <li key={idx}>{o}</li>
                          ))}
                        </ul>
                        <p className="mt-2 text-green-600">
                          Answer: {q.answer}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                {["summarize", "transcribe"].includes(generatedContent.type) && (
                  <ScrollArea className="h-96 p-4 border rounded">
                    <pre className="whitespace-pre-wrap">
                      {typeof generatedContent.content === "string"
                        ? generatedContent.content
                        : Array.isArray(generatedContent.content)
                        ? generatedContent.content.join("\n\n")
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
