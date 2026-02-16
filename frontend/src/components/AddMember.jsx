import React, { useState, useEffect } from 'react';

const AddMember = ({ isOpen, onClose, onAdd, initialData }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        address: '',
        contact: '',
        joinDate: '',
        expiryDate: '',
    });

    useEffect(() => {
        if (initialData) {
        setFormData(initialData);
        } else {
        setFormData({ id: '', name: '', email: '', address: '', contact: '', joinDate: '', expiryDate: '' });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onAdd) onAdd(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="rounded-[10px] shadow-2xl w-full max-w-md mx-4 border border-white/10 overflow-hidden bg-[#1a1a1a]">
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#770e00]/80">
            <h2 className="text-xl font-bold text-white tracking-wide">
                {initialData ? 'Update Member' : 'Add New Member'}
            </h2>
            <button onClick={onClose} className="text-gray-300 hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {[
                { label: 'Member ID', name: 'id', type: 'text', placeholder: 'e.g. 12345' },
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'e.g. Roycee Hugh M. Lacuesta' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'e.g. member@sertfit.com' },
                { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter address' },
                { label: 'Contact', name: 'contact', type: 'tel', placeholder: '0912-345-6789' },
                { label: 'Join Date', name: 'joinDate', type: 'date' },
                { label: 'Expiry Date', name: 'expiryDate', type: 'date' },
            ].map((field) => (
                <div key={field.name}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                    {field.label}
                </label>
                <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all placeholder:text-gray-600"/>
                </div>
            ))}
            <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 text-gray-300 font-semibold hover:bg-white/5 py-2 rounded-[8px]">
                Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-[8px] text-white font-bold bg-[#770e00] shadow-lg hover:scale-[1.02] transition-all">
                {initialData ? 'Update' : 'Confirm Add'}
                </button>
            </div>
            </form>
      </div>
    </div>
  );
};

export default AddMember;