import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeDeleteDoc } from 'frappe-react-sdk'
import { Plus, Users, Search, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, getStatusColor, truncateText } from '../../utils/formatters'
import { LEAD_STATUSES, LEAD_SOURCES, PAGE_SIZE } from '../../utils/constants'

export default function LeadList() {
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  // Form state
  const [form, setForm] = useState({
    lead_name: '', email_id: '', phone: '', company_name: '',
    source: '', status: 'Lead', notes: '',
  })

  const filters = []
  if (statusFilter) filters.push(['status', '=', statusFilter])
  if (searchTerm) filters.push(['lead_name', 'like', `%${searchTerm}%`])

  const { data: leads, isLoading, mutate } = useFrappeGetDocList('Lead', {
    fields: ['name', 'lead_name', 'email_id', 'phone', 'status', 'company_name', 'owner', 'creation'],
    filters: filters.length > 0 ? filters : undefined,
    orderBy: { field: 'creation', order: 'desc' },
    limit: PAGE_SIZE,
    start: page * PAGE_SIZE,
  })

  const { createDoc, loading: creating } = useFrappeCreateDoc()
  const { deleteDoc } = useFrappeDeleteDoc()

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createDoc('Lead', {
        lead_name: form.lead_name,
        email_id: form.email_id,
        phone: form.phone,
        company_name: form.company_name,
        status: form.status,
        notes: form.notes,
      })
      toast.success('Lead created successfully!')
      setShowCreate(false)
      setForm({ lead_name: '', email_id: '', phone: '', company_name: '', source: '', status: 'Lead', notes: '' })
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to create lead')
    }
  }

  const handleDelete = async (e, name) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this lead?')) return
    try {
      await deleteDoc('Lead', name)
      toast.success('Lead deleted')
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to delete lead')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Leads</h1>
          <p>Manage and track your sales leads</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreate(true)} id="create-lead-btn">
            <Plus size={18} /> New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            style={{ paddingLeft: 36, minWidth: 220 }}
            id="lead-search"
          />
        </div>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          id="lead-status-filter"
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <Loader />
        ) : !leads || leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No leads found"
            description="Create your first lead or adjust your filters"
            action={
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                <Plus size={18} /> Create Lead
              </button>
            }
          />
        ) : (
          <>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.name}
                      onClick={() => navigate(`/leads/${lead.name}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ fontWeight: 600 }}>{truncateText(lead.lead_name, 30)}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{lead.email_id || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{lead.phone || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{lead.company_name || '—'}</td>
                      <td>
                        <span className={`badge badge-dot badge-${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatDate(lead.creation)}</td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={(e) => { e.stopPropagation(); navigate(`/leads/${lead.name}`); }}
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={(e) => handleDelete(e, lead.name)}
                            title="Delete"
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <span className="pagination-info">
                Showing {page * PAGE_SIZE + 1}—{page * PAGE_SIZE + leads.length} results
              </span>
              <div className="pagination-controls">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={leads.length < PAGE_SIZE}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create New Lead"
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={creating || !form.lead_name}>
              {creating ? 'Creating...' : 'Create Lead'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Lead Name *</label>
              <input
                className="form-input"
                placeholder="John Doe"
                value={form.lead_name}
                onChange={(e) => setForm({ ...form, lead_name: e.target.value })}
                required
                id="lead-form-name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="john@company.com"
                value={form.email_id}
                onChange={(e) => setForm({ ...form, email_id: e.target.value })}
                id="lead-form-email"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                id="lead-form-phone"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input
                className="form-input"
                placeholder="Acme Corp"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                id="lead-form-company"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                id="lead-form-status"
              >
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Additional notes about this lead..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              id="lead-form-notes"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
