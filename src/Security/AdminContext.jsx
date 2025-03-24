import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminID, setAdminID] = useState(null);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Check for existing admin session in localStorage
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      const parsedData = JSON.parse(storedAdminData);
      setAdminID(parsedData.email);
      setAdminData(parsedData);
      setIsAdmin(true);
    }
  }, []);

  const login = async (email) => {
    const adminInfo = {
      email,
      loginTime: new Date().toISOString(),
      lastActive: new Date().toISOString()
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