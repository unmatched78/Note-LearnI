import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from './context/AuthContext';
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </AuthProvider>
  </ClerkProvider>
  </ThemeProvider>
  ,
)
