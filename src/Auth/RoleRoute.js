
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../Common/Loading';

const RoleRoute = ({ requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
