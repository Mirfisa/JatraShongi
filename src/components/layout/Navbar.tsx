import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bus, User, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar - Navigation bar with branding, menu, and user controls
 * @component
 * @returns {JSX.Element} Sticky navigation bar
 * @remarks
 * Features:
 * - JatraShongi logo and branding
 * - Navigation links (Home, Routes)
 * - Language selector (Bengali)
 * - User menu (Hi, {name} + Logout OR Login button)
 * - Responsive: horizontal menu on desktop, hamburger menu on mobile
 */
const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                                <Bus className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">JatraShongi</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Nav links */}
                        <Link to="/" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800/50">
                            Home
                        </Link>
                        <Link to="/routes" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800/50">
                            Routes
                        </Link>

                        {/* Language and user section */}
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
                            {/* Language switcher */}
                            <button className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                                <Globe className="h-4 w-4" />
                                <span className="text-sm font-medium">BN</span>
                            </button>
                            {/* User menu */}
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-300">Hi, {user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                                    <User className="h-4 w-4" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {/* Mobile nav links */}
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-800/50">
                            Home
                        </Link>
                        <Link to="/routes" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-800/50">
                            Routes
                        </Link>

                        {/* Mobile user section */}
                        <div className="border-t border-slate-700 pt-4 pb-3">
                            {/* Language switcher */}
                            <div className="flex items-center px-3">
                                <button className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                                    <Globe className="h-4 w-4" />
                                    <span className="text-sm font-medium">BN</span>
                                </button>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                {/* User menu - logged in or login button */}
                                {user ? (
                                    <>
                                        <div className="px-3 py-2 text-base font-medium text-slate-300">
                                            Hi, {user.name}
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-800/50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-800/50">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
