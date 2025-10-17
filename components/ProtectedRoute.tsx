import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MembershipRequiredModal from './MembershipRequiredModal';

interface ProtectedRouteProps {
  children: React.ReactElement;
  membershipRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, membershipRequired = false }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const handleCloseModal = () => {
    navigate('/', { replace: true });
  };

  if (membershipRequired && !currentUser.isMember) {
     return <MembershipRequiredModal onClose={handleCloseModal} />;
  }

  return children;
};

export default ProtectedRoute;