/**
 * @module AuthContext
 * Authentication state management using React Context API
 * @remarks
 * Provides user login/logout functionality and auth state across the entire app.
 * Persists user data to localStorage for session persistence.
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authService } from '../services/authService';

/**
 * Authentication context type definition
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Currently logged in user or null
 * @property {Function} login - Login function
 * @property {Function} register - Register function
 * @property {Function} logout - Logout function
 * @property {boolean} isAuthenticated - Whether user is logged in
 * @property {boolean} isLoading - Whether auth state is still loading
 */
interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Wraps app and manages authentication state
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Context provider wrapping children
 * @remarks
 * Loads user from localStorage on mount.
 * Provides login, register, and logout functions to all children.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage when component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    /**
     * Log in user with credentials
     * @function login
     * @param {LoginCredentials} credentials - Email and password
     * @returns {Promise<void>} Promise that resolves on successful login
     * @throws {Error} If login fails
     */
    const login = async (credentials: LoginCredentials) => {
        try {
            const user = await authService.login(credentials);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            throw error;
        }
    };

    /**
     * Register a new user account
     * @function register
     * @param {RegisterCredentials} credentials - Registration details
     * @returns {Promise<void>} Promise that resolves on successful registration
     * @throws {Error} If registration fails
     */
    const register = async (credentials: RegisterCredentials) => {
        try {
            const user = await authService.register(credentials);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            throw error;
        }
    };

    /**
     * Log out current user and clear stored data
     * @function logout
     * @returns {void}
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to access authentication context
 * @hook useAuth
 * @returns {AuthContextType} Auth context with user state and functions
 * @throws {Error} If used outside AuthProvider
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
