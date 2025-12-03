import React, { useState, useEffect } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import BusRating from './BusRating';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Bus review object
 * @typedef {Object} Review
 * @property {string} id - Unique review ID
 * @property {string} busId - Bus route ID
 * @property {string} userId - User ID who wrote review
 * @property {string} userName - Name of reviewer
 * @property {number} rating - Star rating (1-5)
 * @property {string} comment - Review text
 * @property {string} date - Review date
 */
interface Review {
    id: string;
    busId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

/**
 * Props for ReviewModal component
 * @typedef {Object} ReviewModalProps
 * @property {boolean} isOpen - Whether modal is visible
 * @property {Function} onClose - Callback to close modal
 * @property {string} busId - Bus route ID to show reviews for
 * @property {string} busName - Bus route name for display
 */
interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    busId: string;
    busName: string;
}

/**
 * ReviewModal - Modal for viewing and writing bus reviews
 * @component
 * @param {ReviewModalProps} props - Component props
 * @returns {JSX.Element|null} Modal dialog with reviews and review form
 * @remarks
 * Features:
 * - Shows all reviews for selected bus
 * - Displays average rating
 * - Form to add new review (only if logged in and hasn't reviewed)
 * - Prevents duplicate reviews per user
 * @example
 * <ReviewModal isOpen={true} onClose={close} busId="123" busName="Route 5C" />
 */
const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, busId, busName }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [hasUserReviewed, setHasUserReviewed] = useState(false);

    // Fetch reviews when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchReviews();
        }
    }, [isOpen, busId]);

    /**
     * Fetch all reviews for this bus from backend
     * @function fetchReviews
     * @returns {Promise<void>} Loads reviews and checks if user already reviewed
     */
    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:3001/reviews?busId=${busId}`);
            const data = await response.json();
            setReviews(data);

            // Check if current user has already reviewed this bus
            if (user) {
                const userReview = data.find((review: Review) => review.userId === user.id);
                setHasUserReviewed(!!userReview);
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        }
    };

    /**
     * Submit a new review to the backend.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
            alert('You need to register or login before rating!');
            onClose();
            navigate('/login');
            return;
        }

        // Check if user has already reviewed this bus
        if (hasUserReviewed) {
            alert('You have already reviewed this bus!');
            return;
        }

        setLoading(true);
        const newReview = {
            id: crypto.randomUUID(),
            busId,
            userId: user.id,
            userName: user.name,
            rating,
            comment,
            date: new Date().toISOString()
        };

        try {
            await fetch('http://localhost:3001/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview)
            });
            setReviews([...reviews, newReview]);
            setRating(0);
            setComment('');
            setHasUserReviewed(true); // Update local state
        } catch (error) {
            console.error('Failed to submit review', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Calculate average rating from all reviews
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop overlay */}
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal content */}
                <div className="relative inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full z-10 border border-slate-700">
                    <div className="bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg leading-6 font-bold text-slate-100" id="modal-title">
                                Reviews for {busName}
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors bg-slate-700/50 p-1 rounded-full hover:bg-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Average rating card */}
                        <div className="mt-4 flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                            <div className="text-4xl font-bold text-slate-100">{averageRating}</div>
                            <div>
                                <BusRating value={parseFloat(averageRating)} readonly />
                                <p className="text-sm text-slate-400 mt-1">{reviews.length} reviews</p>
                            </div>
                        </div>

                        {/* List of reviews */}
                        <div className="mt-6 max-h-60 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {reviews.length === 0 ? (
                                <p className="text-slate-500 text-center py-8 bg-slate-900/30 rounded-xl border border-slate-700/30 border-dashed">
                                    No reviews yet. Be the first to rate!
                                </p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
                                        {/* Reviewer info and date */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-slate-200 flex items-center gap-2">
                                                <div className="bg-slate-700 p-1 rounded-full">
                                                    <UserIcon className="h-3 w-3 text-slate-300" />
                                                </div>
                                                {review.userName}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {/* Star rating */}
                                        <div className="mb-2">
                                            <BusRating value={review.rating} readonly size="sm" />
                                        </div>
                                        {/* Review comment */}
                                        <p className="text-slate-400 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Write review form or login prompt */}
                        {isAuthenticated ? (
                            hasUserReviewed ? (
                                <div className="mt-6 bg-blue-900/20 p-4 rounded-xl text-center border border-blue-500/20">
                                    <p className="text-sm text-blue-400 font-medium">You have already reviewed this bus.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="mt-6 border-t border-slate-700 pt-6">
                                    <h4 className="text-sm font-bold text-slate-200 mb-4">Write a Review</h4>
                                    {/* Rating input */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Rating</label>
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 inline-block">
                                            <BusRating value={rating} onChange={setRating} />
                                        </div>
                                    </div>
                                    {/* Comment input */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Comment</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                                            placeholder="Share your experience..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>
                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={loading || rating === 0}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )
                        ) : (
                            <div className="mt-6 bg-yellow-900/20 p-4 rounded-xl text-center border border-yellow-700/30">
                                <p className="text-sm text-yellow-200 font-medium mb-3">Login to write a review</p>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/login');
                                    }}
                                    className="text-xs bg-yellow-600/20 text-yellow-200 hover:bg-yellow-600/30 px-4 py-2 rounded-lg font-semibold transition-colors border border-yellow-500/30"
                                >
                                    Go to Login / Register
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
