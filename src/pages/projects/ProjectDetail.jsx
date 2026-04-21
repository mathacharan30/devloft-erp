import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFrappeGetDoc, useFrappeGetDocList, useFrappeUpdateDoc, useFrappeCreateDoc } from 'frappe-react-sdk'
import { ArrowLeft, Save, Calendar, ClipboardList, Plus, CheckCircle2, Circle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import { formatDate, formatDateTime, getStatusColor } from '../../utils/formatters'
import { PROJECT_STATUSES, TASK_STATUSES } from '../../utils/constants'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskForm, setTaskForm] = useState({ subject: '', status: 'Open', start_date: '', end_date: '', is_milestone: 0 })
  const [activeTab, setActiveTab] = useState('overview')

  const { data: project, isLoading, mutate } = useFrappeGetDoc('Project', id)
  const { data: tasks, isLoading: tasksLoading, mutate: mutateTasks } = useFrappeGetDocList('Task', {
    fields: ['name', 'subject', 'status', 'start_date', 'end_date', 'is_milestone', 'priority', 'completed_on'],
    filters: [['project', '=', id]],
    orderBy: { field: 'creation', order: 'desc' },
    limit: 100,
  })

  const { updateDoc, loading: saving } = useFrappeUpdateDoc()
  const { createDoc, loading: creatingTask } = useFrappeCreateDoc()

  if (isLoading) return <Loader />

  if (!project) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">Project not found</h3>
        <button className="btn btn-secondary" onClick={() => navigate('/projects')}><ArrowLeft size={16} /> Back</button>
      </div>
    )
  }

  const startEdit = () => {
    setForm({
      project_name: project.project_name || '',
      status: project.status || 'Open',
      expected_start_date: project.expected_start_date || '',
      expected_end_date: project.expected_end_date || '',
      notes: project.notes || '',
    })
    setEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateDoc('Project', id, form)
      toast.success('Project updated!')
      setEditing(false)
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to update')
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    try {
      await createDoc('Task', { ...taskForm, project: id })
      toast.success('Task added!')
      setShowAddTask(false)
      setTaskForm({ subject: '', status: 'Open', start_date: '', end_date: '', is_milestone: 0 })
      mutateTasks()
    } catch (err) {
      toast.error(err?.message || 'Failed to add task')
    }
  }

  const tasksByStatus = {
    Open: tasks?.filter((t) => t.status === 'Open') || [],
    Working: tasks?.filter((t) => t.status === 'Working') || [],
    Completed: tasks?.filter((t) => t.status === 'Completed') || [],
    Other: tasks?.filter((t) => !['Open', 'Working', 'Completed'].includes(t.status)) || [],
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="detail-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')} style={{ marginBottom: 'var(--space-3)' }}>
            <ArrowLeft size={16} /> Back to Projects
          </button>
          <h1 className="detail-title">{project.project_name}</h1>
          <div className="detail-meta">
            <span className={`badge badge-dot badge-${getStatusColor(project.status)}`}>{project.status}</span>
            <span className="detail-meta-item"><Calendar size={14} /> {formatDate(project.expected_start_date)} → {formatDate(project.expected_end_date)}</span>
          </div>
        </div>
        <div className="page-header-actions">
          {editing ? (
            <>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save'}</button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setShowAddTask(true)}><Plus size={16} /> Add Task</button>
              <button className="btn btn-primary" onClick={startEdit}>Edit Project</button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontWeight: 600 }}>Overall Progress</span>
          <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{Math.round(project.percent_complete || 0)}%</span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${project.percent_complete || 0}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
          Tasks ({tasks?.length || 0})
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="detail-grid">
          <div className="card">
            <div className="detail-section">
              <h2>Project Details</h2>
              {editing ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Project Name</label>
                    <input className="form-input" value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input className="form-input" type="date" value={form.expected_start_date} onChange={(e) => setForm({ ...form, expected_start_date: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input className="form-input" type="date" value={form.expected_end_date} onChange={(e) => setForm({ ...form, expected_end_date: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} />
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-field"><div className="detail-field-label">Company</div><div className="detail-field-value">{project.company || '—'}</div></div>
                  <div className="detail-field"><div className="detail-field-label">Start Date</div><div className="detail-field-value">{formatDate(project.expected_start_date)}</div></div>
                  <div className="detail-field"><div className="detail-field-label">End Date</div><div className="detail-field-value">{formatDate(project.expected_end_date)}</div></div>
                  <div className="detail-field"><div className="detail-field-label">Last Modified</div><div className="detail-field-value">{formatDateTime(project.modified)}</div></div>
                  {project.notes && <div className="detail-field"><div className="detail-field-label">Notes</div><div className="detail-field-value" style={{ whiteSpace: 'pre-wrap' }}>{project.notes}</div></div>}
                </>
              )}
            </div>
          </div>

          {/* Quick Task Summary */}
          <div className="card">
            <div className="detail-section">
              <h2>Task Summary</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'rgba(79,140,255,0.06)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--accent-blue)' }}>{tasksByStatus.Open.length}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Open</div>
                </div>
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--warning)' }}>{tasksByStatus.Working.length}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Working</div>
                </div>
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--success)' }}>{tasksByStatus.Completed.length}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Completed</div>
                </div>
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>{tasks?.length || 0}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tasks Tab */
        <div>
          {tasksLoading ? <Loader /> : (
            <div className="kanban-board">
              {['Open', 'Working', 'Completed'].map((status) => (
                <div key={status} className="kanban-column">
                  <div className="kanban-column-header">
                    <span className="kanban-column-title" style={{ color: status === 'Open' ? 'var(--accent-blue)' : status === 'Working' ? 'var(--warning)' : 'var(--success)' }}>
                      {status === 'Open' ? <Circle size={14} style={{ display: 'inline', marginRight: 4 }} /> : status === 'Working' ? <Clock size={14} style={{ display: 'inline', marginRight: 4 }} /> : <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 4 }} />}
                      {status}
                    </span>
                    <span className="kanban-column-count">{tasksByStatus[status].length}</span>
                  </div>
                  {tasksByStatus[status].map((task) => (
                    <div key={task.name} className="kanban-card">
                      <div className="kanban-card-title">
                        {task.is_milestone ? '🏁 ' : ''}{task.subject}
                      </div>
                      <div className="kanban-card-meta">
                        {task.start_date && <span>{formatDate(task.start_date)}</span>}
                        {task.end_date && <span> → {formatDate(task.end_date)}</span>}
                      </div>
                    </div>
                  ))}
                  {tasksByStatus[status].length === 0 && (
                    <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>
                      No tasks
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Add Task"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAddTask} disabled={creatingTask || !taskForm.subject}>
            {creatingTask ? 'Adding...' : 'Add Task'}
          </button>
        </>}
      >
        <form onSubmit={handleAddTask}>
          <div className="form-group">
            <label className="form-label">Task Name *</label>
            <input className="form-input" placeholder="Design homepage mockup" value={taskForm.subject} onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })} required id="task-form-name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" value={taskForm.start_date} onChange={(e) => setTaskForm({ ...taskForm, start_date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" value={taskForm.end_date} onChange={(e) => setTaskForm({ ...taskForm, end_date: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={taskForm.is_milestone} onChange={(e) => setTaskForm({ ...taskForm, is_milestone: e.target.checked ? 1 : 0 })} />
                Mark as Milestone
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
