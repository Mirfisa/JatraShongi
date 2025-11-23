import React from 'react';
import { Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmergencyButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/emergency')}
            className="fixed bottom-8 right-8 z-50 group"
            aria-label="Emergency"
        >
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25 group-hover:opacity-40"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-rose-600 text-white p-4 rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-110 flex items-center justify-center">
                <Phone className="h-6 w-6 animate-pulse" />
            </div>
        </button>
    );
};

export default EmergencyButton;
