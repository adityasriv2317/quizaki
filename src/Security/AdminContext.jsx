import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminID, setAdminID] = useState(null);

  useEffect(() => {
    // Check for existing admin session in localStorage
    const storedAdminID = localStorage.getItem('adminID');
    if (storedAdminID) {
      setAdminID(storedAdminID);
      setIsAdmin(true);
    }
  }, []);

  const login = async (email) => {
    // Here you would typically make an API call to verify credentials
    // For now, we'll just set the admin state
    setAdminID(email);
    setIsAdmin(true);
    localStorage.setItem('adminID', email);
  };

  const logout = () => {
    setAdminID(null);
    setIsAdmin(false);
    localStorage.removeItem('adminID');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminID, login, logout }}>
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