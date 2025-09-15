import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPinIcon } from "../components/icons";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/Dialog";

type Step = "phone" | "otp";

const Login: React.FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [aadhaar, setAadhaar] = useState<string>("");
  const [step, setStep] = useState<Step>("phone");
  const [aadhaarDialog, setAadhaarDialog] = useState<boolean>(false);

  const { sendOtp, verifyOtp, loginWithAadhaar } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // 🔹 Handle OTP send
  const handleSendOtp = async () => {
    if (!phone) {
      showToast("Please enter your phone number.", "error");
      return;
    }
    const success = await sendOtp(phone);
    if (success) {
      showToast("OTP sent successfully! (check console in dev mode)", "success");
      setStep("otp");
    } else {
      showToast("Failed to send OTP. Try again.", "error");
    }
  };

  // 🔹 Handle OTP verify
  const handleVerifyOtp = async () => {
    if (!otp) {
      showToast("Please enter OTP.", "error");
      return;
    }
    const user = await verifyOtp(phone, otp);
    if (user) {
      showToast(`Welcome, ${user.name}!`, "success");
      navigate("/dashboard");
    } else {
      showToast("Invalid OTP. Please try again.", "error");
    }
  };

  // 🔹 Handle Aadhaar login
  const handleAadhaarLogin = async () => {
    if (!aadhaar) {
      showToast("Please enter Aadhaar number.", "error");
      return;
    }
    const user = await loginWithAadhaar(aadhaar);
    if (user) {
      showToast(`Welcome via Aadhaar, ${user.name}!`, "success");
      setAadhaarDialog(false);
      navigate("/dashboard");
    } else {
      showToast("Aadhaar login failed.", "error");
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
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/5 text-white ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-md transition-colors"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2 → OTP Input */}
        {step === "otp" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/5 text-white ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md transition-colors"
            >
              Verify OTP & Login
            </button>
            <button
              onClick={() => setStep("phone")}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md text-sm"
            >
              Back
            </button>
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
            <DialogTitle>Aadhaar Login</DialogTitle>
            <DialogDescription>
              Enter your Aadhaar number to login. By continuing, you consent to verification.
            </DialogDescription>
          </DialogHeader>
          <input
            type="text"
            placeholder="Enter Aadhaar Number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-white/5 text-white ring-1 ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 mb-4"
          />
          <DialogFooter>
            <button
              onClick={handleAadhaarLogin}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md transition-colors"
            >
              Confirm & Login
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MotionDiv>
  );
};

export default Login;
