// components/aiToolsTabs/QuizTab.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, MessageSquare, Loader2 } from "lucide-react";

interface QuizTabProps {
  selectedResource?: { name: string; type: string };
  isProcessing: boolean;
  onProcess: () => void;
}

export default function QuizTab({ selectedResource, isProcessing, onProcess }: QuizTabProps) {
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
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Select Resource
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Quiz Type</Label>
        <Select defaultValue="multiple-choice"><SelectTrigger><SelectValue placeholder="Select quiz type" /></SelectTrigger><SelectContent><SelectItem value="multiple-choice">Multiple Choice</SelectItem><SelectItem value="true-false">True/False</SelectItem><SelectItem value="short-answer">Short Answer</SelectItem><SelectItem value="mixed">Mixed Format</SelectItem></SelectContent></Select>
      </div>

      <div className="space-y-2">
        <Label>Number of Questions</Label>
        <Slider defaultValue={[5]} max={20} step={1} />
      </div>

      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <Select defaultValue="medium"><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger><SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem><SelectItem value="mixed">Mixed</SelectItem></SelectContent></Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Include Explanations</Label>
        <Switch defaultChecked />
      </div>

      <Button
        className="w-full"
        onClick={onProcess}
        disabled={isProcessing || !selectedResource}
      >
        {isProcessing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quiz...</>
        ) : (
          <><MessageSquare className="mr-2 h-4 w-4" /> Generate Quiz</>
        )}
      </Button>
    </div>
  );
}