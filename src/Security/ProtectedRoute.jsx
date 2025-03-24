import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminContext } from './AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, adminID } = useAdminContext();
  const location = useLocation();

  if (!isAdmin || !adminID) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 