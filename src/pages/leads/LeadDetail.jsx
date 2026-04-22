import GenericDetail from '../../components/ui/GenericDetail'
import { Mail, Phone, Building2 } from 'lucide-react'
import { LEAD_STATUSES } from '../../utils/constants'
import Tabs from '../../components/ui/Tabs'
import ChildTable from '../../components/ui/ChildTable'

export default function LeadDetail() {
  return (
    <GenericDetail
      doctype="Lead"
      basePath="/leads"
      titleField="lead_name"
      statusField="status"
      renderContent={(doc, editing, setForm, form) => {
        
        const handleAddressChange = (index, key, value) => {
          const newAddresses = [...(form.addresses || [])]
          newAddresses[index] = { ...newAddresses[index], [key]: value }
          setForm({ ...form, addresses: newAddresses })
        }
        const addAddress = () => setForm({ ...form, addresses: [...(form.addresses || []), {}] })
        const removeAddress = (index) => setForm({ ...form, addresses: (form.addresses || []).filter((_, i) => i !== index) })

        const handleContactChange = (index, key, value) => {
          const newContacts = [...(form.contacts || [])]
          newContacts[index] = { ...newContacts[index], [key]: value }
          setForm({ ...form, contacts: newContacts })
        }
        const addContact = () => setForm({ ...form, contacts: [...(form.contacts || []), {}] })
        const removeContact = (index) => setForm({ ...form, contacts: (form.contacts || []).filter((_, i) => i !== index) })

        const handleActivityChange = (index, key, value) => {
          const newLogs = [...(form.activity_logs || [])]
          newLogs[index] = { ...newLogs[index], [key]: value }
          setForm({ ...form, activity_logs: newLogs })
        }
        const addActivity = () => setForm({ ...form, activity_logs: [...(form.activity_logs || []), { date: new Date().toISOString().split('T')[0] }] })
        const removeActivity = (index) => setForm({ ...form, activity_logs: (form.activity_logs || []).filter((_, i) => i !== index) })

        const detailsTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Contact Information</h2>
              {editing ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Lead Name</label>
                    <input className="form-input" value={form.lead_name || ''} onChange={(e) => setForm({ ...form, lead_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={form.email_id || ''} onChange={(e) => setForm({ ...form, email_id: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input className="form-input" value={form.company_name || ''} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status || 'Lead'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} />
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-field">
                    <div className="detail-field-label"><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />Email</div>
                    <div className="detail-field-value">{doc.email_id || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />Phone</div>
                    <div className="detail-field-value">{doc.phone || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />Company</div>
                    <div className="detail-field-value">{doc.company_name || '—'}</div>
                  </div>
                  {doc.notes && (
                    <div className="detail-field" style={{ marginTop: 'var(--space-4)' }}>
                      <div className="detail-field-label">Notes</div>
                      <div className="detail-field-value" style={{ whiteSpace: 'pre-wrap' }}>{doc.notes}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )

        const addressesTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Addresses</h2>
              <ChildTable 
                editing={editing}
                data={editing ? (form.addresses || []) : (doc.addresses || [])}
                columns={[
                  { key: 'address_title', label: 'Title' },
                  { key: 'address_type', label: 'Type' },
                  { key: 'city', label: 'City' },
                  { key: 'country', label: 'Country' }
                ]}
                onChange={handleAddressChange}
                onAdd={addAddress}
                onRemove={removeAddress}
              />
            </div>
          </div>
        )

        const contactsTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Contacts</h2>
              <ChildTable 
                editing={editing}
                data={editing ? (form.contacts || []) : (doc.contacts || [])}
                columns={[
                  { key: 'first_name', label: 'First Name' },
                  { key: 'last_name', label: 'Last Name' },
                  { key: 'email_id', label: 'Email', type: 'email' },
                  { key: 'phone', label: 'Phone' }
                ]}
                onChange={handleContactChange}
                onAdd={addContact}
                onRemove={removeContact}
              />
            </div>
          </div>
        )

        const activityLogTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Activity Log</h2>
              <ChildTable 
                editing={editing}
                data={editing ? (form.activity_logs || []) : (doc.activity_logs || [])}
                columns={[
                  { key: 'date', label: 'Date', type: 'date' },
                  { key: 'activity_type', label: 'Activity Type' },
                  { key: 'subject', label: 'Subject' },
                  { key: 'status', label: 'Status' }
                ]}
                onChange={handleActivityChange}
                onAdd={addActivity}
                onRemove={removeActivity}
              />
            </div>
          </div>
        )

        return (
          <Tabs 
            tabs={[
              { id: 'details', label: 'Details', content: detailsTab },
              { id: 'addresses', label: 'Addresses', content: addressesTab },
              { id: 'contacts', label: 'Contacts', content: contactsTab },
              { id: 'activity', label: 'Activity Log', content: activityLogTab },
            ]} 
          />
        )
      }}
    />
  )
}

