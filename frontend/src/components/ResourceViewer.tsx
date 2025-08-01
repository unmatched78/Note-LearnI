// src/components/ResourceViewer.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Download, Share, BookmarkPlus, PenTool,
  MessageSquare, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Plus,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader,  DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { TooltipProvider, Tooltip } from "@/components/ui/tooltip";
import { TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export interface Resource {
  id: number;
  title: string;
  type?: "pdf" | "docx" | "txt" | "pptx" | "video" | "audio";
  file?: string;        // URL to the document
  notes?: string | null;
  tags?: string[];
  moduleName?: string;
}

interface ResourceViewerProps {
  resource: Resource;
}

export default function ResourceViewer({ resource }: ResourceViewerProps) {
  const [activeTab, setActiveTab] = useState<"document"|"info">("document");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [notesValue, setNotesValue] = useState(resource.notes || "");

  // build full URL
  const BASE = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const fileURL = resource.file
    ? resource.file.startsWith("http")
      ? resource.file
      : `${BASE}${resource.file}`
    : "";

  // toolbar handlers
  const toggleAnnotations = () => setShowAnnotations(v => !v);
  const prevPage = () => setCurrentPage(p => Math.max(p-1,1));
  const nextPage = () => setCurrentPage(p => p+1);
  const zoomIn = () => setZoomLevel(z => Math.min(z+10,200));
  const zoomOut = () => setZoomLevel(z => Math.max(z-10,50));

  const renderToolbar = () => (
    <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
      <div className="flex items-center">
        <h2 className="text-lg font-medium">{resource.title}</h2>
        <Badge className="ml-2">{resource.type?.toUpperCase() ?? "—"}</Badge>
      </div>
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline"><Download size={16}/></Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline"><Share size={16}/></Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline"><BookmarkPlus size={16}/></Button>
            </TooltipTrigger>
            <TooltipContent>Bookmark</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline"><PenTool size={16}/></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
            <Textarea
              value={notesValue}
              onChange={e => setNotesValue(e.target.value)}
              className="min-h-[120px] mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  const renderDocumentViewer = () => (
    <div className="flex flex-1 bg-white">
      <div className="flex-1 flex flex-col">
        {/* PDF navigation (optional) */}
        {resource.type === "pdf" && (
          <div className="flex justify-between items-center p-2 border-b">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={prevPage} disabled={currentPage===1}>
                <ChevronLeft size={16}/>
              </Button>
              <span className="text-sm">Page {currentPage}</span>
              <Button size="sm" variant="outline" onClick={nextPage}>
                <ChevronRight size={16}/>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={zoomOut}><ZoomOut size={16}/></Button>
              <span className="text-sm">{zoomLevel}%</span>
              <Button size="sm" variant="outline" onClick={zoomIn}><ZoomIn size={16}/></Button>
              <Button size="sm" variant="outline"><RotateCw size={16}/></Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={toggleAnnotations}>
                      <MessageSquare size={16}/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showAnnotations ? "Hide Annotations" : "Show Annotations"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto relative bg-gray-50">
          {resource.type === "pdf" && fileURL && (
            <embed
              src={fileURL}
              type="application/pdf"
              className="w-full h-full"
            />
          )}
          {["docx","pptx","txt"].includes(resource.type || "") && (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(fileURL)}&embedded=true`}
              className="w-full h-full"
              title="Office Viewer"
            />
          )}
          {resource.type === "video" && fileURL && (
            <video src={fileURL} controls className="w-full h-full rounded" />
          )}
          {resource.type === "audio" && fileURL && (
            <audio src={fileURL} controls className="w-full p-4" />
          )}

          {/* Example annotation overlay */}
          {showAnnotations && resource.type === "pdf" && (
            <div className="absolute top-32 left-32 bg-yellow-100 p-2 rounded shadow border">
              <span className="text-sm">Sample Annotation</span>
            </div>
          )}
        </div>
      </div>

      {showAnnotations && (
        <div className="w-64 border-l bg-white p-4 overflow-y-auto">
          <h3 className="font-medium mb-2">Annotations</h3>
          <div className="space-y-3">
            <div className="p-2 bg-yellow-50 border-yellow-200 border rounded">
              <div className="text-sm font-medium">Page {currentPage}</div>
              <div className="text-sm">Important point</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Plus size={14} className="mr-1" /> Add Annotation
          </Button>
        </div>
      )}
    </div>
  );

  const renderInfoPanel = () => (
    <div className="p-4 space-y-4">
      <h3 className="font-medium mb-2">Resource Info</h3>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Type:</span>
          <span>{resource.type ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>Module:</span>
          <span>{resource.moduleName ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>Tags:</span>
          <span>{(resource.tags || []).join(", ") || "—"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0">
        {renderToolbar()}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="border-b">
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="document" className="flex-1 p-0 m-0">
            {renderDocumentViewer()}
          </TabsContent>

          <TabsContent value="info" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full">{renderInfoPanel()}</ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
