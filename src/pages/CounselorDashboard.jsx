import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CounselorDashboard({ currentUser, authToken }) {
  if (!currentUser) {
    // Should be handled by App.jsx routing, but a safety check is good
    return <div className="p-8 text-center text-red-600">Access Denied. Please log in.</div>;
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700">Counsellor Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser.name}. You are logged in as a **{currentUser.role}**.</p>
          <p className="text-sm text-gray-400 mt-2">
            User ID: <span className="font-mono text-xs">{currentUser.uid || currentUser._id}</span>
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Pending Cases</h2>
            <p className="text-4xl font-bold text-indigo-600">12</p>
            <p className="text-gray-500 text-sm mt-1">New clients requiring assignment.</p>
          </div>

          {/* Active Sessions Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Active Sessions</h2>
            <p className="text-4xl font-bold text-green-600">8</p>
            <p className="text-gray-500 text-sm mt-1">Sessions scheduled for today.</p>
          </div>
          
          {/* Analytics Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Client Check-ins</h2>
            <p className="text-4xl font-bold text-yellow-600">95%</p>
            <p className="text-gray-500 text-sm mt-1">Average weekly compliance rate.</p>
          </div>
        </section>

        <section className="mt-12 bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Client Management Tools</h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              This area will house tools for scheduling, secure chat, and progress tracking for assigned clients.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
              <li>View and update client recovery scores.</li>
              <li>Access secure communication channels.</li>
              <li>Manage your weekly session schedule.</li>
            </ul>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/chat', { state: { otherUser: { role: 'victim' } } })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
            >
              Open Chat Panel
            </button>

          </div>

        </section>
      </div>
    </div>
  );
}
