import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
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
    section: 'Manage',
    items: [
      { to: '/leads', icon: Users, label: 'Leads' },
      { to: '/projects', icon: FolderKanban, label: 'Projects' },
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
