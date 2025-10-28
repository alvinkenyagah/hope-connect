import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, Users } from 'lucide-react';

const API_BASE_URL = 'https://hope-connect-server.onrender.com/api'; // Use your base URL

const getStatusStyles = (status) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export default function AppointmentsList({ user, authToken, onScheduleNew }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const isCounselor = user.role === 'counselor';

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch appointments.');
      setAppointments(data.appointments);
    } catch (error) {
      console.error(error);
      // Handle error display
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this appointment?`)) return;

    try {
      await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        },
        body: JSON.stringify({ status }),
      });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Update failed:', error);
      // Handle error display
    }
  };

  if (loading) return <div className="text-center p-8">Loading appointments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          {isCounselor ? 'My Client Sessions' : 'My Appointments'} ({appointments.length})
        </h2>
        {!isCounselor && ( // Only victim can see 'Schedule New' button
            <button 
                onClick={onScheduleNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
                + Book New
            </button>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-600 border border-dashed">
          No appointments recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex justify-between items-center">
              <div className="flex items-start space-x-4">
                <div>
                  <div className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(appt.status)}`}>
                    <Clock className="w-3 h-3 mr-1" /> {appt.status.toUpperCase()}
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    {formatDate(appt.time)}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    {isCounselor 
                        ? `Client: ${appt.patient.name}` 
                        : `Counselor: ${appt.counselor.name}`}
                  </p>
                </div>
              </div>

              {appt.status === 'scheduled' && (
                <div className="flex space-x-2">
                    {isCounselor && (
                        <button
                            onClick={() => handleUpdateStatus(appt._id, 'completed')}
                            className="text-green-600 hover:text-white border border-green-600 hover:bg-green-600 p-2 rounded-lg transition"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                        className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 p-2 rounded-lg transition"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}