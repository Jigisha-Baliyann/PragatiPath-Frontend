import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<AuthUser | null>;
  loginWithAadhaar: (aadhaar: string) => Promise<AuthUser | null>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void; // ✅ added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'pragatipath_session';
const USERS_STORAGE_KEY = 'pragatipath_users';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const getUsers = (): AuthUser[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (newUser: AuthUser) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === newUser.id);
    if (index === -1) {
      users.push(newUser);
    } else {
      users[index] = newUser; // update existing
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
  };

  const sendOtp = async (phone: string): Promise<boolean> => {
    console.log(`Sending OTP to ${phone}... (mock: 123456)`);
    return true;
  };

  const verifyOtp = async (phone: string, otp: string): Promise<AuthUser | null> => {
    if (otp === '123456') {
      let existingUser = getUsers().find(u => (u as any).phone === phone); // phone exists only in some AuthUser
      if (!existingUser) {
        existingUser = {
          id: `user_${Date.now()}`,
          name: `User_${phone.slice(-4)}`,
          role: 'citizen',
          avatarUrl: `https://picsum.photos/seed/${phone}/100`,
          phone, // optional
        } as AuthUser & { phone: string };
        saveUser(existingUser);
      } else {
        setUser(existingUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(existingUser));
      }
      return existingUser;
    }
    return null;
  };

  const loginWithAadhaar = async (aadhaar: string): Promise<AuthUser | null> => {
    console.log(`Logging in with Aadhaar ${aadhaar}...`);
    const userAadhaar: AuthUser & { aadhaar: string } = {
      id: `aadhaar_${aadhaar}`,
      name: `AadhaarUser_${aadhaar.slice(-4)}`,
      role: 'citizen',
      avatarUrl: `https://picsum.photos/seed/${aadhaar}/100`,
      aadhaar,
    };
    saveUser(userAadhaar);
    return userAadhaar;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  // ✅ Add updateUser function
  const updateUser = (updatedUser: AuthUser) => {
    saveUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, loginWithAadhaar, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
