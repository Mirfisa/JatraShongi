/**
 * @module main
 * Entry point for the JatraShongi React application
 * @remarks
 * Initializes the React root with StrictMode and AuthProvider.
 * - StrictMode: Highlights potential issues in development
 * - AuthProvider: Provides authentication context globally
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

/**
 * Initialize React application at DOM root element
 * @internal
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
