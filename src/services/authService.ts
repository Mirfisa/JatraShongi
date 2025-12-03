import type { User, LoginCredentials, RegisterCredentials } from '../types/auth';

const API_URL = 'http://localhost:3000';

export const authService = {
    async login(credentials: LoginCredentials): Promise<User> {
        const response = await fetch(`${API_URL}/users?email=${credentials.email}&password=${credentials.password}`);
        const users = await response.json();

        if (users.length > 0) {
            return users[0];
        }
        throw new Error('Invalid email or password');
    },

    async register(credentials: RegisterCredentials): Promise<User> {
        // Check if user already exists
        const checkResponse = await fetch(`${API_URL}/users?email=${credentials.email}`);
        const existingUsers = await checkResponse.json();

        if (existingUsers.length > 0) {
            throw new Error('User already exists with this email');
        }

        const newUser = {
            id: crypto.randomUUID(),
            name: credentials.name,
            email: credentials.email,
            password: credentials.password, // In a real app, this should be hashed
            role: 'user'
        };

        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
    }
};
