import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FrappeProvider } from 'frappe-react-sdk'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// We route all requests via the relative /api path so that both 
// Vite's dev proxy and our Production Node server handle CORS + Auth.
const erpUrl = ''

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FrappeProvider
        url={erpUrl}
        enableSocket={false}
      >
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e2a',
              color: '#f0f0f5',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '14px',
            },
          }}
        />
      </FrappeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
