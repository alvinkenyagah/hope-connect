import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Trash2, CheckCircle, AlertTriangle, User } from 'lucide-react';

const AdminDashboard = ({ currentUser, authToken }) => {
    const [counsellorForm, setCounsellorForm] = useState({
        name: '',
        email: '',
        password: 'password123', // Default or placeholder password
        specialization: '',
        qualifications: ''
    });
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filterRole, setFilterRole] = useState('all');

    const BASE_URL = 'https://hope-connect-server.onrender.com/api/admin'; // Base URL for admin endpoints


    // --- New states for assignment ---
const [selectedVictim, setSelectedVictim] = useState('');
const [selectedCounselor, setSelectedCounselor] = useState('');
const [isAssigning, setIsAssigning] = useState(false);

// --- Assign Counselor to Victim ---
const handleAssignCounselor = async (e) => {
    e.preventDefault();

    if (!selectedVictim || !selectedCounselor) {
        return setMessage({ type: 'error', text: 'Please select both victim and counselor.' });
    }

    setIsAssigning(true);
    try {
        const response = await fetch(`${BASE_URL}/assign-counselor`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ victimId: selectedVictim, counselorId: selectedCounselor }),
        });

        const data = await response.json();
        setIsAssigning(false);

        if (response.ok) {
            setMessage({ type: 'success', text: data.message });
            fetchAllUsers(); // refresh users to reflect change
            setSelectedVictim('');
            setSelectedCounselor('');
        } else {
            setMessage({ type: 'error', text: data.message || 'Assignment failed.' });
        }
    } catch (error) {
        setIsAssigning(false);
        setMessage({ type: 'error', text: 'Network error while assigning counselor.' });
    }
};




    // --- Data Fetching Logic (Get All Users) ---
    const fetchAllUsers = async () => {
        if (!authToken) return;
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                setAllUsers(data);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to fetch users. Access Denied?' });
            }
        } catch (error) {
            setIsLoading(false);
            setMessage({ type: 'error', text: 'Network error while fetching users.' });
            console.error('Fetch Users Error:', error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [authToken]); // Rerun when auth token changes

    // --- Counsellor Form Logic ---
    const handleFormChange = (e) => {
        setCounsellorForm({ ...counsellorForm, [e.target.name]: e.target.value });
    };

    const handleAddCounsellor = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${BASE_URL}/counsellor`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(counsellorForm),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                setMessage({ type: 'success', text: `Counsellor ${data.user.name} added successfully!` });
                // Reset form (except for default password)
                setCounsellorForm({ 
                    name: '', 
                    email: '', 
                    password: 'password123', // Keep default password for convenience
                    specialization: '',
                    qualifications: '' 
                });
                // Refresh the user list
                fetchAllUsers(); 
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to add counsellor.' });
            }
        } catch (error) {
            setIsLoading(false);
            setMessage({ type: 'error', text: 'Network error while adding counsellor.' });
            console.error('Add Counsellor Error:', error);
        }
    };
    
    // --- Rendering Logic ---
    const filteredUsers = allUsers.filter(user => 
        filterRole === 'all' ? true : user.role === filterRole
    );

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return 'bg-red-500';
            case 'counselor': return 'bg-green-500';
            case 'victim': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto pt-9">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center">
                    <User className="w-8 h-8 mr-3 text-red-600"/> Admin Dashboard
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Welcome, <span className="font-semibold text-red-600">{currentUser?.name || 'Admin'}</span>. Manage platform users.
                </p>

                {/* Status Message */}
                {message.text && (
                    <div className={`p-4 mb-6 rounded-xl shadow-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
                        <div className="flex items-center">
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertTriangle className="w-5 h-5 mr-3" />}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    </div>
                )}
                
                {/* 1. Add Counsellor Form */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl mb-10 border-t-4 border-red-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <UserPlus className="w-6 h-6 mr-2 text-red-500"/> Add New Counsellor
                    </h2>
                    <form onSubmit={handleAddCounsellor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={counsellorForm.name}
                            onChange={handleFormChange}
                            placeholder="Full Name"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={counsellorForm.email}
                            onChange={handleFormChange}
                            placeholder="Email Address"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            required
                        />
                        {/* Note: Password field is usually hidden/simplified for admin-created users */}
                        <input
                            type="text"
                            name="password"
                            value={counsellorForm.password}
                            onChange={handleFormChange}
                            placeholder="Initial Password (e.g., password123)"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            required
                        />
                        <input
                            type="text"
                            name="specialization"
                            value={counsellorForm.specialization}
                            onChange={handleFormChange}
                            placeholder="Specialization (e.g., Trauma, Addiction)"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            required
                        />
                        <textarea
                            name="qualifications"
                            value={counsellorForm.qualifications}
                            onChange={handleFormChange}
                            placeholder="Qualifications/Bio (Optional)"
                            rows="2"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 md:col-span-2"
                        />
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="md:col-span-2 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'Add Counsellor'}
                        </button>
                    </form>
                </div>





                {/* 1.5 Assign Counselor to Victim */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl mb-10 border-t-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <UserPlus className="w-6 h-6 mr-2 text-blue-500"/> Assign Counselor to Victim
                </h2>

                <form onSubmit={handleAssignCounselor} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Victim Dropdown */}
                    <select
                    value={selectedVictim}
                    onChange={(e) => setSelectedVictim(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                    <option value="">Select Victim</option>
                    {allUsers.filter(u => u.role === 'victim').map((v) => (
                        <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
                    ))}
                    </select>

                    {/* Counselor Dropdown */}
                    <select
                    value={selectedCounselor}
                    onChange={(e) => setSelectedCounselor(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                    <option value="">Select Counselor</option>
                    {allUsers.filter(u => u.role === 'counselor').map((c) => (
                        <option key={c._id} value={c._id}>{c.name} ({c.specialization || 'General'})</option>
                    ))}
                    </select>

                    <button
                    type="submit"
                    disabled={isAssigning}
                    className="py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                    >
                    {isAssigning ? 'Assigning...' : 'Assign Counselor'}
                    </button>
                </form>
                </div>







                {/* 2. View All Users */}
{/* 2. View All Users */}
<div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border-t-4 border-gray-500">
  <div className="flex justify-between items-center mb-6 border-b pb-4">
    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
      <Users className="w-6 h-6 mr-2 text-gray-500" /> All Platform Users ({allUsers.length})
    </h2>

    <select
      value={filterRole}
      onChange={(e) => setFilterRole(e.target.value)}
      className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="all">All Roles</option>
      <option value="admin">Admin</option>
      <option value="counselor">Counselor</option>
      <option value="victim">Victim/Client</option>
    </select>
  </div>

  {isLoading && <p className="text-center py-8 text-gray-500">Loading users...</p>}

  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Assigned Counselor</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {filteredUsers.map((user) => (
          <tr key={user._id} className="hover:bg-blue-50 transition duration-150">
            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white capitalize ${
                  user.role === 'admin'
                    ? 'bg-red-500'
                    : user.role === 'counselor'
                    ? 'bg-green-500'
                    : user.role === 'victim'
                    ? 'bg-blue-500'
                    : 'bg-gray-400'
                }`}
              >
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
              {user.specialization || 'N/A'}
            </td>

            {/* Assigned Counselor Column */}
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
              {user.role === 'victim' ? (
                user.assignedCounselor ? (
                  <span className="text-sm font-medium text-gray-800">
                    {user.assignedCounselor.name}{' '}
                    <span className="text-gray-500 text-xs">
                      ({user.assignedCounselor.specialization || 'N/A'})
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Not Assigned</span>
                )
              ) : (
                <span className="text-gray-300">—</span>
              )}
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-red-600 hover:text-red-800 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {!isLoading && filteredUsers.length === 0 && (
    <p className="text-center py-8 text-gray-500">No users found for this filter.</p>
  )}
</div>

            </div>
        </div>
    );
};

export default AdminDashboard;
