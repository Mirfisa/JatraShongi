/**
 * @module main
 * Entry point for the JatraShongi React application
 * @remarks
 * Initializes the React root with StrictMode.
 * - StrictMode: Highlights potential issues in development
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Initialize React application at DOM root element
 * @internal
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
