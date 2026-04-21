import { useFrappeGetDocCount, useFrappeGetDocList } from 'frappe-react-sdk'
import { Users, FolderKanban, CreditCard, TrendingUp, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatsCard from '../components/charts/StatsCard'
import Loader from '../components/ui/Loader'
import { formatCurrency, formatDate, getStatusColor, truncateText } from '../utils/formatters'

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: leadCount } = useFrappeGetDocCount('Lead')
  const { data: projectCount } = useFrappeGetDocCount('Project', [['status', '=', 'Open']])
  const { data: paymentCount } = useFrappeGetDocCount('Payment Entry', [['docstatus', '=', 1]])
  const { data: convertedCount } = useFrappeGetDocCount('Lead', [['status', '=', 'Converted']])

  const { data: recentLeads, isLoading: leadsLoading } = useFrappeGetDocList('Lead', {
    fields: ['name', 'lead_name', 'status', 'creation'],
    orderBy: { field: 'creation', order: 'desc' },
    limit: 5,
  })

  const { data: recentProjects, isLoading: projectsLoading } = useFrappeGetDocList('Project', {
    fields: ['name', 'project_name', 'status', 'percent_complete', 'expected_end_date'],
    orderBy: { field: 'creation', order: 'desc' },
    limit: 5,
  })

  const { data: recentPayments, isLoading: paymentsLoading } = useFrappeGetDocList('Payment Entry', {
    fields: ['name', 'party', 'paid_amount', 'payment_type', 'posting_date', 'docstatus'],
    orderBy: { field: 'creation', order: 'desc' },
    limit: 5,
  })

  const conversionRate = leadCount && convertedCount
    ? ((convertedCount / leadCount) * 100).toFixed(1) + '%'
    : '0%'

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your business overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid stagger-children">
        <StatsCard
          icon={Users}
          label="Total Leads"
          value={leadCount ?? '—'}
          change="+12% this month"
          changeType="up"
          color="blue"
        />
        <StatsCard
          icon={FolderKanban}
          label="Active Projects"
          value={projectCount ?? '—'}
          color="violet"
        />
        <StatsCard
          icon={CreditCard}
          label="Payments"
          value={paymentCount ?? '—'}
          change="+8% this month"
          changeType="up"
          color="green"
        />
        <StatsCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={conversionRate}
          color="orange"
        />
      </div>

      {/* Recent Activity Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Recent Leads */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Leads</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leads')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          {leadsLoading ? (
            <Loader />
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads?.map((lead) => (
                    <tr
                      key={lead.name}
                      onClick={() => navigate(`/leads/${lead.name}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 600 }}>{truncateText(lead.lead_name, 30)}</td>
                      <td>
                        <span className={`badge badge-dot badge-${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatDate(lead.creation)}</td>
                    </tr>
                  ))}
                  {(!recentLeads || recentLeads.length === 0) && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                        No leads yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Projects</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          {projectsLoading ? (
            <Loader />
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects?.map((project) => (
                    <tr
                      key={project.name}
                      onClick={() => navigate(`/projects/${project.name}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 600 }}>{truncateText(project.project_name, 30)}</td>
                      <td>
                        <span className={`badge badge-dot badge-${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div
                              className="progress-fill"
                              style={{ width: `${project.percent_complete || 0}%` }}
                            />
                          </div>
                          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                            {Math.round(project.percent_complete || 0)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {formatDate(project.expected_end_date)}
                      </td>
                    </tr>
                  ))}
                  {(!recentProjects || recentProjects.length === 0) && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                        No projects yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Payments</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/payments')}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        {paymentsLoading ? (
          <Loader />
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment #</th>
                  <th>Party</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments?.map((payment) => (
                  <tr
                    key={payment.name}
                    onClick={() => navigate(`/payments/${payment.name}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>
                      {payment.name}
                    </td>
                    <td>{payment.party || '—'}</td>
                    <td>
                      <span className={`badge badge-${payment.payment_type === 'Receive' ? 'green' : 'blue'}`}>
                        {payment.payment_type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(payment.paid_amount)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(payment.posting_date)}</td>
                    <td>
                      <span className={`badge badge-dot badge-${payment.docstatus === 1 ? 'green' : payment.docstatus === 2 ? 'red' : 'gray'}`}>
                        {payment.docstatus === 1 ? 'Submitted' : payment.docstatus === 2 ? 'Cancelled' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!recentPayments || recentPayments.length === 0) && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                      No payments yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
