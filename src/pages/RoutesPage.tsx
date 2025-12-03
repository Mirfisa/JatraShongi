import React from 'react';

/**
 * RoutesPage - Routes information page
 * @component
 * @returns {JSX.Element} Routes page
 * @remarks
 * Displays information about bus routes.
 */
const RoutesPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Page title */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-3">Bus Routes</h1>
                <p className="text-lg text-slate-400">Explore bus routes across Dhaka city.</p>
            </div>
        </div>
    );
};

export default RoutesPage;

