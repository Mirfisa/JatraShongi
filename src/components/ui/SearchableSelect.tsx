/**
 * @module SearchableSelect
 * Reusable searchable dropdown component with filter capability
 * @remarks
 * Features:
 * - Real-time search/filter of options
 * - Click-outside detection to close dropdown
 * - Keyboard navigation support
 * - Size variants (sm, md, lg)
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

/**
 * Props for SearchableSelect component
 * @typedef {Object} SearchableSelectProps
 * @property {string[]} options - Available selection options
 * @property {string} value - Currently selected value
 * @property {Function} onChange - Callback when value changes
 * @property {string} [placeholder='Select...'] - Placeholder text
 * @property {React.ReactNode} [icon] - Icon to display in input
 * @property {string} [className=''] - Additional CSS classes
 */
interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    icon,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search term
    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, options]);

    useEffect(() => {
        // Reset search term when value changes externally or is selected
        if (value) {
            // Show the value as placeholder if not searching
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // If closed without selection, reset search to current value if exists
                if (!value) {
                    setSearchTerm('');
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef, value]);

    /**
     * When user selects an option, save it and close dropdown.
     */
    const handleSelect = (option: string) => {
        onChange(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearchTerm('');
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            {/* Main input field */}
            <div
                className="relative cursor-text"
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* Icon on left side */}
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        {icon}
                    </div>
                )}

                {/* Search/input field */}
                <input
                    ref={inputRef}
                    type="text"
                    className={`w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:bg-slate-900/80 text-slate-200 placeholder-slate-500 ${isOpen ? 'ring-2 ring-blue-500 bg-slate-900/80' : ''}`}
                    placeholder={value || placeholder}
                    value={isOpen ? searchTerm : (value || '')}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                        // If user clears input, clear value
                        if (e.target.value === '' && value) {
                            onChange('');
                        }
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm(''); // Clear search on focus
                    }}
                />

                {/* Clear and chevron buttons on right */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {value && (
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown menu with options */}
            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                    {filteredOptions.length > 0 ? (
                        <div className="py-1">
                            {filteredOptions.map((option) => (
                                <button
                                    key={option}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700 hover:text-blue-400 transition-colors flex items-center justify-between ${value === option ? 'bg-slate-700 text-blue-400 font-medium' : 'text-slate-200'}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                    {value === option && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">
                            No locations found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
