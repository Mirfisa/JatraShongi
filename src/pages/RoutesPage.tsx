import React from 'react';
import RouteSearch from '../components/route/RouteSearch';

/**
 * RoutesPage - Route search page
 * @component
 * @returns {JSX.Element} Route search form
 * @remarks
 * Displays route search form for finding bus routes.
 */
const RoutesPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Page title */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-3">Bus Routes</h1>
                <p className="text-lg text-slate-400">Search and explore bus routes across Dhaka city.</p>
            </div>

            {/* Search form */}
            <RouteSearch />

            {/* Popular routes */}
            <div className="mt-8 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-200 mb-3">Popular Routes</h3>
                <ul className="space-y-2">
                    {['Mirpur 10 to Motijheel', 'Uttara to Shahbag', 'Mohammadpur to Gulshan 1'].map((route, i) => (
                        <li key={i} className="flex items-center gap-2 text-blue-400 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            {route}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RoutesPage;
