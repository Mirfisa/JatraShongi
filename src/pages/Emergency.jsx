import React from 'react';
import { Phone, Shield, Truck } from 'lucide-react';
import { emergencyContacts } from '../data/mockData';

const Emergency = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Emergency Contacts</h1>
                <p className="text-lg text-gray-600">
                    Quick access to emergency services in Dhaka. Tap to call.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {emergencyContacts.map((contact, index) => (
                    <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow border border-red-100">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-6">
                            {contact.type === 'Police' && <Shield className="h-8 w-8" />}
                            {contact.type === 'Fire' && <Truck className="h-8 w-8" />}
                            {contact.type === 'General' && <Phone className="h-8 w-8" />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.name}</h3>
                        <a
                            href={`tel:${contact.number}`}
                            className="text-2xl font-bold text-red-600 hover:text-red-700 block mb-4"
                        >
                            {contact.number}
                        </a>
                        <button
                            onClick={() => window.location.href = `tel:${contact.number}`}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                        >
                            Call Now
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            <span className="font-bold">Safety Tip:</span> Always share your live location with trusted contacts when traveling late at night.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Emergency;
