import React, { useState, useEffect } from 'react';

const AddLog = ({ isOpen, onClose, onAdd }) => {
    const [customerType, setCustomerType] = useState('Walk-in');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', email: '' });
            setCustomerType('Walk-in');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onAdd({ ...formData, customerType });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="rounded-[10px] shadow-2xl w-full max-w-md mx-4 border border-white/10 overflow-hidden bg-[#1a1a1a]">
                <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#770e00]/80">
                    <h2 className="text-xl font-bold text-white tracking-wide">Add Record</h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="flex gap-4 p-1 bg-[#1f1f1f] rounded-lg border border-white/5">
                        <button
                            type="button"
                            onClick={() => setCustomerType('Walk-in')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${customerType === 'Walk-in' ? 'bg-[#770e00] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            Walk-in
                        </button>
                        <button
                            type="button"
                            onClick={() => setCustomerType('Member')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${customerType === 'Member' ? 'bg-[#770e00] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            Member
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter full name"
                                className="w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {customerType === 'Member' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required={customerType === 'Member'}
                                    placeholder="e.g. member@email.com"
                                    className="w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all placeholder:text-gray-600"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 text-gray-300 font-semibold hover:bg-white/5 py-2 rounded-[8px]">Cancel</button>
                        <button type="submit" className="flex-1 py-2 rounded-[8px] text-white font-bold bg-[#770e00] shadow-lg hover:scale-[1.02] transition-all">Record</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLog;