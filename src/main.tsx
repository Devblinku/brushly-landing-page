import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './components/auth/AuthContext'
import { PostHogProvider } from './components/PostHogProvider'
import { initPostHog } from './lib/posthog'
import App from './App'
import './index.css'

// Initialize PostHog
initPostHog()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <PostHogProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PostHogProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
