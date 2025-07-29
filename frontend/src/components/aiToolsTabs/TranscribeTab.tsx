// components/aiToolsTabs/TranscribeTab.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Play, Loader2 } from "lucide-react";

interface TranscribeTabProps {
  isProcessing: boolean;
  onProcess: () => void;
}

export default function TranscribeTab({ isProcessing, onProcess }: TranscribeTabProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label>Audio/Video to Transcribe</Label>
        <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload Media
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Language</Label>
        <Select defaultValue="english">
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Speaker Identification</Label>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <Label>Generate Summary</Label>
        <Switch />
      </div>

      <Button
        className="w-full"
        onClick={onProcess}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transcribing...</>
        ) : (
          <><Play className="mr-2 h-4 w-4" /> Start Transcription</>
        )}
      </Button>
    </div>
  );
}
