import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Footer = () => (
    <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold">JatraShongi</h3>
                    <p className="text-gray-400 text-sm">Making your daily commute easier.</p>
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} JatraShongi. All rights reserved.
            </div>
        </div>
    </footer>
);

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
