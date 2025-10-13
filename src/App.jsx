import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import the useNavigate hook to allow for programmatic navigation
import { useNavigate } from 'react-router-dom'; 

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';

// Import the two separate components
import SignupPage from './pages/SignupPage'; 
import LoginPage from './pages/LoginPage.jsx';    

import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is outside Routes so it is rendered on every page */}
      <Navbar /> 
      
      <main>
        <Routes>

          <Route path="/" element={<LandingPage />} /> 
        
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/login" element={<LoginPage />} />  
                    
          <Route path="*" element={<NotFoundPage />} /> 


        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;