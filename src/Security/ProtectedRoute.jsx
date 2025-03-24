import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminContext } from './AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, adminID } = useAdminContext();
  const location = useLocation();

  useEffect(() => {
    // Double check localStorage on component mount
    const storedAdminID = localStorage.getItem('adminID');
    if (!storedAdminID && (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login')) {
      window.location.href = '/admin/login';
    }
  }, [location]);

  if (!isAdmin || !adminID) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;