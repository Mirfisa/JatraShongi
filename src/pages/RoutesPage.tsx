import React, { useState } from 'react';
import RouteSearch from '../components/route/RouteSearch';
import MapComponent from '../components/ui/MapComponent';

/**
 * RoutesPage - Route search and interactive map display
 * @component
 * @returns {JSX.Element} Two-column layout with search form and map
 * @remarks
 * Layout:
 * - Left column: Route search form and popular route suggestions
 * - Right column: Interactive map showing selected route
 * Handles route selection and updates map with route path and stops.
 */
const RoutesPage: React.FC = () => {
    const [selectedRoutePath, setSelectedRoutePath] = useState<[number, number][]>([]);
    const [selectedRouteStops, setSelectedRouteStops] = useState<Array<{ name: string; position: [number, number] }>>([]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Page title */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-3">Bus Routes</h1>
                <p className="text-lg text-slate-400">Search and explore bus routes across Dhaka city.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left side: search form and popular routes */}
                <div className="order-2 lg:order-1">
                    <div className="relative z-10">
                        <RouteSearch
                            onSelectRoute={(path, stops) => {
                                setSelectedRoutePath(path);
                                setSelectedRouteStops(stops || []);
                            }}
                        />
                    </div>
                    {/* Show some example routes */}
                    <div className="mt-8 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 relative z-0">
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
                {/* Right side: map showing selected route */}
                <div className="order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
                    <div className="bg-slate-800 rounded-2xl h-[50vh] md:h-[600px] shadow-xl border border-slate-700 overflow-hidden relative ring-1 ring-white/10">
                        <MapComponent
                            routePath={selectedRoutePath}
                            stops={selectedRouteStops}
                        />
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-3">
                        Interactive map showing real-time route visualization
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoutesPage;
