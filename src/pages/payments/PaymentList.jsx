import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFrappeGetDocList, useFrappeCreateDoc } from 'frappe-react-sdk'
import { Plus, CreditCard, Search, Eye, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import StatsCard from '../../components/charts/StatsCard'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { PAYMENT_TYPES, PARTY_TYPES, PAYMENT_MODES, PAGE_SIZE } from '../../utils/constants'

export default function PaymentList() {
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  const [form, setForm] = useState({
    payment_type: 'Receive',
    party_type: 'Customer',
    party: '',
    paid_amount: '',
    mode_of_payment: '',
    reference_no: '',
    reference_date: '',
    posting_date: new Date().toISOString().split('T')[0],
  })

  const filters = []
  if (typeFilter) filters.push(['payment_type', '=', typeFilter])
  if (searchTerm) filters.push(['party', 'like', `%${searchTerm}%`])

  const { data: payments, isLoading, mutate } = useFrappeGetDocList('Payment Entry', {
    fields: ['name', 'payment_type', 'party_type', 'party', 'paid_amount', 'received_amount', 'mode_of_payment', 'posting_date', 'docstatus', 'reference_no'],
    filters: filters.length > 0 ? filters : undefined,
    orderBy: { field: 'creation', order: 'desc' },
    limit: PAGE_SIZE,
    start: page * PAGE_SIZE,
  })

  // Stats
  const { data: allReceived } = useFrappeGetDocList('Payment Entry', {
    fields: ['sum(paid_amount) as total'],
    filters: [['payment_type', '=', 'Receive'], ['docstatus', '=', 1]],
    limit: 1,
  })
  const { data: allPaid } = useFrappeGetDocList('Payment Entry', {
    fields: ['sum(paid_amount) as total'],
    filters: [['payment_type', '=', 'Pay'], ['docstatus', '=', 1]],
    limit: 1,
  })
  const { data: drafts } = useFrappeGetDocList('Payment Entry', {
    fields: ['count(name) as total'],
    filters: [['docstatus', '=', 0]],
    limit: 1,
  })

  const totalReceived = allReceived?.[0]?.total || 0
  const totalPaid = allPaid?.[0]?.total || 0
  const draftCount = drafts?.[0]?.total || 0

  const { createDoc, loading: creating } = useFrappeCreateDoc()

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createDoc('Payment Entry', {
        payment_type: form.payment_type,
        party_type: form.party_type,
        party: form.party,
        paid_amount: parseFloat(form.paid_amount),
        received_amount: parseFloat(form.paid_amount),
        mode_of_payment: form.mode_of_payment || undefined,
        reference_no: form.reference_no || undefined,
        reference_date: form.reference_date || undefined,
        posting_date: form.posting_date,
      })
      toast.success('Payment entry created!')
      setShowCreate(false)
      setForm({
        payment_type: 'Receive', party_type: 'Customer', party: '', paid_amount: '',
        mode_of_payment: '', reference_no: '', reference_date: '',
        posting_date: new Date().toISOString().split('T')[0],
      })
      mutate()
    } catch (err) {
      toast.error(err?.message || 'Failed to create payment. Ensure required accounts are configured.')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Payments</h1>
          <p>Track and manage all payment entries</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreate(true)} id="create-payment-btn">
            <Plus size={18} /> New Payment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid stagger-children" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatsCard icon={ArrowDownLeft} label="Total Received" value={formatCurrency(totalReceived)} color="green" />
        <StatsCard icon={ArrowUpRight} label="Total Paid" value={formatCurrency(totalPaid)} color="red" />
        <StatsCard icon={CreditCard} label="Draft Entries" value={draftCount} color="orange" />
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" className="form-input" placeholder="Search by party..."
            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            style={{ paddingLeft: 36, minWidth: 220 }} id="payment-search"
          />
        </div>
        <select className="form-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }} id="payment-type-filter">
          <option value="">All Types</option>
          {PAYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <Loader />
        ) : !payments || payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments found"
            description="Record your first payment entry"
            action={
              <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={18} /> New Payment</button>
            }
          />
        ) : (
          <>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Type</th>
                    <th>Party</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.name} onClick={() => navigate(`/payments/${p.name}`)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>{p.name}</td>
                      <td>
                        <span className={`badge ${p.payment_type === 'Receive' ? 'badge-green' : p.payment_type === 'Pay' ? 'badge-red' : 'badge-blue'}`}>
                          {p.payment_type === 'Receive' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {p.payment_type}
                        </span>
                      </td>
                      <td>{p.party || '—'}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(p.paid_amount)}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.mode_of_payment || '—'}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatDate(p.posting_date)}</td>
                      <td>
                        <span className={`badge badge-dot badge-${p.docstatus === 1 ? 'green' : p.docstatus === 2 ? 'red' : 'gray'}`}>
                          {p.docstatus === 1 ? 'Submitted' : p.docstatus === 2 ? 'Cancelled' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/payments/${p.name}`); }}>
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span className="pagination-info">Showing {page * PAGE_SIZE + 1}—{page * PAGE_SIZE + payments.length}</span>
              <div className="pagination-controls">
                <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <button className="btn btn-secondary btn-sm" disabled={payments.length < PAGE_SIZE} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreate} onClose={() => setShowCreate(false)} title="Record Payment" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={creating || !form.party || !form.paid_amount}>
            {creating ? 'Creating...' : 'Create Payment'}
          </button>
        </>}
      >
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Type *</label>
              <select className="form-select" value={form.payment_type} onChange={(e) => setForm({ ...form, payment_type: e.target.value })} id="payment-form-type">
                {PAYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Party Type *</label>
              <select className="form-select" value={form.party_type} onChange={(e) => setForm({ ...form, party_type: e.target.value })} id="payment-form-party-type">
                {PARTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Party *</label>
              <input className="form-input" placeholder="Customer/Supplier name" value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} required id="payment-form-party" />
            </div>
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input className="form-input" type="number" step="0.01" placeholder="0.00" value={form.paid_amount} onChange={(e) => setForm({ ...form, paid_amount: e.target.value })} required id="payment-form-amount" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mode of Payment</label>
              <select className="form-select" value={form.mode_of_payment} onChange={(e) => setForm({ ...form, mode_of_payment: e.target.value })} id="payment-form-mode">
                <option value="">Select mode</option>
                {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Posting Date</label>
              <input className="form-input" type="date" value={form.posting_date} onChange={(e) => setForm({ ...form, posting_date: e.target.value })} id="payment-form-date" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reference No.</label>
              <input className="form-input" placeholder="TXN-12345" value={form.reference_no} onChange={(e) => setForm({ ...form, reference_no: e.target.value })} id="payment-form-ref" />
            </div>
            <div className="form-group">
              <label className="form-label">Reference Date</label>
              <input className="form-input" type="date" value={form.reference_date} onChange={(e) => setForm({ ...form, reference_date: e.target.value })} id="payment-form-ref-date" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
