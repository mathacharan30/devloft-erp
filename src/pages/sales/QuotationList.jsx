import { FileText } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText, formatCurrency, formatDate } from '../../utils/formatters'

export default function QuotationList() {
  return (
    <GenericList
      doctype="Quotation"
      title="Quotations"
      subtitle="Manage quotes sent to customers"
      icon={FileText}
      basePath="/sales/quotations"
      fields={['party_name', 'status', 'grand_total', 'transaction_date']}
      statusOptions={['Draft', 'Open', 'Replied', 'Partially Ordered', 'Ordered', 'Lost', 'Cancelled']}
      columns={[
        { label: 'Quotation', key: 'name' },
        { label: 'Customer', key: 'party_name', format: (val) => truncateText(val, 30) },
        { label: 'Date', key: 'transaction_date', format: (val) => formatDate(val) },
        { label: 'Amount', key: 'grand_total', format: (val) => formatCurrency(val) },
        { label: 'Status', key: 'status', format: (val) => <span className={`badge badge-dot badge-${['Ordered', 'Partially Ordered'].includes(val) ? 'success' : ['Lost', 'Cancelled'].includes(val) ? 'danger' : val === 'Draft' ? 'muted' : 'info'}`}>{val}</span> },
      ]}
      onCreate={() => alert('Create Quotation Modal TBD')}
    />
  )
}
