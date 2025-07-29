// src/pages/AIToolsPage.tsx
import React, { useState, useRef, ChangeEvent } from "react";
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
import { Tabs } from "@/components/ui/tabs";

interface Resource {
  id: string;
  name: string;
  type: string;
  file?: File;
  url?: string;
}

const AIToolsPage: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const resourceInputRef = useRef<HTMLInputElement>(null);

  const handleResourceUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedResource({
      id: Date.now().toString(),
      name: file.name,
      type: file.type.startsWith("text/") ||
            file.type === "application/pdf" ||
            file.type.includes("word")
        ? "Document"
        : "Unknown",
      file,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">AI Study Hub</h1>
          <nav className="space-x-4 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
            <a href="/resources" className="hover:text-gray-900">My Resources</a>
            <a href="/ai-tools" className="font-medium text-primary">AI Tools</a>
          </nav>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-96 bg-white border-r border-gray-200 p-6 overflow-auto space-y-6">
          {/* Resource Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Resource</label>
            <Button
              variant="outline"
              onClick={() => resourceInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" /> Choose File
            </Button>
            <Input
              ref={resourceInputRef}
              type="file"
              accept=".pdf,.pptx,.docx,.txt"
              className="hidden"
              onChange={handleResourceUpload}
            />
            {selectedResource && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-sm">Selected Resource</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Tabs className="truncate gap-4 flex-wrap">{selectedResource.name}</Tabs>
                  </div>
                  <Badge className="gap-2" variant="outline">{selectedResource.type}</Badge>
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Tools Panel */}
          <AIToolsPanel
            selectedResource={selectedResource || undefined}
            onGenerateContent={setGeneratedContent}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {!generatedContent ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Content Generated Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  Select a tool and click “Generate” to see your AI‑powered output here.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg capitalize">
                    {generatedContent.type}
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                  {/* Flashcards */}
                  {generatedContent.type === "flashcards" && (
                    <ul className="space-y-4">
                      {generatedContent.content.map((card: any, i: number) => (
                        <li
                          key={i}
                          className="p-4 border rounded-lg hover:shadow-sm transition"
                        >
                          <div className="font-semibold mb-1">{card.front}</div>
                          <Badge variant="secondary">{card.back}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Quiz */}
                  {generatedContent.type === "quiz" && (
                    <ul className="space-y-4">
                      {generatedContent.content.map((q: any, i: number) => (
                        <li key={i} className="p-4 border rounded-lg">
                          <div className="font-semibold mb-2">
                            Q{i + 1}: {q.question}
                          </div>
                          <ul className="list-disc list-inside space-y-1">
                            {q.options.map((opt: string, idx: number) => (
                              <li key={idx}>{opt}</li>
                            ))}
                          </ul>
                          <div className="mt-2 text-green-600">
                            Answer: {q.answer}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Summaries & Transcripts */}
                  {(generatedContent.type === "summarize" ||
                    generatedContent.type === "transcribe") && (
                    <ScrollArea className="h-96 p-4 border rounded-lg">
                      <p className="whitespace-pre-wrap">
                        {generatedContent.content}
                      </p>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIToolsPage;
