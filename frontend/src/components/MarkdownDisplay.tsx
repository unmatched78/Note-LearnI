// src/components/SummaryDisplay.tsx
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface SummaryDisplayProps {
  title?: string;
  content: string;
}

export default function SummaryDisplay({ title = "Summary", content }: SummaryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Summary copied!");  // <— Sonner toast here
  };

  return (
    <motion.div
      ref={containerRef}
      className="max-w-4xl mx-auto"
      whileHover={{ scale: 1.02, rotateY: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ perspective: 800 }}
    >
      <Card className="ring-1 ring-transparent hover:ring-indigo-400 hover:shadow-indigo-500/60 shadow-lg shadow-indigo-500/40 transition-all duration-300">
        <CardHeader className="flex justify-between items-center pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="hover:bg-indigo-100"
          >
            <Copy className="h-4 w-4 text-indigo-600" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {/* for the height down you can further change accordingly also if you want full content to be loaded at once simply use h-fit */}
          <ScrollArea className="h-[500px] p-4">
            <div className="prose prose-indigo max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>

            
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
