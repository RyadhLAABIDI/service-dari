// import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assurez-vous d'avoir le bon chemin vers votre AuthContext

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, loading, user } = useAuth(); // Supposez que `user` contient les informations de l'utilisateur, y compris son rôle

  if (loading) {
    return <div>Loading...</div>; // Vous pouvez utiliser un spinner ici
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />; // Redirige vers une page "unauthorized" si le rôle ne correspond pas
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string, // Ajoutez `role` comme prop facultative
};

export default PrivateRoute;
