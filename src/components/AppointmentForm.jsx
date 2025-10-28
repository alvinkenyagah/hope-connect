import React, { useState } from 'react';
import { Calendar, User, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = 'https://hope-connect-server.onrender.com/api';

export default function AppointmentForm({ counselor, authToken, onSubmissionComplete, onCancel }) {
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('online');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const appointmentTime = new Date(time);
    if (appointmentTime < new Date()) {
      setMessage({ type: 'error', text: 'You cannot book an appointment in the past.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          counselorId: counselor._id, // Assumes counselor object has _id
          time: appointmentTime,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed. Please check time availability.');
      }

      setMessage({ type: 'success', text: 'Appointment successfully booked!' });
      setTimeout(() => onSubmissionComplete(), 1500);

    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-blue-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
        <Calendar className="w-7 h-7 mr-2" /> Schedule a Session
      </h2>
      <p className="text-gray-600 mb-6 border-b pb-4">
        You are booking a session with your assigned counselor: <span className="font-semibold">{counselor.name}</span>.
      </p>

      {message && (
        <div className={`p-3 mb-4 text-sm rounded-lg flex items-center ${
          message.type === 'error' ? 'text-red-800 bg-red-50 border border-red-300' : 'text-green-800 bg-green-50 border border-green-300'
        }`}>
          {message.type === 'error' ? <XCircle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-1"/> Date and Time
          </label>
          <input
            type="datetime-local"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1"/> Session Mode
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="online">Online Video Call</option>
            <option value="in-person">In-Person Meeting</option>
          </select>
        </div>

        <div className="pt-4 border-t flex justify-between space-x-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !time}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}