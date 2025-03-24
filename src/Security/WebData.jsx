import React, { createContext, useState, useEffect, useContext } from 'react';

const webContext = createContext();

export const WebData = ({ children }) => {
    const [siteData, setSiteData] = useState(() => {
        const savedData = localStorage.getItem('siteData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error('Error parsing site data:', error);
                return {
                    user: null,
                    email: null,
                    isLogin: false,
                    code: null,
                };
            }
        }
        return {
            user: null,
            email: null,
            isLogin: false,
            code: null,
        };
    });

    useEffect(() => {
        localStorage.setItem('siteData', JSON.stringify(siteData));
    }, [siteData]);

    const userLogout = () => {
        setSiteData({
            user: null,
            email: null,
            isLogin: false,
            code: null,
        });
        localStorage.removeItem('siteData');
    };

    const userLogin = (user, email) => {
        setSiteData({
            user,
            email,
            isLogin: true,
            code: null,
        });
    };

    return (    
        <webContext.Provider value={{ siteData, setSiteData, userLogin, userLogout }}>
            {children}
        </webContext.Provider>
    );
};

export const useWebData = () => {
    const context = useContext(webContext);
    if (!context) {
        throw new Error('useWebData must be used within a WebData Provider');
    }
    return context;
};