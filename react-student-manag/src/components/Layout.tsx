
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

interface LayoutProps {
  requireAuth?: boolean;
  requiredRole?: 'student' | 'admin';
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  requireAuth = false,
  requiredRole,
  children,
}) => {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-green-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication if required
  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  // Check role if required
  if (user && requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
