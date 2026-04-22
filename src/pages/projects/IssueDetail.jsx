import GenericDetail from '../../components/ui/GenericDetail'
import { AlertCircle, Building2, AlignLeft } from 'lucide-react'

export default function IssueDetail() {
  return (
    <GenericDetail
      doctype="Issue"
      basePath="/projects/issues"
      titleField="subject"
      renderContent={(doc, editing, setForm, form) => (
        <div className="card">
          <div className="detail-section">
            <h2>Issue Details</h2>
            {editing ? (
              <>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" value={form.subject || ''} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Customer</label>
                  <input className="form-input" value={form.customer || ''} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority || 'Medium'} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {['Low', 'Medium', 'High'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} />
                </div>
              </>
            ) : (
              <>
                <div className="detail-field">
                  <div className="detail-field-label"><Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />Customer</div>
                  <div className="detail-field-value">{doc.customer || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label"><AlertCircle size={12} style={{ display: 'inline', marginRight: 4 }} />Priority</div>
                  <div className="detail-field-value">{doc.priority || '—'}</div>
                </div>
                {doc.description && (
                  <div className="detail-field" style={{ marginTop: 'var(--space-4)' }}>
                    <div className="detail-field-label"><AlignLeft size={12} style={{ display: 'inline', marginRight: 4 }} />Description</div>
                    <div className="detail-field-value" style={{ whiteSpace: 'pre-wrap', background: 'var(--surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                      {doc.description}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    />
  )
}
