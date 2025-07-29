// components/aiToolsTabs/FlashcardsTab.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger,SelectContent, SelectItem,SelectValue  } from "@/components/ui/select";
import { Plus, BookOpen, Lightbulb, Loader2 } from "lucide-react";

interface FlashcardsTabProps {
  selectedResource?: { name: string; type: string };
  isProcessing: boolean;
  onProcess: () => void;
}

export default function FlashcardsTab({ selectedResource, isProcessing, onProcess }: FlashcardsTabProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label>Resource for Flashcards</Label>
        {selectedResource ? (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
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
        <Label>Number of Flashcards</Label>
        <Slider defaultValue={[10]} max={50} step={5} />
      </div>

      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <Select defaultValue="medium">
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic (Definitions)</SelectItem>
            <SelectItem value="medium">Medium (Concepts)</SelectItem>
            <SelectItem value="advanced">Advanced (Applications)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Focus Topics (optional)</Label>     <Input placeholder="Enter specific topics to focus on" />
      </div>

      <Button
        className="w-full"
        onClick={onProcess}
        disabled={isProcessing || !selectedResource}
      >
        {isProcessing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Flashcards...</>
        ) : (
          <><Lightbulb className="mr-2 h-4 w-4" /> Generate Flashcards</>
        )}
      </Button>
    </div>
  );
}