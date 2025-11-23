import React from 'react';
import BusCard from './BusCard';

const BusList = ({ buses }) => {
    if (!buses || buses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No buses found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {buses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
            ))}
        </div>
    );
};

export default BusList;
