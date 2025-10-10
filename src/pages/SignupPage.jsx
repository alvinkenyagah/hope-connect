import React, { useState } from 'react';
import { Heart, Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Shield, ArrowLeft, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('victim'); // 'victim' or 'counselor'
  
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

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', loginForm);
    // Add authentication logic here
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Signup:', { ...signupForm, userType });
    // Add registration logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 pt-7">
      {/* Background Decorations */}
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
            {/* Left Side - Branding */}
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

            {/* Right Side - Forms */}
            <div className="p-12">
              {currentPage === 'login' ? (
                // LOGIN FORM
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                  <p className="text-gray-600 mb-8">Access your account to continue</p>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
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
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
                    >
                      Sign In
                    </button>



                    <p className="text-center text-gray-600 mt-6">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentPage('signup')}
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
                  <p className="text-gray-600 mb-6">Join our community of support</p>

                  {/* User Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I am registering as a:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setUserType('victim')}
                        className={`p-4 border-2 rounded-xl transition ${
                          userType === 'victim'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <p className="font-semibold text-gray-900">Person Seeking Help</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('counselor')}
                        className={`p-4 border-2 rounded-xl transition ${
                          userType === 'counselor'
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <p className="font-semibold text-gray-900">Counselor</p>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSignupSubmit} className="space-y-5 max-h-96 overflow-y-auto pr-2">
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
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={signupForm.confirmPassword}
                          onChange={handleSignupChange}
                          className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                    </div>

                    {userType === 'victim' && (
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
                              Your identity will be kept completely confidential
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

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
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
                    >
                      Create Account
                    </button>

                    <p className="text-center text-gray-600 mt-6">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentPage('login')}
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