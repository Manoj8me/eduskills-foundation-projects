import React, { useState } from "react";

// Simplified User Verification Form - Only WhatsApp
const UserVerificationForm = ({ onVerificationComplete }) => {
  const [step, setStep] = useState(1); // 1: WhatsApp, 2: OTP
  const [whatsapp, setWhatsapp] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});
  const otpRefs = React.useRef([]);

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // OTP handling
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const validateWhatsApp = () => {
    const newErrors = {};
    if (!whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!/^[6-9]\d{9}$/.test(whatsapp)) {
      newErrors.whatsapp = "Invalid WhatsApp number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = () => {
    if (!validateWhatsApp()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setStep(2);
      setCountdown(60);
      setIsVerifying(false);
    }, 1500);
  };

  const verifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Simulate fetching user details based on WhatsApp
      const mockUserDetails = {
        name: "John Doe",
        email: "john.doe@example.com",
        mobile: whatsapp,
        whatsapp: whatsapp,
      };
      onVerificationComplete(mockUserDetails);
    }, 2000);
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setCountdown(60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Connect'25 Registration
              </h1>
              <p className="text-gray-600">
                Enter your WhatsApp number to continue
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  WhatsApp Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-700 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) =>
                      setWhatsapp(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    className={`w-full p-4 rounded-r-lg bg-gray-50 border ${
                      errors.whatsapp ? "border-red-400" : "border-gray-300"
                    } focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="9876543210"
                    maxLength="10"
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                )}
              </div>

              <button
                onClick={sendOtp}
                disabled={isVerifying}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 transform ${
                  isVerifying
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Verify OTP
              </h1>
              <p className="text-gray-600">
                We've sent a 6-digit code to
                <br />
                <span className="font-semibold text-orange-600">
                  +91 {whatsapp}
                </span>
              </p>
            </div>

            <div className="mb-8">
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-200"
                    maxLength="1"
                  />
                ))}
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend OTP in{" "}
                    <span className="font-semibold text-orange-600">
                      {countdown}s
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={resendOtp}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={verifyOtp}
              disabled={isVerifying || otp.join("").length !== 6}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 transform ${
                isVerifying || otp.join("").length !== 6
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              ← Back to WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVerificationForm;
