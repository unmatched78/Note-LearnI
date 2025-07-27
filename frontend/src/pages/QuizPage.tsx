// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/api';
// import { getStoredAccessToken, getStoredRefreshToken, clearTokens } from '../api/api';
// // Import our new components
// import Sidebar from '../components/Sidebar';
// import UploadView from '../components/UploadView';
// import QuizGenerationView from '../components/QuizGenerationView';
// import QuizTakingView from '../components/QuizTakingView';
// import QuizResultsView from '../components/QuizResultsView';

// interface Document {
//   id: number;
//   title: string;
//   created_at: string;
// }

// interface Quiz {
//   id: number;
//   quiz_title: string;
//   created_at: string;
//   questions: {
//     questions: Array<{
//       question: string;
//       options: string[];
//       correct_choice: string;
//     }>;
//   };
// }

// interface QuizAttempt {
//   id: number;
//   quiz: {
//     quiz_title: string;
//   };
//   score: number;
//   total_questions: number;
//   created_at: string;
// }

// export default function QuizPage() {
//   const { user, logout } = useAuth();
//   const [currentView, setCurrentView] = useState<'upload' | 'generate' | 'quiz' | 'results'>('upload');
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [recentQuizzes, setRecentQuizzes] = useState<QuizAttempt[]>([]);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
//   const [quizPrompt, setQuizPrompt] = useState('Generate comprehensive multiple-choice questions based on the content.');
//   const [numQuestions, setNumQuestions] = useState(10);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
//   const [quizResults, setQuizResults] = useState<any>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load documents and recent quizzes on mount
//   useEffect(() => {
//     loadDocuments();
//     loadRecentQuizzes();
//   }, []);

//   const loadDocuments = async () => {
//     try {
//       const response = await api.get('/documents/');
//       setDocuments(response.data.results || response.data);
//     } catch (error) {
//       console.error('Failed to load documents:', error);
//     }
//   };

//   const loadRecentQuizzes = async () => {
//     try {
//       const response = await api.get('/attempts/');
//       setRecentQuizzes(response.data.results || response.data);
//     } catch (error) {
//       console.error('Failed to load recent quizzes:', error);
//     }
//   };

//   const handleFileUpload = async () => {
//     if (!selectedFile) return;

//     setIsUploading(true);
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('title', selectedFile.name);

//     const token = getStoredAccessToken();
//     console.log('Access token before upload:', token);
//     if (!token) {
//       toast.error('You are not logged in. Please log in again.');
//       setIsUploading(false);
//       return;
//     }

//     try {
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => Math.min(prev + 10, 90));
//       }, 200);

//       const response = await api.post('/documents/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       // Use the response to set the selected document
//       const newDocument = {
//         id: response.data.id,
//         title: selectedFile.name,
//         created_at: new Date().toISOString(), // Approximate, or fetch from response if available
//       };
//       console.log('New document from response:', newDocument); // Debug

//       // Update documents list
//       await loadDocuments();

//       // Set the newly uploaded document as selected
//       setSelectedDocument(newDocument);
//       setSelectedFile(null);
//       setCurrentView('generate');
//       toast.success('Document uploaded successfully!');
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const message = error.response?.data?.detail || 'Upload failed. Please try again.';
//         toast.error(message);
//         console.error('Upload failed:', error.response?.data);
//       } else {
//         toast.error('An unexpected error occurred.');
//         console.error('Upload failed:', error);
//       }
//     } finally {
//       setIsUploading(false);
//       setTimeout(() => setUploadProgress(0), 1000);
//     }
//   };

//   const handleDocumentSelect = (document: Document) => {
//     setSelectedDocument(document);
//     setCurrentView('generate');
//   };

//   const handleGenerateQuiz = async () => {
//     if (!selectedDocument) return;

//     setIsGenerating(true);
//     try {
//       const response = await api.post('/quizzes/generate/', {
//         document_id: selectedDocument.id,
//         prompt: quizPrompt,
//         num_questions: numQuestions,
//       });

//       setCurrentQuiz({
//         id: response.data.quiz_id,
//         quiz_title: `Quiz from ${selectedDocument.title}`,
//         created_at: new Date().toISOString(),
//         questions: { questions: response.data.questions }
//       });
//       setCurrentView('quiz');
//       setCurrentQuestionIndex(0);
//       setSelectedAnswers({});
//     } catch (error) {
//       console.error('Quiz generation failed:', error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleAnswerSelect = (questionIndex: number, answer: string) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [`Q${questionIndex + 1}`]: answer
//     }));
//   };

//   const handleNextQuestion = () => {
//     if (currentQuiz && currentQuestionIndex < currentQuiz.questions.questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleSubmitQuiz = async () => {
//     if (!currentQuiz) return;

//     setIsSubmitting(true);
//     try {
//       const response = await api.post('/attempts/', {
//         quiz_id: currentQuiz.id,
//         student_answers: selectedAnswers,
//       });

//       setQuizResults(response.data);
//       setCurrentView('results');
//       await loadRecentQuizzes();
//     } catch (error) {
//       console.error('Quiz submission failed:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetQuiz = () => {
//     setCurrentView('upload');
//     setSelectedDocument(null);
//     setCurrentQuiz(null);
//     setCurrentQuestionIndex(0);
//     setSelectedAnswers({});
//     setQuizResults(null);
//   };

//   const handleGoBackToUpload = () => {
//     setCurrentView('upload');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <Sidebar
//           user={user}
//           recentQuizzes={recentQuizzes}
//           onLogout={logout}
//         />

//         {/* Main Content */}
//         <div className="flex-1 p-8 overflow-auto">
//           {/* Upload View */}
//           {currentView === 'upload' && (
//             <UploadView
//               documents={documents}
//               selectedFile={selectedFile}
//               uploadProgress={uploadProgress}
//               isUploading={isUploading}
//               onFileSelect={setSelectedFile}
//               onFileUpload={handleFileUpload}
//               onDocumentSelect={handleDocumentSelect}
//             />
//           )}

//           {/* Generate Quiz View */}
//           {currentView === 'generate' && selectedDocument && (
//             <QuizGenerationView
//               selectedDocument={selectedDocument}
//               numQuestions={numQuestions}
//               quizPrompt={quizPrompt}
//               isGenerating={isGenerating}
//               onNumQuestionsChange={setNumQuestions}
//               onQuizPromptChange={setQuizPrompt}
//               onGenerateQuiz={handleGenerateQuiz}
//               onGoBack={handleGoBackToUpload}
//             />
//           )}

//           {/* Quiz Taking View */}
//           {currentView === 'quiz' && currentQuiz && (
//             <QuizTakingView
//               currentQuiz={currentQuiz}
//               currentQuestionIndex={currentQuestionIndex}
//               selectedAnswers={selectedAnswers}
//               isSubmitting={isSubmitting}
//               onAnswerSelect={handleAnswerSelect}
//               onPreviousQuestion={handlePreviousQuestion}
//               onNextQuestion={handleNextQuestion}
//               onSubmitQuiz={handleSubmitQuiz}
//             />
//           )}

//           {/* Results View */}
//           {currentView === 'results' && quizResults && (
//             <QuizResultsView
//               quizResults={quizResults}
//               onResetQuiz={resetQuiz}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/QuizPage.tsx
import React, { useState, useEffect } from 'react';
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
