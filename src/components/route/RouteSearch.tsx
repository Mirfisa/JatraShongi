import React, { useState, useEffect } from 'react';
import SearchableSelect from '../ui/SearchableSelect';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Search, Bus, ArrowRight } from 'lucide-react';
import { MOCK_ROUTES, SORTED_LOCATIONS, type BusRoute } from '../../data/mockRoutes';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { getRoutePath } from '../../utils/routeService';

/**
 * Search result for a route query
 * @typedef {Object} SearchResult
 * @property {'direct'|'connecting'} type - Whether route is direct or requires transfer
 * @property {BusRoute[]} routes - Bus routes involved
 * @property {string} [transferPoint] - Location of transfer if connecting route
 * @property {number} totalStops - Number of stops
 */
interface SearchResult {
    type: 'direct' | 'connecting';
    routes: BusRoute[];
    transferPoint?: string;
    totalStops: number;
}

/**
 * Props for RouteSearch component
 * @typedef {Object} RouteSearchProps
 * @property {Function} [onSelectRoute] - Callback when user selects a route to view on map
 */
interface RouteSearchProps {
    onSelectRoute?: (path: [number, number][], stops?: Array<{ name: string; position: [number, number] }>) => void;
}

/**
 * RouteSearch - Search and filter bus routes between locations
 * @component
 * @param {RouteSearchProps} props - Component props
 * @returns {JSX.Element} Search form, results grid
 * @remarks
 * Features:
 * - Search routes from/to with location selectors
 * - Display direct and connecting routes
 * - View route on interactive map
 * @example
 * <RouteSearch onSelectRoute={(path, stops) => setRoute({ path, stops })} />
 */
