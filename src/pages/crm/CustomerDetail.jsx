import GenericDetail from '../../components/ui/GenericDetail'
import { Building2, MapPin, Globe } from 'lucide-react'
import Tabs from '../../components/ui/Tabs'
import ChildTable from '../../components/ui/ChildTable'

export default function CustomerDetail() {
  return (
    <GenericDetail
      doctype="Customer"
      basePath="/crm/customers"
      titleField="customer_name"
      statusField={null}
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

        const detailsTab = (
          <div className="card">
            <div className="detail-section">
              <h2>Customer Information</h2>
              {editing ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Customer Name</label>
                    <input className="form-input" value={form.customer_name || ''} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer Group</label>
                    <input className="form-input" value={form.customer_group || ''} onChange={(e) => setForm({ ...form, customer_group: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Territory</label>
                    <input className="form-input" value={form.territory || ''} onChange={(e) => setForm({ ...form, territory: e.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-field">
                    <div className="detail-field-label"><Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />Group</div>
                    <div className="detail-field-value">{doc.customer_group || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label"><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />Territory</div>
                    <div className="detail-field-value">{doc.territory || '—'}</div>
                  </div>
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

        return (
          <Tabs 
            tabs={[
              { id: 'details', label: 'Details', content: detailsTab },
              { id: 'addresses', label: 'Addresses', content: addressesTab },
              { id: 'contacts', label: 'Contacts', content: contactsTab },
            ]} 
          />
        )
      }}
    />
  )
}

