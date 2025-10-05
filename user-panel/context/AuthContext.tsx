import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { 
  validatePhoneNumber, 
  validateAadhaarNumber, 
  validateOTP, 
  formatPhoneNumber, 
  maskAadhaarNumber,
  generateMockOTP,
  isDevelopmentMode 
} from '../utils/validation';
import { digilockerService, AadhaarVerificationResult } from '../services/digilockerService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  loginWithAadhaar: (aadhaar: string) => Promise<{ success: boolean; user?: AuthUser; error?: string; phoneNumber?: string }>;
  logout: () => void;
  updateUser: (updatedUser: AuthUser) => void;
  resendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyAadhaarWithDigiLocker: (aadhaar: string) => Promise<AadhaarVerificationResult>;
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

  const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate phone number
      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        return { success: false, error: phoneValidation.error };
      }

      // Clean phone number
      const cleanPhone = phone.replace(/\D/g, '');
      
      console.log(`Sending OTP to ${formatPhoneNumber(cleanPhone)}...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In development mode, show the OTP in console
      if (isDevelopmentMode()) {
        console.log(`🔐 Development OTP for ${formatPhoneNumber(cleanPhone)}: ${generateMockOTP()}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    try {
      // Validate inputs
      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        return { success: false, error: phoneValidation.error };
      }

      const otpValidation = validateOTP(otp);
      if (!otpValidation.isValid) {
        return { success: false, error: otpValidation.error };
      }

      const cleanPhone = phone.replace(/\D/g, '');
      const cleanOtp = otp.replace(/\D/g, '');

      // Check OTP (in real app, this would be validated with backend)
      if (cleanOtp === generateMockOTP()) {
        let existingUser = getUsers().find(u => (u as any).phone === cleanPhone);
        
        if (!existingUser) {
          // Create new user
          existingUser = {
            id: `user_${Date.now()}`,
            name: `User_${cleanPhone.slice(-4)}`,
            role: 'citizen',
            avatarUrl: `https://picsum.photos/seed/${cleanPhone}/100`,
            phone: cleanPhone,
          } as AuthUser & { phone: string };
          saveUser(existingUser);
        } else {
          // Update existing user session
          setUser(existingUser);
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(existingUser));
        }
        
        return { success: true, user: existingUser };
      }
      
      return { success: false, error: 'Invalid OTP. Please try again.' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: 'Verification failed. Please try again.' };
    }
  };

  const loginWithAadhaar = async (aadhaar: string): Promise<{ success: boolean; user?: AuthUser; error?: string; phoneNumber?: string }> => {
    try {
      // Validate Aadhaar number
      const aadhaarValidation = validateAadhaarNumber(aadhaar);
      if (!aadhaarValidation.isValid) {
        return { success: false, error: aadhaarValidation.error };
      }

      const cleanAadhaar = aadhaar.replace(/\D/g, '');
      
      console.log(`🔐 Verifying Aadhaar ${maskAadhaarNumber(cleanAadhaar)} via DigiLocker...`);
      
      // Verify Aadhaar through DigiLocker
      const verificationResult = await digilockerService.verifyAadhaar(cleanAadhaar);
      
      if (!verificationResult.success) {
        return { success: false, error: verificationResult.error };
      }

      if (!verificationResult.phoneNumber) {
        return { success: false, error: 'Phone number not found in Aadhaar records' };
      }

      console.log(`📱 Phone number extracted: ${formatPhoneNumber(verificationResult.phoneNumber)}`);
      
      // Check if user already exists with this Aadhaar
      let existingUser = getUsers().find(u => (u as any).aadhaar === cleanAadhaar);
      
      if (!existingUser) {
        // Create new user with verified Aadhaar data
        existingUser = {
          id: `aadhaar_${Date.now()}`,
          name: verificationResult.userData?.name || `AadhaarUser_${cleanAadhaar.slice(-4)}`,
          role: 'citizen',
          avatarUrl: `https://picsum.photos/seed/${cleanAadhaar}/100`,
          aadhaar: cleanAadhaar,
          phone: verificationResult.phoneNumber,
          email: verificationResult.userData?.email,
        } as AuthUser & { aadhaar: string; phone: string; email?: string };
        saveUser(existingUser);
      } else {
        // Update existing user session
        setUser(existingUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(existingUser));
      }
      
      return { 
        success: true, 
        user: existingUser, 
        phoneNumber: verificationResult.phoneNumber 
      };
    } catch (error) {
      console.error('Aadhaar login error:', error);
      return { success: false, error: 'Aadhaar verification failed. Please try again.' };
    }
  };

  const verifyAadhaarWithDigiLocker = async (aadhaar: string): Promise<AadhaarVerificationResult> => {
    try {
      // Validate Aadhaar number
      const aadhaarValidation = validateAadhaarNumber(aadhaar);
      if (!aadhaarValidation.isValid) {
        return { success: false, error: aadhaarValidation.error };
      }

      const cleanAadhaar = aadhaar.replace(/\D/g, '');
      return await digilockerService.verifyAadhaar(cleanAadhaar);
    } catch (error) {
      console.error('DigiLocker verification error:', error);
      return { success: false, error: 'Failed to verify Aadhaar. Please try again.' };
    }
  };

  const resendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate phone number
      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        return { success: false, error: phoneValidation.error };
      }

      const cleanPhone = phone.replace(/\D/g, '');
      
      console.log(`Resending OTP to ${formatPhoneNumber(cleanPhone)}...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In development mode, show the OTP in console
      if (isDevelopmentMode()) {
        console.log(`🔐 Development OTP (Resend) for ${formatPhoneNumber(cleanPhone)}: ${generateMockOTP()}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Resend OTP error:', error);
      return { success: false, error: 'Failed to resend OTP. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const updateUser = (updatedUser: AuthUser) => {
    saveUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, loginWithAadhaar, logout, updateUser, resendOtp, verifyAadhaarWithDigiLocker }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
