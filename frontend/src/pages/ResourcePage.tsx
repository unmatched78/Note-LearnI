// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import {
//   BookOpen,
//   FileText,
//   Video,
//   Mic,
//   Download,
//   Share,
//   BookmarkPlus,
//   MessageSquare,
//   PenTool,
//   ChevronLeft,
//   ChevronRight,
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
//   Plus,
// } from "lucide-react";

// interface ResourceViewerProps {
//   resource?: {
//     id: string;
//     title: string;
//     type: "pdf" | "docx" | "txt" | "pptx" | "video" | "audio";
//     url: string;
//     tags: string[];
//     moduleId?: string;
//     moduleName?: string;
//   };
// }

// const ResourceViewer = ({
//   resource = {
//     id: "1",
//     title: "Introduction to Machine Learning",
//     type: "pdf",
//     url: "https://example.com/sample.pdf",
//     tags: ["AI", "Machine Learning", "Computer Science"],
//     moduleId: "mod-123",
//     moduleName: "Artificial Intelligence Basics",
//   },
// }: ResourceViewerProps) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [zoomLevel, setZoomLevel] = useState(100);
//   const [showAnnotations, setShowAnnotations] = useState(true);
//   const [activeTab, setActiveTab] = useState("document");
//   const [annotations, setAnnotations] = useState<
//     Array<{
//       id: string;
//       text: string;
//       page: number;
//       position: { x: number; y: number };
//     }>
//   >([]);

//   // Mock total pages for demonstration
//   const totalPages = 24;

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleZoomIn = () => {
//     setZoomLevel(Math.min(zoomLevel + 10, 200));
//   };

//   const handleZoomOut = () => {
//     setZoomLevel(Math.max(zoomLevel - 10, 50));
//   };

//   const renderDocumentViewer = () => {
//     return (
//       <div className="flex flex-col h-full bg-white">
//         <div className="flex justify-between items-center p-2 border-b">
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <div className="text-sm">
//               Page {currentPage} of {totalPages}
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages}
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button variant="outline" size="sm" onClick={handleZoomOut}>
//               <ZoomOut className="h-4 w-4" />
//             </Button>
//             <div className="text-sm">{zoomLevel}%</div>
//             <Button variant="outline" size="sm" onClick={handleZoomIn}>
//               <ZoomIn className="h-4 w-4" />
//             </Button>
//             <Button variant="outline" size="sm">
//               <RotateCw className="h-4 w-4" />
//             </Button>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setShowAnnotations(!showAnnotations)}
//                   >
//                     <MessageSquare className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   {showAnnotations ? "Hide Annotations" : "Show Annotations"}
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         </div>

//         <div className="flex flex-1 overflow-hidden">
//           <div
//             className="flex-1 overflow-auto p-4"
//             style={{
//               transform: `scale(${zoomLevel / 100})`,
//               transformOrigin: "top left",
//             }}
//           >
//             {/* Placeholder for document content */}
//             <div className="bg-gray-100 rounded-md w-full h-[842px] flex items-center justify-center relative">
//               {resource.type === "pdf" && (
//                 <div className="text-center">
//                   <BookOpen className="h-16 w-16 mx-auto text-gray-400" />
//                   <p className="mt-2 text-gray-500">PDF Document Preview</p>
//                   <p className="text-sm text-gray-400">
//                     Page {currentPage} of {totalPages}
//                   </p>
//                 </div>
//               )}
//               {resource.type === "docx" && (
//                 <div className="text-center">
//                   <FileText className="h-16 w-16 mx-auto text-gray-400" />
//                   <p className="mt-2 text-gray-500">Word Document Preview</p>
//                 </div>
//               )}
//               {resource.type === "video" && (
//                 <div className="text-center">
//                   <Video className="h-16 w-16 mx-auto text-gray-400" />
//                   <p className="mt-2 text-gray-500">Video Player</p>
//                 </div>
//               )}
//               {resource.type === "audio" && (
//                 <div className="text-center">
//                   <Mic className="h-16 w-16 mx-auto text-gray-400" />
//                   <p className="mt-2 text-gray-500">Audio Player</p>
//                 </div>
//               )}

