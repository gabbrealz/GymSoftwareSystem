import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './../Context.jsx';


const Transactions = () => {
    const { getAuthToken, setIsAuthenticated, forceLogout } = useContext(AuthContext);
    const [txn, setTxn] = useState([]);

    useEffect(() => {
        const token = getAuthToken();
        if (token === null) {
            setIsAuthenticated(false);
            return;
        }

        const fetchData = async () => {
            let res, data;

            try {
                res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transactions`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
                data = await res.json();

                if (res.ok) {
                    setTxn(data);
                }
                else {
                    console.log(data.message);
                    if (res.status === 401) forceLogout();
                }
            }
            catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleUpdateStatus = async (txnId, newStatus) => {
        const token = getAuthToken();
        if (token === null) {
            setIsAuthenticated(false);
            return;
        }

        let res, data;

        const previousTransactions = txn;
        setTxn(prev => prev.map((t) => t.id === txnId ? { ...t, status: newStatus } : t));

        try {
            res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/transactions/${txnId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ status: newStatus })
            });
            data = await res.json();

            if (!res.ok) {
                setTxn(previousTransactions);
                console.log(data.message);
                if ("errors" in data) console.log(data.errors);
                if (res.status === 401) forceLogout();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

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
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Amount Due</th>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-200 tracking-wide">Recorded By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {txn.map((item) => (
                            <tr key={item.id} className="border-b border-white/5 text-white hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-200">{item.reference_number}</td>
                                <td className="px-6 py-4">{item.date_time}</td>
                                <td className="px-6 py-4">{item.transaction_type}</td>
                                <td className="px-6 py-4 text-gray-200">{item.mode_of_payment}</td>
                                <td className="px-6 py-4 text-gray-200">{item.paid_amount}</td>
                                <td className="px-6 py-4">
                                    <div className="relative inline-block">
                                        <select
                                            value={item.status} onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
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
                                <td className="px-6 py-4 text-gray-200">{item.recorded_by}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;