import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPinIcon } from "../components/icons";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { formatPhoneNumber, maskAadhaarNumber, isDevelopmentMode } from "../utils/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/Dialog";

type Step = "phone" | "otp" | "aadhaar-verify" | "aadhaar-otp";

const Login: React.FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [aadhaar, setAadhaar] = useState<string>("");
  const [step, setStep] = useState<Step>("phone");
  const [aadhaarDialog, setAadhaarDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [verifiedPhone, setVerifiedPhone] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  const { sendOtp, verifyOtp, loginWithAadhaar, resendOtp, verifyAadhaarWithDigiLocker } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // OTP Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // 🔹 Handle OTP send
  const handleSendOtp = async () => {
    if (!phone.trim()) {
      showToast("Please enter your phone number.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await sendOtp(phone);
      if (result.success) {
        showToast(
          isDevelopmentMode() 
            ? "OTP sent successfully! Check console for development OTP." 
            : "OTP sent successfully!",
          "success"
        );
        setStep("otp");
        setOtpTimer(60); // 60 seconds timer
        setCanResend(false);
      } else {
        showToast(result.error || "Failed to send OTP. Try again.", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handle OTP verify
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      showToast("Please enter OTP.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await verifyOtp(phone, otp);
      if (result.success && result.user) {
        showToast(`Welcome, ${result.user.name}!`, "success");
        navigate("/");
      } else {
        showToast(result.error || "Invalid OTP. Please try again.", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handle Aadhaar verification
  const handleAadhaarVerification = async () => {
    if (!aadhaar.trim()) {
      showToast("Please enter Aadhaar number.", "error");
      return;
    }
    
    setIsLoading(true);
    setVerificationStatus("Verifying Aadhaar with DigiLocker...");
    
    try {
      const result = await verifyAadhaarWithDigiLocker(aadhaar);
      if (result.success && result.phoneNumber) {
        setVerifiedPhone(result.phoneNumber);
        setVerificationStatus(`Aadhaar verified! Phone number found: ${formatPhoneNumber(result.phoneNumber)}`);
        showToast("Aadhaar verified successfully! Sending OTP to registered phone number.", "success");
        
        // Automatically send OTP to the verified phone number
        const otpResult = await sendOtp(result.phoneNumber);
        if (otpResult.success) {
          setStep("aadhaar-otp");
          setOtpTimer(60);
          setCanResend(false);
        } else {
          showToast(otpResult.error || "Failed to send OTP.", "error");
        }
      } else {
        showToast(result.error || "Aadhaar verification failed.", "error");
        setVerificationStatus("Aadhaar verification failed.");
      }
    } catch (error) {
      showToast("An error occurred during verification. Please try again.", "error");
      setVerificationStatus("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handle Aadhaar OTP verification
  const handleAadhaarOtpVerification = async () => {
    if (!otp.trim()) {
      showToast("Please enter OTP.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await verifyOtp(verifiedPhone, otp);
      if (result.success && result.user) {
        showToast(`Welcome via Aadhaar, ${result.user.name}!`, "success");
        setAadhaarDialog(false);
        navigate("/");
      } else {
        showToast(result.error || "Invalid OTP. Please try again.", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handle OTP resend
  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      const result = await resendOtp(phone);
      if (result.success) {
        showToast(
          isDevelopmentMode() 
            ? "OTP resent! Check console for development OTP." 
            : "OTP resent successfully!",
          "success"
        );
        setOtpTimer(60);
        setCanResend(false);
      } else {
        showToast(result.error || "Failed to resend OTP.", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex items-center justify-center py-12"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <MapPinIcon className="h-10 w-10 text-cyan-400" />
            <span className="text-3xl font-bold text-white ml-2">PragatiPath</span>
          </div>
          <h2 className="text-2xl font-bold text-cyan-400">Login</h2>
        </div>

        {/* Step 1 → Phone Input */}
        {step === "phone" && (
          <div className="space-y-4">
            <div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-md bg-white/5 text-white ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
              {phone && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatPhoneNumber(phone)}
                </p>
              )}
            </div>
            <button
              onClick={handleSendOtp}
              disabled={isLoading || !phone.trim()}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-md transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        )}

        {/* Step 2 → OTP Input */}
        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">
                OTP sent to {formatPhoneNumber(phone)}
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-md bg-white/5 text-white ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
              />
              {isDevelopmentMode() && (
                <p className="text-xs text-yellow-400 mt-1">
                  Development OTP: 123456
                </p>
              )}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || !otp.trim()}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-md transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Verify OTP & Login'
              )}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setStep("phone")}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md text-sm transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-2 rounded-md text-sm transition-colors"
              >
                {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

        {/* Aadhaar Login */}
        <div className="text-center">
          <button
            onClick={() => setAadhaarDialog(true)}
            className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md transition-colors"
          >
            Login with Aadhaar
          </button>
        </div>
      </div>

      {/* Aadhaar Dialog */}
      <Dialog open={aadhaarDialog} onOpenChange={setAadhaarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aadhaar Login via DigiLocker</DialogTitle>
            <DialogDescription>
              Enter your 12-digit Aadhaar number. We'll verify it with DigiLocker and send OTP to your registered phone number.
            </DialogDescription>
          </DialogHeader>
          
          {step === "phone" && (
            <div>
              <input
                type="text"
                placeholder="Enter 12-digit Aadhaar number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                maxLength={12}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-md bg-white/5 text-white ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 mb-2 disabled:opacity-50"
              />
              {aadhaar && (
                <p className="text-xs text-gray-400">
                  {maskAadhaarNumber(aadhaar)}
                </p>
              )}
              {verificationStatus && (
                <p className="text-xs text-blue-400 mt-2">
                  {verificationStatus}
                </p>
              )}
            </div>
          )}

          {step === "aadhaar-otp" && (
            <div>
              <p className="text-sm text-gray-400 mb-2">
                OTP sent to {formatPhoneNumber(verifiedPhone)}
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-md bg-white/5 text-white ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 mb-2 disabled:opacity-50"
              />
              {isDevelopmentMode() && (
                <p className="text-xs text-yellow-400 mt-1">
                  Development OTP: 123456
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <div className="flex space-x-2 w-full">
              <button
                onClick={() => {
                  setAadhaarDialog(false);
                  setStep("phone");
                  setAadhaar("");
                  setOtp("");
                  setVerifiedPhone("");
                  setVerificationStatus("");
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              
              {step === "phone" && (
                <button
                  onClick={handleAadhaarVerification}
                  disabled={isLoading || !aadhaar.trim()}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-2 rounded-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify with DigiLocker'
                  )}
                </button>
              )}

              {step === "aadhaar-otp" && (
                <button
                  onClick={handleAadhaarOtpVerification}
                  disabled={isLoading || !otp.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-2 rounded-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP & Login'
                  )}
                </button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MotionDiv>
  );
};

export default Login;
