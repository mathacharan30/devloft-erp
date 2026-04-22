import { AlertCircle } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText } from '../../utils/formatters'

export default function IssueList() {
  return (
    <GenericList
      doctype="Issue"
      title="Issues"
      subtitle="Track support tickets and project issues"
      icon={AlertCircle}
      basePath="/projects/issues"
      fields={['subject', 'status', 'priority', 'customer']}
      statusOptions={['Open', 'Replied', 'Resolved', 'Closed']}
      columns={[
        { label: 'Issue', key: 'name' },
        { label: 'Subject', key: 'subject', format: (val) => truncateText(val, 40) },
        { label: 'Customer', key: 'customer', format: (val) => truncateText(val, 30) },
        { label: 'Priority', key: 'priority', format: (val) => <span style={{ color: val === 'High' ? 'var(--danger)' : val === 'Medium' ? 'var(--warning)' : 'inherit'}}>{val}</span> },
        { label: 'Status', key: 'status', format: (val) => <span className={`badge badge-dot badge-${val === 'Resolved' || val === 'Closed' ? 'success' : 'warning'}`}>{val}</span> },
      ]}
      onCreate={() => alert('Create Issue Modal TBD')}
    />
  )
}
