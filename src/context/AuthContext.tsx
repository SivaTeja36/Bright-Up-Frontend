import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin } from '../api/auth';
import { AuthContextType, LoginRequest } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      try {
        // Check if token is expired
        const decodedToken: any = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token expired, clear storage and state
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Invalid token, clear storage and state
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiLogin(credentials);
      const { token } = response;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};