import GenericDetail from '../../components/ui/GenericDetail'
import { Building2, DollarSign, Calendar, Truck } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import Tabs from '../../components/ui/Tabs'
import ChildTable from '../../components/ui/ChildTable'

export default function SalesOrderDetail() {
  return (
    <GenericDetail
      doctype="Sales Order"
      basePath="/sales/orders"
      renderContent={(doc, editing, setForm, form) => {
        
        const handleTaxChange = (index, key, value) => {
          const newTaxes = [...(form.taxes || [])]
          newTaxes[index] = { ...newTaxes[index], [key]: value }
          setForm({ ...form, taxes: newTaxes })
        }
        const addTax = () => setForm({ ...form, taxes: [...(form.taxes || []), {}] })
        const removeTax = (index) => setForm({ ...form, taxes: (form.taxes || []).filter((_, i) => i !== index) })

        const handleCommChange = (index, key, value) => {
          const newComms = [...(form.communications || [])]
          newComms[index] = { ...newComms[index], [key]: value }
          setForm({ ...form, communications: newComms })
        }
        const addComm = () => setForm({ ...form, communications: [...(form.communications || []), {}] })
        const removeComm = (index) => setForm({ ...form, communications: (form.communications || []).filter((_, i) => i !== index) })

        const detailsTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Order Details</h2>
              {editing ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Customer</label>
                    <input className="form-input" value={form.customer || ''} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" value={form.transaction_date || ''} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Date</label>
                    <input type="date" className="form-input" value={form.delivery_date || ''} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-field">
                    <div className="detail-field-label"><Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />Customer</div>
                    <div className="detail-field-value">{doc.customer || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Order Date</div>
                    <div className="detail-field-value">{formatDate(doc.transaction_date)}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><Truck size={12} style={{ display: 'inline', marginRight: 4 }} />Delivery Date</div>
                    <div className="detail-field-value">{formatDate(doc.delivery_date)}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><DollarSign size={12} style={{ display: 'inline', marginRight: 4 }} />Total Amount</div>
                    <div className="detail-field-value">{doc.grand_total || 0}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

        const taxesTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Sales Taxes and Charges</h2>
              <ChildTable 
                editing={editing}
                data={editing ? (form.taxes || []) : (doc.taxes || [])}
                columns={[
                  { key: 'charge_type', label: 'Type' },
                  { key: 'account_head', label: 'Account Head' },
                  { key: 'rate', label: 'Rate' },
                  { key: 'tax_amount', label: 'Amount' }
                ]}
                onChange={handleTaxChange}
                onAdd={addTax}
                onRemove={removeTax}
              />
            </div>
          </div>
        )

        const commsTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Communications</h2>
              <ChildTable 
                editing={editing}
                data={editing ? (form.communications || []) : (doc.communications || [])}
                columns={[
                  { key: 'communication_date', label: 'Date', type: 'date' },
                  { key: 'communication_medium', label: 'Medium' },
                  { key: 'subject', label: 'Subject' },
                  { key: 'sender', label: 'Sender' }
                ]}
                onChange={handleCommChange}
                onAdd={addComm}
                onRemove={removeComm}
              />
            </div>
          </div>
        )

        return (
          <Tabs 
            tabs={[
              { id: 'details', label: 'Details', content: detailsTab },
              { id: 'taxes', label: 'Taxes & Charges', content: taxesTab },
              { id: 'communications', label: 'Communications', content: commsTab },
            ]} 
          />
        )
      }}
    />
  )
}

