// Utility functions for managing authentication state
export const setAuthData = (token: string, user: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Dispatch custom event to notify components
        window.dispatchEvent(new Event('authStateChanged'));
    }
};

export const clearAuthData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        // Dispatch custom event to notify components
        window.dispatchEvent(new Event('authStateChanged'));
    }
};

export const getAuthData = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                return { token, user, isAuthenticated: true };
            } catch (error) {
                console.error('Error parsing user data:', error);
                clearAuthData();
                return { token: null, user: null, isAuthenticated: false };
            }
        }
    }

    return { token: null, user: null, isAuthenticated: false };
};