const RouteSearch: React.FC<RouteSearchProps> = ({ onSelectRoute }) => {
    const [searchParams] = useSearchParams();
    const [from, setFrom] = useState(searchParams.get('from') || '');
    const [to, setTo] = useState(searchParams.get('to') || '');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoadingPath, setIsLoadingPath] = useState(false);

    useEffect(() => {
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');

        if (fromParam || toParam) {
            setFrom(fromParam || '');
            setTo(toParam || '');
            performSearch(fromParam || '', toParam || '');
        }
    }, [searchParams]);

    const performSearch = async (searchFrom: string, searchTo: string) => {
        setHasSearched(true);
        setSearchResults([]);

        if (!searchFrom && !searchTo) {
            return;
        }

        const normalizedFrom = searchFrom.toLowerCase();
        const normalizedTo = searchTo.toLowerCase();
        const results: SearchResult[] = [];

        // Find direct routes (single bus from A to B)
        const directRoutes = MOCK_ROUTES.filter(route => {
            const fromMatch = route.stops.some(stop => stop.toLowerCase().includes(normalizedFrom));
            const toMatch = route.stops.some(stop => stop.toLowerCase().includes(normalizedTo));
            return fromMatch && toMatch;
        });

        // Process direct routes
        for (const route of directRoutes) {
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

                results.push({
                    type: 'direct',
                    routes: [route],
                    totalStops: segmentStops.length
                });
            }
        }

        setSearchResults(results);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(from, to);
    };

    /**
     * When user clicks a route, show it on the map.
     */
    const handleViewOnMap = async (result: SearchResult) => {
        if (onSelectRoute) {
            setIsLoadingPath(true);
            const normalizedFrom = from.toLowerCase();
            const normalizedTo = to.toLowerCase();
            let segmentStops: string[] = [];
            let segmentCoordinates: [number, number][] = [];

            if (result.type === 'direct') {
                const route = result.routes[0];
                const startIndex = route.stops.findIndex(stop => stop.toLowerCase().includes(normalizedFrom));
                const endIndex = route.stops.findIndex(stop => stop.toLowerCase().includes(normalizedTo));

                if (startIndex !== -1 && endIndex !== -1) {
                    const start = Math.min(startIndex, endIndex);
                    const end = Math.max(startIndex, endIndex);
                    segmentStops = route.stops.slice(start, end + 1);
                } else {
                    segmentStops = route.stops;
                }
            } else if (result.type === 'connecting' && result.transferPoint) {
                // Leg 1
                const route1 = result.routes[0];
                const start1 = route1.stops.findIndex(stop => stop.toLowerCase().includes(normalizedFrom));
                const end1 = route1.stops.findIndex(stop => stop === result.transferPoint);

                if (start1 !== -1 && end1 !== -1) {
                    const s1 = Math.min(start1, end1);
                    const e1 = Math.max(start1, end1);
                    segmentStops = [...segmentStops, ...route1.stops.slice(s1, e1 + 1)];
                }

                // Leg 2
                const route2 = result.routes[1];
                const start2 = route2.stops.findIndex(stop => stop === result.transferPoint);
                const end2 = route2.stops.findIndex(stop => stop.toLowerCase().includes(normalizedTo));

                if (start2 !== -1 && end2 !== -1) {
                    const s2 = Math.min(start2, end2);
                    const e2 = Math.max(start2, end2);
                    // Avoid duplicating transfer point if it's already added
                    const stops2 = route2.stops.slice(s2, e2 + 1);
                    if (segmentStops.length > 0 && stops2[0] === segmentStops[segmentStops.length - 1]) {
                        stops2.shift();
                    }
                    segmentStops = [...segmentStops, ...stops2];
                }
            }

            // Map stops to coordinates
            segmentCoordinates = segmentStops
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
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md flex items-center justify-center gap-2 font-semibold active:scale-[0.98]"
                    >
                        <Search className="h-5 w-5" />
                        Search Routes
                    </button>
                </form>
            </div>

            {/* Search Results */}
            {hasSearched && (
                <div className="space-y-6">
                    {/* Result count */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-lg font-bold text-slate-100">
                            {searchResults.length} Route Option{searchResults.length !== 1 && 's'} Found
                        </h3>
                    </div>

                    {searchResults.length > 0 ? (
                        <div className="grid gap-5">
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleViewOnMap(result)}
                                    className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-700/50 hover:shadow-md hover:border-blue-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden ${isLoadingPath ? 'opacity-70 pointer-events-none' : ''}`}
                                >
                                    {/* Loading spinner overlay */}
                                    {isLoadingPath && (
                                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    )}

                                    {/* Connecting route badge */}
                                    {result.type === 'connecting' && (
                                        <div className="mb-4 bg-orange-900/20 text-orange-400 px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 border border-orange-500/20">
                                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                            Connecting Route via {result.transferPoint}
                                        </div>
                                    )}

                                    {/* Bus route details */}
                                    {result.routes.map((route, rIndex) => (
                                        <div key={route.id} className={`${rIndex > 0 ? 'mt-6 pt-6 border-t border-slate-700 border-dashed' : ''}`}>
                                            {/* Bus name, company */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-xl font-bold text-slate-100 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                                                        <Bus className="h-5 w-5 text-blue-500" />
                                                        {route.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-400 font-medium ml-7">{route.company}</p>
                                                </div>
                                            </div>

                                            {/* Route info card */}
                                            <div className="mt-4 bg-slate-900/50 rounded-xl p-4 group-hover:bg-slate-800/50 transition-colors border border-slate-700/30">
                                                <div className="flex items-start gap-3 text-sm text-slate-300">
                                                    <span className="font-semibold min-w-[50px] text-slate-500">Route:</span>
                                                    <span className="text-slate-200 font-medium leading-relaxed">
                                                        {route.startLocation} <ArrowRight className="inline h-3.5 w-3.5 mx-1 text-slate-600" /> {route.endLocation}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-start gap-3 text-xs text-slate-400">
                                                    <span className="font-semibold min-w-[50px] text-slate-500">Stops:</span>
                                                    <span className="leading-relaxed">{route.stops.join(', ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* "Tap to view on map" hint */}
                                    <div className="mt-4 flex justify-end">
                                        <span className="text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            Tap to view on map <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-yellow-900/20 p-6 rounded-2xl text-yellow-200 text-center border border-yellow-700/30">
                            <p className="font-medium">No routes found matching your criteria.</p>
                            <p className="text-sm mt-1 opacity-80">Try different locations or major hubs.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RouteSearch;

