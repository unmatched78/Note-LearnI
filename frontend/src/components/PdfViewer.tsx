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
