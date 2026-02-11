import React, { useState } from 'react'
import SidebarNavigation from './components/SidebarNavigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const Dashboard = ({ onLogout }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'member list', label: 'Member List' },
    { id: 'employee list', label: 'Employee List' },
    { id: 'product inventory', label: 'Product Inventory' },
    { id: 'court reservations', label: 'Court Reservations' },
    { id: 'transactions', label: 'Transactions' }
  ]

  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [pinned, setPinned] = useState(false)

  const showSidebar = () => setSidebarVisible(true)
  const hideSidebar = () => {
    if (!pinned) {
      setSidebarVisible(false)
    }
  }

  const togglePinned = () => {
    const nextPinnedState = !pinned
    setPinned(nextPinnedState)
    if (nextPinnedState) {
      setSidebarVisible(true)
    }
  }

  return (
    <div className="bg-full full-screen flex m-0 p-0 overflow-hidden">
        <div className="fixed top-3 left-8 z-50 flex items-center gap-6">
            <div
                className="cursor-pointer text-white hover:scale-110 transition-transform flex items-center justify-center"
                onMouseEnter={showSidebar}
                onMouseLeave={() => {
                    setTimeout(hideSidebar, 100)
                }}
                onClick={togglePinned}
            >
                <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 18 14" 
                    fill="none" 
                >
                    <rect y="1" width="18" height="2" rx="1" fill="currentColor" />
                    <rect y="6" width="18" height="2" rx="1" fill="currentColor" />
                    <rect y="11" width="18" height="2" rx="1" fill="currentColor" />
                </svg>
            </div>

            <img 
                src="/SertfitLogo2.png" 
                alt="Sertfit Logo" 
                className="h-15 w-auto object-contain"
            />
        </div>

        <div 
            onMouseEnter={showSidebar} 
            onMouseLeave={hideSidebar}
            className="z-40"
        >
            <SidebarNavigation 
                items={items} 
                className={sidebarVisible ? 'visible' : ''} 
                onLogout={onLogout} 
            />
        </div>

        <main className={`flex-1 pt-20 pb-10 px-16 overflow-y-auto text-white transition-all duration-300 ${(sidebarVisible || pinned) ? 'ml-64' : 'ml-0'}`}>
            <h1 className="text-[48px] font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                <div className="bg-[#303030] p-6 rounded-[10px] shadow-lg border border-white/5">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Current Active Members</h2>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.5)]"></div>
                        <p className="text-lg text-white">Ari</p>
                    </div>
                </div>
                
                <div className="bg-[#303030] p-6 rounded-[10px] shadow-lg border border-white/5">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Court Booking</h2>
                    <div className="bg-white rounded-md p-4 text-black h-[450px] shadow-inner">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            height="100%"
                            headerToolbar={{
                                left: 'prev,next',
                                center: 'title',
                                right: 'today'
                            }}
                            events={[
                                { title: 'June', date: '2026-02-12', color: '#770e00' },
                                { title: 'Gabb', date: '2026-02-14', color: '#770e00' }
                            ]}
                        />
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}

export default Dashboard