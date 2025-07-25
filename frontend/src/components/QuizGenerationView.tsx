import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Sparkles
} from "lucide-react";

interface Document {
  id: number;
  title: string;
  created_at: string;
}

interface QuizGenerationViewProps {
  selectedDocument: Document;
  numQuestions: number;
  quizPrompt: string;
  isGenerating: boolean;
  onNumQuestionsChange: (num: number) => void;
  onQuizPromptChange: (prompt: string) => void;
  onGenerateQuiz: () => void;
  onGoBack: () => void;
}

export default function QuizGenerationView({
  selectedDocument,
  numQuestions,
  quizPrompt,
  isGenerating,
  onNumQuestionsChange,
  onQuizPromptChange,
  onGenerateQuiz,
  onGoBack
}: QuizGenerationViewProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
          Generate Quiz
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Customize your AI-generated quiz
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {selectedDocument.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="num-questions">Number of Questions</Label>
            <Input
              id="num-questions"
              type="number"
              min="1"
              max="50"
              value={numQuestions}
              onChange={(e) => onNumQuestionsChange(parseInt(e.target.value) || 10)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="quiz-prompt">Quiz Instructions</Label>
            <Textarea
              id="quiz-prompt"
              value={quizPrompt}
              onChange={(e) => onQuizPromptChange(e.target.value)}
              rows={4}
              className="mt-1"
              placeholder="Describe what kind of questions you want..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onGoBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={onGenerateQuiz}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}