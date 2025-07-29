// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Progress } from "@/components/ui/progress";
// import {
//   AlertCircle,
//   BookOpen,
//   FileText,
//   FlaskConical,
//   Lightbulb,
//   Loader2,
//   MessageSquare,
//   Mic,
//   Play,
//   Plus,
//   Upload,
//   Wand2,
// } from "lucide-react";

// interface AIToolsPanelProps {
//   selectedResource?: {
//     id: string;
//     name: string;
//     type: string;
//   };
//   onGenerateContent?: (content: any) => void;
// }

// const AIToolsPanel = ({
//   selectedResource,
//   onGenerateContent = () => {},
// }: AIToolsPanelProps) => {
//   const [activeTab, setActiveTab] = useState("summarize");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [progress, setProgress] = useState(0);

//   // Mock function to simulate AI processing
//   const handleProcess = (type: string) => {
//     setIsProcessing(true);
//     setProgress(0);

//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setIsProcessing(false);
//           // Mock generated content
//           const mockContent = {
//             type,
//             content:
//               type === "summarize"
//                 ? "This is a generated summary of the selected resource."
//                 : type === "transcribe"
//                   ? "This is a generated transcript of the audio/video."
//                   : type === "flashcards"
//                     ? [
//                         {
//                           front: "What is photosynthesis?",
//                           back: "The process by which green plants and some other organisms use sunlight to synthesize nutrients.",
//                         },
//                         {
//                           front: "What is cellular respiration?",
//                           back: "The process by which cells break down glucose and produce energy in the form of ATP.",
//                         },
//                       ]
//                     : [
//                         {
//                           question: "What is the capital of France?",
//                           options: ["London", "Berlin", "Paris", "Madrid"],
//                           answer: "Paris",
//                         },
//                       ],
//           };
//           onGenerateContent(mockContent);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 300);
//   };

//   return (
//     <Card className="w-full max-w-[350px] h-[600px] bg-background border-border">
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg flex items-center gap-2">
//           <Wand2 className="h-5 w-5 text-primary" />
//           AI Tools
//         </CardTitle>
//         <CardDescription>
//           Generate content and study materials with AI
//         </CardDescription>
//       </CardHeader>
//       <Separator />
//       <CardContent className="p-0">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid grid-cols-4 w-full">
//             <TabsTrigger value="summarize" className="text-xs">
//               <FileText className="h-4 w-4 mr-1" />
//               <span className="hidden sm:inline">Summarize</span>
//             </TabsTrigger>
//             <TabsTrigger value="transcribe" className="text-xs">
//               <Mic className="h-4 w-4 mr-1" />
//               <span className="hidden sm:inline">Transcribe</span>
//             </TabsTrigger>
//             <TabsTrigger value="flashcards" className="text-xs">
//               <BookOpen className="h-4 w-4 mr-1" />
//               <span className="hidden sm:inline">Flashcards</span>
//             </TabsTrigger>
//             <TabsTrigger value="quiz" className="text-xs">
//               <FlaskConical className="h-4 w-4 mr-1" />
//               <span className="hidden sm:inline">Quiz</span>
//             </TabsTrigger>
//           </TabsList>

//           <ScrollArea className="h-[400px] p-4">
//             <TabsContent value="summarize" className="mt-4 space-y-4">
//               <div className="space-y-2">
//                 <Label>Resource to Summarize</Label>
//                 {selectedResource ? (
//                   <div className="flex items-center justify-between p-2 border rounded-md">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-4 w-4 text-muted-foreground" />
//                       <span>{selectedResource.name}</span>
//                     </div>
//                     <Badge variant="outline">{selectedResource.type}</Badge>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
//                     <Button
//                       variant="outline"
//                       className="flex items-center gap-2"
//                     >
//                       <Plus className="h-4 w-4" />
//                       Select Resource
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label>Summary Length</Label>
//                 <Select defaultValue="medium">
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select length" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="short">
//                       Short (1-2 paragraphs)
//                     </SelectItem>
//                     <SelectItem value="medium">
//                       Medium (3-5 paragraphs)
//                     </SelectItem>
//                     <SelectItem value="long">Long (6+ paragraphs)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Include Key Points</Label>
//                   <Switch defaultChecked />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Focus Areas (optional)</Label>
//                 <Textarea placeholder="Enter specific topics or concepts to focus on in the summary" />
//               </div>

//               <Button
//                 className="w-full"
//                 onClick={() => handleProcess("summarize")}
//                 disabled={isProcessing || !selectedResource}
//               >
//                 {isProcessing && activeTab === "summarize" ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Generating Summary...
//                   </>
//                 ) : (
//                   <>
//                     <Wand2 className="mr-2 h-4 w-4" />
//                     Generate Summary
//                   </>
//                 )}
//               </Button>
//             </TabsContent>

//             <TabsContent value="transcribe" className="mt-4 space-y-4">
//               <div className="space-y-2">
//                 <Label>Audio/Video to Transcribe</Label>
//                 <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
//                   <Button variant="outline" className="flex items-center gap-2">
//                     <Upload className="h-4 w-4" />
//                     Upload Media
//                   </Button>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Language</Label>
//                 <Select defaultValue="english">
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select language" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="english">English</SelectItem>
//                     <SelectItem value="spanish">Spanish</SelectItem>
//                     <SelectItem value="french">French</SelectItem>
//                     <SelectItem value="german">German</SelectItem>
//                     <SelectItem value="chinese">Chinese</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Speaker Identification</Label>
//                   <Switch />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Generate Summary</Label>
//                   <Switch />
//                 </div>
//               </div>

