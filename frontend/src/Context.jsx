import { useState, createContext } from "react";

export const AuthContext = createContext();
export const NotifContext = createContext();

export const InterfaceProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [notifStack, setNotifStack] = useState([]);
    const addToNotifs = (notif) => {
        setNotifStack((prev) => {
            const newStack = [{...notif, id: crypto.randomUUID()}, ...prev];
            return newStack.slice(0, 5);
        });
    };

    const getAuthToken = () => localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME) || null;
    const forceLogout = () => {
        localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_VAR_NAME);
        localStorage.removeItem(import.meta.env.VITE_AUTH_USER_VAR_NAME);
        setIsAuthenticated(false);
    };
    
    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, getAuthToken, forceLogout }}>
            <NotifContext.Provider value={{notifStack, addToNotifs, setNotifStack}}>
                {children}
            </NotifContext.Provider>
        </AuthContext.Provider>
    );
};