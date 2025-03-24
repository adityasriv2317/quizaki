import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminContext } from './AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, adminID, adminData, logout } = useAdminContext();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const storedAdminData = localStorage.getItem('adminData');
      if (storedAdminData) {
        try {
          const parsedData = JSON.parse(storedAdminData);
          const sessionExpiry = new Date(parsedData.sessionExpiry);
          
          if (Date.now() > sessionExpiry.getTime()) {
            logout();
            return false;
          }
          return true;
        } catch (error) {
          console.error('Error checking session:', error);
          logout();
          return false;
        }
      }
      return false;
    };

    if (!checkSession() && location.pathname !== '/admin/login') {
      logout();
    }
  }, [location, logout]);

  if (!isAdmin || !adminID) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;