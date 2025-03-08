import React, { createContext, useState } from 'react';
import { useContext } from 'react';

const webContext = createContext();

export const WebData = ({ children }) => {
    const [siteData, setSiteData] = useState({
        user: "Aditya",
        email: "aditya@mail.com",
        isLogin: true,
        code: null,
    });

    const userLogout = () => {
        setSiteData((prev) => ({
            ...prev,
            user: null,
            isLogin: false,
            code: null,
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
        <webContext.Provider value={{ siteData, setSiteData, userLogin, userLogout }}>
            {children}
        </webContext.Provider>
    );
};

export const useWebData = () => useContext(webContext);