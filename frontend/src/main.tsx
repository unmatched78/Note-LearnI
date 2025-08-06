import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/clerk-react'
import { Toaster } from "@/components/ui/sonner"
import ResourceSearchModal from "@/components/ResourceSearchModal"
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// src/main.tsx
// import { pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

    <Toaster />
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <StrictMode>
        <ResourceSearchModal />
        <App />
      </StrictMode>
    </ClerkProvider>
  </ThemeProvider>
  ,
)
