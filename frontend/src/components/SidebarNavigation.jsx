import React from 'react'

const SidebarNavigation = ({ items = [], onSelect, className = '', onLogout, onTrigger, activeItem }) => {
  const isExpanded = className.includes('visible');

  return (
    <nav className={className}>
      <div 
        className="flex items-center cursor-pointer mb-6"
        style={{ 
          height: '90px', 
          width: isExpanded ? '260px' : '70px',
          transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0
        }}
        onClick={onTrigger}
      >
        <img 
          src="/SertfitLogo.png" 
          alt="Sertfit Logo" 
          style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '50%', backgroundColor: 'transparent' }}
        />
      </div>

      <ul className="sidebar-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            className="sidebar-item"
            style={{
              backgroundColor: activeItem === item.id ? 'rgba(255,255,255,0.15)' : ''
            }}
            onClick={() => onSelect?.(item)}
          >
            <span className="sidebar-icon text-[#f865bb]">
                {item.icon}
            </span>
            <span className="sidebar-label ml-2">
                {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pb-6"> 
        <button 
          className="sidebar-logout transition-all duration-300" 
          onClick={onLogout}
          style={{ 
            width: isExpanded ? '100%' : '44px', 
            height: '44px',
            margin: '0 auto' 
          }}
        >
          <span className={`${isExpanded ? 'mr-3' : ''} flex-shrink-0 text-white`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </span>
          {isExpanded && <span className="whitespace-nowrap text-white">Logout</span>}
        </button>
      </div>
    </nav>
  )
}

export default SidebarNavigation