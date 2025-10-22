import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, User, ArrowLeft, Heart, Mail, Lock, AlertTriangle, CheckCircle, Eye, EyeOff, Menu, X } from 'lucide-react'; 


const Navbar = ({ isLoggedIn, onLogout, currentUser }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Scroll effect to change Navbar style
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Utility function to determine the correct dashboard path based on role
    const getDashboardPath = () => {
        if (!currentUser) return '/dashboard'; // Default, though this block should run when logged in
        switch (currentUser.role) {
            case 'admin':
                return '/admin';
            case 'counselor':
                return '/counselor-dashboard';
            default:
                return '/dashboard';
        }
    };


    // Handler for navigation 
    const handleNavigation = (path) => {
        navigate(path); 
        setIsMenuOpen(false); // Close mobile menu after navigation
    };
    
    // Handler for Logout
    const handleLogoutClick = () => {
        onLogout();
        setIsMenuOpen(false);
        navigate('/'); // Redirect to home after logout
    }

    // Determine the style class based on scroll position
    const navClass = `fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`;

    // Common Button component logic for DRY principle
    const NavButton = ({ children, onClick, styleClass, icon }) => (
        <button 
            className={`px-6 py-2 rounded-full transform hover:scale-105 transition flex items-center justify-center ${styleClass}`} 
            onClick={onClick}
        >
            {icon}
            {children}
        </button>
    );

    return (
        
<nav className={navClass}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo and App Name */}
                    <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsMenuOpen(false)}>
                        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                            <Heart className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-800 transition-all duration-300">
                            Hope Connect
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-3">
                        {isLoggedIn ? (
                            <>
                                {/* Dynamic Dashboard Link based on role */}
                                <Link 
                                    to={getDashboardPath()} 
                                    className="flex items-center px-4 py-2.5 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200"
                                >
                                    <User className="w-5 h-5 mr-2" />
                                    Dashboard
                                </Link>
                                <NavButton
                                    onClick={handleLogoutClick}
                                    styleClass="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg"
                                    icon={<LogOut className="w-4 h-4 mr-2" />}
                                >
                                    Logout
                                </NavButton>
                            </>
                        ) : (
                            <>
                                {/* New: Separate Login and Sign Up buttons */}
                                <Link to="/login" className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200">
                                    Login
                                </Link>
                                <NavButton
                                    onClick={() => handleNavigation('/signup')}
                                    styleClass="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 shadow-md hover:shadow-xl hover:scale-105"
                                >
                                    Sign Up
                                </NavButton>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="px-4 py-4 space-y-2">
                        {isLoggedIn ? (
                            <>
                                {/* Dynamic Dashboard Link based on role */}
                                <Link 
                                    to={getDashboardPath()} 
                                    className="flex items-center justify-center w-full py-3 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="w-5 h-5 mr-2" />
                                    Dashboard
                                </Link>
                                <NavButton
                                    onClick={handleLogoutClick}
                                    styleClass="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md"
                                >
                                    <LogOut className="w-4 h-4 mr-2 inline" />
                                    Logout
                                </NavButton>
                            </>
                        ) : (
                            <>
                                {/* New: Separate Login and Sign Up links for mobile */}
                                <Link 
                                    to="/login" 
                                    className="block w-full text-center py-3 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <NavButton
                                    onClick={() => handleNavigation('/signup')}
                                    styleClass="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 shadow-md hover:shadow-lg"
                                >
                                    Sign Up
                                </NavButton>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

