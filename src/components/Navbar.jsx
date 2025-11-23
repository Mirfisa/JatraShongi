import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bus, Phone, User } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 transition-all duration-300">
            <div className="glass mx-4 mt-4 rounded-2xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-brand-accent to-brand-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
                                <Bus className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-display font-bold text-xl text-white tracking-wide">JatraShongi</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5">
                            Home
                        </Link>
                        <Link to="/emergency" className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors hover:bg-red-500/10">
                            <Phone className="h-4 w-4" />
                            Emergency
                        </Link>
                        <Link to="/login" className="bg-gradient-to-r from-brand-primary to-brand-violet text-white hover:opacity-90 px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-all shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40">
                            <User className="h-4 w-4" />
                            Login
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden mx-4 mt-2 glass rounded-xl overflow-hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="text-slate-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/emergency"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <Phone className="h-4 w-4" />
                            Emergency
                        </Link>
                        <Link
                            to="/login"
                            className="text-slate-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="h-4 w-4" />
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
