import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface TranscriptDisplayProps {
    transcript: string;
    summary?: string;
    media_url?: string;
}

export default function TranscriptDisplay({ transcript, summary, media_url }: TranscriptDisplayProps) {
    const [showTranscript, setShowTranscript] = useState(true);
    const [showSummary, setShowSummary] = useState(false);

    const videoId = useMemo(() => {
        if (!media_url) return null;
        const m = media_url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
        return m ? m[1] : null;
    }, [media_url]);

    return (
        <div className="space-y-6">
            {videoId && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="shadow-lg shadow-blue-500/20 hover:shadow-blue-400/40 transition-shadow">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-blue-600 drop-shadow-lg">
                                Video Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="aspect-video p-0 overflow-hidden rounded-lg">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Transcript Section */}
            <Card className="shadow-lg shadow-green-500/20 hover:shadow-green-400/40 transition-shadow">
                <CardHeader
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowTranscript(prev => !prev)}
                >
                    <CardTitle className="text-lg font-bold text-green-600 drop-shadow-lg">
                        Transcript
                    </CardTitle>
                    {showTranscript ? <ChevronUp /> : <ChevronDown />}
                </CardHeader>
                <AnimatePresence>
                    {showTranscript && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardContent className="p-4 max-h-64 overflow-auto bg-gray-50">
                                <pre className="whitespace-pre-wrap font-mono text-sm leading-snug">
                                    {transcript}
                                </pre>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Summary Section */}
            {summary && (
                <Card className="shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/40 transition-shadow">
                    <CardHeader
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setShowSummary(prev => !prev)}
                    >
                        <CardTitle className="text-lg font-bold text-yellow-600 drop-shadow-lg">
                            Summary
                        </CardTitle>
                        {showSummary ? <ChevronUp /> : <ChevronDown />}
                    </CardHeader>
                    <AnimatePresence>
                        {showSummary && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                 <CardContent className="p-4 bg-gray-50">
                  <div className="prose prose-sm prose-p:my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}> 
                      {summary}
                    </ReactMarkdown>
                  </div>
                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            )}
        </div>
    );
}
