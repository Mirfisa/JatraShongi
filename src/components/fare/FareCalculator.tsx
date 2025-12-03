import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

/**
 * FareCalculator - Display official fare chart for bus routes
 * @component
 * @returns {JSX.Element} Fare calculator form and results
 * @remarks\n * Features:
 * - Route selection dropdown
 * - Displays official fare information
 * - Placeholder for future fare data display
 */
const FareCalculator: React.FC = () => {
    // Keep track of selected route
    const [route, setRoute] = useState('');

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Header with dollar icon and title */}
            <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Fare Calculator</h2>
            </div>
            <p className="text-gray-600 mb-4">Select a route to view official fare chart.</p>

            {/* Dropdown to pick a route */}
            <select
                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
            >
                <option value="">Select a Bus Route</option>
                <option value="route1">Route 1 (Mirpur - Motijheel)</option>
                <option value="route2">Route 2 (Uttara - Shahbag)</option>
            </select>

            {/* Shows fare results - will be updated when backend is connected */}
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 text-center text-gray-500">
                Select a route to see fares
            </div>
        </div>
    );
};

export default FareCalculator;
