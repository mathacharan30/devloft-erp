import GenericDetail from '../../components/ui/GenericDetail'
import { FileSpreadsheet, Calendar, DollarSign, AlignLeft } from 'lucide-react'
import { formatDate, formatCurrency } from '../../utils/formatters'

export default function JournalEntryDetail() {
  return (
    <GenericDetail
      doctype="Journal Entry"
      basePath="/finance/journal-entries"
      statusField="docstatus"
      renderContent={(doc, editing, setForm, form) => {
        // Child table state
        const accounts = editing ? (form.accounts || []) : (doc.accounts || [])

        return (
          <div className="card">
            <div className="detail-section">
              <h2>Journal Entry Details</h2>
              {editing ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Posting Date</label>
                    <input type="date" className="form-input" value={form.posting_date || ''} onChange={(e) => setForm({ ...form, posting_date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Voucher Type</label>
                    <input className="form-input" value={form.voucher_type || ''} onChange={(e) => setForm({ ...form, voucher_type: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fiscal Year</label>
                    <input className="form-input" value={form.fiscal_year || ''} onChange={(e) => setForm({ ...form, fiscal_year: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">User Remark</label>
                    <textarea className="form-textarea" value={form.user_remark || ''} onChange={(e) => setForm({ ...form, user_remark: e.target.value })} rows={2} />
                  </div>
                  {/* Basic Child Table Edit support */}
                  <div className="form-group" style={{ marginTop: 'var(--space-6)' }}>
                    <label className="form-label">Accounts (Debit / Credit)</label>
                    <div style={{ background: 'var(--surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>* Full inline child table editing will be implemented in a dedicated table component. View only for now.</p>
                      <table className="data-table" style={{ marginTop: 'var(--space-3)' }}>
                        <thead><tr><th>Account</th><th>Party</th><th>Debit</th><th>Credit</th></tr></thead>
                        <tbody>
                          {accounts.map((acc, i) => (
                            <tr key={acc.name || i}>
                              <td>{acc.account}</td>
                              <td>{acc.party || '-'}</td>
                              <td>{acc.debit_in_account_currency}</td>
                              <td>{acc.credit_in_account_currency}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-field">
                    <div className="detail-field-label"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Posting Date</div>
                    <div className="detail-field-value">{formatDate(doc.posting_date)}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><FileSpreadsheet size={12} style={{ display: 'inline', marginRight: 4 }} />Voucher Type</div>
                    <div className="detail-field-value">{doc.voucher_type || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">Fiscal Year</div>
                    <div className="detail-field-value">{doc.fiscal_year || '—'}</div>
                  </div>
                  {doc.user_remark && (
                    <div className="detail-field">
                      <div className="detail-field-label"><AlignLeft size={12} style={{ display: 'inline', marginRight: 4 }} />User Remark</div>
                      <div className="detail-field-value" style={{ whiteSpace: 'pre-wrap' }}>{doc.user_remark}</div>
                    </div>
                  )}

                  {/* Child Table Display */}
                  <div className="detail-section" style={{ marginTop: 'var(--space-8)' }}>
                    <h3>Accounting Entries</h3>
                    <div className="data-table-container" style={{ marginTop: 'var(--space-4)', border: '1px solid var(--surface-border)' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Account</th>
                            <th>Party</th>
                            <th style={{ textAlign: 'right' }}>Debit</th>
                            <th style={{ textAlign: 'right' }}>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accounts.length > 0 ? accounts.map(acc => (
                            <tr key={acc.name}>
                              <td style={{ fontWeight: 500 }}>{acc.account}</td>
                              <td style={{ color: 'var(--text-secondary)' }}>{acc.party || '-'}</td>
                              <td style={{ textAlign: 'right', color: acc.debit_in_account_currency > 0 ? 'var(--success)' : 'inherit' }}>{formatCurrency(acc.debit_in_account_currency)}</td>
                              <td style={{ textAlign: 'right', color: acc.credit_in_account_currency > 0 ? 'var(--danger)' : 'inherit' }}>{formatCurrency(acc.credit_in_account_currency)}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No accounting entries found</td></tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: 'var(--surface-hover)', fontWeight: 600 }}>
                            <td colSpan="2" style={{ textAlign: 'right' }}>Totals:</td>
                            <td style={{ textAlign: 'right' }}>{formatCurrency(doc.total_debit)}</td>
                            <td style={{ textAlign: 'right' }}>{formatCurrency(doc.total_credit)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }}
    />
  )
}
