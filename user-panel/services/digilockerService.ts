// DigiLocker Service for Aadhaar verification
import { isDevelopmentMode } from '../utils/validation';

export interface DigiLockerResponse {
  success: boolean;
  data?: {
    aadhaarNumber: string;
    name: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    dob?: string;
    gender?: string;
  };
  error?: string;
}

export interface AadhaarVerificationResult {
  success: boolean;
  phoneNumber?: string;
  userData?: {
    name: string;
    aadhaarNumber: string;
    phoneNumber: string;
    email?: string;
  };
  error?: string;
}

class DigiLockerService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.digilocker.gov.in' 
    : 'http://localhost:3001/api/digilocker';
  
  private clientId = process.env.VITE_DIGILOCKER_CLIENT_ID || 'mock-client-id';
  private clientSecret = process.env.VITE_DIGILOCKER_CLIENT_SECRET || 'mock-client-secret';

  /**
   * Verify Aadhaar number through DigiLocker
   * @param aadhaarNumber - 12-digit Aadhaar number
   * @returns Promise with verification result
   */
  async verifyAadhaar(aadhaarNumber: string): Promise<AadhaarVerificationResult> {
    try {
      console.log(`🔐 Verifying Aadhaar ${aadhaarNumber.slice(0, 4)}XXXX${aadhaarNumber.slice(8)} via DigiLocker...`);

      if (isDevelopmentMode()) {
        // Mock response for development
        return this.getMockVerificationResponse(aadhaarNumber);
      }

      // Real DigiLocker API call
      const response = await fetch(`${this.baseUrl}/verify-aadhaar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify({
          aadhaarNumber: aadhaarNumber,
          clientId: this.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`DigiLocker API error: ${response.status}`);
      }

      const result: DigiLockerResponse = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          phoneNumber: result.data.phoneNumber,
          userData: {
            name: result.data.name,
            aadhaarNumber: result.data.aadhaarNumber,
            phoneNumber: result.data.phoneNumber,
            email: result.data.email,
          },
        };
      }

      return {
        success: false,
        error: result.error || 'Aadhaar verification failed',
      };
    } catch (error) {
      console.error('DigiLocker verification error:', error);
      return {
        success: false,
        error: 'Failed to verify Aadhaar. Please try again.',
      };
    }
  }

  /**
   * Get access token for DigiLocker API
   * @returns Promise with access token
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          grantType: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Access token error:', error);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Mock verification response for development
   * @param aadhaarNumber - Aadhaar number
   * @returns Mock verification result
   */
  private getMockVerificationResponse(aadhaarNumber: string): AadhaarVerificationResult {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock phone numbers based on Aadhaar number for consistent testing
        const mockPhoneNumbers = [
          '9876543210',
          '8765432109',
          '7654321098',
          '6543210987',
          '5432109876',
        ];
        
        const phoneIndex = parseInt(aadhaarNumber.slice(-1)) % mockPhoneNumbers.length;
        const mockPhone = mockPhoneNumbers[phoneIndex];

        console.log(`🔐 Mock DigiLocker verification successful for Aadhaar ${aadhaarNumber.slice(0, 4)}XXXX${aadhaarNumber.slice(8)}`);
        console.log(`📱 Extracted phone number: ${mockPhone}`);

        resolve({
          success: true,
          phoneNumber: mockPhone,
          userData: {
            name: `AadhaarUser_${aadhaarNumber.slice(-4)}`,
            aadhaarNumber: aadhaarNumber,
            phoneNumber: mockPhone,
            email: `user${aadhaarNumber.slice(-4)}@example.com`,
          },
        });
      }, 2000); // 2 second delay to simulate real API
    });
  }

  /**
   * Check if DigiLocker service is available
   * @returns Promise with service status
   */
  async checkServiceStatus(): Promise<{ available: boolean; message?: string }> {
    try {
      if (isDevelopmentMode()) {
        return { available: true, message: 'Mock DigiLocker service available' };
      }

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
        },
      });

      return {
        available: response.ok,
        message: response.ok ? 'DigiLocker service available' : 'DigiLocker service unavailable',
      };
    } catch (error) {
      return {
        available: false,
        message: 'DigiLocker service unavailable',
      };
    }
  }
}

export const digilockerService = new DigiLockerService();
