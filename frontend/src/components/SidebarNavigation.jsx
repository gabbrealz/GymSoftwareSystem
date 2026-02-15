import React from 'react'

const SidebarNavigation = ({ items = [], onSelect, className = '', onLogout }) => {
  return (
    <nav className={`sidebar ${className}`.trim()}>
      <ul className="sidebar-list">
        {items.map((item) => (
          <li
            key={item.id}
            className="sidebar-item"
            onClick={() => onSelect?.(item)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') onSelect?.(item) }}
          >
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
      <button className="sidebar-logout" onClick={onLogout}>
        Logout
      </button>
    </nav>
  )
}

export default SidebarNavigation
