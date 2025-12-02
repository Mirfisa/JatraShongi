import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Props for the BusRating component
 * 
 * @interface IBusRatingProps
 */
interface IBusRatingProps {
    /** The current rating value (1-5) */
    value: number;
    /** Callback function when rating changes */
    onChange?: (rating: number) => void;
    /** Whether the rating is read-only (non-interactive) */
    readonly?: boolean;
    /** Size variant of the stars */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Bus Rating Component
 * 
 * A star-based rating component that displays and optionally allows editing of ratings.
 * Supports hover effects for interactive mode and read-only display mode.
 * 
 * @param props - Component props
 * @returns A star rating display/input component
 * 
 * @remarks
 * The component renders 5 stars and highlights them based on the current value.
 * In interactive mode (readonly=false), users can hover and click to change ratings.
 * In read-only mode, the component only displays the rating without interaction.
 * 
 * @example
 * ```tsx
 * // Interactive rating
 * <BusRating value={rating} onChange={setRating} size="md" />
 * 
 * // Read-only display
 * <BusRating value={4} readonly size="sm" />
 * ```
 */
const BusRating: React.FC<IBusRatingProps> = ({ value, onChange, readonly = false, size = 'md' }) => {
    const [hover, setHover] = useState(0);

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
