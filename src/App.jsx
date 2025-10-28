import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import CounselorDashboard from './pages/CounselorDashboard.jsx'; 
import NotFoundPage from './pages/NotFoundPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx'; // 🎯 Import the new page

function App() {
  // Initialize state by trying to read from localStorage
  const initialToken = localStorage.getItem('authToken');
  const initialUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken); 
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [authToken, setAuthToken] = useState(initialToken);

  // --- Core Persistence Logic: useEffect ---
  useEffect(() => {
    if (authToken && currentUser) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setIsLoggedIn(false);
    }
  }, [authToken, currentUser]);
  // ------------------------------------------

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    console.log("Login success handled and persisted.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    console.log("Logout handled and storage cleared.");
  };

  // Helper function for unauthorized redirects
  const UnauthorizedFallback = () => <Navigate to="/login" replace />;

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> 
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} /> 
          
          {/* 1. Protected Counselor Dashboard Route (Role: counselor) */}
          <Route path="/counselor-dashboard" element={
            isLoggedIn && currentUser?.role === 'counselor'
              ? <CounselorDashboard currentUser={currentUser} authToken={authToken} /> 
              : <UnauthorizedFallback /> // Block access
          } />
          
          {/* 2. Protected Admin Route (Role: admin) */}
          <Route path="/admin" element={
            isLoggedIn && currentUser?.role === 'admin' 
              ? <AdminDashboard currentUser={currentUser} authToken={authToken} /> 
              : <UnauthorizedFallback /> // Block access
          } />
          
          {/* 3. Protected Victim Dashboard Route (Role: victim) */}
          <Route path="/dashboard" element={
            isLoggedIn && currentUser?.role === 'victim'
              ? <UserDashboard currentUser={currentUser} authToken={authToken} /> 
              : <UnauthorizedFallback /> // Block access or redirect to login
          } />


          {/* 🎯 4. APPOINTMENTS ROUTE (For both 'victim' and 'counselor') */}
          <Route path="/appointments" element={
            isLoggedIn && (currentUser?.role === 'victim' || currentUser?.role === 'counselor')
              ? <AppointmentsPage currentUser={currentUser} authToken={authToken} /> 
              : <UnauthorizedFallback /> // Block access for logged-out or Admin users
          } />


          {/* 5. Chat Route */}
          <Route
            path="/chat"
            element={
              isLoggedIn ? (
                <ChatPage currentUser={currentUser} />
              ) : (
                <UnauthorizedFallback />
              )
            }
          />
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;