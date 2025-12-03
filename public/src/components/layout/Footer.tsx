import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

/**
 * Footer - Site footer with company info, links, and contact details
 * @component
 * @returns {JSX.Element} Footer section with three columns
 * @remarks
 * Sections:
 * - Company info with social media links
 * - Support links (Help Center, Contact, Privacy, Terms)
 * - Contact information (Address, Phone, Email, Emergency)
 * - Copyright notice
 */
const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company info and social links */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-blue-400">JatraShongi</h3>
                        <p className="text-gray-400 text-sm">
                            Making daily commuting in Dhaka easier, safer, and more transparent for everyone.
                        </p>
                        {/* Social media links */}
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Support links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/help" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            {/* Address */}
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
                                <span>Bashundhara R/A, Dhaka-1229, Bangladesh</span>
                            </li>
                            {/* Phone */}
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                                <span>+880 1234-567890</span>
                            </li>
                            {/* Email */}
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                                <span>support@jatrashongi.com</span>
                            </li>
                            {/* Emergency contact */}
                            <li className="mt-4 pt-4 border-t border-gray-800">
                                <div className="flex items-center gap-2 text-red-500 font-bold">
                                    <Phone className="h-5 w-5" />
                                    <span>Emergency: 999</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} JatraShongi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
