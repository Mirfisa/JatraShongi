import { MapPin } from 'lucide-react';

/**
 * Home - Landing page with hero section
 * @component
 * @returns {JSX.Element} Home page with hero and feature card
 * @remarks
 * Features:
 * - Hero section with call-to-action
 * - Feature card (Accurate Routes)
 */
const Home: React.FC = () => {
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
                        Navigate Dhaka with ease. Travel safely with JatraShongi.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    {/* Section title and description */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Why Choose JatraShongi?</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">We make your daily commute easier and predictable.</p>
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
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

