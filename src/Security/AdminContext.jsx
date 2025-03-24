import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminID, setAdminID] = useState(null);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      try {
        const parsedData = JSON.parse(storedAdminData);
        if (parsedData && parsedData.email) {
          setAdminID(parsedData.email);
          setAdminData(parsedData);
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminData');
      }
    }
  }, []);

  const login = async (email) => {
    const adminInfo = {
      email,
      loginTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    setAdminID(email);
    setAdminData(adminInfo);
    setIsAdmin(true);
    localStorage.setItem('adminData', JSON.stringify(adminInfo));
  };

  const logout = () => {
    setAdminID(null);
    setAdminData(null);
    setIsAdmin(false);
    localStorage.removeItem('adminData');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminID, adminData, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};