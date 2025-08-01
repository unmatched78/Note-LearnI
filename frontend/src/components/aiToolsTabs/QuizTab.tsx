import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, MessageSquare, Loader2 } from "lucide-react";
import { useApi } from "@/api/api";

interface QuizTabProps {
  selectedResource?: { id: number; name: string; type: string };
  onGenerateContent: (payload: { type: string; content: any }) => void;
  onQuizMeta: (meta: { quizId: number; questions: Array<{ question: string; options: string[]; answer: string }> }) => void;
}

export default function QuizTab({ selectedResource, onGenerateContent, onQuizMeta }: QuizTabProps) {
  const { fetchJson } = useApi();
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!selectedResource) return;
    setLoading(true);
    try {
      const payload = {
        document_id: selectedResource.id,
        prompt: `Generate ` + numQuestions + ` ${difficulty} multiple-choice questions` + (includeExplanations ? ` with explanations.` : `.`),
        num_questions: numQuestions,
      };
      const response = await fetchJson<{
        quiz_id: number;
        questions: Array<{ question: string; options: string[]; correct_choice: string }>;
      }>("/quizzes/generate/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Map to frontend-ready shape
      const flat = response.questions.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.correct_choice,
      }));
      onGenerateContent({ type: "quiz", content: flat });
      onQuizMeta({ quizId: response.quiz_id, questions: flat });
    } catch (error: any) {
      console.error("Quiz generation error:", error);
      alert(error.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label>Resource for Quiz</Label>
        {selectedResource ? (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{selectedResource.name}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{selectedResource.type}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
            <span className="text-muted-foreground">Select a document first</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Number of Questions: {numQuestions}</Label>
        <Slider
          value={[numQuestions]}
          max={20}
          min={1}
          step={1}
          onValueChange={([val]) => setNumQuestions(val)}
        />
      </div>

      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <Select defaultValue={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Include Explanations</Label>
        <Switch checked={includeExplanations} onCheckedChange={setIncludeExplanations} />
      </div>

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={loading || !selectedResource}
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quiz...</>
        ) : (
          <><MessageSquare className="mr-2 h-4 w-4" /> Generate Quiz</>
        )}
      </Button>
    </div>
  );
}
