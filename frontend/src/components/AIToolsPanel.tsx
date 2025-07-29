// components/AIToolsPanel.tsx (updated to pass correct props)
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Wand2, Loader2 } from "lucide-react";
import SummarizeTab from "@/components/aiToolsTabs/SummarizeTab";
import TranscribeTab from "@/components/aiToolsTabs/TranscribeTab";
import FlashcardsTab from "@/components/aiToolsTabs/FlashcardsTab";
import QuizTab from "@/components/aiToolsTabs/QuizTab";

interface AIToolsPanelProps {
  selectedResource?: { id: number; name: string; type: string };
  onGenerateContent: (payload: { type: string; content: any }) => void;
}

export default function AIToolsPanel({ selectedResource, onGenerateContent }: AIToolsPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("summarize");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // For non-flashcard tools: local mock handler (or integrate separately)
  const handleProcess = (type: string) => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // You can replace mock content with real API data if needed
          onGenerateContent({ type, content: [] });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "summarize":
        return (
          <SummarizeTab
            selectedResource={selectedResource}
            isProcessing={isProcessing && activeTab === "summarize"}
            onProcess={() => handleProcess("summarize")}
          />
        );
      case "transcribe":
        return (
          <TranscribeTab
            isProcessing={isProcessing && activeTab === "transcribe"}
            onProcess={() => handleProcess("transcribe")}
          />
        );
      case "flashcards":
        return (
          <FlashcardsTab
            selectedResource={selectedResource}
            onGenerateContent={onGenerateContent}
          />
        );
      case "quiz":
        return (
          <QuizTab
            selectedResource={selectedResource}
            isProcessing={isProcessing && activeTab === "quiz"}
            onProcess={() => handleProcess("quiz")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-[350px] h-[600px] bg-background border-border">
      <CardHeader className="pb-3 flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          AI Tools
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="summarize">Summarize</TabsTrigger>
            <TabsTrigger value="transcribe">Transcribe</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollArea className="h-[500px] p-4">{renderTab()}</ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        {isProcessing ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Processing...
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        ) : (
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Select a resource to get started</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
