import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, DollarSign, Clock } from 'lucide-react';
import { SORTED_LOCATIONS } from '../data/mockRoutes';
import SearchableSelect from '../components/ui/SearchableSelect';

/**
 * Home - Landing page with hero section and route search
 * @component
 * @returns {JSX.Element} Home page with search form and feature cards
 * @remarks
 * Features:
 * - Hero section with call-to-action
 * - Route search form with location selectors
 * - Three feature cards (Accurate Routes, Transparent Fares, Save Time)
 */
const Home: React.FC = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    /**
     * Navigate to routes page with search parameters
     * @function handleSearch
     * @returns {void} Navigates to /routes with from/to query params
     */
    const handleSearch = () => {
        if (from || to) {
            navigate(`/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
        } else {
            navigate('/routes');
        }
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-visible">
                {/* Background shapes for styling */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600 blur-3xl mix-blend-screen"></div>
                    <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-purple-600 blur-3xl mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-indigo-600 blur-3xl mix-blend-screen"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-20">
                    {/* Hero Title and Description */}
                    <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                        Your Trusted <br />
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Travel Companion</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Navigate Dhaka with ease. Find the best bus routes, check accurate fares, and travel safely with JatraShongi.
                    </p>

                    {/* Search form for finding routes */}
                    <div className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-blue-900/20 p-8 max-w-4xl mx-auto text-slate-200 border border-slate-700/50 overflow-visible">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Pick starting location */}
                            <div className="relative group z-10">
                                <label className="block text-sm font-semibold text-slate-400 mb-2 text-left ml-1">From</label>
                                <SearchableSelect
                                    options={SORTED_LOCATIONS}
                                    value={from}
                                    onChange={setFrom}
                                    placeholder="Select pickup location"
                                    icon={<MapPin className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />}
                                />
                            </div>

                            {/* Pick destination */}
                            <div className="relative group z-10">
                                <label className="block text-sm font-semibold text-slate-400 mb-2 text-left ml-1">To</label>
                                <SearchableSelect
                                    options={SORTED_LOCATIONS}
                                    value={to}
                                    onChange={setTo}
                                    placeholder="Select destination"
                                    icon={<MapPin className="h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />}
                                />
                            </div>

                            {/* Search button */}
                            <div className="flex items-end">
                                <button
                                    onClick={handleSearch}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md flex items-center justify-center gap-2 font-semibold text-lg active:scale-95"
                                >
                                    <Search className="h-5 w-5" />
                                    Find Bus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    {/* Section title and description */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Why Choose JatraShongi?</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">We make your daily commute easier, predictable, and more transparent.</p>
                    </div>

                    {/* Three main features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 border border-slate-700 hover:-translate-y-1 group">
                            <div className="bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-900/50 transition-colors border border-blue-500/20">
                                <MapPin className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Accurate Routes</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Find the most efficient bus routes across Dhaka city with detailed stop information and real-time path visualization.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-green-900/20 transition-all duration-300 border border-slate-700 hover:-translate-y-1 group">
                            <div className="bg-green-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-900/50 transition-colors border border-green-500/20">
                                <DollarSign className="h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Transparent Fares</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Know the official government-approved fare before you board. No more overcharging, bargaining, or confusion.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300 border border-slate-700 hover:-translate-y-1 group">
                            <div className="bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-900/50 transition-colors border border-purple-500/20">
                                <Clock className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Save Time</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Compare routes by estimated time and distance to reach your destination faster and avoid unnecessary delays.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
