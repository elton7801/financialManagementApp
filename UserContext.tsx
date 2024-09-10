import React, { createContext, useState, useContext } from 'react';

// Create a context for storing user information
const UserContext = createContext<{ email: string; setEmail: (email: string) => void }>({ email: '', setEmail: () => {} });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [email, setEmail] = useState<string>('');

    return (
        // Provide email and setEmail across the app
        <UserContext.Provider value={{ email, setEmail }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access the UserContext
export const useUser = () => useContext(UserContext);
