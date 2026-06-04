import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export function CrmProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/crm/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
