import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import CounselorDashboard from './pages/CounselorDashboard.jsx'; // <-- NEW IMPORT
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  // Initialize state by trying to read from localStorage
  const initialToken = localStorage.getItem('authToken');
  const initialUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken); // Set true if a token exists
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [authToken, setAuthToken] = useState(initialToken);

  // --- Core Persistence Logic: useEffect ---
  useEffect(() => {
    // This effect runs whenever authToken or currentUser changes.
    if (authToken && currentUser) {
      // Save data to localStorage on login
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setIsLoggedIn(true);
    } else {
      // Clear data from localStorage on logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setIsLoggedIn(false);
    }
  }, [authToken, currentUser]);
  // ------------------------------------------

  // Function to handle a successful login (called from LoginPage)
  const handleLoginSuccess = (user, token) => {
    // Updating state here will trigger the useEffect hook above
    setCurrentUser(user);
    setAuthToken(token);
    console.log("Login success handled and persisted.");
  };

  // Function to handle logout (called from Navbar)
  const handleLogout = () => {
    // Clear state. This will trigger the useEffect hook to clear localStorage.
    setCurrentUser(null);
    setAuthToken(null);
    console.log("Logout handled and storage cleared.");
  };

  return (
    <BrowserRouter>
      {/* Pass currentUser object to Navbar so it can conditionally show the Admin link */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} currentUser={currentUser} /> 
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} /> 
          
          {/* 1. Protected Counselor Dashboard Route */}
          <Route path="/counselor-dashboard" element={
            isLoggedIn && currentUser && currentUser.role === 'counselor'
              ? <CounselorDashboard currentUser={currentUser} authToken={authToken} /> 
              : <NotFoundPage /> // Show 404 or access denied for unauthorized users
          } />
          
          {/* 2. Protected Admin Route */}
          <Route path="/admin" element={
            isLoggedIn && currentUser && currentUser.role === 'admin' 
              ? <AdminDashboard currentUser={currentUser} authToken={authToken} /> 
              : <NotFoundPage /> 
          } />
          
          {/* 3. Generic User Dashboard Route (for everyone else) */}
          <Route path="/dashboard" element={
            isLoggedIn 
              ? <UserDashboard currentUser={currentUser} authToken={authToken} /> 
              : <LoginPage onLoginSuccess={handleLoginSuccess} /> // Redirect to login if not logged in
          } />

          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
