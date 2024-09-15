"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the User type
interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    token: string; // JWT or any other auth token
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the app and provides authentication logic
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage (if persisted) on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to handle login
    const login = async (userData: User) => {
        try {
            setLoading(true);
            // Simulate an API call here (e.g., verify credentials)
            // const response = await apiLogin(userData);

            // Persist user data to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setError(null);
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Logout automatically after token expiration (if applicable)
    useEffect(() => {
        if (user && user.token) {
            const tokenExpirationTime = getTokenExpirationTime(user.token);
            const timeout = setTimeout(() => {
                logout();
                alert('Session expired. You have been logged out.');
            }, tokenExpirationTime - Date.now());

            return () => clearTimeout(timeout); // Clear timeout on component unmount
        }
    }, [user]);

    // Utility function to decode JWT and get the expiration time
    const getTokenExpirationTime = (token: string) => {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.exp * 1000; // Convert to milliseconds
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
