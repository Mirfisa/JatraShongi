import React, { useState, useEffect } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import BusRating from './bus-rating';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Review data interface
 * 
 * @interface IReview
 * @remarks
 * Represents a single user review for a bus/route.
 * Reviews are stored in the backend and include rating, comment, and metadata.
 */
export interface IReview {
    /** Unique identifier for the review */
    id: string;
    /** ID of the bus or route being reviewed */
    busId: string;
    /** ID of the user who submitted the review */
    userId: string;
    /** Display name of the user who submitted the review */
    userName: string;
    /** Numerical rating from 1-5 */
    rating: number;
    /** Optional text comment */
    comment: string;
    /** ISO 8601 timestamp of when the review was created */
    date: string;
}

/**
 * Props for the ReviewModal component
 * 
 * @interface IReviewModalProps
 */
interface IReviewModalProps {
    /** Whether the modal is currently visible */
    isOpen: boolean;
    /** Callback function to close the modal */
    onClose: () => void;
    /** ID of the bus being reviewed */
    busId: string;
    /** Display name of the bus being reviewed */
    busName: string;
}

/**
 * Review Modal Component
 * 
 * A modal dialog that displays existing reviews and allows authenticated users
 * to submit new reviews for a specific bus/route.
 * 
 * @param props - Component props
 * @returns A modal component for viewing and submitting reviews
 * 
 * @remarks
 * This component handles the following responsibilities:
 * - Fetches and displays all reviews for a specific bus
 * - Provides a form for authenticated users to submit new reviews
 * - Prevents duplicate reviews from the same user
 * - Requires authentication before allowing review submission
 * - Redirects to login page if unauthenticated user attempts to review
 * 
 * The component communicates with a backend API at `http://localhost:3001/reviews`
 * to fetch and store reviews.
 * 
 * @throws May log errors to console if review fetch or submission fails
 * 
 * @example
 * ```tsx
 * <ReviewModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   busId="bus-123"
 *   busName="Dhaka Express"
 * />
 * ```
 */
const ReviewModal: React.FC<IReviewModalProps> = ({ isOpen, onClose, busId, busName }) => {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [hasUserReviewed, setHasUserReviewed] = useState(false);

    useEffect(() => {
        /**
         * Fetches reviews from the backend for the current bus
         * 
         * @remarks
         * Also checks if the current user has already submitted a review
         * to prevent duplicate submissions.
         * 
         * @throws Logs error to console if fetch fails
         */
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/reviews?busId=${busId}`);
                const data = await response.json();
                setReviews(data);

                // Check if current user has already reviewed this bus
                if (user) {
                    const userReview = data.find((review: IReview) => review.userId === user.id);
                    setHasUserReviewed(!!userReview);
                }
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            }
        };

        if (isOpen) {
            fetchReviews();
        }
    }, [isOpen, busId, user]);

    /**
     * Handles review form submission
     * 
     * @param e - Form submit event
     * @returns Promise that resolves when review is submitted
     * 
     * @remarks
     * Validates authentication and duplicate review status before submission.
     * If user is not authenticated, redirects to login page.
     * If user has already reviewed, shows an alert and prevents submission.
     * 
     * @throws Logs error to console if submission fails
     * 
     * @example
     * ```tsx
     * <form onSubmit={handleSubmit}>
     *   // form fields
     * </form>
     * ```
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-700">
                    <h2 className="text-2xl font-bold text-slate-100">
                        Reviews for {busName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-slate-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Review Form */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-slate-100 mb-4">
                            {hasUserReviewed ? 'You have already reviewed this bus' : 'Write a Review'}
                        </h3>
                        {!hasUserReviewed ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-slate-300 font-medium mb-2 block">Your Rating</label>
                                    <BusRating value={rating} onChange={setRating} size="lg" />
                                </div>
                                <div>
                                    <label className="text-slate-300 font-medium mb-2 block">Your Comment</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || rating === 0}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {loading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-slate-400 text-center py-4">
                                Thank you for your feedback! You can only submit one review per bus.
                            </p>
                        )}
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-slate-100">All Reviews ({reviews.length})</h3>
                        {reviews.length === 0 ? (
                            <div className="bg-slate-900/30 rounded-xl p-8 text-center border border-slate-700/50">
                                <p className="text-slate-400">No reviews yet. Be the first to review!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-slate-900/50 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-600 rounded-full p-3 flex-shrink-0">
                                            <UserIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                                <h4 className="text-slate-100 font-semibold">{review.userName}</h4>
                                                <span className="text-slate-500 text-sm">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <BusRating value={review.rating} readonly size="sm" />
                                            <p className="text-slate-300 mt-3 leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
