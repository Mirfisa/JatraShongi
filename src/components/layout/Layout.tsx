import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout - Main application layout wrapper
 * @component
 * @returns {JSX.Element} Layout with navbar, page content, and footer
 * @remarks
 * Provides consistent structure for all pages:
 * - Navbar at top (sticky)
 * - Flexible main content area (uses React Router Outlet)
 * - Footer at bottom
 * - Full viewport height with footer always visible
 */
const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Navigation header */}
            <Navbar />
            {/* Page content goes here */}
            <main className="flex-grow">
                <Outlet />
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
