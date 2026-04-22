import { ShoppingCart } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'
import { truncateText, formatCurrency, formatDate } from '../../utils/formatters'

export default function SalesOrderList() {
  return (
    <GenericList
      doctype="Sales Order"
      title="Sales Orders"
      subtitle="Track customer orders and deliveries"
      icon={ShoppingCart}
      basePath="/sales/orders"
      fields={['customer', 'status', 'grand_total', 'transaction_date']}
      statusOptions={['Draft', 'To Bill and Deliver', 'To Deliver', 'To Bill', 'Completed', 'Cancelled', 'Closed']}
      columns={[
        { label: 'Order', key: 'name' },
        { label: 'Customer', key: 'customer', format: (val) => truncateText(val, 30) },
        { label: 'Date', key: 'transaction_date', format: (val) => formatDate(val) },
        { label: 'Amount', key: 'grand_total', format: (val) => formatCurrency(val) },
        { label: 'Status', key: 'status', format: (val) => <span className={`badge badge-dot badge-${val === 'Completed' ? 'success' : ['Cancelled', 'Closed'].includes(val) ? 'danger' : val === 'Draft' ? 'muted' : 'info'}`}>{val}</span> },
      ]}
      onCreate={() => alert('Create Sales Order Modal TBD')}
    />
  )
}
