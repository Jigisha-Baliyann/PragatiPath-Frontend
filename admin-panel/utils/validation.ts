// Form validation utilities
import { useState, useCallback } from 'react';
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  // Min length validation
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (data: any, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
  },
  required: {
    required: true,
  },
};

// Custom validation functions
export const customValidators = {
  confirmPassword: (password: string) => (value: string) => {
    return value !== password ? 'Passwords do not match' : null;
  },
  
  strongPassword: (value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    
    return null;
  },
  
  futureDate: (value: string) => {
    const date = new Date(value);
    const now = new Date();
    return date <= now ? 'Date must be in the future' : null;
  },
  
  pastDate: (value: string) => {
    const date = new Date(value);
    const now = new Date();
    return date >= now ? 'Date must be in the past' : null;
  },
  
  positiveNumber: (value: number) => {
    return value <= 0 ? 'Value must be positive' : null;
  },
  
  validUrl: (value: string) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL format';
    }
  },
};

// Form state management hook
export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  rules: ValidationRules
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(() => {
    const newErrors = validateForm(data, rules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data, rules]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: keyof T) => {
    const fieldRules = rules[field as string];
    if (fieldRules) {
      const error = validateField(data[field], fieldRules);
      setErrors(prev => ({
        ...prev,
        [field]: error || '',
      }));
    }
  }, [data, rules]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const isValid = Object.keys(errors).length === 0;
  const isTouched = Object.values(touched).some(Boolean);

  return {
    data,
    errors,
    touched,
    isValid,
    isTouched,
    validate,
    setFieldValue,
    setFieldTouched,
    validateField,
    reset,
  };
};
