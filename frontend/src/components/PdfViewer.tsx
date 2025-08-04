// import React, { useState } from 'react';

// interface PDFViewerProps {
//   url?: string;
// }

// const PDFViewer: React.FC<PDFViewerProps> = ({ url = '/final_view.pdf' }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [pdfSrc, setPdfSrc] = useState(url);

//   // File picker handler
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && file.type === 'application/pdf') {
//       const blobUrl = URL.createObjectURL(file);
//       setPdfSrc(blobUrl);
//       setError('');
//       setIsLoading(true);
//     } else {
//       setError('Please select a valid PDF file.');
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Toolbar */}
//       <div className="bg-white p-4 shadow flex justify-between items-center">
//         <h1 className="text-lg font-semibold">PDF Viewer</h1>
//         <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded">
//           <Input
//             type="file"
//             accept="application/pdf"
//             onChange={handleFileChange}
//             className="hidden"
//           />
//           Open PDF
//         </label>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="p-4 bg-red-100 text-red-700">{error}</div>
//       )}

//       {/* Loading spinner */}
//       {isLoading && !error && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-b-transparent rounded-full" />
//         </div>
//       )}

//       {/* Iframe */}
//       {!error && (
//         <iframe
//           src={pdfSrc}
//           onLoad={() => setIsLoading(false)}
//           onError={() => {
//             setIsLoading(false);
//             setError('Failed to load PDF.');
//           }}
//           className="flex-1 w-full border-0"
//           title="PDF Viewer"
//         />
//       )}

//       {/* Download link */}
//       {!error && !isLoading && (
//         <div className="bg-white p-4 text-right">
//           <a
//             href={pdfSrc}
//             download={pdfSrc.split('/').pop() || 'document.pdf'}
//             className="text-blue-600 hover:underline"
//           >
//             Download PDF
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFViewer;
import React, { useState, useEffect, CSSProperties } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PDFViewerProps {
  url?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url = '/final_view.pdf' }) => {
  const [pdfSrc, setPdfSrc] = useState(url);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100); // percent
  const [rotation, setRotation] = useState(0);

  // Re-trigger loader when URL or page changes
  useEffect(() => {
    setIsLoading(true);
  }, [pdfSrc, page, zoom, rotation]);

  // Build fragment for native PDF viewer controls off
  const fragment = `page=${page}&view=FitH`;
  const iframeSrc = `${pdfSrc}#${fragment}`;

  // CSS wrapper to apply zoom & rotation
  const wrapperStyle: CSSProperties = {
    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
    transformOrigin: 'top left',
    width: `${100 / (zoom / 100)}%`,
    height: `${100 / (zoom / 100)}%`,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const blobUrl = URL.createObjectURL(file);
      setPdfSrc(blobUrl);
      setError('');
      setPage(1);
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
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between p-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold">PDF Viewer</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <FileText className="h-4 w-4" />
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            Open
          </label>
          <Button variant="secondary" onClick={handleDownload} className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()} className="p-2">
            <RefreshCcw className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white border-b p-3 flex items-center justify-center gap-4 sticky top-14 z-10">
        <Button size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={1}
            value={page}
            onChange={(e) => setPage(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center"
          />
          <span>/?</span>
        </div>
        <Button size="icon" onClick={() => setPage((p) => p + 1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>

        <Button size="icon" onClick={() => setZoom((z) => Math.max(50, z - 25))}>
          <ZoomOut className="h-5 w-5" />
        </Button>
        <span className="w-12 text-center">{zoom}%</span>
        <Button size="icon" onClick={() => setZoom((z) => Math.min(200, z + 25))}>
          <ZoomIn className="h-5 w-5" />
        </Button>

        <Button size="icon" onClick={() => setRotation((r) => (r + 90) % 360)}>
          <RotateCw className="h-5 w-5" />
        </Button>
      </div>

      {/* Error banner */}
      {error && <div className="p-4 bg-red-100 text-red-700">{error}</div>}

      {/* Loader */}
      {isLoading && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-b-transparent rounded-full" />
        </div>
      )}

      {/* PDF iframe with zoom/rotate wrapper */}
      {!error && (
        <div className="flex-1 overflow-auto bg-gray-200">
          <div style={wrapperStyle} className="origin-top-left">
            <iframe
              src={iframeSrc}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError('Failed to load PDF.');
              }}
              className="w-full h-screen border-0"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
