import { useState, useEffect, useContext } from 'react';
import AddEmployee from './AddEmployee';
import { AuthContext } from './../Context.jsx';

const Employee = () => {
  const { getAuthToken, setIsAuthenticated, forceLogout } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token === null) {
      setIsAuthenticated(false);
      return;
    }

    const fetchData = async () => {
      let res, data;
      try {
        res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employees`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        data = await res.json();

        if (res.ok) {
          setEmployees(data);
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

  const handleSaveEmployee = (formData) => {
    const token = getAuthToken();
    if (token === null) {
      setIsAuthenticated(false);
      return;
    }

    const previousEmployees = employees;
    let res, data;
    
    const fetchData = editingEmployee ?
    async () => {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? formData : emp));

      try {
        res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employees/${formData.id}`, {
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
          setEmployees(previousEmployees);
          console.log(data.message);
          if ("errors" in data) console.log(data.errors);
          if (res.status === 401) forceLogout();
        }
      }
      catch (error) {
        setEmployees(previousEmployees);
        console.error(error);
      }
    }
    :
    async () => {
      try {
        setEmployees(prev => [...prev, formData]);

        res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employees`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(formData)
        });
        data = await res.json();

        if (!res.ok) {
          setEmployees(previousEmployees);
          console.log(data.message);
          if ("errors" in data) console.log(data.errors);
          if (res.status === 401) forceLogout();
        }
      }
      catch (error) {
        setEmployees(previousEmployees);
        console.error(error);
      }
    };

    fetchData();
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (employeeId) => {
    const token = getAuthToken();
    if (token === null) {
      setIsAuthenticated(false);
      return;
    }

    const previousEmployees = employees;

    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    let res, data;

    try {
      res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employees/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      data = await res.json();

      if (!res.ok) {
        setEmployees(previousEmployees);
        if (res.status === 401) forceLogout();
      }
    }
    catch (error) {
      setEmployees(previousEmployees);
      console.error(error);
    }
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsAddEmployeeOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[48px] font-bold">Employee List</h1>
        <button
          onClick={() => { setEditingEmployee(null); setIsAddEmployeeOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: '#770e00' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Employee
        </button>
      </div>

      <AddEmployee
        isOpen={isAddEmployeeOpen}
        onClose={() => { setIsAddEmployeeOpen(false); setEditingEmployee(null); }}
        onAdd={handleSaveEmployee}
        initialData={editingEmployee}/>

      <div className="rounded-[10px] overflow-hidden border border-white/5 shadow-xl" style={{ backgroundColor: '#303030cc' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'rgba(119,14,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Email</th>
              <th className='text-left px-6 py-4 font-semibold text-gray-200 tracking-wide'>Address</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Contact No.</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Salary</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Hire Date</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide">Position</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-200 tracking-wide"></th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500 italic">No employees found.</td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={emp.id} className="transition-colors duration-150 hover:bg-white/5 border-b border-white/5 last:border-none">
                  <td className="px-6 py-4 font-medium text-white">{emp.username}</td>
                  <td className="px-6 py-4 text-gray-300">{emp.email}</td>
                  <td className="px-6 py-4 text-gray-300">{emp.address}</td>
                  <td className="px-6 py-4 text-gray-300">{emp.contact_number}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{emp.monthly_salary}</td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">{emp.hire_date}</td>
                  <td className="px-6 py-4 text-gray-300">{emp.role}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        className="text-gray-400 hover:text-white transition-colors duration-150" 
                        title="Edit"
                        onClick={() => openEditModal(emp)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-400 transition-colors duration-150"
                        title="Delete"
                        onClick={() => handleDeleteEmployee(emp.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;