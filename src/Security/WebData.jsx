import React, { createContext, useState } from 'react';
import { useContext } from 'react';

const webContext = createContext();

export const WebData = ({ children }) => {
    const [siteData, setSiteData] = useState({
        user: "Aditya",
        isLogin: false,
    });

    const userLogout = () => {
        setSiteData((prev) => ({
            ...prev,
            user: null,
            isLogin: false,
        }));
    };

    const userLogin = (user) => {
        setSiteData((prev) => ({
            ...prev,
            user: user,
            isLogin: true,
        }));
    };

    return (
        <webContext.Provider value={{ siteData, userLogin, userLogout }}>
            {children}
        </webContext.Provider>
    );
};

export const useWebData = () => useContext(webContext);