import { useState, useEffect } from 'react';

const AddEmployee = ({ isOpen, onClose, onAdd, initialData }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        address: '',
        contact_number: '',
        monthly_salary: '',
        hire_date: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({...initialData, password: '', password_confirmation: ''});
        } else {
            setFormData({ 
                username: '', email: '', address: '', contact_number: '',monthly_salary: '',
                hire_date: '', password: '', password_confirmation: ''
            });
        }
        setStep(1);
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            alert("Passwords do not match!");
            return;
        }

        if (onAdd) onAdd(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="rounded-[10px] shadow-2xl w-full max-w-md mx-4 border border-white/10 overflow-hidden bg-[#1a1a1a]">
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#770e00]/80">
            <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                {initialData ? 'Update Employee' : 'Add New Employee'}
                </h2>
                <p className="text-xs text-white/60 uppercase tracking-widest mt-1">Step {step} of 2</p>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>

            <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="p-8 space-y-5">
            {step === 1 && (
                <div className="space-y-4">
                {[
                    { label: 'Name', name: 'username', type: 'text', placeholder: 'e.g. Roycee Hugh M. Lacuesta' },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'e.g. roycee.lacuesta@sertfit.com' },
                    { label: 'Address', name: 'address', type: 'text', placeholder: 'Enter home address' },
                    { label: 'Contact', name: 'contact_number', type: 'tel', placeholder: 'e.g. 09123456789' },
                    { label: 'Salary', name: 'monthly_salary', type: 'text', placeholder: 'e.g. 25000' },
                    { label: 'Date Hired', name: 'hire_date', type: 'date' },
                ].map((field) => (
                    <div key={field.name}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all placeholder:text-gray-600"/>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3 rounded-[8px] text-white font-bold bg-[#770e00] hover:scale-[1.02] transition-all shadow-lg mt-4">
                    Next
                </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Employee Password</label>
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all"/>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Confirm Password</label>
                    <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#303030cc] text-white rounded-[8px] border border-white/10 focus:border-[#770e00] outline-none transition-all"/>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-4 py-3 rounded-[8px] text-gray-300 font-semibold hover:bg-white/5 transition-all">
                    Back
                    </button>
                    <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-[8px] text-white font-bold bg-[#770e00] hover:scale-[1.02] transition-all shadow-lg">
                    {initialData ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
            )}
            </form>
        </div>
    </div>
    );
};

export default AddEmployee;