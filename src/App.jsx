// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // Import the useNavigate hook to allow for programmatic navigation
// import { useNavigate } from 'react-router-dom'; 

// import Navbar from './components/Navbar';
// import LandingPage from './pages/LandingPage';

// // Import the two separate components
// import SignupPage from './pages/SignupPage'; 
// import LoginPage from './pages/LoginPage.jsx';    

// import NotFoundPage from './pages/NotFoundPage.jsx';

// function App() {
//   return (
//     <BrowserRouter>
//       {/* Navbar is outside Routes so it is rendered on every page */}
//       <Navbar /> 
      
//       <main>
//         <Routes>

//           <Route path="/" element={<LandingPage />} /> 
        
//           <Route path="/signup" element={<SignupPage />} /> 
//           <Route path="/login" element={<LoginPage />} />  
                    
//           <Route path="*" element={<NotFoundPage />} /> 


//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }

// export default App;



import React, { useState } from 'react'; // Import useState [cite: 217]
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // [cite: 425]
// Import the necessary pages
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage'; // [cite: 427]
import LoginPage from './pages/LoginPage.jsx'; // [cite: 426]
import UserDashboard from './pages/UserDashboard.jsx'; // New Import
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Function to handle a successful login (will be passed to LoginPage)
  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setIsLoggedIn(true);
    // In a real app, you would also save the token to localStorage/sessionStorage.
    console.log("Login success handled in App component.");
  };

  // Function to handle logout (will be passed to Navbar)
  const handleLogout = () => {
    // Clear state
    setCurrentUser(null);
    setAuthToken(null);
    setIsLoggedIn(false);
    // In a real app, clear the token from storage as well.
    console.log("Logout handled in App component.");
  };

  return (
    <BrowserRouter>
      {/* Pass authentication state and logout handler to Navbar */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /> 
      
      <main>
        <Routes>

          <Route path="/" element={<LandingPage />} /> 
        
          <Route path="/signup" element={<SignupPage />} /> 
          {/* Pass login success handler to LoginPage */}
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />  
          
          {/* Add a protected route for the Dashboard */}
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