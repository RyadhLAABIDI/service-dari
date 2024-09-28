import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { isAuthenticated as checkAuth } from './helpers/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    clientId: null,    // On inclut à la fois clientId
    providerId: null,  // et providerId
  });

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus.isAuthenticated);

    if (authStatus.isAuthenticated) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const clientId = localStorage.getItem('clientId');
          console.log('clientId from localStorage:', clientId);
          const providerId = localStorage.getItem('providerId');
          const response = await axios.get('http://localhost:9001/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser({
            ...response.data,
            clientId,    // Inclure clientId si c'est un utilisateur client
            providerId,  // Inclure providerId si c'est un fournisseur
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      };

      fetchUser();
    }

    setLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({ clientId: null, providerId: null });
    localStorage.removeItem('token');
    localStorage.removeItem('clientId');
    localStorage.removeItem('providerId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
