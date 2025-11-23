import React, { useState } from 'react';
import Hero from '../components/Hero';
import BusList from '../components/BusList';
import EmergencyButton from '../components/EmergencyButton';
import { buses } from '../data/mockData';

const Home = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = ({ from, to }) => {
        setIsSearching(true);
        // Simulate API call or filtering
        setTimeout(() => {
            const filtered = buses.filter(bus =>
                bus.stops.some(stop => stop.toLowerCase().includes(from.toLowerCase())) &&
                bus.stops.some(stop => stop.toLowerCase().includes(to.toLowerCase()))
            );
            setSearchResults(filtered);
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className="pb-20 min-h-screen bg-brand-dark relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <Hero onSearch={handleSearch} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
                {searchResults !== null && (
                    <div className="mb-12 animate-fade-in-up">
                        <h2 className="text-3xl font-display font-bold text-white mb-8 border-l-4 border-brand-accent pl-4">
                            Search Results
                        </h2>
                        {isSearching ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-accent mx-auto"></div>
                                <p className="mt-4 text-slate-400">Finding the best routes for you...</p>
                            </div>
                        ) : (
                            <BusList buses={searchResults} />
                        )}
                    </div>
                )}

                {searchResults === null && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl font-display font-bold text-white mb-8 border-l-4 border-brand-primary pl-4">
                            Popular Buses
                        </h2>
                        <BusList buses={buses} />
                    </div>
                )}
            </div>
            <EmergencyButton />
        </div>
    );
};

export default Home;
