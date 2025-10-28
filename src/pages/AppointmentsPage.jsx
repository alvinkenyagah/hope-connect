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
        // Victim Logic
        if (currentView === 'schedule') {
            if (!assignedCounselor) {
                return (
                    <div className="text-center p-12 bg-yellow-50 rounded-xl border border-yellow-300 shadow-md">
                        <User className="w-8 h-8 text-yellow-600 mx-auto mb-3"/>
                        <p className="text-xl font-bold text-yellow-800">
                            ⚠️ Assignment Pending
                        </p>
                        <p className="text-gray-600 mt-2">
                            You must be assigned a counselor before scheduling a session.
                        </p>
                        <button 
                            onClick={handleCancel}
                            className="mt-6 text-sm text-blue-600 hover:text-blue-800 transition font-medium"
                        >
                            View Appointment History
                        </button>
                    </div>
                );
            }
            
            // Render the booking form
            return (
                <AppointmentForm 
                    counselor={assignedCounselor} 
                    authToken={authToken} 
                    onSubmissionComplete={handleSubmissionComplete} 
                    onCancel={handleCancel}
                />
            );
        }
        
        // Victim Appointment List View
        return (
            <AppointmentsList 
                user={user} 
                authToken={authToken} 
                onScheduleNew={handleScheduleNew} 
            />
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
            {isVictim && currentView === 'schedule' && (
                <button 
                    onClick={handleCancel}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition mb-4 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back to Appointments List
                </button>
            )}
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