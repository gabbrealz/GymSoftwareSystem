import React, { useState, useEffect } from 'react';

const AddMember = ({ isOpen, onClose, onAdd }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        contact_number: '',
        plan_type: '',
        payment_amount: '',
        mode_of_payment: 'Cash',
        payment_status: 'Pending'
    });

    useEffect(() => {
        setFormData({ name: '', email: '', address: '', contact_number: '', plan_type: '' });
        setStep(1);
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onAdd) onAdd(formData);
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="rounded-[10px] shadow-2xl w-full max-w-md mx-4 border border-white/10 overflow-hidden bg-[#1a1a1a]">
                <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#770e00]/80">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        Add New Member
                    </h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {
                        step === 1 ?

                        <>
                            {[
                                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Enter full name' },
                                { label: 'Email', name: 'email', type: 'email', placeholder: 'e.g. member@sertfit.com' },
                                { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter address' },
                                { label: 'Contact', name: 'contact_number', type: 'tel', placeholder: '0912-345-6789' },
                                { label: 'Membership Plan', name: 'plan_type', type: 'select', options: ['Regular', 'VIP'] },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                        {field.label}
                                    </label>
                                    
                                    {field.type === 'select' ? (
                                        <div className="relative">
                                            <select
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 pr-10 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all appearance-none cursor-pointer">
                                                <option value="" disabled className="bg-[#1a1a1a] text-gray-400">Select a plan</option>
                                                {field.options.map(opt => (
                                                    <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">{opt}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            required
                                            placeholder={field.placeholder}
                                            className="w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all placeholder:text-gray-600 [color-scheme:dark]"
                                        />
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full py-3 rounded-[8px] text-white font-bold bg-[#770e00] hover:scale-[1.02] transition-all shadow-lg mt-4">
                                Next
                            </button>
                        </>
                        :
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Amount Due
                                </label>
                                <input
                                    type="number"
                                    name="payment_amount"
                                    value={formData.payment_amount}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter payment amount"
                                    className="
                                        w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all placeholder:text-gray-600
                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                    "
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Mode of Payment
                                </label>
                                <select
                                    name="mode_of_payment"
                                    value={formData.mode_of_payment}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 pr-10 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all appearance-none cursor-pointer">
                                    <option value="Cash" className="bg-[#1a1a1a] text-white">
                                        Cash
                                    </option>
                                    <option value="GCash" className="bg-[#1a1a1a] text-white">
                                        GCash
                                    </option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Payment Status
                                </label>
                                <select
                                    name="payment_status"
                                    value={formData.payment_status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 pr-10 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all appearance-none cursor-pointer">
                                    <option value="Pending" className="bg-[#1a1a1a] text-white">
                                        Pending
                                    </option>
                                    <option value="Paid" className="bg-[#1a1a1a] text-white">
                                        Paid
                                    </option>
                                    <option value="Failed" className="bg-[#1a1a1a] text-white">
                                        Failed
                                    </option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 text-gray-300 font-semibold hover:bg-white/5 py-2 rounded-[8px]">
                                    Back
                                </button>
                                <button type="submit" className="flex-1 py-2 rounded-[8px] text-white font-bold bg-[#770e00] shadow-lg hover:scale-[1.02] transition-all">
                                    Add
                                </button>
                            </div>
                        </>
                    }
                </form>
            </div>
        </div>
    );
};

export default AddMember;