//               <Button
//                 className="w-full"
//                 onClick={() => handleProcess("transcribe")}
//                 disabled={isProcessing}
//               >
//                 {isProcessing && activeTab === "transcribe" ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Transcribing...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="mr-2 h-4 w-4" />
//                     Start Transcription
//                   </>
//                 )}
//               </Button>
//             </TabsContent>

//             <TabsContent value="flashcards" className="mt-4 space-y-4">
//               <div className="space-y-2">
//                 <Label>Resource for Flashcards</Label>
//                 {selectedResource ? (
//                   <div className="flex items-center justify-between p-2 border rounded-md">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-4 w-4 text-muted-foreground" />
//                       <span>{selectedResource.name}</span>
//                     </div>
//                     <Badge variant="outline">{selectedResource.type}</Badge>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
//                     <Button
//                       variant="outline"
//                       className="flex items-center gap-2"
//                     >
//                       <Plus className="h-4 w-4" />
//                       Select Resource
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label>Number of Flashcards</Label>
//                 <div className="pt-2">
//                   <Slider defaultValue={[10]} max={50} step={5} />
//                   <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                     <span>5</span>
//                     <span>25</span>
//                     <span>50</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Difficulty Level</Label>
//                 <Select defaultValue="medium">
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select difficulty" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="basic">Basic (Definitions)</SelectItem>
//                     <SelectItem value="medium">Medium (Concepts)</SelectItem>
//                     <SelectItem value="advanced">
//                       Advanced (Applications)
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Focus Topics (optional)</Label>
//                 <Input placeholder="Enter specific topics to focus on" />
//               </div>

//               <Button
//                 className="w-full"
//                 onClick={() => handleProcess("flashcards")}
//                 disabled={isProcessing || !selectedResource}
//               >
//                 {isProcessing && activeTab === "flashcards" ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating Flashcards...
//                   </>
//                 ) : (
//                   <>
//                     <Lightbulb className="mr-2 h-4 w-4" />
//                     Generate Flashcards
//                   </>
//                 )}
//               </Button>
//             </TabsContent>

//             <TabsContent value="quiz" className="mt-4 space-y-4">
//               <div className="space-y-2">
//                 <Label>Resource for Quiz</Label>
//                 {selectedResource ? (
//                   <div className="flex items-center justify-between p-2 border rounded-md">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-4 w-4 text-muted-foreground" />
//                       <span>{selectedResource.name}</span>
//                     </div>
//                     <Badge variant="outline">{selectedResource.type}</Badge>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
//                     <Button
//                       variant="outline"
//                       className="flex items-center gap-2"
//                     >
//                       <Plus className="h-4 w-4" />
//                       Select Resource
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label>Quiz Type</Label>
//                 <Select defaultValue="multiple-choice">
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select quiz type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="multiple-choice">
//                       Multiple Choice
//                     </SelectItem>
//                     <SelectItem value="true-false">True/False</SelectItem>
//                     <SelectItem value="short-answer">Short Answer</SelectItem>
//                     <SelectItem value="mixed">Mixed Format</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Number of Questions</Label>
//                 <div className="pt-2">
//                   <Slider defaultValue={[5]} max={20} step={1} />
//                   <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                     <span>1</span>
//                     <span>10</span>
//                     <span>20</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Difficulty Level</Label>
//                 <Select defaultValue="medium">
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select difficulty" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="easy">Easy</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="hard">Hard</SelectItem>
//                     <SelectItem value="mixed">Mixed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Include Explanations</Label>
//                   <Switch defaultChecked />
//                 </div>
//               </div>

//               <Button
//                 className="w-full"
//                 onClick={() => handleProcess("quiz")}
//                 disabled={isProcessing || !selectedResource}
//               >
//                 {isProcessing && activeTab === "quiz" ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Generating Quiz...
//                   </>
//                 ) : (
//                   <>
//                     <MessageSquare className="mr-2 h-4 w-4" />
//                     Generate Quiz
//                   </>
//                 )}
//               </Button>
//             </TabsContent>
//           </ScrollArea>
//         </Tabs>
//       </CardContent>

//       <CardFooter className="border-t p-4">
//         {isProcessing && (
//           <div className="w-full space-y-2">
//             <div className="flex items-center justify-between text-sm">
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-3 w-3 animate-spin" />
//                 Processing...
//               </span>
//               <span>{progress}%</span>
//             </div>
//             <Progress value={progress} className="h-1" />
//           </div>
//         )}

//         {!isProcessing && (
//           <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
//             <div className="flex items-center gap-1">
//               <AlertCircle className="h-3 w-3" />
//               <span>Select a resource to get started</span>
//             </div>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default AIToolsPanel;
// components/AIToolsPanel.tsx (refactored)
import React, { useState } from "react";
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

const AIToolsPanel = ({ selectedResource, onGenerateContent }) => {
  const [activeTab, setActiveTab] = useState("summarize");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = (type) => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          onGenerateContent({ type, content: [] /* replace with real content */ });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const renderTab = () => {
    const commonProps = { isProcessing };
    switch (activeTab) {
      case "summarize":
        return <SummarizeTab selectedResource={selectedResource} onProcess={() => handleProcess("summarize")} {...commonProps} />;
      case "transcribe":
        return <TranscribeTab onProcess={() => handleProcess("transcribe")} {...commonProps} />;
      case "flashcards":
        return <FlashcardsTab selectedResource={selectedResource} onProcess={() => handleProcess("flashcards")} {...commonProps} />;
      case "quiz":
        return <QuizTab selectedResource={selectedResource} onProcess={() => handleProcess("quiz")} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-[350px] h-[600px] bg-background border-border">
      <CardHeader className="pb-3 flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" /> AI Tools
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
};

export default AIToolsPanel;
