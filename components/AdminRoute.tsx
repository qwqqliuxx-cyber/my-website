import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  // Fix: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser || !currentUser.isAdmin) {
    // Redirect them to the home page if they are not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
