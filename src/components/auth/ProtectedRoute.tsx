import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { session, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F7] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#43866A] mb-3" />
        <p className="font-serif text-sm text-[#777F79]">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
