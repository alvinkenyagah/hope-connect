// src/pages/AppointmentsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, User } from 'lucide-react';
import AppointmentForm from '../components/AppointmentForm'; 
import AppointmentsList from '../components/AppointmentsList';

const API_BASE_URL = 'https://hope-connect-server.onrender.com/api';

// 1. Component now accepts currentUser (as 'user') and authToken as props
const AppointmentsPage = ({ currentUser: user, authToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Basic validation/access check based on props
  if (!user || !authToken) {
      // This should ideally be caught by App.jsx route protection, but is a good safeguard
      return <div className="text-center p-12">Access Denied. Please log in.</div>;
  }
  
  const isVictim = user.role === 'victim';

  // State for fetching the assigned counselor (Victim-specific)
  const [assignedCounselor, setAssignedCounselor] = useState(undefined); // undefined = not fetched
  const [isLoadingCounselor, setIsLoadingCounselor] = useState(true);

  // Determine initial view: 'schedule' from navigation state, otherwise 'list'
  const initialView = location.state?.view === 'schedule' && isVictim ? 'schedule' : 'list';
  const [currentView, setCurrentView] = useState(initialView);

  // --- Data Fetching Logic for Assigned Counselor (REAL API CALL) ---
  const fetchAssignedCounselor = useCallback(async () => {
    // Only victims need to fetch their counselor
    if (!isVictim) {
        setIsLoadingCounselor(false);
        setAssignedCounselor(null);
        return;
    }
    
    setIsLoadingCounselor(true);
    try {
      // Endpoint: /api/assignments/my-counselor
      const response = await fetch(`${API_BASE_URL}/assignments/my-counselor`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();

      if (response.ok && data.counselor) {
        setAssignedCounselor(data.counselor);
      } else {
        // Handles both API error and the case where counselor is explicitly null
        setAssignedCounselor(null); 
      }
    } catch (error) {
      console.error('Failed to fetch assigned counselor:', error);
      // Fallback for network issues
      setAssignedCounselor(null); 
    } finally {
      setIsLoadingCounselor(false);
    }
  }, [isVictim, authToken]);

  useEffect(() => {
    fetchAssignedCounselor();
    // Ensure Counselor view is always 'list' even if state was manipulated
    if (!isVictim) setCurrentView('list');
  }, [fetchAssignedCounselor, isVictim]);

  // --- View Control Handlers ---

  const handleSubmissionComplete = () => {
    // Navigate back to the list view after booking
    setCurrentView('list');
    // Clear location state to prevent form re-opening if the user refreshes
    navigate(location.pathname, { replace: true, state: {} }); 
  };
  
  const handleCancel = () => {
    setCurrentView('list');
    navigate(location.pathname, { replace: true, state: {} }); 
  };
  
  const handleScheduleNew = () => {
    // Allows the AppointmentList component to trigger the scheduling view
    if (assignedCounselor) {
        setCurrentView('schedule');
    }
  };

  // --- Render Logic ---

  const renderContent = () => {
    if (isLoadingCounselor) {
        return (
            <div className="text-center p-12 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-lg font-medium text-gray-700">Loading your assignment details...</p>
            </div>
        );
    }



    if (isVictim) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setCurrentView('schedule')}
          className={`px-4 py-2 font-semibold ${
            currentView === 'schedule'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Schedule Session
        </button>

        <button
          onClick={() => setCurrentView('list')}
          className={`ml-6 px-4 py-2 font-semibold ${
            currentView === 'list'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Appointment History
        </button>
      </div>

      {/* TAB CONTENT */}
      {currentView === 'schedule' ? (
        !assignedCounselor ? (
          <div className="text-center p-8 bg-yellow-50 rounded-xl border border-yellow-300 shadow-md">
            <p className="text-xl font-bold text-yellow-800">⚠️ Assignment Pending</p>
            <p className="text-gray-600 mt-2">
              You must be assigned a counselor before scheduling.
            </p>
          </div>
        ) : (
          <AppointmentForm
            counselor={assignedCounselor}
            authToken={authToken}
            onSubmissionComplete={handleSubmissionComplete}
            onCancel={() => setCurrentView('list')}
          />
        )
      ) : (
        <AppointmentsList
          user={user}
          authToken={authToken}
          onScheduleNew={() => setCurrentView('schedule')}
        />
      )}
    </div>
  );
}



    // Counselor Logic (Always the list view)
    return (
        <AppointmentsList 
            user={user} 
            authToken={authToken} 
            onScheduleNew={() => {}} // Disabled for counselors
        />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      
      <div className="max-w-4xl mx-auto pt-9">


        <header className="mb-8">
{/* 
            {isVictim && currentView === 'schedule' && (
                <button 
                    onClick={handleCancel}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition mb-4 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back to Appointments List
                </button>
            )} */}


        <div className="bg-white p-6 rounded-lg shadow-sm mt-9 mb-9">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </button>
        </div>



            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <Calendar className="w-7 h-7 mr-3 text-blue-600"/>
                {isVictim ? 'My Sessions & Scheduling' : 'Counseling Session Management'}
            </h1>
            <p className="text-gray-600 mt-1">
                {currentView === 'schedule' 
                    ? `Booking with ${assignedCounselor?.name || 'your assigned counselor'}.` 
                    : 'View and manage all your scheduled appointments.'}
            </p>
        </header>

        {renderContent()}
      </div>
    </div>
  );
};

export default AppointmentsPage;