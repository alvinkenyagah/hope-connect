import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
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
                    
          <Route path="*" element={<NotFoundPage />} /> 


        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;