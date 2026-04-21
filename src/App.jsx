import { Routes, Route, Navigate } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LeadList from './pages/leads/LeadList'
import LeadDetail from './pages/leads/LeadDetail'
import ProjectList from './pages/projects/ProjectList'
import ProjectDetail from './pages/projects/ProjectDetail'
import TaskBoard from './pages/projects/TaskBoard'
import PaymentList from './pages/payments/PaymentList'
import PaymentDetail from './pages/payments/PaymentDetail'

const hasTokenAuth = import.meta.env.VITE_API_KEY && import.meta.env.VITE_API_SECRET

function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useFrappeAuth()

  // If token auth is configured, skip login check — tokens handle auth
  if (hasTokenAuth) return children

  if (isLoading) {
    return (
      <div className="loader-container" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<LeadList />} />
                <Route path="/leads/:id" element={<LeadDetail />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/projects/:id/tasks" element={<TaskBoard />} />
                <Route path="/payments" element={<PaymentList />} />
                <Route path="/payments/:id" element={<PaymentDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
