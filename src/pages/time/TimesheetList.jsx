import { Clock } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText, formatDate } from '../../utils/formatters'

export default function TimesheetList() {
  return (
    <GenericList
      doctype="Timesheet"
      title="Timesheets"
      subtitle="Track employee hours and billing"
      icon={Clock}
      basePath="/time/timesheets"
      fields={['employee_name', 'status', 'start_date', 'total_billed_hours']}
      statusOptions={['Draft', 'Submitted', 'Billed', 'Payslip', 'Completed', 'Cancelled']}
      columns={[
        { label: 'Timesheet', key: 'name' },
        { label: 'Employee', key: 'employee_name', format: (val) => truncateText(val, 30) },
        { label: 'Start Date', key: 'start_date', format: (val) => formatDate(val) },
        { label: 'Billed Hours', key: 'total_billed_hours', format: (val) => `${val || 0} hrs` },
        { label: 'Status', key: 'status', format: (val) => <span className={`badge badge-dot badge-${val === 'Billed' || val === 'Completed' ? 'success' : val === 'Draft' ? 'muted' : 'info'}`}>{val}</span> },
      ]}
      onCreate={() => alert('Create Timesheet Modal TBD')}
    />
  )
}
