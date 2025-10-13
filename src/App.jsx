
import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx'; 
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
    // setIsLoggedIn(true) is now handled by useEffect
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
      {/* Pass authentication state and logout handler to Navbar */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /> 
      
      <main>
        <Routes>

          
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />  
          
          {/* Protected Route */}
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