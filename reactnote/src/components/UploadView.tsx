import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Plus
} from "lucide-react";

interface Document {
  id: number;
  title: string;
  created_at: string;
}

interface UploadViewProps {
  documents: Document[];
  selectedFile: File | null;
  uploadProgress: number;
  isUploading: boolean;
  onFileSelect: (file: File | null) => void;
  onFileUpload: () => void;
  onDocumentSelect: (document: Document) => void;
}

export default function UploadView({
  documents,
  selectedFile,
  uploadProgress,
  isUploading,
  onFileSelect,
  onFileUpload,
  onDocumentSelect
}: UploadViewProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
          Upload Study Material
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Upload your documents to generate AI-powered quizzes
        </p>
      </div>

      <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 transition-colors">
        <CardContent className="p-8">
          <div className="text-center">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.pptx"
              onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Choose File
            </label>
            
            {selectedFile && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                
                {isUploading && (
                  <div className="mb-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-slate-500 mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}
                
                <Button
                  onClick={onFileUpload}
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Process'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Or select from uploaded documents:</h3>
          <div className="grid gap-3">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                onClick={() => onDocumentSelect(doc)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}