// Validation utilities for user authentication

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Phone number validation
export const validatePhoneNumber = (phone: string): ValidationResult => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number
  if (cleanPhone.length !== 10) {
    return {
      isValid: false,
      error: 'Phone number must be 10 digits'
    };
  }
  
  // Check if it starts with valid Indian mobile prefixes
  const validPrefixes = ['6', '7', '8', '9'];
  if (!validPrefixes.includes(cleanPhone[0])) {
    return {
      isValid: false,
      error: 'Invalid phone number format'
    };
  }
  
  return { isValid: true };
};

// Aadhaar number validation
export const validateAadhaarNumber = (aadhaar: string): ValidationResult => {
  // Remove all non-digit characters
  const cleanAadhaar = aadhaar.replace(/\D/g, '');
  
  // Check if it's 12 digits
  if (cleanAadhaar.length !== 12) {
    return {
      isValid: false,
      error: 'Aadhaar number must be 12 digits'
    };
  }
  
  // Check if it doesn't start with 0 or 1
  if (cleanAadhaar[0] === '0' || cleanAadhaar[0] === '1') {
    return {
      isValid: false,
      error: 'Invalid Aadhaar number format'
    };
  }
  
  return { isValid: true };
};

// OTP validation
export const validateOTP = (otp: string): ValidationResult => {
  const cleanOTP = otp.replace(/\D/g, '');
  
  if (cleanOTP.length !== 6) {
    return {
      isValid: false,
      error: 'OTP must be 6 digits'
    };
  }
  
  return { isValid: true };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  return phone;
};

// Format Aadhaar number for display (masked)
export const formatAadhaarNumber = (aadhaar: string): string => {
  const cleanAadhaar = aadhaar.replace(/\D/g, '');
  if (cleanAadhaar.length === 12) {
    return `${cleanAadhaar.slice(0, 4)} ${cleanAadhaar.slice(4, 8)} ${cleanAadhaar.slice(8)}`;
  }
  return aadhaar;
};

// Mask Aadhaar number for privacy
export const maskAadhaarNumber = (aadhaar: string): string => {
  const cleanAadhaar = aadhaar.replace(/\D/g, '');
  if (cleanAadhaar.length === 12) {
    return `${cleanAadhaar.slice(0, 4)} XXXX ${cleanAadhaar.slice(8)}`;
  }
  return aadhaar;
};

// Generate mock OTP for development
export const generateMockOTP = (): string => {
  return '123456'; // For development purposes
};

// Check if we're in development mode
export const isDevelopmentMode = (): boolean => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};
