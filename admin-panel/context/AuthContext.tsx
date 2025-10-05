import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth on mount...');
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');
        console.log('Found token:', !!token, 'Found userData:', !!userData);
        
        if (token && userData) {
          // In a real app, you would validate the token with your backend
          const parsedUser = JSON.parse(userData);
          console.log('Setting user from localStorage:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('No valid session found');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Debug user state changes
  useEffect(() => {
    console.log('User state changed:', user);
    console.log('isAuthenticated:', !!user);
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', { email, password });
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, validate with backend
      if (email === 'admin@pragatipath.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'admin',
          avatar: '/logo.png'
        };
        
        console.log('Setting user data:', userData);
        setUser(userData);
        localStorage.setItem('admin_token', 'mock_jwt_token');
        localStorage.setItem('admin_user', JSON.stringify(userData));
        console.log('User set, isAuthenticated should be true');
        console.log('Current user state after login:', userData);
        return true;
      }
      
      console.log('Invalid credentials for:', email);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
