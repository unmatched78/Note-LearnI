// components/aiToolsTabs/FlashcardsTab.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen, Lightbulb, Loader2 } from "lucide-react";
import { useApi } from "@/api/api";

interface FlashcardsTabProps {
  selectedResource?: { id: number; name: string; type: string };
  onGenerateContent: (payload: { type: string; content: any }) => void;
}

export default function FlashcardsTab({ selectedResource, onGenerateContent }: FlashcardsTabProps) {
  const { fetchJson } = useApi();
  const [numCards, setNumCards] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [focusTopics, setFocusTopics] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!selectedResource) return;
    setIsLoading(true);
    try {
      const payload = {
        document: selectedResource.id,
        num_cards: numCards,
        difficulty,
        focus_topics: focusTopics,
      };
      const response = await fetchJson<any>(
        "/flashcards/generate/",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      const rawCards = response.cards;
      const cards = Array.isArray(rawCards)
        ? rawCards
        : rawCards?.flashcard ?? [];
      onGenerateContent({ type: "flashcards", content: cards });
    } catch (error: any) {
      console.error("Flashcard generation error:", error);
      alert(error.message || "Failed to generate flashcards");
    } finally {
      setIsLoading(false);
    }
  };

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
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Plus className="h-4 w-4" /> Select Resource
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Number of Flashcards: {numCards}</Label>
        <Slider
          value={[numCards]}
          max={50}
          step={5}
          onValueChange={([val]) => setNumCards(val)}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>5</span><span>25</span><span>50</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <Select defaultValue={difficulty} onValueChange={setDifficulty}>
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
        <Label>Focus Topics (optional)</Label>
        <Input
          value={focusTopics}
          onChange={(e) => setFocusTopics(e.target.value)}
          placeholder="Enter specific topics to focus on"
        />
      </div>

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={isLoading || !selectedResource}
      >
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Flashcards...</>
        ) : (
          <><Lightbulb className="mr-2 h-4 w-4" /> Generate Flashcards</>
        )}
      </Button>
    </div>
  );
}
