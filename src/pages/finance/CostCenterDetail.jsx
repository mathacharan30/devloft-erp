import GenericDetail from '../../components/ui/GenericDetail'
import { Building, Building2, FolderTree } from 'lucide-react'

export default function CostCenterDetail() {
  return (
    <GenericDetail
      doctype="Cost Center"
      basePath="/finance/cost-centers"
      titleField="cost_center_name"
      statusField={null}
      renderContent={(doc, editing, setForm, form) => (
        <div className="card">
          <div className="detail-section">
            <h2>Cost Center Details</h2>
            {editing ? (
              <>
                <div className="form-group">
                  <label className="form-label">Cost Center Name</label>
                  <input className="form-input" value={form.cost_center_name || ''} onChange={(e) => setForm({ ...form, cost_center_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Cost Center</label>
                  <input className="form-input" value={form.parent_cost_center || ''} onChange={(e) => setForm({ ...form, parent_cost_center: e.target.value })} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input type="checkbox" checked={form.is_group || false} onChange={(e) => setForm({ ...form, is_group: e.target.checked ? 1 : 0 })} />
                  <label className="form-label" style={{ marginBottom: 0 }}>Is Group (Folder)</label>
                </div>
              </>
            ) : (
              <>
                <div className="detail-field">
                  <div className="detail-field-label"><FolderTree size={12} style={{ display: 'inline', marginRight: 4 }} />Parent Cost Center</div>
                  <div className="detail-field-value">{doc.parent_cost_center || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label"><Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />Company</div>
                  <div className="detail-field-value">{doc.company || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label">Structure Type</div>
                  <div className="detail-field-value">
                    <span className={`badge badge-${doc.is_group ? 'info' : 'secondary'}`}>
                      {doc.is_group ? 'Group (Contains other cost centers)' : 'Node (Can be tagged in transactions)'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    />
  )
}
