import React, { useState } from 'react';

const initialTransactions = [
    { refnum: 'TXN-000001', timestamp: '17/02/2026 08:30 AM', type: 'Membership Payment', mop: 'Gcash', status: 'Paid', recordedby: 'Roycee Hugh M. Lacuesta' },
    { refnum: 'TXN-000002', timestamp: '17/02/2026 09:15 AM', type: 'Workout Session', mop: 'Cash', status: 'Pending', recordedby: 'Christian Gabriel P. Agot' },
    { refnum: 'TXN-000003', timestamp: '17/02/2026 10:00 AM', type: 'Membership Payment', mop: 'Cash', status: 'Failed', recordedby: 'Ariana May F. Saromo' }
];

const Transactions = () => {
    const [txn, setTxn] = useState(initialTransactions);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-[48px] font-bold">Transactions</h1>
            </div>

            <div className="rounded-[10px] overflow-hidden border border-white/5 shadow-xl bg-[#303030cc]">
                <table className="w-full text-sm text-left">
                    <thead style={{ backgroundColor: 'rgba(119,14,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Reference Number</th>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Date & Time</th>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Transaction Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Mode of Payment</th>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Recorded By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {txn.map((item, index) => (
                            <tr key={index} className="border-b border-white/5 text-white hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-200">{item.refnum}</td>
                                <td className="px-6 py-4">{item.timestamp}</td>
                                <td className="px-6 py-4">{item.type}</td>
                                <td className="px-6 py-4 text-gray-200">{item.mop}</td>
                                <td className="px-6 py-4">
                                    <div className="relative inline-block">
                                        <select
                                            value={item.status} onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setTxn(prev => prev.map((t, i) => 
                                                    i === index ? { ...t, status: newStatus } : t
                                                ));
                                            }}
                                            className={`bg-transparent font-semibold outline-none cursor-pointer appearance-none pr-6 transition-colors ${
                                                item.status === 'Paid' ? 'text-green-400' : 
                                                item.status === 'Failed' ? 'text-red-400' : 
                                                'text-yellow-400'
                                            }`}>
                                            <option value="Paid" className="bg-[#1a1a1a] text-green-400">Paid</option>
                                            <option value="Pending" className="bg-[#1a1a1a] text-yellow-400">Pending</option>
                                            <option value="Failed" className="bg-[#1a1a1a] text-red-400">Failed</option>
                                        </select>
                                        
                                        <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3 opacity-70">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-200">{item.recordedby}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;