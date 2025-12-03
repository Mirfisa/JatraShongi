import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Props for BusRating component
 * @typedef {Object} BusRatingProps
 * @property {number} value - Star rating value (0-5)
 * @property {Function} [onChange] - Callback when rating changes
 * @property {boolean} [readonly=false] - If true, display-only mode
 * @property {'sm'|'md'|'lg'} [size='md'] - Star size
 */
interface BusRatingProps {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * BusRating - 5-star rating component for displaying or setting ratings
 * @component
 * @param {BusRatingProps} props - Component props
 * @returns {JSX.Element} Star rating UI
 * @remarks
 * - Interactive mode: click to set rating, hover to preview
 * - Readonly mode: displays current rating value
 * - Supports three size variants
 * @example
 * <BusRating value={4} onChange={(val) => setRating(val)} />
 */
const BusRating: React.FC<BusRatingProps> = ({ value, onChange, readonly = false, size = 'md' }) => {
    const [hover, setHover] = useState(0);

    // Size options for star icons
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    className={`focus:outline-none ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
                    onClick={() => !readonly && onChange && onChange(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(value)}
                >
                    {/* Star icon - filled if <= hovered or current value */}
                    <Star
                        className={`${sizeClasses[size]} ${star <= (hover || value) ? 'text-yellow-400 fill-current' : 'text-slate-600'
                            } transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
};

export default BusRating;
