import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Props for RegisterForm component
 * @typedef {Object} RegisterFormProps
 * @property {Function} [onSuccess] - Callback after successful registration
 */
interface RegisterFormProps {
    onSuccess?: () => void;
}

/**
 * RegisterForm - User registration form with name, email, and password fields
 * @component
 * @param {RegisterFormProps} props - Component props
 * @returns {JSX.Element} Registration form with validation and error display
 * @remarks
 * Features:
 * - Full name, email, and password input fields with icons
 * - Error message display for validation failures
 * - Loading state during account creation
 * - Calls useAuth hook to register new user
 * - Password minimum length: 6 characters
 */
const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    /**
     * Handle form submission and user registration
     * @function handleSubmit
     * @param {React.FormEvent} e - Form submission event
     * @returns {Promise<void>} Creates user account and calls onSuccess callback
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register({ name, email, password });
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-900/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm border border-red-500/20">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                    Full Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        id="name"
                        required
                        className="bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 pr-3 py-2.5 rounded-xl outline-none transition-all"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                    Email address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        required
                        className="bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 pr-3 py-2.5 rounded-xl outline-none transition-all"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="password"
                        id="password"
                        required
                        minLength={6}
                        className="bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 pr-3 py-2.5 rounded-xl outline-none transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;
