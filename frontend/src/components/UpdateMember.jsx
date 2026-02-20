import React, { useState, useEffect } from 'react';

const UpdateMember = ({ isOpen, onClose, onUpdate, initialData }) => {
    const [registerSubscription, setRegisterSubscription] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        contact_number: '',
        plan_type: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({...initialData});
        }
        setRegisterSubscription(false);
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setRegisterSubscription(checked);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onUpdate) onUpdate(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="
                h-10/11 overflow-scroll rounded-[10px] shadow-2xl w-full max-w-md mx-4 border border-white/10 bg-[#1a1a1a]
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            ">
                
                <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#770e00]/80">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        Update Member
                    </h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">

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
                                        <option value="" disabled className="bg-[#1a1a1a] text-gray-400">
                                            Select a plan
                                        </option>
                                        {field.options.map(opt => (
                                            <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">
                                                {opt}
                                            </option>
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

                    <div className="flex items-center gap-3 pt-2 mb-6">
                        <input
                            type="checkbox"
                            id="registerSubscription"
                            checked={registerSubscription}
                            onChange={handleChange}
                            className="w-4 h-4 accent-[#770e00]"
                        />
                        <label htmlFor="registerSubscription" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Register new subscription
                        </label>
                    </div>

                    {registerSubscription && (
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

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Mode of Payment
                                </label>
                                <select
                                    name="mode_of_payment"
                                    value={formData.mode_of_payment}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all">
                                    <option value="Cash">Cash</option>
                                    <option value="GCash">GCash</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                    Payment Status
                                </label>
                                <select
                                    name="payment_status"
                                    value={formData.payment_status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all">
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-[8px] text-white font-bold bg-[#770e00] hover:scale-[1.02] transition-all shadow-lg mt-4">
                        Update Member
                    </button>

                </form>
            </div>
        </div>
    );
};

export default UpdateMember;
