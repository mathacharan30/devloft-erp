import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  ShoppingCart,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  Clock,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileSpreadsheet,
  Landmark,
  Building,
} from 'lucide-react'
import { getInitials } from '../../utils/formatters'

const navItems = [
  {
    section: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    section: 'CRM',
    items: [
      { to: '/leads', icon: Users, label: 'Leads' },
      { to: '/crm/opportunities', icon: Briefcase, label: 'Opportunities' },
      { to: '/crm/customers', icon: Building2, label: 'Customers' },
    ],
  },
  {
    section: 'Sales',
    items: [
      { to: '/sales/quotations', icon: FileText, label: 'Quotations' },
      { to: '/sales/orders', icon: ShoppingCart, label: 'Sales Orders' },
      { to: '/sales/invoices', icon: FileText, label: 'Sales Invoices' },
    ],
  },
  {
    section: 'Projects & Support',
    items: [
      { to: '/projects', icon: FolderKanban, label: 'Projects' },
      { to: '/projects/tasks', icon: CheckSquare, label: 'Tasks' },
      { to: '/projects/issues', icon: AlertCircle, label: 'Issues' },
    ],
  },
  {
    section: 'Time & Finance',
    items: [
      { to: '/time/timesheets', icon: Clock, label: 'Timesheets' },
      { to: '/finance/journal-entries', icon: FileSpreadsheet, label: 'Journal Entries' },
      { to: '/finance/accounts', icon: Landmark, label: 'Chart of Accounts' },
      { to: '/finance/cost-centers', icon: Building, label: 'Cost Centers' },
      { to: '/payments', icon: CreditCard, label: 'Payments' },
    ],
  },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { currentUser, logout } = useFrappeAuth()
  const location = useLocation()
  const displayName = currentUser?.split('@')[0] || 'Admin'
  const displayEmail = currentUser || 'Token Auth'

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">D</div>
        <span className="sidebar-brand">DevLoft</span>
      </div>

      <button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="nav-section-label">{group.section}</div>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-item-icon">
                    <Icon size={20} />
                  </span>
                  <span className="nav-item-label">{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={logout} title="Logout">
          <div className="user-avatar">
            {getInitials(displayName)}
          </div>
          <div className="user-info">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{displayEmail}</div>
          </div>
          <LogOut size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
        </div>
      </div>
    </aside>
  )
}
