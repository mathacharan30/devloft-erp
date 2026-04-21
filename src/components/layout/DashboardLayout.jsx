import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="dashboard-main">
        <Topbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}
