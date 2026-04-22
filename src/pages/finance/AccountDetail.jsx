import GenericDetail from '../../components/ui/GenericDetail'
import { Landmark, Building2, FolderTree } from 'lucide-react'

export default function AccountDetail() {
  return (
    <GenericDetail
      doctype="Account"
      basePath="/finance/accounts"
      titleField="account_name"
      statusField={null}
      renderContent={(doc, editing, setForm, form) => (
        <div className="card">
          <div className="detail-section">
            <h2>Account Details</h2>
            {editing ? (
              <>
                <div className="form-group">
                  <label className="form-label">Account Name</label>
                  <input className="form-input" value={form.account_name || ''} onChange={(e) => setForm({ ...form, account_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Account</label>
                  <input className="form-input" value={form.parent_account || ''} onChange={(e) => setForm({ ...form, parent_account: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <input className="form-input" value={form.account_type || ''} onChange={(e) => setForm({ ...form, account_type: e.target.value })} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input type="checkbox" checked={form.is_group || false} onChange={(e) => setForm({ ...form, is_group: e.target.checked ? 1 : 0 })} />
                  <label className="form-label" style={{ marginBottom: 0 }}>Is Group (Folder)</label>
                </div>
              </>
            ) : (
              <>
                <div className="detail-field">
                  <div className="detail-field-label"><FolderTree size={12} style={{ display: 'inline', marginRight: 4 }} />Parent Account</div>
                  <div className="detail-field-value">{doc.parent_account || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label"><Landmark size={12} style={{ display: 'inline', marginRight: 4 }} />Account Type</div>
                  <div className="detail-field-value">{doc.account_type || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label"><Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />Company</div>
                  <div className="detail-field-value">{doc.company || '—'}</div>
                </div>
                <div className="detail-field">
                  <div className="detail-field-label">Structure Type</div>
                  <div className="detail-field-value">
                    <span className={`badge badge-${doc.is_group ? 'info' : 'secondary'}`}>
                      {doc.is_group ? 'Group (Contains other accounts)' : 'Ledger (Can hold transactions)'}
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
