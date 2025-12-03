import React from 'react';
import { PhoneCall } from 'lucide-react';

/**
 * EmergencyButton - Fixed button for quick emergency contact
 * @component
 * @returns {JSX.Element} Emergency button with phone icon
 * @remarks
 * Features:
 * - Fixed position at bottom-right of screen
 * - Pulsing animation to draw attention
 * - Red color for emergency alert visibility
 * - TODO: Connect to real emergency services (999) and location sharing
 */
const EmergencyButton: React.FC = () => {
    /**
     * Handle emergency button click
     * @function handleEmergency
     * @returns {void} Shows alert and triggers emergency sequence
     * @remarks Currently shows alert; will call 999 and share location
     */
    const handleEmergency = () => {
        // TODO: Implement emergency logic (call 999, share location)
        alert("Emergency Alert Triggered! Calling 999...");
    };

    return (
        <button
            onClick={handleEmergency}
            className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-110 z-50 flex items-center justify-center"
            title="Emergency: Call 999"
        >
            <PhoneCall className="h-6 w-6 animate-pulse" />
        </button>
    );
};

export default EmergencyButton;
