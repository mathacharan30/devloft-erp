import { CheckSquare } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText, formatDate } from '../../utils/formatters'

export default function TaskList() {
  return (
    <GenericList
      doctype="Task"
      title="Tasks"
      subtitle="Manage project tasks"
      icon={CheckSquare}
      basePath="/projects/tasks"
      fields={['subject', 'status', 'project', 'exp_start_date', 'exp_end_date']}
      statusOptions={['Open', 'Working', 'Pending Review', 'Overdue', 'Completed', 'Cancelled']}
      columns={[
        { label: 'Task', key: 'name' },
        { label: 'Subject', key: 'subject', format: (val) => truncateText(val, 30) },
        { label: 'Project', key: 'project', format: (val) => truncateText(val, 20) },
        { label: 'End Date', key: 'exp_end_date', format: (val) => formatDate(val) },
        { label: 'Status', key: 'status', format: (val) => <span className={`badge badge-dot badge-${val === 'Completed' ? 'success' : val === 'Overdue' ? 'danger' : ['Working', 'Pending Review'].includes(val) ? 'warning' : 'info'}`}>{val}</span> },
      ]}
      onCreate={() => alert('Create Task Modal TBD')}
    />
  )
}
