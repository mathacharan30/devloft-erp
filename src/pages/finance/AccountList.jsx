import { Landmark } from 'lucide-react'
import GenericList from '../../components/ui/GenericList'

export default function AccountList() {
  return (
    <GenericList
      doctype="Account"
      title="Chart of Accounts"
      subtitle="Manage your company's accounting structure"
      icon={Landmark}
      basePath="/finance/accounts"
      fields={['account_name', 'account_type', 'root_type', 'is_group', 'parent_account', 'company']}
      statusField={null}
      columns={[
        { label: 'Account Name', key: 'account_name' },
        { 
          label: 'Type', 
          key: 'is_group', 
          format: (val) => <span className={`badge badge-${val ? 'info' : 'secondary'}`}>{val ? 'Group' : 'Ledger'}</span> 
        },
        { label: 'Account Type', key: 'account_type' },
        { label: 'Parent Account', key: 'parent_account' },
        { label: 'Company', key: 'company' },
      ]}
      onCreate={() => alert('Create Account Modal TBD')}
    />
  )
}
