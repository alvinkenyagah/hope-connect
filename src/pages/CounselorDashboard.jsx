import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CounselorDashboard({ currentUser, authToken }) {
  const navigate = useNavigate();
  const [assignedVictims, setAssignedVictims] = useState([]);
  const [contactedClientsCount, setContactedClientsCount] = useState(0); // State for the Active Sessions count
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

        // NOTE: The URL must point to your live server or localhost if running locally
        // The original URL (https://hope-connect-server.onrender.com) is replaced with localhost:4000 for local testing based on the user's provided code snippet.
        const res = await fetch(`https://hope-connect-server.onrender.com/api/counselor/my-victims`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Failed to load assigned victims.");
        }

        // The backend now returns an object { victims: [...], contactedClients: 5 }
        setAssignedVictims(data.victims || []); 
        setContactedClientsCount(data.contactedClients || 0); // Update the count state

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
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6 md:p-12">
    <div className="max-w-7xl mx-auto pt-8">
      {/* Header */}
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-tight">
          Counselor Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome back, <span className="font-semibold text-gray-800">{currentUser.name}</span> 👋
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Logged in as <strong className="text-indigo-600">{currentUser.role}</strong> • ID:{" "}
          <span className="font-mono text-xs">{currentUser._id || currentUser.id}</span>
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl border border-indigo-100 transition-all duration-300">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
            👥 Assigned Clients
          </h2>
          <p className="text-5xl font-extrabold text-indigo-600">{loading ? "..." : assignedVictims.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total clients assigned to you</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl border border-green-100 transition-all duration-300">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
            💬 Active Sessions
          </h2>
          <p className="text-5xl font-extrabold text-green-600">{loading ? "..." : contactedClientsCount}</p>
          <p className="text-gray-500 text-sm mt-1">Clients contacted at least once</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl border border-yellow-100 transition-all duration-300">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
            📈 Client Check-ins
          </h2>
          <p className="text-5xl font-extrabold text-yellow-600">95%</p>
          <p className="text-gray-500 text-sm mt-1">Average weekly compliance rate</p>
        </div>
      </section>

      {/* Assigned Clients Table */}
      <section className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            🧑‍💼 Assigned Clients
          </h2>
        </div>

        {loading ? (
          <div className="text-gray-600 text-center py-10 text-lg animate-pulse">Loading clients...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-10 text-lg">{error}</div>
        ) : assignedVictims.length === 0 ? (
          <div className="text-gray-500 text-center py-10 text-lg">No clients assigned yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Interaction
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {assignedVictims.map((victim, index) => (
                  <tr
                    key={victim._id}
                    className={`hover:bg-indigo-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{victim.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{victim.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {victim.lastContact ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {new Date(victim.lastContact).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not contacted yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate("/chat", { state: { otherUser: victim } })}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                      >
                        💬 Chat
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