import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Target
} from "lucide-react";

interface Quiz {
  id: number;
  quiz_title: string;
  created_at: string;
  questions: {
    questions: Array<{
      question: string;
      options: string[];
      correct_choice: string;
    }>;
  };
}

interface QuizTakingViewProps {
  currentQuiz: Quiz;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  isSubmitting: boolean;
  onAnswerSelect: (questionIndex: number, answer: string) => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onSubmitQuiz: () => void;
}

export default function QuizTakingView({
  currentQuiz,
  currentQuestionIndex,
  selectedAnswers,
  isSubmitting,
  onAnswerSelect,
  onPreviousQuestion,
  onNextQuestion,
  onSubmitQuiz
}: QuizTakingViewProps) {
  const currentQuestion = currentQuiz.questions.questions[currentQuestionIndex];
  const totalQuestions = currentQuiz.questions.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const currentAnswerKey = `Q${currentQuestionIndex + 1}`;
  const hasSelectedAnswer = !!selectedAnswers[currentAnswerKey];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentQuiz.quiz_title}</h2>
              <p className="text-sm text-slate-500">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
          </Badge>
        </div>
        <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  selectedAnswers[currentAnswerKey] === option
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
                onClick={() => onAnswerSelect(currentQuestionIndex, option)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentAnswerKey] === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  }`}>
                    {selectedAnswers[currentAnswerKey] === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {!isLastQuestion ? (
              <Button
                onClick={onNextQuestion}
                disabled={!hasSelectedAnswer}
                className="flex-1"
              >
                Next Question
              </Button>
            ) : (
              <Button
                onClick={onSubmitQuiz}
                disabled={!hasSelectedAnswer || isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}