//               {/* Sample annotations */}
//               {showAnnotations && (
//                 <>
//                   <div className="absolute top-1/4 left-1/4 bg-yellow-100 p-2 rounded shadow-sm border border-yellow-300">
//                     <p className="text-sm">Important concept to remember</p>
//                   </div>
//                   <div className="absolute bottom-1/3 right-1/4 bg-blue-100 p-2 rounded shadow-sm border border-blue-300">
//                     <p className="text-sm">Question for professor</p>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {showAnnotations && (
//             <div className="w-64 border-l p-4 bg-gray-50 overflow-y-auto">
//               <h3 className="font-medium mb-4">Annotations</h3>
//               <div className="space-y-4">
//                 <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
//                   <p className="text-sm font-medium">Page 1</p>
//                   <p className="text-sm">Important concept to remember</p>
//                   <p className="text-xs text-gray-500 mt-1">Added 2 days ago</p>
//                 </div>
//                 <div className="bg-blue-50 p-3 rounded border border-blue-200">
//                   <p className="text-sm font-medium">Page 1</p>
//                   <p className="text-sm">Question for professor</p>
//                   <p className="text-xs text-gray-500 mt-1">Added 1 day ago</p>
//                 </div>
//                 <div className="bg-green-50 p-3 rounded border border-green-200">
//                   <p className="text-sm font-medium">Page 3</p>
//                   <p className="text-sm">Key formula for exam</p>
//                   <p className="text-xs text-gray-500 mt-1">Added today</p>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <Button variant="outline" size="sm" className="w-full">
//                   <Plus className="h-4 w-4 mr-2" /> Add Annotation
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderToolbar = () => {
//     return (
//       <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
//         <div className="flex items-center">
//           <h2 className="text-lg font-medium mr-2">{resource.title}</h2>
//           <Badge variant="outline" className="ml-2">
//             {resource.type.toUpperCase()}
//           </Badge>
//         </div>
//         <div className="flex space-x-2">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <Download className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Download</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <Share className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Share</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <BookmarkPlus className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Bookmark</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <PenTool className="h-4 w-4" />
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add Note</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4 py-4">
//                 <Textarea
//                   placeholder="Enter your notes here..."
//                   className="min-h-[200px]"
//                 />
//                 <div className="flex justify-end space-x-2">
//                   <Button variant="outline">Cancel</Button>
//                   <Button>Save Note</Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//     );
//   };

//   const renderInfoPanel = () => {
//     return (
//       <div className="p-4 space-y-4">
//         <div>
//           <h3 className="text-sm font-medium mb-2">Resource Information</h3>
//           <div className="text-sm space-y-2">
//             <div className="flex justify-between">
//               <span className="text-gray-500">Type:</span>
//               <span>{resource.type.toUpperCase()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-500">Module:</span>
//               <span>{resource.moduleName}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-500">Added:</span>
//               <span>April 15, 2023</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-500">Last viewed:</span>
//               <span>Today</span>
//             </div>
//           </div>
//         </div>

//         <Separator />

//         <div>
//           <h3 className="text-sm font-medium mb-2">Tags</h3>
//           <div className="flex flex-wrap gap-2">
//             {resource.tags.map((tag, index) => (
//               <Badge key={index} variant="secondary">
//                 {tag}
//               </Badge>
//             ))}
//             <Button variant="ghost" size="sm" className="h-6 px-2">
//               <Plus className="h-3 w-3 mr-1" /> Add
//             </Button>
//           </div>
//         </div>

//         <Separator />

//         <div>
//           <h3 className="text-sm font-medium mb-2">Related Resources</h3>
//           <div className="space-y-2">
//             <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
//               <FileText className="h-4 w-4 mr-2 text-blue-500" />
//               <span className="text-sm">Machine Learning Basics</span>
//             </div>
//             <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
//               <Video className="h-4 w-4 mr-2 text-red-500" />
//               <span className="text-sm">Neural Networks Lecture</span>
//             </div>
//             <div className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
//               <FileText className="h-4 w-4 mr-2 text-green-500" />
//               <span className="text-sm">Practice Problems</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Card className="w-full h-full bg-background">
//       <CardContent className="p-0 h-full flex flex-col">
//         {renderToolbar()}

//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="flex-1 flex flex-col"
//         >
//           <div className="border-b px-4">
//             <TabsList className="bg-transparent">
//               <TabsTrigger
//                 value="document"
//                 className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
//               >
//                 Document
//               </TabsTrigger>
//               <TabsTrigger
//                 value="info"
//                 className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
//               >
//                 Info
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           <div className="flex-1 overflow-hidden">
//             <TabsContent
//               value="document"
//               className="h-full m-0 data-[state=active]:flex-1 data-[state=active]:flex data-[state=active]:flex-col"
//             >
//               {renderDocumentViewer()}
//             </TabsContent>

//             <TabsContent value="info" className="h-full m-0 overflow-auto">
//               <ScrollArea className="h-full">{renderInfoPanel()}</ScrollArea>
//             </TabsContent>
//           </div>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// };

// export default ResourceViewer;
// src/pages/ResourcePage.tsx
// src/pages/ResourcePage.tsx
// src/pages/ResourcePage.tsx
import React, { useEffect, useState } from "react";
import ResourceViewer, { Resource } from "@/components/ResourceViewer";
import { useParams } from "react-router-dom";
import { useApi } from "@/api/api";
import { Loader2 } from "lucide-react";

export default function ResourcePage() {
  const { id } = useParams(); // assumes URL like /resources/:id
  const api = useApi();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await api.get(`/resources/${id}/`);
        setResource(res.data);
      } catch (err) {
        console.error("Failed to load resource:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Resource not found.
      </div>
    );
  }

  return (
    <div className="p-4 h-[calc(100vh-64px)]">
      <ResourceViewer resource={resource} />
    </div>
  );
}
