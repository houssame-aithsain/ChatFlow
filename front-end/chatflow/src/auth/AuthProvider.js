import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Context for authentication state
const AuthContext = createContext();

// Custom hook to use auth state in any component
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || null);

    // This function will be called to login and set user and token
    const login = (userData, authToken) => {
        console.log("userData", userData);
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("site", authToken); // Save token in localStorage
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        console.log("setting token to null");
        localStorage.removeItem("site");
    };

    useEffect(() => {
        // Automatically check token when app loads
        if (token) {
            // You can make an API call here to verify the token, or handle session persistence
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
