import { Building2 } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText } from '../../utils/formatters'

export default function CustomerList() {
  return (
    <GenericList
      doctype="Customer"
      title="Customers"
      subtitle="Manage your customer database"
      icon={Building2}
      basePath="/crm/customers"
      fields={['customer_name', 'customer_group', 'territory']}
      searchField="customer_name"
      statusField={null}
      columns={[
        { label: 'Customer ID', key: 'name' },
        { label: 'Customer Name', key: 'customer_name', format: (val) => truncateText(val, 30) },
        { label: 'Customer Group', key: 'customer_group' },
        { label: 'Territory', key: 'territory' },
      ]}
      onCreate={() => alert('Create Customer Modal TBD')}
    />
  )
}
