import React, { useState } from 'react';
import { Heart, Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Shield, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SignupPage() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    anonymous: false
  });

  // --- Handlers for Form Changes ---

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm(prev => {
      const newState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      // Conditional handling for anonymous field
      if (name === 'anonymous' && checked) {
        newState.fullName = 'Anonymous User';
      } else if (name === 'anonymous' && !checked) {
        newState.fullName = ''; // Clear name if switching back from anonymous
      }
      return newState;
    });
  };

  // --- Handlers for Form Submissions ---

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setSuccessMessage('Login successful!');
        console.log('User logged in:', data.user);
        console.log('Token:', data.token); // Store this token in localStorage/cookies!
        // Redirect or update application state (e.g., set user context)
        // window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network error. Could not connect to the server.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // 1. Client-side Password Match Validation
    if (signupForm.password !== signupForm.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setIsLoading(true);

    // 2. Prepare Payload (Map to server-side 'User' model fields)
    const name = signupForm.anonymous ? 'Anonymous User' : signupForm.fullName;

    const payload = {
      name,
      email: signupForm.email,
      password: signupForm.password,
      role: 'victim', // Hardcoded as per component logic
      phone: signupForm.phone,
      // Note: DOB/Gender/Location/Anonymous are not directly mapped in the server model snippet but are good to include if the model expands.
      // For the current server model: name, email, password, role are sufficient.
    };

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        console.log('User registered:', data.user);
        console.log('Token:', data.token); // Store this token in localStorage/cookies!
        setTimeout(() => setCurrentPage('login'), 2000); // Switch to login after 2 seconds
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network error. Could not connect to the server.');
    }
  };

  const LoadingButtonContent = () => (
    <div className="flex items-center justify-center">
      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 pt-7">
      {/* Background Decorations */}
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

      <div className="relative w-full max-w-6xl pt-9" >
        {/* Back to Home Button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Branding (Unchanged) */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Heart className="w-8 h-8" />
                  </div>
                  <span className="text-3xl font-bold">Hope Connect</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  {currentPage === 'login' ? 'Welcome Back' : 'Start Your Journey'}
                </h2>
                <p className="text-blue-100 text-lg">
                  {currentPage === 'login' 
                    ? 'Continue your path to recovery and connect with your support network.'
                    : 'Take the first step towards healing. You\'re not alone in this journey.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm mt-1">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">100% Confidential</h4>
                    <p className="text-blue-100 text-sm">Your privacy is our top priority</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm mt-1">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Professional Support</h4>
                    <p className="text-blue-100 text-sm">Licensed counselors available 24/7</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm mt-1">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Compassionate Care</h4>
                    <p className="text-blue-100 text-sm">Judgment-free environment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Forms (Updated) */}
            <div className="p-12">
              {/* ERROR/SUCCESS Messages */}
              {error && (
                <div className="mb-4 flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Error:</span> {error}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 flex items-center p-3 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Success:</span> {successMessage}
                </div>
              )}

              {currentPage === 'login' ? (
                // LOGIN FORM
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                  <p className="text-gray-600 mb-8">Access your account to continue</p>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {/* Email Input */}
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
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
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
                          required
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

                    {/* Remember Me & Forgot Password */}
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
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <LoadingButtonContent /> : 'Sign In'}
                    </button>

                    {/* Switch to Signup */}
                    <p className="text-center text-gray-600 mt-6">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setCurrentPage('signup'); setError(null); setSuccessMessage(null); }}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                </div>
              ) : (
                // SIGNUP FORM
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
                  <p className="text-gray-600 mb-6">Join our community of support as a person seeking help.</p>

                  <div className="mb-6 p-4 border-2 border-blue-600 bg-blue-50 rounded-xl text-center">
                    <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-gray-900">Registering as a Person Seeking Help</p>
                    <p className="text-sm text-gray-600">Counselor accounts are created by the admin team.</p>
                  </div>

                  <form onSubmit={handleSignupSubmit} className="space-y-5 max-h-96 overflow-y-auto pr-2">
                    {/* Full Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name {signupForm.anonymous && '(Optional)'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={signupForm.fullName}
                          onChange={handleSignupChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="John Doe"
                          required={!signupForm.anonymous}
                          disabled={signupForm.anonymous}
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={signupForm.email}
                          onChange={handleSignupChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone & DOB */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={signupForm.phone}
                            onChange={handleSignupChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="+254..."
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={signupForm.dateOfBirth}
                            onChange={handleSignupChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gender Select */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={signupForm.gender}
                        onChange={handleSignupChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={signupForm.password}
                          onChange={handleSignupChange}
                          className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Create a strong password"
                          required
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

                    {/* Confirm Password Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={signupForm.confirmPassword}
                          onChange={handleSignupChange}
                          className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${signupForm.password && signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Re-enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {signupForm.password && signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords must match.</p>
                      )}
                    </div>

                    {/* Register Anonymously Checkbox */}
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="anonymous"
                          checked={signupForm.anonymous}
                          onChange={handleSignupChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Register Anonymously</span>
                          <p className="text-sm text-gray-600 mt-1">
                            Your full name will be replaced by "Anonymous User" in our records.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Terms Checkbox */}
                    <div>
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={signupForm.agreeTerms}
                          onChange={handleSignupChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                          required
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || signupForm.password !== signupForm.confirmPassword}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <LoadingButtonContent /> : 'Create Account'}
                    </button>

                    {/* Switch to Login */}
                    <p className="text-center text-gray-600 mt-6">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setCurrentPage('login'); setError(null); setSuccessMessage(null); }}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Help Banner */}
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-800 font-semibold">
            🚨 In Crisis? Need Immediate Help?
          </p>
          <p className="text-red-600 text-sm mt-1">
            Call our 24/7 emergency hotline: <span className="font-bold">1-800-HELP-NOW</span>
          </p>
        </div>
      </div>
    </div>
  );
}