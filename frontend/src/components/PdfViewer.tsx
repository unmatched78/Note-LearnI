import React, { useState } from 'react';

interface PDFViewerProps {
  url?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url = '/final_view.pdf' }) => {
  const [pdfSrc, setPdfSrc] = useState<string>(url);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const blobUrl = URL.createObjectURL(file);
      setPdfSrc(blobUrl);
      setError('');
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfSrc;
    link.download = pdfSrc.split('/').pop() || 'document.pdf';
    link.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* File input and download button */}
      <div className="p-4 bg-white shadow flex items-center gap-4">
        <label className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          Open PDF
        </label>
        <button
          onClick={handleDownload}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* Loader */}
      {isLoading && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-b-transparent rounded-full" />
        </div>
      )}

      {/* PDF iframe */}
      {!error && (
        <div className="flex-1">
          <iframe
            src={pdfSrc}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError('Failed to load PDF.');
            }}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
