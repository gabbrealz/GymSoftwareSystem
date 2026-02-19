import React from 'react';
import AttendanceChart from './AttendanceChart';
import InventoryAnalytics from './ProductInventory';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const DashContent = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-[#303030] backdrop-blur-sm p-6 rounded-[10px] shadow-lg border border-white/5">
          <h2 className="text-xl font-semibold mb-4 text-gray-200 text-center uppercase tracking-widest">
            Attendance Overview
          </h2>
          <AttendanceChart />
        </div>

        <div className="bg-[#303030] backdrop-blur-sm p-6 rounded-[10px] shadow-lg border border-white/5">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Court Booking</h2>
          <div className="bg-white rounded-md p-4 text-black h-[450px]">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="100%"
              events={[
                { title: 'June', date: '2026-02-12', color: '#770e00' },
                { title: 'Gabb', date: '2026-02-14', color: '#770e00' }
              ]}
            />
          </div>
        </div>

        <div className="bg-[#303030] p-6 rounded-[10px] shadow-lg border border-white/5 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">
            Product Inventory
          </h2>
          <InventoryAnalytics />
        </div>
      </div>
    </>
  );
};

export default DashContent;