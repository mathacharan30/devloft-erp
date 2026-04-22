import { Routes, Route, Navigate } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// CRM
import LeadList from './pages/leads/LeadList'
import LeadDetail from './pages/leads/LeadDetail'
import OpportunityList from './pages/crm/OpportunityList'
import OpportunityDetail from './pages/crm/OpportunityDetail'
import CustomerList from './pages/crm/CustomerList'
import CustomerDetail from './pages/crm/CustomerDetail'

// Sales
import QuotationList from './pages/sales/QuotationList'
import QuotationDetail from './pages/sales/QuotationDetail'
import SalesOrderList from './pages/sales/SalesOrderList'
import SalesOrderDetail from './pages/sales/SalesOrderDetail'
import SalesInvoiceList from './pages/sales/SalesInvoiceList'
import SalesInvoiceDetail from './pages/sales/SalesInvoiceDetail'

// Projects & Support
import ProjectList from './pages/projects/ProjectList'
import ProjectDetail from './pages/projects/ProjectDetail'
import TaskBoard from './pages/projects/TaskBoard'
import TaskList from './pages/projects/TaskList'
import TaskDetail from './pages/projects/TaskDetail'
import IssueList from './pages/projects/IssueList'
import IssueDetail from './pages/projects/IssueDetail'

// Time
import TimesheetList from './pages/time/TimesheetList'
import TimesheetDetail from './pages/time/TimesheetDetail'

// Finance
import PaymentList from './pages/payments/PaymentList'
import PaymentDetail from './pages/payments/PaymentDetail'
import JournalEntryList from './pages/finance/JournalEntryList'
import JournalEntryDetail from './pages/finance/JournalEntryDetail'
import AccountList from './pages/finance/AccountList'
import AccountDetail from './pages/finance/AccountDetail'
import CostCenterList from './pages/finance/CostCenterList'
import CostCenterDetail from './pages/finance/CostCenterDetail'

const hasTokenAuth = import.meta.env.VITE_API_KEY && import.meta.env.VITE_API_SECRET

function ProtectedRoute({ children }) {
  const { currentUser, isLoading } = useFrappeAuth()
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
                
                {/* CRM */}
                <Route path="/leads" element={<LeadList />} />
                <Route path="/leads/:id" element={<LeadDetail />} />
                <Route path="/crm/opportunities" element={<OpportunityList />} />
                <Route path="/crm/opportunities/:id" element={<OpportunityDetail />} />
                <Route path="/crm/customers" element={<CustomerList />} />
                <Route path="/crm/customers/:id" element={<CustomerDetail />} />

                {/* Sales */}
                <Route path="/sales/quotations" element={<QuotationList />} />
                <Route path="/sales/quotations/:id" element={<QuotationDetail />} />
                <Route path="/sales/orders" element={<SalesOrderList />} />
                <Route path="/sales/orders/:id" element={<SalesOrderDetail />} />
                <Route path="/sales/invoices" element={<SalesInvoiceList />} />
                <Route path="/sales/invoices/:id" element={<SalesInvoiceDetail />} />

                {/* Projects */}
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/projects/:id/tasks" element={<TaskBoard />} />
                <Route path="/projects/tasks" element={<TaskList />} />
                <Route path="/projects/tasks/:id" element={<TaskDetail />} />
                <Route path="/projects/issues" element={<IssueList />} />
                <Route path="/projects/issues/:id" element={<IssueDetail />} />

                {/* Time */}
                <Route path="/time/timesheets" element={<TimesheetList />} />
                <Route path="/time/timesheets/:id" element={<TimesheetDetail />} />

                {/* Finance */}
                <Route path="/payments" element={<PaymentList />} />
                <Route path="/payments/:id" element={<PaymentDetail />} />
                <Route path="/finance/journal-entries" element={<JournalEntryList />} />
                <Route path="/finance/journal-entries/:id" element={<JournalEntryDetail />} />
                <Route path="/finance/accounts" element={<AccountList />} />
                <Route path="/finance/accounts/:id" element={<AccountDetail />} />
                <Route path="/finance/cost-centers" element={<CostCenterList />} />
                <Route path="/finance/cost-centers/:id" element={<CostCenterDetail />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
