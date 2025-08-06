// // 👇 ensure worker installed: npm install react-pdf pdfjs-dist

// import React, {
//   useState,
//   useEffect,
//   ChangeEvent,
//   useRef,
//   CSSProperties
// } from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// import "react-pdf/dist/Page/TextLayer.css";
// import "react-pdf/dist/Page/AnnotationLayer.css";

// // Point PDF.js worker at the correct build file
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// export default function ResourceViewer() {
//   const [file, setFile] = useState<File | null>(null);
//   const [numPages, setNumPages] = useState(0);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [zoom, setZoom] = useState(1.0);

//   // Clean up Object URL
//   const fileUrlRef = useRef<string | null>(null);
//   useEffect(() => {
//     if (file) {
//       if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
//       fileUrlRef.current = URL.createObjectURL(file);
//     }
//     return () => {
//       if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
//     };
//   }, [file]);

//   function onFileChange(e: ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0] ?? null;
//     if (f?.type === "application/pdf") {
//       setFile(f);
//       setPageNumber(1);
//       setNumPages(0);
//     } else {
//       alert("Please select a valid PDF file.");
//     }
//   }

//   function onDocLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div className="h-full flex flex-col bg-background">
//       <header className="p-2 border-b bg-gray-50 flex items-center space-x-3">
//         <label>
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={onFileChange}
//             hidden
//           />
//           <button className="btn btn-sm">
//             {file ? "Replace PDF" : "Upload PDF"}
//           </button>
//         </label>
//         {file && <span>{file.name}</span>}
//       </header>

//       <main className="flex-1 overflow-hidden">
//         {fileUrlRef.current ? (
//           <>
//             {/* Toolbar */}
//             <div className="flex items-center p-2 border-b bg-white">
//               <button
//                 disabled={pageNumber <= 1}
//                 onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
//                 className="btn btn-xs"
//               >◀ Previous</button>
//               <span className="mx-2 text-sm">
//                 {pageNumber} / {numPages}
//               </span>
//               <button
//                 disabled={pageNumber >= numPages}
//                 onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
//                 className="btn btn-xs"
//               >Next ▶</button>

//               <div className="flex-1" />
//               <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="btn btn-xs"
//               >➖</button>
//               <span className="mx-1 text-sm">{Math.round(zoom * 100)}%</span>
//               <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3))} className="btn btn-xs"
//               >➕</button>
//             </div>

//             {/* PDF document */}
//             <div className="flex-1 overflow-auto p-4 bg-gray-100">
//               <Document
//                 file={fileUrlRef.current}
//                 onLoadSuccess={onDocLoadSuccess}
//                 loading="Loading PDF…"
//               >
//                 <Page
//                   pageNumber={pageNumber}
//                   scale={zoom}
//                   renderTextLayer={true}
//                   renderAnnotationLayer={true}
//                 />
//               </Document>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             No PDF loaded. Click “Upload PDF” above.
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
