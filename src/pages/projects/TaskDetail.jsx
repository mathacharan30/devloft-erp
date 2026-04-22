import GenericDetail from '../../components/ui/GenericDetail'
import { CheckSquare, FolderKanban, Calendar } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import Tabs from '../../components/ui/Tabs'
import ChildTable from '../../components/ui/ChildTable'

export default function TaskDetail() {
  return (
    <GenericDetail
      doctype="Task"
      basePath="/projects/tasks"
      titleField="subject"
      renderContent={(doc, editing, setForm, form) => {
        
        const handleTimeLogChange = (index, key, value) => {
          const newLogs = [...(form.time_logs || [])]
          newLogs[index] = { ...newLogs[index], [key]: value }
          setForm({ ...form, time_logs: newLogs })
        }
        const addTimeLog = () => setForm({ ...form, time_logs: [...(form.time_logs || []), {}] })
        const removeTimeLog = (index) => setForm({ ...form, time_logs: (form.time_logs || []).filter((_, i) => i !== index) })

        const detailsTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Task Details</h2>
              {editing ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-input" value={form.subject || ''} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project</label>
                    <input className="form-input" value={form.project || ''} onChange={(e) => setForm({ ...form, project: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status || 'Open'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {['Open', 'Working', 'Pending Review', 'Overdue', 'Completed', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-field">
                    <div className="detail-field-label"><FolderKanban size={12} style={{ display: 'inline', marginRight: 4 }} />Project</div>
                    <div className="detail-field-value">{doc.project || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Expected End Date</div>
                    <div className="detail-field-value">{formatDate(doc.exp_end_date)}</div>
                  </div>
                  {doc.description && (
                    <div className="detail-field" style={{ marginTop: 'var(--space-4)' }}>
                      <div className="detail-field-label">Description</div>
                      <div className="detail-field-value" style={{ whiteSpace: 'pre-wrap' }}>{doc.description}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )

        const timeLogsTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Time Logs</h2>
              <ChildTable 
                editing={editing}
                data={editing ? (form.time_logs || []) : (doc.time_logs || [])}
                columns={[
                  { key: 'activity_type', label: 'Activity Type' },
                  { key: 'from_time', label: 'From Time', type: 'datetime-local' },
                  { key: 'to_time', label: 'To Time', type: 'datetime-local' },
                  { key: 'hours', label: 'Hours', type: 'number' },
                  { key: 'employee', label: 'Employee' }
                ]}
                onChange={handleTimeLogChange}
                onAdd={addTimeLog}
                onRemove={removeTimeLog}
              />
            </div>
          </div>
        )

        return (
          <Tabs 
            tabs={[
              { id: 'details', label: 'Details', content: detailsTab },
              { id: 'timelogs', label: 'Time Logs', content: timeLogsTab },
            ]} 
          />
        )
      }}
    />
  )
}

