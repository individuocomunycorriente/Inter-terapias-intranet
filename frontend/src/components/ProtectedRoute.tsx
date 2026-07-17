import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Si no está logueado, al login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si su rol no está autorizado para esta vista
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  // Si todo está bien, renderiza la página solicitada
  return <Outlet />;
};

export default ProtectedRoute;
