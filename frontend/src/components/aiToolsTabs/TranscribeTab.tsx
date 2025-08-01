// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Upload, Youtube, Loader2, Play } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { useApi } from "@/api/api";
// import { toast } from "sonner";

// interface TranscribeTabProps {
//   isProcessing: boolean;
//   onGenerateContent: (payload: { type: string; content: any }) => void;
// }

// export default function TranscribeTab({ isProcessing, onGenerateContent }: TranscribeTabProps) {
//   const { fetchJson } = useApi();
//   const [useYouTube, setUseYouTube] = useState(false);
//   const [youtubeURL, setYoutubeURL] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleStart = async () => {
//     if (loading) return;
//     try {
//       setLoading(true);

//       if (useYouTube) {
//         if (!youtubeURL.trim()) {
//           toast.error("Please provide a YouTube URL.");
//           setLoading(false);
//           return;
//         }

//         const result = await fetchJson("/transcripts/youtube/", {
//           method: "POST",
//           body: JSON.stringify({
//             youtube_url: youtubeURL,
//             language: "en",
//             generate_summary: true,
//           }),
//         });

//         onGenerateContent({
//           type: "transcribe",
//           content: {
//             transcript: result.transcript,
//             summary: result.summary,
//             media_url: youtubeURL,
//           },
//         });
//         toast.success("Transcript completed.");
//       } else {
//         toast.error("Upload support not yet implemented.");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Failed to transcribe");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-4 space-y-4">
//       <div className="flex gap-4">
//         <Button variant={!useYouTube ? "default" : "outline"} onClick={() => setUseYouTube(false)}>
//           <Upload className="w-4 h-4 mr-2" /> Upload
//         </Button>
//         <Button variant={useYouTube ? "default" : "outline"} onClick={() => setUseYouTube(true)}>
//           <Youtube className="w-4 h-4 mr-2" /> YouTube
//         </Button>
//       </div>

//       {useYouTube ? (
//         <div>
//           <Label htmlFor="yt">YouTube Video URL</Label>
//           <Input
//             id="yt"
//             value={youtubeURL}
//             onChange={(e) => setYoutubeURL(e.target.value)}
//             placeholder="https://www.youtube.com/watch?v=..."
//           />
//         </div>
//       ) : (
//         <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
//           <Button variant="outline" className="flex items-center gap-2">
//             <Upload className="h-4 w-4" /> Upload Media
//           </Button>
//         </div>
//       )}

//       <Button className="w-full" onClick={handleStart} disabled={loading || isProcessing}>
//         {loading || isProcessing ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transcribing...
//           </>
//         ) : (
//           <>
//             <Play className="mr-2 h-4 w-4" /> Start Transcription
//           </>
//         )}
//       </Button>
//     </div>
//   );
// }
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Youtube, Loader2, Play } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useApi } from "@/api/api";
import { toast } from "sonner";

interface TranscribeTabProps {
  selectedResource?: { id: number; name: string; type: string };
  isProcessing: boolean;
  onGenerateContent: (payload: { type: string; content: { transcript: string; summary?: string; media_url?: string } }) => void;
}

export default function TranscribeTab({ selectedResource, isProcessing, onGenerateContent }: TranscribeTabProps) {
  const { fetchJson } = useApi();
  const [useYouTube, setUseYouTube] = useState(false);
  const [youtubeURL, setYoutubeURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let result;
      if (useYouTube) {
        if (!youtubeURL.trim()) {
          toast.error("Please provide a YouTube URL.");
          return;
        }
        result = await fetchJson<{ transcript: string; summary?: string }>(
          "/transcripts/youtube/",
          {
            method: "POST",
            body: JSON.stringify({
              youtube_url: youtubeURL,
              language: "en",
              generate_summary: true,
            }),
          }
        );
        onGenerateContent({ type: "transcribe", content: { transcript: result.transcript, summary: result.summary, media_url: youtubeURL } });
      } else {
        // file upload path
        if (!selectedResource) {
          toast.error("Please upload a media file first.");
          return;
        }
        // Assuming selectedResource.id maps to a document with file URL
        result = await fetchJson<{ transcript: string; summary?: string }>(
          "/transcripts/generate/",
          {
            method: "POST",
            body: JSON.stringify({
              document: selectedResource.id,
              language: "en",
              speaker_identification: false,
              generate_summary: true,
            }),
          }
        );
        onGenerateContent({ type: "transcribe", content: { transcript: result.transcript, summary: result.summary } });
      }
      toast.success("Transcription completed.");
    } catch (err: any) {
      toast.error(err.message || "Failed to transcribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-4">
        <Button
          variant={!useYouTube ? "default" : "outline"}
          onClick={() => setUseYouTube(false)}
        >
          <Upload className="w-4 h-4 mr-2" /> Upload
        </Button>
        <Button
          variant={useYouTube ? "default" : "outline"}
          onClick={() => setUseYouTube(true)}
        >
          <Youtube className="w-4 h-4 mr-2" /> YouTube
        </Button>
      </div>

      {useYouTube ? (
        <div>
          <Label htmlFor="yt">YouTube Video URL</Label>
          <Input
            id="yt"
            value={youtubeURL}
            onChange={(e) => setYoutubeURL(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      ) : (
        <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
          <Button variant="outline" disabled>
            <Upload className="h-4 w-4 mr-2" /> Select Media Document
          </Button>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleStart}
        disabled={loading || isProcessing}
      >
        {loading || isProcessing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transcribing...</>
        ) : (
          <><Play className="mr-2 h-4 w-4" /> Start Transcription</>
        )}
      </Button>
    </div>
  );
}
