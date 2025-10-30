import React, { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../../../services/configUrls";
import axios from "axios";

const VoterRegistration = ({ onRegistrationComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    mobile_number: "",
    company_name: "",
    company_website: "",
    company_address: "",
  });
  const [errors, setErrors] = useState({});
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Check if form has any data to determine unsaved changes
  useEffect(() => {
    const hasData =
      Object.values(formData).some((value) => value.trim() !== "") ||
      showOtpField ||
      isVerified;
    setHasUnsavedChanges(hasData);
  }, [formData, showOtpField, isVerified]);

  // Add beforeunload event listener for page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Your registration data will be lost if you leave this page. Are you sure you want to continue?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }

    // Check if it's a domain email (not from free email providers)
    const domain = email.split("@")[1].toLowerCase();
    const freeEmailProviders = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "live.com",
      "icloud.com",
      "aol.com",
      "protonmail.com",
      "mail.com",
      "yandex.com",
      "rediffmail.com",
      "zoho.com",
      "mailinator.com",
      "10minutemail.com",
      "tempmail.org",
      "guerrillamail.com",
      "maildrop.cc",
      "sharklasers.com",
    ];

    if (freeEmailProviders.includes(domain)) {
      return {
        isValid: false,
        message:
          "Please use your company/organization email address, not personal email",
      };
    }

    return { isValid: true, message: "" };
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateWebsite = (website) => {
    if (!website.trim()) return true; // Optional field
    const websiteRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return websiteRegex.test(website);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length && i < 6; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);

        // Focus the next empty field or the last field
        const nextIndex = Math.min(digits.length, 5);
        otpRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleEmailVerification = async () => {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setErrors((prev) => ({
        ...prev,
        email: emailValidation.message,
      }));
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/internship/send-otp/academy-leaders/`,
        { email: formData.email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.message !== "Email already exists") {
        setShowOtpField(true);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 300);
      }
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      }));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      alert("Please enter complete 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await fetch(
        `${BASE_URL}/internship/verify-otp/academy-leaders/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: otpString,
          }),
        }
      );

      if (response.ok) {
        setIsVerified(true);
        setShowOtpField(false);
        alert("Email verified successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Invalid OTP. Please try again.");
        // Clear OTP fields on error
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (error) {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.message;
      } else if (!isVerified) {
        newErrors.email = "Please verify your email address";
      }
    }

    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!validateMobile(formData.mobile_number)) {
      newErrors.mobile_number = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.company_name.trim())
      newErrors.company_name = "Company name is required";

    if (
      formData.company_website.trim() &&
      !validateWebsite(formData.company_website)
    ) {
      newErrors.company_website = "Please enter a valid website URL";
    }

    if (!formData.company_address.trim())
      newErrors.company_address = "Company address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Your registration data will be lost if you leave this page. Are you sure you want to continue?"
      );
      if (!confirmLeave) {
        return;
      }
    }
    onCancel();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/internship/create/corporate-account/`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.message === "Email already registered.") {
        alert(response.data.message);
      } else {
        alert("Registration completed successfully!");
        setHasUnsavedChanges(false);
        if (onRegistrationComplete)
          onRegistrationComplete(response.data.corporate_id);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Voter Registration
        </h2>
        <p className="text-gray-600">
          Please complete your registration to participate in voting
        </p>
        {hasUnsavedChanges && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-yellow-700 text-sm">
                Warning: Your registration data will be lost if you refresh or
                leave this page.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.designation ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your designation"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-600 mb-2">
            Please use your company/organization email address (personal emails
            like Gmail, Yahoo are not allowed)
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your company email address"
              disabled={isVerified}
            />
            {!isVerified && (
              <button
                type="button"
                onClick={handleEmailVerification}
                disabled={isSendingOtp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition duration-200 transform hover:scale-105"
              >
                {isSendingOtp ? "Sending..." : "Verify"}
              </button>
            )}
            {isVerified && (
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center animate-pulse">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Animated OTP Field */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showOtpField ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="transform transition-transform duration-500 ease-out">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter OTP
            </label>

            {/* OTP Input Blocks */}
            <div className="flex justify-center space-x-3 mb-4">
              {otp.map((digit, index) => (
                <div
                  key={index}
                  className={`transition-all duration-300 ease-out transform ${
                    showOtpField
                      ? "scale-100 translate-y-0"
                      : "scale-75 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <input
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-all duration-200 transform hover:scale-105
                      ${
                        digit
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }
                    `}
                    maxLength="1"
                    inputMode="numeric"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mb-3">
              <button
                type="button"
                onClick={verifyOtp}
                disabled={isVerifyingOtp || otp.join("").length !== 6}
                className={`px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 
                  text-white rounded-lg transition-all duration-200 transform hover:scale-105
                  ${isVerifyingOtp ? "animate-pulse" : ""}
                `}
              >
                {isVerifyingOtp ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>

            <p className="text-sm text-gray-600 text-center animate-fade-in">
              Please check your email for the 6-digit OTP
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              errors.mobile_number ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
          />
          {errors.mobile_number && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              errors.company_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your company name"
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Website
          </label>
          <input
            type="url"
            name="company_website"
            value={formData.company_website}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              errors.company_website ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://www.example.com (optional)"
          />
          {errors.company_website && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company_website}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="company_address"
            value={formData.company_address}
            onChange={handleInputChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 ${
              errors.company_address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your company address"
          />
          {errors.company_address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company_address}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isVerified}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </div>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>
      </div>

      {/* Terms Notice */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By registering, you agree to participate in the voting process. Your
          information will be kept secure and confidential.
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VoterRegistration;
