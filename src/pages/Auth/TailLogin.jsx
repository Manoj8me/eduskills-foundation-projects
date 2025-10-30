import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { setTokens } from "../../store/Slices/auth/authSlice";
import { setUserRole } from "../../store/Slices/auth/authoriseSlice";
import { AuthService } from "../../services/dataService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/imgs/logo-dark.svg";
import { Turnstile } from "@marsidev/react-turnstile";

const TailLogin = () => {
  const [email, setEmail] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpEmailError, setOtpEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showOTPEmail, setShowOTPEmail] = useState(false);
  const [showInputOtp, setShowInputOtp] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Turnstile callback handlers
  const handleTurnstileSuccess = useCallback((token) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback(() => {
    // handleErrorMessage("CAPTCHA verification failed. Please try again.");
    setTurnstileToken("");
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

  // Countdown Effect
  useEffect(() => {
    let countdownInterval;
    if (isCountdownActive && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [isCountdownActive, countdown]);

  // Toast Handlers
  const handleSuccessMessage = (message) => {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  };

  const handleErrorMessage = (message) => {
    toast.error(message, {
      autoClose: 2000,
      position: "top-center",
    });
  };

  // Handlers
  const handleOTP = () => {
    setShowOTPEmail(true);
    setShowOTP(true);
    if (countdown < 300) {
      setShowInputOtp(true);
    }
  };

  const handleBackSignin = () => {
    setShowOTP(false);
    setShowOTPEmail(false);
    setShowInputOtp(false);
    setOtpEmail("");
    setOtp("");
    setOtpError("");
    setOtpEmailError("");
    setTurnstileToken("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateOtpEmail()) return;

    // if (!turnstileToken) {
    //   handleErrorMessage("Please complete the CAPTCHA verification");
    //   return;
    // }

    setLoading(true);
    try {
      const response = await AuthService.sendOtp(otpEmail, turnstileToken);
      if (response?.status === 200) {
        handleSuccessMessage("OTP sent successfully! Please check your email.");
        setShowInputOtp(true);
        setIsCountdownActive(true);
        setCountdown(300);
      }
    } catch (error) {
      handleErrorMessage(error.response?.data?.detail || "Failed to send OTP.");
      setTurnstileToken("");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.verifyOtp(otpEmail, otp);
      if (response?.status === 200) {
        handleLoginSuccess(response.data);
      }
    } catch (error) {
      setOtpError("Invalid OTP");
      handleErrorMessage(error.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (data) => {
    const { access_token, refresh_token } = data;
    dispatch(
      setTokens({ accessToken: access_token, refreshToken: refresh_token })
    );

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("userName", showOTP ? otpEmail : email);

    try {
      const rolesResponse = await AuthService.roles();
      const activeRole = rolesResponse.data.roles.find(
        (role) => role.status === true
      );

      if (activeRole) {
        const activeRoleName = activeRole.role_name
          .toLowerCase()
          .replace(/ /g, "_");
        localStorage.setItem("Authorise", activeRoleName);
        dispatch(setUserRole(activeRoleName));
        handleSuccessMessage("Login successful!");
        navigate("/dashboard");
      } else {
        handleErrorMessage("No active role found");
      }
    } catch (error) {
      handleErrorMessage("Error fetching user roles");
    }
  };

  const validateOtpEmail = () => {
    if (!otpEmail) {
      setOtpEmailError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(otpEmail)) {
      setOtpEmailError("Please enter a valid email address");
      return false;
    }
    setOtpEmailError("");
    return true;
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[1200px] flex items-center gap-8">
          {/* Left Section - Branding with new illustration */}
          <div className="hidden md:flex md:w-1/2 flex-col space-y-12">
            <img src={Logo} alt="Logo" className="w-48" />

            {/* SVG Illustration Container */}
            <div className="relative h-[400px]">
              <svg
                className="w-full h-64 absolute top-0 left-0"
                viewBox="0 0 600 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Soft blue gradient */}
                  <linearGradient
                    id="cardGrad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#EBF8FF", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#BEE3F8", stopOpacity: 1 }}
                    />
                  </linearGradient>

                  {/* Deep blue gradient */}
                  <linearGradient
                    id="nodeGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#3182CE", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#2B6CB0", stopOpacity: 1 }}
                    />
                  </linearGradient>

                  {/* Accent blue gradient */}
                  <linearGradient
                    id="accentGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#4299E1", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#3182CE", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>

                {/* Background Shapes */}
                <path
                  d="M50,150 Q150,50 300,100 T550,150 Q450,250 300,200 T50,150"
                  fill="url(#cardGrad1)"
                  className="drop-shadow-lg"
                />

                {/* Decorative Curves */}
                <g stroke="#63B3ED" strokeWidth="1.5" fill="none" opacity="0.6">
                  <path d="M100,150 Q200,100 300,150 T500,150" />
                  <path d="M150,200 Q250,150 350,200 T550,200" />
                  <path d="M50,100 Q150,50 250,100 T450,100" />
                </g>

                {/* Main Connection Points */}
                <g>
                  {/* Education Hub */}
                  <circle
                    cx="150"
                    cy="150"
                    r="35"
                    fill="url(#nodeGrad)"
                    className="drop-shadow-xl"
                  />
                  <text x="132" y="160" fontSize="24">
                    🎓
                  </text>

                  {/* Industry Hub */}
                  <circle
                    cx="450"
                    cy="150"
                    r="35"
                    fill="url(#nodeGrad)"
                    className="drop-shadow-xl"
                  />
                  <text x="432" y="160" fontSize="24">
                    💼
                  </text>

                  {/* Skills Hub */}
                  <circle
                    cx="300"
                    cy="200"
                    r="40"
                    fill="url(#accentGrad)"
                    className="drop-shadow-xl"
                  />
                  <text x="280" y="210" fontSize="28">
                    🤝
                  </text>
                </g>

                {/* Floating Elements */}
                <g className="animate-bounce">
                  <circle
                    cx="200"
                    cy="130"
                    r="20"
                    fill="#4299E1"
                    className="drop-shadow-lg"
                  />
                  <text x="190" y="138" fontSize="16">
                    💡
                  </text>
                </g>
                <g
                  className="animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  <circle
                    cx="400"
                    cy="180"
                    r="20"
                    fill="#4299E1"
                    className="drop-shadow-lg"
                  />
                  <text x="390" y="188" fontSize="16">
                    📚
                  </text>
                </g>

                {/* Connection Lines */}
                <g
                  stroke="#63B3ED"
                  strokeWidth="3"
                  strokeDasharray="6,6"
                  className="animate-pulse"
                >
                  <line x1="180" y1="150" x2="270" y2="200" />
                  <line x1="420" y1="150" x2="330" y2="200" />
                  <line x1="180" y1="150" x2="420" y2="150" />
                </g>

                {/* Accent Dots */}
                <g fill="#90CDF4">
                  <circle cx="150" cy="100" r="4" />
                  <circle cx="450" cy="100" r="4" />
                  <circle cx="300" cy="250" r="4" />
                  <circle cx="200" cy="200" r="4" />
                  <circle cx="400" cy="200" r="4" />
                </g>
              </svg>

              {/* Text Card */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200">
                  <h1 className="text-4xl font-bold text-gray-800 leading-tight">
                    <span className="text-blue-600">Connecting</span> Skilled
                    Talent
                    <br />
                    with Industry
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full md:w-1/2 max-w-[400px] mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg border border-blue-200">
              <div className="md:hidden mb-6">
                <img src={Logo} alt="Logo" className="w-32 mx-auto" />
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-normal text-gray-900">Hello!</h2>
                <p className="font-semibold text-gray-900 mt-1">
                  Welcome to Admin/Spoc/Educator Login
                </p>
              </div>

              <form
                onSubmit={showInputOtp ? handleOTPSubmit : handleEmailSubmit}
                className="space-y-5"
              >
                <div>
                  <input
                    type="email"
                    value={otpEmail}
                    onChange={(e) => {
                      setOtpEmail(e.target.value);
                      setOtpEmailError("");
                    }}
                    disabled={showInputOtp}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      otpEmailError ? "border-red-500" : "border-blue-200"
                    } focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-black outline-none transition-all disabled:bg-blue-50`}
                    placeholder="Email Address"
                  />
                  {otpEmailError && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {otpEmailError}
                    </span>
                  )}
                </div>

                {/* {!showInputOtp && (
                  <div className="flex justify-center">
                    <Turnstile
                      siteKey="0x4AAAAAAAzPpbGutwXyyFrF"
                      onSuccess={handleTurnstileSuccess}
                      onError={handleTurnstileError}
                      onExpire={handleTurnstileExpire}
                      options={{
                        theme: "light",
                        appearance: 'execute',
                      }}
                    />
                  </div>
                )} */}

                {!showInputOtp && (
                  <div className="flex justify-start w-full overflow-x-auto">
                    <div className="transform-gpu scale-[0.85] sm:scale-90 origin-left min-w-fit">
                      <Turnstile
                        siteKey="0x4AAAAAAAzPpbGutwXyyFrF"
                        onSuccess={handleTurnstileSuccess}
                        onError={handleTurnstileError}
                        onExpire={handleTurnstileExpire}
                        options={{
                          theme: "light",
                          appearance: "execute",
                        }}
                        className="!w-[300px]"
                      />
                    </div>
                  </div>
                )}

                {showInputOtp && (
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && value.length <= 6) {
                            setOtp(value);
                            setOtpError("");
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          otpError ? "border-red-500" : "border-blue-200"
                        } focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white outline-none text-black transition-all`}
                        placeholder="Enter OTP"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {otpError && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {otpError}
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold disabled:from-blue-400 disabled:to-blue-400 shadow-md hover:shadow-lg"
                >
                  {loading
                    ? "Processing..."
                    : showInputOtp
                    ? "Verify OTP"
                    : "Send OTP"}
                </button>

                {showInputOtp && (
                  <div className="flex justify-end">
                    <div className="text-blue-600 text-sm">
                      {countdown === 0 ? (
                        <button
                          type="button"
                          onClick={handleEmailSubmit}
                          className="hover:underline"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span>
                          Resend in {Math.floor(countdown / 60)}:
                          {(countdown % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-sm text-gray-600 border-t border-blue-100">
        Copyright © {new Date().getFullYear()}{" "}
        <a
          href="https://eduskillsfoundation.org/"
          className="text-inherit no-underline hover:text-blue-600 transition-colors"
        >
          EduSkills Foundation
        </a>
      </div>
    </div>
  );
};

export default TailLogin;
