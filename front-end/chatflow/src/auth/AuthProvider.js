import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Contexts
const AuthContext = createContext();
const UserContext = createContext();

// Custom hooks to use auth and user state in any component
export const useAuth = () => useContext(AuthContext);
export const useUser = () => useContext(UserContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem("site") || null);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);

        // Persist to localStorage
        // document.cookie = `token=${authToken}; path=/; secure=true; HttpOnly`;
        localStorage.setItem("site", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        // Remove from localStorage
        localStorage.removeItem("site");
        localStorage.removeItem("user");
    };

    useEffect(() => {
        if (token && !user) {
            // Optional: Validate token and fetch user data from API
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            <UserContext.Provider value={user}>
                {children}
            </UserContext.Provider>
        </AuthContext.Provider>
    );
};
