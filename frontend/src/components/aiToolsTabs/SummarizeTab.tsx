// // components/aiToolsTabs/SummarizeTab.tsx
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, FileText, Wand2, Loader2 } from "lucide-react";

// interface SummarizeTabProps {
//   selectedResource?: { name: string; type: string };
//   isProcessing: boolean;
//   onProcess: () => void;
// }

// export default function SummarizeTab({ selectedResource, isProcessing, onProcess }: SummarizeTabProps) {
//   return (
//     <div className="mt-4 space-y-4">
//       <div className="space-y-2">
//         <Label>Resource to Summarize</Label>
//         {selectedResource ? (
//           <div className="flex items-center justify-between p-2 border rounded-md">
//             <div className="flex items-center gap-2">
//               <FileText className="h-4 w-4 text-muted-foreground" />
//               <span>{selectedResource.name}</span>
//             </div>
//             <span className="text-xs font-medium text-muted-foreground">{selectedResource.type}</span>
//           </div>
//         ) : (
//           <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
//             <Button variant="outline" className="flex items-center gap-2">
//               <Plus className="h-4 w-4" /> Select Resource
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label>Summary Length</Label>
//         <Select defaultValue="medium">
//           <SelectTrigger>
//             <SelectValue placeholder="Select length" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="short">Short (1-2 paragraphs)</SelectItem>
//             <SelectItem value="medium">Medium (3-5 paragraphs)</SelectItem>
//             <SelectItem value="long">Long (6+ paragraphs)</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex items-center justify-between">
//         <Label>Include Key Points</Label>
//         <Switch defaultChecked />
//       </div>

//       <div className="space-y-2">
//         <Label>Focus Areas (optional)</Label>
//         <Textarea placeholder="Enter specific topics or concepts to focus on in the summary" />
//       </div>

//       <Button
//         className="w-full"
//         onClick={onProcess}
//         disabled={isProcessing || !selectedResource}
//       >
//         {isProcessing ? (
//           <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Summary...</>
//         ) : (
//           <><Wand2 className="mr-2 h-4 w-4" /> Generate Summary</>
//         )}
//       </Button>
//     </div>
//   );
// }
// src/components/aiToolsTabs/SummarizeTab.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Wand2, Loader2 } from "lucide-react";
import { useApi } from "@/api/api";

interface SummarizeTabProps {
  selectedResource?: { id: number; name: string; type: string };
  onGenerateContent: (payload: { type: "summarize"; content: string }) => void;
}

export default function SummarizeTab({
  selectedResource,
  onGenerateContent,
}: SummarizeTabProps) {
  const { fetchJson } = useApi();
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true);
  const [focusAreas, setFocusAreas] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onProcess = async () => {
    if (!selectedResource) return;
    setIsProcessing(true);
    setError(null);

    const payload = {
      document: selectedResource.id,
      length,
      include_key_points: includeKeyPoints,
      focus_areas: focusAreas,
    };

    try {
      // use fetchJson instead of api.post
      const data = await fetchJson<{ content: string }>(
        "/summaries/generate/",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      onGenerateContent({ type: "summarize", content: data.content });
    } catch (e: any) {
      console.error(e);
      // fetchJson throws Error(detail) so e.message holds the detail
      setError(e.message || "Failed to generate summary");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label>Resource to Summarize</Label>
        {selectedResource ? (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{selectedResource.name}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {selectedResource.type}
            </span>
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
        <Label>Summary Length</Label>
        <Select value={length} onValueChange={(v) => setLength(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Include Key Points</Label>
        <Switch
          checked={includeKeyPoints}
          onCheckedChange={setIncludeKeyPoints}
        />
      </div>

      <div className="space-y-2">
        <Label>Focus Areas (optional)</Label>
        <Textarea
          value={focusAreas}
          onChange={(e) => setFocusAreas(e.target.value)}
          placeholder="Enter topics or concepts to emphasize"
        />
      </div>

      <Button
        className="w-full"
        onClick={onProcess}
        disabled={isProcessing || !selectedResource}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Summary
          </>
        )}
      </Button>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
