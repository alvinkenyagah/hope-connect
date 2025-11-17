import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyIcon from '../components/icon.jsx';

// Re-using the utility component for loading state
const LoadingButtonContent = () => (
  <div className="flex items-center justify-center">
    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
        5.291A7.962 7.962 0 014 12H0c0 3.042 1.135
        5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Processing...
  </div>
);

// Login Page
export default function LoginPage({ onNavigateToSignup, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // NOTE: Using a placeholder URL. Ensure this matches your actual backend endpoint.
      const response = await fetch('https://hope-connect-server.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setSuccessMessage('Login successful!');
        
       if (onLoginSuccess) {
          onLoginSuccess(data.user, data.token);
        }

        if (data.user.assignedCounselor) {
          localStorage.setItem('assignedCounselor', JSON.stringify(data.user.assignedCounselor));
        }





        // --- START: UPDATED ROLE-BASED REDIRECTION LOGIC ---
        const userRole = data.user ? data.user.role : 'user';

        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'counselor') { // <-- NEW REDIRECTION FOR COUNSELLOR
          navigate('/counselor-dashboard');
        } else {
          // Default: All other roles (standard user, etc.) go to the generic dashboard
          navigate('/dashboard'); 
        }
        // --- END: UPDATED ROLE-BASED REDIRECTION LOGIC ---

      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 pt-7">
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite cubic-bezier(0.6, -0.28, 0.735, 0.045); }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl pt-9">
        <button
          onClick={() => window.location.href = '/'}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Section */}
            <div className="bg-blue-400 p-12 text-white flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <MyIcon/>
                  </div>
                  <span className="text-3xl font-bold">Hope Connect</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
                <p className="text-blue-100 text-lg">
                  Continue your path to recovery and connect with your support network.
                </p>
              </div>
            </div>

            {/* Right Section (Form) */}
            <div className="p-12">
              {error && (
                <div
                  className="mb-4 flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
                  role="alert"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Error:</span> {error}
                </div>
              )}

              {successMessage && (
                <div
                  className="mb-4 flex items-center p-3 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50"
                  role="alert"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Success:</span> {successMessage}
                </div>
              )}

              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                <p className="text-gray-600 mb-8">Access your account to continue</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        // placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={loginForm.rememberMe}
                        onChange={handleLoginChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    onClick={handleLoginSubmit}
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600  text-white rounded-xl font-semibold hover:shadow-lg transform transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <LoadingButtonContent /> : 'Sign In'}
                  </button>

                  <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/signup')}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Need immediate help? Call our 24/7 hotline:{' '}
            <span className="font-semibold text-blue-600">1-800-HOPE-NOW</span>
          </p>
        </div>
      </div>
    </div>
  );
}