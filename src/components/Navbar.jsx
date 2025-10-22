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
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Hope Connect
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                {/* Dynamic Dashboard Link based on role */}
                                <Link 
                                    to={getDashboardPath()} 
                                    className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center"
                                >
                                    <User className="w-5 h-5 mr-1" />
                                    Dashboard
                                </Link>
                                <NavButton
                                    onClick={handleLogoutClick}
                                    styleClass="bg-red-500 text-white hover:bg-red-600"
                                    icon={<LogOut className="w-4 h-4 mr-2" />}
                                >
                                    Logout
                                </NavButton>
                            </>
                        ) : (
                            <>
                                {/* New: Separate Login and Sign Up buttons */}
                                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">
                                    Login
                                </Link>
                                <NavButton
                                    onClick={() => handleNavigation('/signup')}
                                    styleClass="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                                >
                                    Sign Up
                                </NavButton>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                        {isMenuOpen ? <X className="w-7 h-7 text-gray-800" /> : <Menu className="w-7 h-7 text-gray-800" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t transition-all duration-300">
                    <div className="px-4 py-4 space-y-3 flex flex-col items-center">
                        {isLoggedIn ? (
                            <>
                                {/* Dynamic Dashboard Link based on role */}
                                <Link 
                                    to={getDashboardPath()} 
                                    className="w-full text-center py-2 text-gray-700 hover:text-blue-600 font-medium transition border-b border-gray-100" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <NavButton
                                    onClick={handleLogoutClick}
                                    styleClass="w-full bg-red-500 text-white hover:bg-red-600"
                                >
                                    Logout
                                </NavButton>
                            </>
                        ) : (
                            <>
                                {/* New: Separate Login and Sign Up links for mobile */}
                                <Link 
                                    to="/login" 
                                    className="w-full text-center py-2 text-gray-700 hover:text-blue-600 font-medium transition border-b border-gray-100" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <NavButton
                                    onClick={() => handleNavigation('/signup')}
                                    styleClass="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
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

