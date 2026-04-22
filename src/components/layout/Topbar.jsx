import { useLocation } from 'react-router-dom'
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

const pageTitles = {
  '/': 'Dashboard',
  '/leads': 'Lead Management',
  '/projects': 'Project Management',
  '/payments': 'Payment Management',
}

function getPageTitle(pathname) {
  if (pathname.startsWith('/leads/')) return 'Lead Details'
  if (pathname.startsWith('/projects/') && pathname.endsWith('/tasks')) return 'Task Board'
  if (pathname.startsWith('/projects/')) return 'Project Details'
  if (pathname.startsWith('/payments/')) return 'Payment Details'
  return pageTitles[pathname] || 'Dashboard'
}

export default function Topbar({ onMenuToggle }) {
  const location = useLocation()
  const title = getPageTitle(location.pathname)
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn"
          onClick={onMenuToggle}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={18} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            id="global-search"
            aria-label="Search"
          />
        </div>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-btn" id="notifications-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="badge-dot" />
        </button>
      </div>
    </header>
  )
}
