import React, { useEffect, useState } from "react";
import AttendanceChart from "./AttendanceChart";
import InventoryAnalytics from "./ProductInventory";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const DashContent = () => {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7); // YYYY-MM
  });

  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState("weekly");

  useEffect(() => {
    const token =
      localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
    if (!token) return;

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/workout-sessions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();
        if (res.ok) setLogs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        <div className="bg-[#303030] backdrop-blur-sm p-6 rounded-[10px] shadow-lg border border-white/5">
            
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">
              Attendance Overview
            </h2>

            <div className="flex gap-3">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-[#1f1f1f] text-white px-3 py-1 rounded-md border border-white/10 focus:outline-none"
              />

              <select
                className="bg-[#1f1f1f] text-white px-3 py-1 rounded-md border border-white/10 focus:outline-none"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

            <AttendanceChart logs={logs} range={range} month={month} />
        </div>

        <div className="bg-[#303030] backdrop-blur-sm p-6 rounded-[10px] shadow-lg border border-white/5">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">
            Court Booking
          </h2>
          <div className="bg-white rounded-md p-4 text-black h-[450px]">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="100%"
              events={[
                { title: "June", date: "2026-02-12", color: "#770e00" },
                { title: "Gabb", date: "2026-02-14", color: "#770e00" },
              ]}
            />
          </div>
        </div>

        <div className="bg-[#303030] p-6 rounded-[10px] shadow-lg border border-white/5 lg:col-span-2">
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