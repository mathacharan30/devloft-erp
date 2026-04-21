import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FrappeProvider } from 'frappe-react-sdk'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// In dev mode, the Vite proxy handles auth + CORS
// In production, set the actual ERPNext URL
const erpUrl = import.meta.env.DEV ? '' : (import.meta.env.VITE_ERP_URL || '')

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
