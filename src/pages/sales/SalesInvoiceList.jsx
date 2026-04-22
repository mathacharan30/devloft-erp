import { FileText } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText, formatCurrency, formatDate } from '../../utils/formatters'

export default function SalesInvoiceList() {
  return (
    <GenericList
      doctype="Sales Invoice"
      title="Sales Invoices"
      subtitle="Manage billing and receivables"
      icon={FileText}
      basePath="/sales/invoices"
      fields={['customer', 'status', 'grand_total', 'posting_date']}
      statusOptions={['Draft', 'Return', 'Unpaid', 'Paid', 'Partly Paid', 'Overdue', 'Cancelled']}
      columns={[
        { label: 'Invoice', key: 'name' },
        { label: 'Customer', key: 'customer', format: (val) => truncateText(val, 30) },
        { label: 'Date', key: 'posting_date', format: (val) => formatDate(val) },
        { label: 'Amount', key: 'grand_total', format: (val) => formatCurrency(val) },
        { label: 'Status', key: 'status', format: (val) => <span className={`badge badge-dot badge-${val === 'Paid' ? 'success' : ['Overdue', 'Cancelled'].includes(val) ? 'danger' : ['Unpaid', 'Partly Paid'].includes(val) ? 'warning' : 'info'}`}>{val}</span> },
      ]}
      onCreate={() => alert('Create Sales Invoice Modal TBD')}
    />
  )
}
