// src/pages/QuizPage.tsx
import { useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useApi } from '../api/api';
import Sidebar from '../components/Sidebar';
import UploadView from '../components/UploadView';
import QuizGenerationView from '../components/QuizGenerationView';
import QuizTakingView from '../components/QuizTakingView';
import QuizResultsView from '../components/QuizResultsView';

interface Document {
  id: number;
  title: string;
  created_at: string;
}

interface Quiz {
  id: number;
  quiz_title: string;
  created_at: string;
  questions: { questions: Array<{ question: string; options: string[]; correct_choice: string }> };
}

interface QuizAttempt {
  id: number;
  quiz: { quiz_title: string };
  score: number;
  total_questions: number;
  created_at: string;
}

export default function QuizPage() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerkAuth();
  const { fetchJson } = useApi();

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

  useEffect(() => {
    if (isLoaded && user) {
      loadDocuments();
      loadRecentQuizzes();
    }
  }, [isLoaded, user]);

  const loadDocuments = async () => {
    try {
      const data = await fetchJson<{ results?: Document[] }>('/documents/');
      setDocuments(data.results || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const loadRecentQuizzes = async () => {
    try {
      const data = await fetchJson<{ results?: QuizAttempt[] }>('/attempts/');
      setRecentQuizzes(data.results || []);
    } catch (err) {
      console.error('Failed to load recent quizzes:', err);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const result = await fetchJson<{ id: number }>(
        '/documents/',
        {
          method: 'POST',
          body: formData,
          headers: {} // let browser set multipart boundary
        }
      );

      setUploadProgress(100);
      await loadDocuments();

      const newDoc: Document = {
        id: result.id,
        title: selectedFile.name,
        created_at: new Date().toISOString()
      };
      setSelectedDocument(newDoc);
      setSelectedFile(null);
      setCurrentView('generate');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDocument) return;
    setIsGenerating(true);

    try {
      const { quiz_id, questions } = await fetchJson<{ quiz_id: number; questions: any[] }>(
        '/quizzes/generate/',
        {
          method: 'POST',
          body: JSON.stringify({
            document_id: selectedDocument.id,
            prompt: quizPrompt,
            num_questions: numQuestions
          })
        }
      );

      setCurrentQuiz({
        id: quiz_id,
        quiz_title: `Quiz from ${selectedDocument.title}`,
        created_at: new Date().toISOString(),
        questions: { questions }
      });
      setCurrentView('quiz');
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    } catch (err) {
      console.error('Quiz generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (index: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [`Q${index + 1}`]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;
    setIsSubmitting(true);

    try {
      const result = await fetchJson<any>(
        '/attempts/',
        {
          method: 'POST',
          body: JSON.stringify({
            quiz_id: currentQuiz.id,
            student_answers: selectedAnswers
          })
        }
      );
      setQuizResults(result);
      setCurrentView('results');
      await loadRecentQuizzes();
    } catch (err) {
      console.error('Quiz submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentView('upload');
    setSelectedDocument(null);
    setCurrentQuiz(null);
    setSelectedAnswers({});
    setQuizResults(null);
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="flex h-screen">
        <Sidebar user={user} recentQuizzes={recentQuizzes} onLogout={signOut} />
        <div className="flex-1 p-8 overflow-auto">
          {currentView === 'upload' && (
            <UploadView
              documents={documents}
              selectedFile={selectedFile}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              onFileSelect={setSelectedFile}
              onFileUpload={handleFileUpload}
              onDocumentSelect={doc => { setSelectedDocument(doc); setCurrentView('generate'); }}
            />
          )}
          {currentView === 'generate' && selectedDocument && (
            <QuizGenerationView
              selectedDocument={selectedDocument}
              numQuestions={numQuestions}
              quizPrompt={quizPrompt}
              isGenerating={isGenerating}
              onNumQuestionsChange={setNumQuestions}
              onQuizPromptChange={setQuizPrompt}
              onGenerateQuiz={handleGenerateQuiz}
              onGoBack={resetQuiz}
            />
          )}
          {currentView === 'quiz' && currentQuiz && (
            <QuizTakingView
              currentQuiz={currentQuiz}
              currentQuestionIndex={currentQuestionIndex}
              selectedAnswers={selectedAnswers}
              isSubmitting={isSubmitting}
              onAnswerSelect={handleAnswerSelect}
              onSubmitQuiz={handleSubmitQuiz}
            />
          )}
          {currentView === 'results' && quizResults && (
            <QuizResultsView quizResults={quizResults} onResetQuiz={resetQuiz} />
          )}
        </div>
      </div>
    </div>
  );
}
