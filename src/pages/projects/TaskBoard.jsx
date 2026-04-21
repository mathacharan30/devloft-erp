import { useParams, useNavigate } from 'react-router-dom'
import { useFrappeGetDocList, useFrappeUpdateDoc } from 'frappe-react-sdk'
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Loader from '../../components/ui/Loader'
import { formatDate } from '../../utils/formatters'

export default function TaskBoard() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: tasks, isLoading, mutate } = useFrappeGetDocList('Task', {
    fields: ['name', 'subject', 'status', 'start_date', 'end_date', 'is_milestone', 'priority'],
    filters: [['project', '=', id]],
    orderBy: { field: 'creation', order: 'desc' },
    limit: 200,
  })

  const { updateDoc } = useFrappeUpdateDoc()

  const statusColumns = ['Open', 'Working', 'Completed']

  const moveTask = async (taskName, newStatus) => {
    try {
      await updateDoc('Task', taskName, { status: newStatus })
      toast.success(`Task moved to ${newStatus}`)
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to update task')
    }
  }

  if (isLoading) return <Loader />

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/projects/${id}`)} style={{ marginBottom: 'var(--space-2)' }}>
            <ArrowLeft size={16} /> Back to Project
          </button>
          <h1>Task Board</h1>
        </div>
      </div>

      <div className="kanban-board">
        {statusColumns.map((status) => {
          const columnTasks = tasks?.filter((t) => t.status === status) || []
          const StatusIcon = status === 'Open' ? Circle : status === 'Working' ? Clock : CheckCircle2
          const color = status === 'Open' ? 'var(--accent-blue)' : status === 'Working' ? 'var(--warning)' : 'var(--success)'

          return (
            <div key={status} className="kanban-column">
              <div className="kanban-column-header">
                <span className="kanban-column-title" style={{ color, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StatusIcon size={14} /> {status}
                </span>
                <span className="kanban-column-count">{columnTasks.length}</span>
              </div>

              {columnTasks.map((task) => (
                <div key={task.name} className="kanban-card">
                  <div className="kanban-card-title">
                    {task.is_milestone ? '🏁 ' : ''}{task.subject}
                  </div>
                  <div className="kanban-card-meta" style={{ marginBottom: 'var(--space-2)' }}>
                    {task.start_date && <span>{formatDate(task.start_date)}</span>}
                    {task.end_date && <span> → {formatDate(task.end_date)}</span>}
                  </div>
                  <div className="flex gap-1">
                    {statusColumns
                      .filter((s) => s !== status)
                      .map((s) => (
                        <button
                          key={s}
                          className="btn btn-ghost btn-sm"
                          onClick={() => moveTask(task.name, s)}
                          style={{ fontSize: 'var(--font-xs)', padding: '2px 8px', height: 'auto' }}
                        >
                          → {s}
                        </button>
                      ))}
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>
                  No tasks here
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
