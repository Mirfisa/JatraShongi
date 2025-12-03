import React, { useState, useEffect } from 'react';
import SearchableSelect from '../ui/SearchableSelect';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { MOCK_ROUTES, SORTED_LOCATIONS } from '../../data/mockRoutes';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { getRoutePath } from '../../utils/routeService';


/**
 * Props for RouteSearch component
 * @typedef {Object} RouteSearchProps
 * @property {Function} [onSelectRoute] - Callback when user selects a route to view on map
 */
interface RouteSearchProps {
    onSelectRoute?: (path: [number, number][], stops?: Array<{ name: string; position: [number, number] }>) => void;
}


/**
 * RouteSearch - Search bus routes between locations
 * @component
 * @param {RouteSearchProps} props - Component props
 * @returns {JSX.Element} Search form
 * @remarks
 * Features:
 * - Search routes from/to with location selectors
 * - Display route on interactive map
 * @example
 * <RouteSearch onSelectRoute={(path, stops) => setRoute({ path, stops })} />
 */
const RouteSearch: React.FC<RouteSearchProps> = ({ onSelectRoute }) => {
    const [searchParams] = useSearchParams();
    const [from, setFrom] = useState(searchParams.get('from') || '');
    const [to, setTo] = useState(searchParams.get('to') || '');
    const [isLoadingPath, setIsLoadingPath] = useState(false);

    useEffect(() => {
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');

        if (fromParam && toParam) {
            setFrom(fromParam || '');
            setTo(toParam || '');
            performSearch(fromParam || '', toParam || '');
        }
    }, [searchParams]);

    const performSearch = async (searchFrom: string, searchTo: string) => {
        if (!searchFrom || !searchTo) {
            return;
        }

        const normalizedFrom = searchFrom.toLowerCase();
        const normalizedTo = searchTo.toLowerCase();

        // Find direct routes (single bus from A to B)
        const directRoutes = MOCK_ROUTES.filter(route => {
            const fromMatch = route.stops.some(stop => stop.toLowerCase().includes(normalizedFrom));
            const toMatch = route.stops.some(stop => stop.toLowerCase().includes(normalizedTo));
            return fromMatch && toMatch;
        });

        // Process first matching route
        if (directRoutes.length > 0) {
            const route = directRoutes[0];

            // Try exact match first, then fallback to includes
            let startIndex = route.stops.findIndex(stop => stop.toLowerCase() === normalizedFrom);
            if (startIndex === -1) {
                startIndex = route.stops.findIndex(stop => stop.toLowerCase().includes(normalizedFrom));
            }

            let endIndex = route.stops.findIndex(stop => stop.toLowerCase() === normalizedTo);
            if (endIndex === -1) {
                endIndex = route.stops.findIndex(stop => stop.toLowerCase().includes(normalizedTo));
            }

            // Check both directions: forward (start < end) and reverse (start > end)
            if (startIndex !== -1 && endIndex !== -1 && startIndex !== endIndex) {
                let segmentStops;

                // Determine direction and get segment
                if (startIndex < endIndex) {
                    // Forward: A -> B
                    segmentStops = route.stops.slice(startIndex, endIndex + 1);
                } else {
                    // Reverse: B -> A
                    segmentStops = route.stops.slice(endIndex, startIndex + 1).reverse();
                }

                // Display on map
                await displayRouteOnMap(segmentStops);
            }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(from, to);
    };

    /**
     * Display route on the map.
     */
    const displayRouteOnMap = async (segmentStops: string[]) => {
        if (onSelectRoute) {
            setIsLoadingPath(true);

            // Map stops to coordinates
            const segmentCoordinates = segmentStops
                .map(stop => LOCATION_COORDINATES[stop])
                .filter((coord): coord is [number, number] => coord !== undefined);

            // Create stops objects for markers
            const stopsData = segmentStops
                .map(stop => ({
                    name: stop,
                    position: LOCATION_COORDINATES[stop]
                }))
                .filter(stop => stop.position !== undefined) as Array<{ name: string; position: [number, number] }>;

            // Fetch realistic path from OSRM
            const realisticPath = await getRoutePath(segmentCoordinates);

            onSelectRoute(realisticPath, stopsData);
            setIsLoadingPath(false);
        }
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
                        disabled={isLoadingPath}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md flex items-center justify-center gap-2 font-semibold active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingPath ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Loading Route...
                            </>
                        ) : (
                            <>
                                <Search className="h-5 w-5" />
                                Search Routes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RouteSearch;
