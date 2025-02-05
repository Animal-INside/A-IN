import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // useAuth.js의 AuthProvider에 signup 추가 20250126
  const signup = async (userData) => {
    await authService.signup(userData);
  };

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token decode error:', error);
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const token = await authService.login(credentials);
    const decoded = jwtDecode(token);
    setCurrentUser(decoded);
    setIsAuthenticated(true);
    return token;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser,
      loading, 
      login, 
      logout,
      signup 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};