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

interface Resource {
  id: number;
  name: string;
  type: string;
}

interface QuizMeta {
  quizId: number;
  questions: Array<{ question: string; options: string[]; answer: string }>;
}

interface AIToolsPanelProps {
  selectedResource?: Resource;
  onGenerateContent: (payload: { type: string; content: any }) => void;
  onQuizMeta: (meta: QuizMeta) => void;
}

export default function AIToolsPanel({
  selectedResource,
  onGenerateContent,
  onQuizMeta
}: AIToolsPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("summarize");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Mock handler for non-AI tools
  const handleProcess = (type: string) => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
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
            onGenerateContent={onGenerateContent}
          // isProcessing={isProcessing}
          // onProcess={() => handleProcess("summarize")}
          />
        );
      case "transcribe":
        return (
          <TranscribeTab
             selectedResource={selectedResource}
              isProcessing={isProcessing && activeTab === "transcribe"} 
            onGenerateContent={(payload) => { 
              setIsProcessing(false);
              onGenerateContent(payload);
            }}
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
            onGenerateContent={onGenerateContent}
            onQuizMeta={onQuizMeta}
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
        <ScrollArea className="h-[500px] p-4">
          {renderTab()}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        {/* {isProcessing ? ( */}
        {activeTab !== "summarize" && isProcessing ? (
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
            <AlertCircle className="h-3 w-3" />
            <span>Select a resource to get started</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
