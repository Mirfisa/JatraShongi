import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from './authService';

/**
 * Unit tests for authService login function
 * Tests successful login, invalid credentials, and error handling
 */
describe('authService.login', () => {
    beforeEach(() => {
        // Mock fetch before each test
        vi.stubGlobal('fetch', vi.fn());
    });

    it('should successfully login with valid credentials', async () => {
        // Arrange - Set up mock response
        const mockUser = {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user'
        };

        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [mockUser],
            ok: true
        } as Response);

        // Act - Call login with valid credentials
        const result = await authService.login({
            email: 'john@example.com',
            password: 'password123'
        });

        // Assert - Verify correct user is returned
        expect(result).toEqual(mockUser);
        expect(result.email).toBe('john@example.com');
        expect(result.name).toBe('John Doe');
    });

    it('should throw error with invalid email', async () => {
        // Arrange - Mock empty user response
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [],
            ok: true
        } as Response);

        // Act & Assert - Expect error to be thrown
        await expect(
            authService.login({
                email: 'invalid@example.com',
                password: 'password123'
            })
        ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error with invalid password', async () => {
        // Arrange - Mock empty user response (wrong password scenario)
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [],
            ok: true
        } as Response);

        // Act & Assert - Expect error to be thrown
        await expect(
            authService.login({
                email: 'john@example.com',
                password: 'wrongpassword'
            })
        ).rejects.toThrow('Invalid email or password');
    });

    it('should call fetch with correct API URL and parameters', async () => {
        // Arrange
        const mockUser = {
            id: '123',
            name: 'Jane Doe',
            email: 'jane@example.com',
            role: 'user'
        };

        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [mockUser],
            ok: true
        } as Response);

        // Act
        await authService.login({
            email: 'jane@example.com',
            password: 'password456'
        });

        // Assert - Verify fetch was called with correct URL
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/users?email=jane@example.com&password=password456'
        );
    });

    it('should handle network errors gracefully', async () => {
        // Arrange - Mock network error
        vi.mocked(fetch).mockRejectedValueOnce(
            new Error('Network error')
        );

        // Act & Assert - Expect network error to propagate
        await expect(
            authService.login({
                email: 'john@example.com',
                password: 'password123'
            })
        ).rejects.toThrow('Network error');
    });

    it('should return first user when multiple users exist', async () => {
        // Arrange - Mock multiple user responses
        const user1 = { id: '1', name: 'First User', email: 'test@example.com', role: 'user' };
        const user2 = { id: '2', name: 'Second User', email: 'test@example.com', role: 'user' };

        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [user1, user2],
            ok: true
        } as Response);

        // Act
        const result = await authService.login({
            email: 'test@example.com',
            password: 'password'
        });

        // Assert - Should return first user
        expect(result).toEqual(user1);
        expect(result.id).toBe('1');
    });

    it('should preserve user properties in returned object', async () => {
        // Arrange
        const mockUser = {
            id: 'uuid-12345',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
        };

        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => [mockUser],
            ok: true
        } as Response);

        // Act
        const result = await authService.login({
            email: 'test@example.com',
            password: 'password'
        });

        // Assert - All properties should be preserved
        expect(result.id).toBe('uuid-12345');
        expect(result.name).toBe('Test User');
        expect(result.email).toBe('test@example.com');
        expect(result.role).toBe('user');
    });
});
