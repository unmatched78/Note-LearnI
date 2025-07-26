import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  CheckCircle,
  XCircle
} from "lucide-react";

interface QuizResults {
  score: number;
  total: number;
  feedback: Array<{
    question: string;
    student_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }>;
}

interface QuizResultsViewProps {
  quizResults: QuizResults;
  onResetQuiz: () => void;
}

export default function QuizResultsView({
  quizResults,
  onResetQuiz
}: QuizResultsViewProps) {
  const percentage = Math.round((quizResults.score / quizResults.total) * 100);
  const isGoodScore = quizResults.score >= quizResults.total * 0.7;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
          Quiz Complete!
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Here are your results
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {quizResults.score}/{quizResults.total}
            </div>
            <div className="text-lg text-slate-600 mb-4">
              {percentage}% Score
            </div>
            <Progress value={percentage} className="h-3 mb-4" />
            <Badge 
              variant={isGoodScore ? "default" : "secondary"}
              className="px-4 py-2 text-sm"
            >
              {isGoodScore ? 'Great Job!' : 'Keep Practicing!'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-auto">
            {quizResults.feedback.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex items-start gap-3 mb-2">
                  {item.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">{item.question}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-slate-500">Your answer:</span>{' '}
                        <span className={item.is_correct ? 'text-green-600' : 'text-red-600'}>
                          {item.student_answer}
                        </span>
                      </p>
                      {!item.is_correct && (
                        <p>
                          <span className="text-slate-500">Correct answer:</span>{' '}
                          <span className="text-green-600">{item.correct_answer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Button
          onClick={onResetQuiz}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          Take Another Quiz
        </Button>
      </div>
    </div>
  );
}