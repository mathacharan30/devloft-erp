import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFrappeGetDoc, useFrappeUpdateDoc } from 'frappe-react-sdk'
import { ArrowLeft, Save, Mail, Phone, Building2, Calendar, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Loader from '../../components/ui/Loader'
import { formatDate, formatDateTime, getStatusColor } from '../../utils/formatters'
import { LEAD_STATUSES, LEAD_SOURCES } from '../../utils/constants'

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)

  const { data, isLoading, mutate } = useFrappeGetDoc('Lead', id)
  const { updateDoc, loading: saving } = useFrappeUpdateDoc()

  const lead = data

  if (isLoading) return <Loader />

  if (!lead) {
    return (
      <div className="empty-state">
        <h3 className="empty-state-title">Lead not found</h3>
        <button className="btn btn-secondary" onClick={() => navigate('/leads')}>
          <ArrowLeft size={16} /> Back to Leads
        </button>
      </div>
    )
  }

  const startEdit = () => {
    setForm({
      lead_name: lead.lead_name || '',
      email_id: lead.email_id || '',
      phone: lead.phone || '',
      company_name: lead.company_name || '',
      company_name: lead.company_name || '',
      status: lead.status || 'Lead',
      notes: lead.notes || '',
    })
    setEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateDoc('Lead', id, form)
      toast.success('Lead updated successfully!')
      setEditing(false)
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to update lead')
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="detail-header">
        <div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/leads')}
            style={{ marginBottom: 'var(--space-3)' }}
          >
            <ArrowLeft size={16} /> Back to Leads
          </button>
          <h1 className="detail-title">{lead.lead_name}</h1>
          <div className="detail-meta">
            <span className={`badge badge-dot badge-${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
            <span className="detail-meta-item">
              <Calendar size={14} /> Created {formatDate(lead.creation)}
            </span>
            <span className="detail-meta-item">
              <User size={14} /> {lead.owner}
            </span>
          </div>
        </div>
        <div className="page-header-actions">
          {editing ? (
            <>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={startEdit}>Edit Lead</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="detail-grid">
        <div className="card">
          <div className="detail-section">
            <h2>Contact Information</h2>
            {editing ? (
              <>
                <div className="form-group">
                  <label className="form-label">Lead Name</label>
                  <input className="form-input" value={form.lead_name} onChange={(e) => setForm({ ...form, lead_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email_id} onChange={(e) => setForm({ ...form, email_id: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                </div>
              </>
            ) : (
              <>
                <div className="detail-field">
                  <div className="detail-field-label"><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />Email</div>
                  <div className="detail-field-value">{lead.email_id || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label"><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />Phone</div>
                  <div className="detail-field-value">{lead.phone || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label"><Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />Company</div>
                  <div className="detail-field-value">{lead.company_name || '—'}</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="detail-section">
            <h2>Lead Details</h2>
            {editing ? (
              <>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} />
                </div>
              </>
            ) : (
              <>

                <div className="detail-field">
                  <div className="detail-field-label">Lead Owner</div>
                  <div className="detail-field-value">{lead.lead_owner || lead.owner || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label">Last Modified</div>
                  <div className="detail-field-value">{formatDateTime(lead.modified)}</div>
                </div>
                {lead.notes && (
                  <div className="detail-field">
                    <div className="detail-field-label">Notes</div>
                    <div className="detail-field-value" style={{ whiteSpace: 'pre-wrap' }}>{lead.notes}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
