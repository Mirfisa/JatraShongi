import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

/**
 * Login - Authentication page with login and register forms
 * @component
 * @returns {JSX.Element} Login/Register page with toggleable forms
 * @remarks
 * Features:
 * - Toggle between login and register modes
 * - Conditional form rendering based on isLogin state
 * - Redirect to home on successful authentication
 */
const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    /**
     * Callback after successful login or registration
     * @function handleSuccess
     * @returns {void} Navigates user to home page
     */
    const handleSuccess = () => {
        navigate('/');
    };

    return (
        <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-slate-700/50">
                {/* Header with title and toggle button */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-100">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium text-blue-400 hover:text-blue-300 focus:outline-none underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Show login or register form based on isLogin state */}
                {isLogin ? (
                    <LoginForm onSuccess={handleSuccess} />
                ) : (
                    <RegisterForm onSuccess={handleSuccess} />
                )}
            </div>
        </div>
    );
};

export default Login;
