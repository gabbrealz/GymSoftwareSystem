import { useState, useEffect, useContext } from 'react'
import { NotifContext } from '../Context.jsx'
import AddMember from './AddMember'
import UpdateMember from './UpdateMember'

const Member = () => {
    const { addToNotifs } = useContext(NotifContext);
    const [members, setMembers] = useState([])
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [editingMember, setEditingMember] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
        if (token === null) return;
        
        const fetchData = async () => {
            let res, data;

            try {
                res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
                data = await res.json();

                if (res.ok) {
                    setMembers(data);
                }
                else {
                    console.log(data.message);
                }
            }
            catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleAddMember = async (formData) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
        if (token === null) return;

        console.log(formData);

        let res, data;

        try {
            res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members`, {
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
                setMembers(prev => [...prev, data.new_member]);

                addToNotifs({ message: data.message || "Member added successfully.", bgcolor: "bg-green-600" });
            }
            else {
                console.log(data.message);
                if ("errors" in data) console.log(data.errors);

                addToNotifs({ message: data.message || "Failed to add member.", bgcolor: "bg-red-600" });
            }
        }
        catch (error) {
            setMembers(previousMembers);
            console.error(error);

            addToNotifs({ message: "Server error while adding member.", bgcolor: "bg-red-600" });
        }

        setIsAddMemberOpen(false);
    };

    const handleUpdateMember = async (formData) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
        if (token === null) return;

        console.log(formData);

        const previousMembers = members;
        setMembers(prev => prev.map(mem => mem.id === editingMember.id ? { ...editingMember, ...formData } : mem));

        let res, data;

        try {
            res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members/${editingMember.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });
            data = await res.json();

            if (!res.ok) {
                setMembers(previousMembers);
                console.log(data.message);

                addToNotifs({ message: data.message || "Failed to update member.", bgcolor: "bg-red-600" });
            } else {
                addToNotifs({ message: data.message || "Member updated successfully.", bgcolor: "bg-green-600" });
            }
        }
        catch (error) {
            setMembers(previousMembers);
            console.error(error);

            addToNotifs({ message: "Server error while updating member.", bgcolor: "bg-red-600" });
        }

        setEditingMember(null);
    };

    const handleDeleteMember = async (memberId) => {
        const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
        if (token === null) return;

        console.log(formData);

        const previousMembers = members;
        setMembers(prev => prev.filter(mem => mem.id !== memberId));

        let res, data;

        try {
            res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members/${memberId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            })
            data = await res.json()

            if (!res.ok) {
                setEmployees(previousMembers);

                addToNotifs({ message: data.message || "Failed to delete member.", bgcolor: "bg-red-600" });
            } else {
                addToNotifs({ message: data.message || "Member deleted successfully.", bgcolor: "bg-green-600" });
            }
        }
        catch (error) {
            setEmployees(previousMembers);
            console.error(error);

            addToNotifs({ message: "Server error while deleting member.", bgcolor: "bg-red-600" });
        }        
    };

    return (
        <div>
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-[48px] font-bold">Member List</h1>
            <button
                onClick={() => { setEditingMember(null); setIsAddMemberOpen(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#770e00' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Member
            </button>
        </div>

        <AddMember
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            onAdd={handleAddMember} />

        <UpdateMember
            isOpen={editingMember !== null}
            onClose={() => setEditingMember(null)}
            onUpdate={handleUpdateMember}
            initialData={editingMember} />

        <div className="rounded-[10px] overflow-hidden border border-white/5 shadow-xl" style={{ backgroundColor: '#303030cc' }}>
            <table className="w-full text-sm">
            <thead>
                <tr style={{ backgroundColor: 'rgba(119,14,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Address</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Contact</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Membership Plan</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Join Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Expiry Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide"></th>
                </tr>
            </thead>
            <tbody>
                {members.map(mem => (
                <tr key={mem.id} className="transition-colors duration-150 hover:bg-white/5 border-b border-white/5 last:border-none">
                    <td className="px-6 py-4 font-medium text-white">{mem.name}</td>
                    <td className="px-6 py-4 text-gray-300">{mem.email}</td>
                    <td className="px-6 py-4 text-gray-300">{mem.address}</td>
                    <td className="px-6 py-4 text-gray-300">{mem.contact_number}</td>
                    <td className="px-6 py-4 text-gray-300">{mem.plan_type}</td>
                    <td className="px-6 py-4 text-gray-300">{mem.join_date}</td>
                    <td className="px-6 py-4 text-gray-300">{mem.expiry_date}</td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                            <button className="text-gray-400 hover:text-white transition-all" onClick={() => setEditingMember(mem)} title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button className="text-gray-400 hover:text-red-400 transition-all" onClick={() => handleDeleteMember(mem.id)} title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default Member;