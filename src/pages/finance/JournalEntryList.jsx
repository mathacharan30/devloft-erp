import { FileSpreadsheet } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText, formatCurrency, formatDate } from '../../utils/formatters'

export default function JournalEntryList() {
  return (
    <GenericList
      doctype="Journal Entry"
      title="Journal Entries"
      subtitle="Manage accounting journal entries"
      icon={FileSpreadsheet}
      basePath="/finance/journal-entries"
      fields={['posting_date', 'voucher_type', 'total_debit', 'total_credit', 'docstatus']}
      statusField="docstatus"
      statusOptions={['0', '1', '2']} // 0: Draft, 1: Submitted, 2: Cancelled in ERPNext
      columns={[
        { label: 'Entry ID', key: 'name' },
        { label: 'Posting Date', key: 'posting_date', format: (val) => formatDate(val) },
        { label: 'Voucher Type', key: 'voucher_type' },
        { label: 'Total Debit', key: 'total_debit', format: (val) => formatCurrency(val) },
        { label: 'Total Credit', key: 'total_credit', format: (val) => formatCurrency(val) },
        { 
          label: 'Status', 
          key: 'docstatus', 
          format: (val) => (
            <span className={`badge badge-dot badge-${val === 1 ? 'success' : val === 2 ? 'danger' : 'muted'}`}>
              {val === 1 ? 'Submitted' : val === 2 ? 'Cancelled' : 'Draft'}
            </span>
          ) 
        },
      ]}
      onCreate={() => alert('Create Journal Entry Modal TBD')}
    />
  )
}
