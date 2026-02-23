import { useState, useEffect, useContext } from 'react';
import { NotifContext } from '../Context.jsx';
import AttendanceChart from './AttendanceChart';
import AddLog from './AddLog';

const GymLog = () => {
    const { addToNotifs } = useContext(NotifContext);

    const [month, setMonth] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 7);
    });
    const [logs, setLogs] = useState([]);
    const [range, setRange] = useState('daily');
    const [isAddLogOpen, setIsAddLogOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
        if (token === null) return;

        const fetchData = async () => {
            let res, data;
            
            try {
                res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/workout-sessions`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
                data = await res.json();

                if (res.ok) {
                    setLogs(data);
                }
                else {
                    addToNotifs({ message: data.message ||"Failed to load gym logd.", bgcolor: "bg-red-600" });
                }
            }
            catch (error) {
                console.error(error);

                addToNotifs({ message: "An error occurred while loading gym logs.", bgcolor: "bg-red-600" });
            }
        };

        fetchData();
    }, []);

    const handleAddLog = (formData) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
        if (token === null) return;

        const fetchData = async () => {
            let res, data;

            try {
                res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/workout-sessions`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                data = await res.json();
                
                if (res.ok) {
                    setLogs(prev => [...prev, data.new_log]);

                    addToNotifs({ message: data.message || "Log added successfully.", bgcolor: "bg-green-600" });
                }
                else if ("errors" in data) {
                    console.log(data.errors);

                    addToNotifs({ message: Object.values(data.errors).flat().join(", "), bgcolor: "bg-red-600" });
                }
            }
            catch (error) {
                console.error(error);
                addToNotifs({ "Server error": "An error occurred while adding the log.", bgcolor: "bg-red-600" });
            }
        };

        fetchData();
    };

    const handleDeleteLog = (log_id) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
        if (token === null) {
            addToNotifs({ message: "Session expired. Please log in again.", bgcolor: "bg-red-600" });
            return;
        }

        const oldData = logs;
        setLogs(prev => prev.filter(log => log.id !== log_id));

        const fetchData = async () => {
            let res, data;

            try {
                res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/workout-sessions/${log_id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                });
                data = await res.json();
                
                if (!res.ok) {
                    setLogs(oldData);

                    addToNotifs({ message: data.message || "Failed to delete log.", bgcolor: "bg-red-600" });
                } else {
                    addToNotifs({ message: data.message || "Log deleted successfully.", bgcolor: "bg-green-600" });
                }
            }
            catch (error) {
                console.error(error);

                addToNotifs({ message: "Server error while deleting log.", bgcolor: "bg-red-600" });
            }
        };

        fetchData();
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-[48px] font-bold">Gym Logs</h1>
                <button
                    onClick={() => setIsAddLogOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: '#770e00' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Record
                </button>
            </div>

            <AddLog 
                isOpen={isAddLogOpen} 
                onClose={() => setIsAddLogOpen(false)} 
                onAdd={handleAddLog} 
            />

            <div className="rounded-[12px] overflow-hidden border border-white/5 shadow-xl bg-[#303030cc] p-8 space-y-10">

                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-200">
                            Attendance Analytics
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

                    <div className="bg-[#1f1f1f] rounded-[10px] p-6 border border-white/5">
                        <AttendanceChart logs={logs} range={range} month={month} />
                    </div>
                </div>

                <div className="border-t border-white/10"></div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-200 mb-6">
                        Recent Gym Logs
                    </h2>

                    <div className="rounded-[10px] overflow-hidden border border-white/5">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{
                                    backgroundColor: 'rgba(119,14,0,0.6)',
                                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                                }}>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Name</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Date & Time</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Customer Type</th>
                                    <th className="text-left px-6 py-4"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="transition-colors duration-150 hover:bg-white/5 border-b border-white/5 last:border-none"
                                    >
                                        <td className="px-6 py-4 font-medium text-white">{log.name}</td>
                                        <td className="px-6 py-4 text-gray-300">{log.timestamp}</td>
                                        <td className="px-6 py-4 text-white">{log.customer_type}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteLog(log.id)}
                                                className="text-gray-400 hover:text-red-400 transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" strokeWidth={1.5}
                                                    stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GymLog;