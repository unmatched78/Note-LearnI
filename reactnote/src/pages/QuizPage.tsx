import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  BookOpen,
  Settings,
  LogOut,
  Plus,
  History,
  Target,
  Sparkles
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

interface Document {
  id: number;
  title: string;
  created_at: string;
}

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

interface QuizAttempt {
  id: number;
  quiz: {
    quiz_title: string;
  };
  score: number;
  total_questions: number;
  created_at: string;
}

export default function QuizPage() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'upload' | 'generate' | 'quiz' | 'results'>('upload');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizAttempt[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [quizPrompt, setQuizPrompt] = useState('Generate comprehensive multiple-choice questions based on the content.');
  const [numQuestions, setNumQuestions] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load documents and recent quizzes on mount
  useEffect(() => {
    loadDocuments();
    loadRecentQuizzes();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await api.get('/documents/');
      setDocuments(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const loadRecentQuizzes = async () => {
    try {
      const response = await api.get('/attempts/');
      setRecentQuizzes(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to load recent quizzes:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', selectedFile.name);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await api.post('/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      await loadDocuments();
      setSelectedFile(null);
      setCurrentView('generate');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDocument) return;

    setIsGenerating(true);
    try {
      const response = await api.post('/quizzes/generate/', {
        document_id: selectedDocument.id,
        prompt: quizPrompt,
        num_questions: numQuestions,
      });

      setCurrentQuiz({
        id: response.data.quiz_id,
        quiz_title: `Quiz from ${selectedDocument.title}`,
        created_at: new Date().toISOString(),
        questions: { questions: response.data.questions }
      });
      setCurrentView('quiz');
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    } catch (error) {
      console.error('Quiz generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [`Q${questionIndex + 1}`]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/attempts/', {
        quiz_id: currentQuiz.id,
        student_answers: selectedAnswers,
      });

      setQuizResults(response.data);
      setCurrentView('results');
      await loadRecentQuizzes();
    } catch (error) {
      console.error('Quiz submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentView('upload');
    setSelectedDocument(null);
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizResults(null);
  };

  const currentQuestion = currentQuiz?.questions.questions[currentQuestionIndex];
  const totalQuestions = currentQuiz?.questions.questions.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                QuizMaster
              </h1>
              <p className="text-sm text-slate-500">AI-Powered Learning</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.username}</p>
              <p className="text-xs text-slate-500">Student</p>
            </div>
            <ModeToggle />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Quizzes
              </h3>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {recentQuizzes.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate flex-1">
                          {attempt.quiz.quiz_title}
                        </p>
                        <Badge variant={attempt.score >= attempt.total_questions * 0.7 ? "default" : "secondary"} className="ml-2">
                          {attempt.score}/{attempt.total_questions}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(attempt.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {recentQuizzes.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No quizzes taken yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Upload View */}
          {currentView === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
                  Upload Study Material
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Upload your documents to generate AI-powered quizzes
                </p>
              </div>

              <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 transition-colors">
                <CardContent className="p-8">
                  <div className="text-center">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.pptx"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Choose File
                    </label>
                    
                    {selectedFile && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">{selectedFile.name}</span>
                        </div>
                        
                        {isUploading && (
                          <div className="mb-4">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-sm text-slate-500 mt-1">Uploading... {uploadProgress}%</p>
                          </div>
                        )}
                        
                        <Button
                          onClick={handleFileUpload}
                          disabled={isUploading}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          {isUploading ? 'Uploading...' : 'Upload & Process'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {documents.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Or select from uploaded documents:</h3>
                  <div className="grid gap-3">
                    {documents.map((doc) => (
                      <Card
                        key={doc.id}
                        className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setCurrentView('generate');
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <div className="flex-1">
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-slate-500">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generate Quiz View */}
          {currentView === 'generate' && selectedDocument && (
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
                      onChange={(e) => setNumQuestions(parseInt(e.target.value) || 10)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quiz-prompt">Quiz Instructions</Label>
                    <Textarea
                      id="quiz-prompt"
                      value={quizPrompt}
                      onChange={(e) => setQuizPrompt(e.target.value)}
                      rows={4}
                      className="mt-1"
                      placeholder="Describe what kind of questions you want..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentView('upload')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerateQuiz}
                      disabled={isGenerating}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Quiz'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quiz View */}
          {currentView === 'quiz' && currentQuiz && currentQuestion && (
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
                          selectedAnswers[`Q${currentQuestionIndex + 1}`] === option
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                        onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[`Q${currentQuestionIndex + 1}`] === option
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-slate-300'
                          }`}>
                            {selectedAnswers[`Q${currentQuestionIndex + 1}`] === option && (
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
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    
                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <Button
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        disabled={!selectedAnswers[`Q${currentQuestionIndex + 1}`]}
                        className="flex-1"
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={!selectedAnswers[`Q${currentQuestionIndex + 1}`] || isSubmitting}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results View */}
          {currentView === 'results' && quizResults && (
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
                      {Math.round((quizResults.score / quizResults.total) * 100)}% Score
                    </div>
                    <Progress value={(quizResults.score / quizResults.total) * 100} className="h-3 mb-4" />
                    <Badge 
                      variant={quizResults.score >= quizResults.total * 0.7 ? "default" : "secondary"}
                      className="px-4 py-2 text-sm"
                    >
                      {quizResults.score >= quizResults.total * 0.7 ? 'Great Job!' : 'Keep Practicing!'}
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
                    {quizResults.feedback.map((item: any, index: number) => (
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
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Take Another Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}