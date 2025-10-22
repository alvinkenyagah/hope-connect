import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CounselorDashboard({ currentUser, authToken }) {
  const navigate = useNavigate();
  const [assignedVictims, setAssignedVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-red-600">
        Access Denied. Please log in.
      </div>
    );
  }

  // ✅ Fetch assigned victims for this counselor
  useEffect(() => {
    const fetchAssignedVictims = async () => {
      try {
        setLoading(true);


        const res = await fetch(`https://hope-connect-server.onrender.com/api/counselor/my-victims`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });



        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load assigned victims.");
        setAssignedVictims(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedVictims();
  }, [currentUser, authToken]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 ">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700">Counselor Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {currentUser.name}. You are logged in as <strong>{currentUser.role}</strong>.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            User ID:{" "}
            <span className="font-mono text-xs">{currentUser._id || currentUser.id}</span>
          </p>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Pending Cases</h2>
            <p className="text-4xl font-bold text-indigo-600">12</p>
            <p className="text-gray-500 text-sm mt-1">New clients requiring assignment.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Active Sessions</h2>
            <p className="text-4xl font-bold text-green-600">8</p>
            <p className="text-gray-500 text-sm mt-1">Sessions scheduled for today.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Client Check-ins</h2>
            <p className="text-4xl font-bold text-yellow-600">95%</p>
            <p className="text-gray-500 text-sm mt-1">Average weekly compliance rate.</p>
          </div>
        </section>

        {/* Assigned Clients Section */}
        <section className="bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Assigned Clients</h2>

          {loading ? (
            <div className="text-gray-600 text-center py-6">Loading clients...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-6">{error}</div>
          ) : assignedVictims.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No clients assigned yet.</div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Interaction</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedVictims.map((victim) => (
                  <tr key={victim._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{victim.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{victim.email}</td>                  
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {victim.lastContact
                            ? new Date(victim.lastContact).toLocaleString() // This will now receive a valid date from the backend
                            : <span className="text-gray-400 italic">Not contacted yet</span>}
                        </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate('/chat', { state: { otherUser: victim } })}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Start Conversation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </section>
      </div>
    </div>
  );
}
