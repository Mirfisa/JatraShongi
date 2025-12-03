import React, { useState } from 'react';
import SearchableSelect from '../ui/SearchableSelect';
import { MapPin, Search } from 'lucide-react';
import { SORTED_LOCATIONS } from '../../data/mockRoutes';

/**
 * RouteSearch - Search bus routes between locations
 * @component
 * @returns {JSX.Element} Search form
 * @remarks
 * Features:
 * - Search routes from/to with location selectors
 * @example
 * <RouteSearch />
 */
const RouteSearch: React.FC = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search functionality removed - form is display only
    };

    return (
        <div className="space-y-8">
            {/* Search Form Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/50">
                <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-500" />
                    Find Your Route
                </h2>
                <form onSubmit={handleSearch} className="space-y-5">
                    {/* From location */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">From</label>
                        <div className="relative group">
                            <SearchableSelect
                                options={SORTED_LOCATIONS}
                                value={from}
                                onChange={setFrom}
                                placeholder="Select pickup location"
                                icon={<MapPin className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />}
                            />
                        </div>
                    </div>
                    {/* To location */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">To</label>
                        <div className="relative group">
                            <SearchableSelect
                                options={SORTED_LOCATIONS}
                                value={to}
                                onChange={setTo}
                                placeholder="Select destination"
                                icon={<MapPin className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />}
                            />
                        </div>
                    </div>
                    {/* Search button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md flex items-center justify-center gap-2 font-semibold active:scale-[0.98]"
                    >
                        <Search className="h-5 w-5" />
                        Search Routes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RouteSearch;
