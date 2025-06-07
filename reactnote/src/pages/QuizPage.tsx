// src/pages/QuizPage.tsx
import { useEffect, useState, ChangeEvent } from 'react'
import api from '@/api/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ModeToggle } from '@/components/mode-toggle'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Plus } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  correct_choice?: string
}

export default function QuizPage() {
  const { logout } = useAuth()

  // Step 1: upload
  const [file, setFile] = useState<File | null>(null)
  const [chunks, setChunks] = useState<string[]>([])
  const [loadingUpload, setLoadingUpload] = useState(false)

  // Step 2: generate
  const [prompt, setPrompt] = useState('')
  const [numQs, setNumQs] = useState(5)
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizId, setQuizId] = useState<number | null>(null)
  const [loadingGen, setLoadingGen] = useState(false)

  // Step 3: answers
  const [answers, setAnswers] = useState<Record<string,string>>({})
  const [feedback, setFeedback] = useState<any[]>([])
  const [score, setScore] = useState<number|null>(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  // Upload handler
  async function handleUpload() {
    if (!file) return toast.error('Select a file first')
    setLoadingUpload(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await api.post<{ id:number; text_chunks:string[] }>('/documents/', form, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      setChunks(res.data.text_chunks)
      toast.success('File uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setLoadingUpload(false)
    }
  }

  // Generate handler
  async function handleGenerate() {
    if (chunks.length === 0) return toast.error('Upload first')
    setLoadingGen(true)
    try {
      const res = await api.post<{ quiz_id:number; questions: Question[] }>('/quizzes/generate/', {
        document_id: undefined, // backend uses last uploaded; or adjust to return doc id
        prompt, num_questions: numQs
      })
      setQuestions(res.data.questions)
      setQuizId(res.data.quiz_id)
      toast.success('Quiz generated')
    } catch {
      toast.error('Generation failed')
    } finally {
      setLoadingGen(false)
    }
  }

  // Answer selection
  function handleSelect(qidx:number, opt:string) {
    setAnswers(a => ({ ...a, [`Q${qidx+1}`]: opt }))
  }

  // Submit handler
  async function handleSubmit() {
    if (!quizId) return
    setLoadingSubmit(true)
    try {
      const res = await api.post<{ feedback:any[]; total_correct:number }>('/attempts/', {
        quiz_id: quizId,
        student_answers: answers
      })
      setFeedback(res.data.feedback)
      setScore(res.data.total_correct)
      toast.success('Submitted')
    } catch {
      toast.error('Submit failed')
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="h-screen flex flex-col">
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
        </header>

        <ScrollArea className="p-6 flex-1 overflow-auto space-y-6">
          {/* 1. Upload */}
          <Card>
            <CardHeader>
              <CardTitle>1. Upload Study Material</CardTitle>
              <CardDescription>PDF, DOCX, PPTX, or TXT</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Input type="file" accept=".pdf,.docx,.pptx,.txt"
                onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                  setFile(e.target.files?.[0]||null)
                }}
              />
              <Button onClick={handleUpload} disabled={loadingUpload}>
                {loadingUpload?'Uploading…':'Upload'}
              </Button>
            </CardContent>
          </Card>

          {/* 2. Generate */}
          {chunks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>2. Generate Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter any extra instructions (optional)"
                  value={prompt}
                  onChange={(e)=>setPrompt(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Input type="number" min={1} value={numQs}
                    onChange={e=>setNumQs(+e.target.value)}
                  />
                  <Button onClick={handleGenerate} disabled={loadingGen}>
                    {loadingGen?'Generating…':'Generate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. Quiz */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>3. Take Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="font-medium">{idx+1}. {q.question}</p>
                    <div className="flex flex-col space-y-1">
                      {q.options.map(opt => (
                        <Button
                          key={opt}
                          variant={answers[`Q${idx+1}`]===opt ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={()=>handleSelect(idx,opt)}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit} disabled={loadingSubmit}>
                  {loadingSubmit?'Submitting…':'Submit Answers'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* 4. Feedback */}
          {feedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  You got {score} of {questions.length} correct
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.map((fb, idx) => (
                  <div key={idx} className="p-3 rounded border 
                      {fb.is_correct ? 'border-green-300 bg-green-50' 
                                     : 'border-red-300 bg-red-50'}">
                    <p className="font-medium">{fb.question}</p>
                    <p>Your answer: {fb.student_answer}</p>
                    {!fb.is_correct && (
                      <p>Correct: {fb.correct_answer}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
// This code defines a QuizPage component that allows users to upload study materials,
// generate quizzes from them, take the quizzes, and view feedback on their answers.
// It uses a sidebar for navigation, and includes steps for uploading files, generating quizzes,
// answering questions, and displaying results. The component manages state for file uploads,
// quiz generation, answers, and feedback, and interacts with an API for backend operations.
// The UI is built using a combination of cards, buttons, inputs, and text areas for a clean layout.