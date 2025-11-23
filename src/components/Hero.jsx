import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const Hero = ({ onSearch }) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ from, to });
    };

    return (
        <div className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-brand-dark">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative max-w-4xl mx-auto text-center z-10">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass border-brand-accent/30">
                    <span className="text-brand-accent text-sm font-medium tracking-wide uppercase">Dhaka's Smart Transit</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-white leading-tight">
                    Find Your Way <br />
                    <span className="text-gradient">In The City</span>
                </h1>

                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
                    Real-time routes, accurate fares, and safe travel across Dhaka.
                    Experience the future of public transport.
                </p>

                <form onSubmit={handleSubmit} className="glass p-2 rounded-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2 shadow-2xl shadow-brand-primary/10">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="From (e.g., Mirpur)"
                            className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-transparent rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-brand-accent/50 transition-all"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-brand-violet transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="To (e.g., Gulshan)"
                            className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-transparent rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-brand-violet/50 transition-all"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-brand-primary to-brand-violet text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/25 flex items-center justify-center gap-2 md:w-auto w-full"
                    >
                        <Search className="h-5 w-5" />
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Hero;
