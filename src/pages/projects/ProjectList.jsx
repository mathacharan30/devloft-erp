import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeDeleteDoc } from 'frappe-react-sdk'
import { Plus, FolderKanban, Trash2, Eye, Calendar, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, getStatusColor } from '../../utils/formatters'
import { PROJECT_STATUSES, PAGE_SIZE } from '../../utils/constants'

export default function ProjectList() {
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'

  const [form, setForm] = useState({
    project_name: '', status: 'Open', expected_start_date: '', expected_end_date: '',
    company: '', notes: '',
  })

  const filters = []
  if (statusFilter) filters.push(['status', '=', statusFilter])
  if (searchTerm) filters.push(['project_name', 'like', `%${searchTerm}%`])

  const { data: projects, isLoading, mutate } = useFrappeGetDocList('Project', {
    fields: ['name', 'project_name', 'status', 'percent_complete', 'expected_start_date', 'expected_end_date', 'company', 'creation'],
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
      await createDoc('Project', {
        project_name: form.project_name,
        status: form.status,
        expected_start_date: form.expected_start_date || undefined,
        expected_end_date: form.expected_end_date || undefined,
        company: form.company || undefined,
        notes: form.notes || undefined,
      })
      toast.success('Project created successfully!')
      setShowCreate(false)
      setForm({ project_name: '', status: 'Open', expected_start_date: '', expected_end_date: '', company: '', notes: '' })
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to create project')
    }
  }

  const handleDelete = async (e, name) => {
    e.stopPropagation()
    if (!confirm('Delete this project?')) return
    try {
      await deleteDoc('Project', name)
      toast.success('Project deleted')
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to delete project')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Projects</h1>
          <p>Manage all your projects and track progress</p>
        </div>
        <div className="page-header-actions">
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('cards')}
              style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}
            >
              Cards
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('table')}
              style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
            >
              Table
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)} id="create-project-btn">
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" className="form-input" placeholder="Search projects..."
            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            style={{ paddingLeft: 36, minWidth: 220 }} id="project-search"
          />
        </div>
        <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} id="project-status-filter">
          <option value="">All Statuses</option>
          {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <Loader />
      ) : !projects || projects.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FolderKanban}
            title="No projects found"
            description="Create your first project to get started"
            action={
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                <Plus size={18} /> Create Project
              </button>
            }
          />
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }} className="stagger-children">
          {projects.map((project) => (
            <div
              key={project.name}
              className="card"
              onClick={() => navigate(`/projects/${project.name}`)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>{project.project_name}</h3>
                  <span className={`badge badge-dot badge-${getStatusColor(project.status)}`}>{project.status}</span>
                </div>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => handleDelete(e, project.name)} title="Delete" style={{ color: 'var(--danger)' }}>
                  <Trash2 size={15} />
                </button>
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 600 }}>{Math.round(project.percent_complete || 0)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${project.percent_complete || 0}%` }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} /> {formatDate(project.expected_start_date)}
                </span>
                <span>→ {formatDate(project.expected_end_date)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.name} onClick={() => navigate(`/projects/${project.name}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 600 }}>{project.project_name}</td>
                    <td><span className={`badge badge-dot badge-${getStatusColor(project.status)}`}>{project.status}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${project.percent_complete || 0}%` }} />
                        </div>
                        <span style={{ fontSize: 'var(--font-xs)' }}>{Math.round(project.percent_complete || 0)}%</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(project.expected_start_date)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(project.expected_end_date)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.name}`); }}><Eye size={15} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => handleDelete(e, project.name)} style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {projects && projects.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">Showing {page * PAGE_SIZE + 1}—{page * PAGE_SIZE + projects.length}</span>
          <div className="pagination-controls">
            <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <button className="btn btn-secondary btn-sm" disabled={projects.length < PAGE_SIZE} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={creating || !form.project_name}>
            {creating ? 'Creating...' : 'Create Project'}
          </button>
        </>}
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" placeholder="Website Redesign" value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} required id="project-form-name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" value={form.expected_start_date} onChange={(e) => setForm({ ...form, expected_start_date: e.target.value })} id="project-form-start" />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" value={form.expected_end_date} onChange={(e) => setForm({ ...form, expected_end_date: e.target.value })} id="project-form-end" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} id="project-form-status">
                {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" placeholder="DevLoft" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} id="project-form-company" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" placeholder="Project description..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} id="project-form-notes" />
          </div>
        </form>
      </Modal>
    </div>
  )
}
