import { createContext, useState, useEffect, useCallback } from 'react';
import { getStoredUser, isAuthenticated, logout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = getStoredUser();
      const authenticated = isAuthenticated();
      
      setUser(storedUser);
      setIsAuth(authenticated);
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const loginUser = useCallback((userData) => {
    setUser(userData);
    setIsAuth(true);
  }, []);

  const logoutUser = useCallback(() => {
    logout();
    setUser(null);
    setIsAuth(false);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        loginUser,
        logoutUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;