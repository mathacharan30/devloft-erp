import { Building } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'

export default function CostCenterList() {
  return (
    <GenericList
      doctype="Cost Center"
      title="Cost Centers"
      subtitle="Manage your company's cost centers"
      icon={Building}
      basePath="/finance/cost-centers"
      fields={['cost_center_name', 'parent_cost_center', 'is_group', 'company']}
      statusField={null}
      columns={[
        { label: 'Cost Center Name', key: 'cost_center_name' },
        { 
          label: 'Type', 
          key: 'is_group', 
          format: (val) => <span className={`badge badge-${val ? 'info' : 'secondary'}`}>{val ? 'Group' : 'Node'}</span> 
        },
        { label: 'Parent Cost Center', key: 'parent_cost_center' },
        { label: 'Company', key: 'company' },
      ]}
      onCreate={() => alert('Create Cost Center Modal TBD')}
    />
  )
}
