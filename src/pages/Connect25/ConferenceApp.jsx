import { useState, useEffect } from "react";
import StatusDisplayComponent from "./StatusDisplayComponent";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";
import RegistrationBanner from "./RegistrationBanner";
import { downloadTicket } from "./downloadTicket";

// Main App Component
const ConferenceApp = () => {
  const [currentStep, setCurrentStep] = useState("loading");
  const [registrationInfo, setRegistrationInfo] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  useEffect(() => {
    fetchRegistrationInfo();
  }, []);

  const fetchRegistrationInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Access token not found. Please login again.");
        return;
      }

      const response = await api.get(
        `${BASE_URL}/internship/registration-info`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setRegistrationInfo(data);

      // Check if registration info is empty object
      if (!data || Object.keys(data).length === 0) {
        setCurrentStep("registration-not-available");
        return;
      }

      // Determine the current step based on registration info
      if (data.payment_status === null) {
        setCurrentStep("payment-required");
      } else if (data.registration_id) {
        // Already registered, show ticket
        setCurrentStep("ticket");
      } else {
        // Can register
        setCurrentStep("registration");
      }
    } catch (error) {
      console.error("Error fetching registration info:", error);
      setError("Failed to fetch registration information. Please try again.");
    }
  };

  const handleRegistrationComplete = async (formData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Access token not found. Please login again.");
        return;
      }

      // Create FormData to handle file upload
      const formDataToSend = new FormData();

      // Add all the preference data
      formDataToSend.append(
        "gender",
        formData.preferences.day1_gender
          ? formData.preferences.day1_gender.toLowerCase()
          : ""
      );
      formDataToSend.append(
        "day1_food_preferences",
        formData.preferences.day1_food || ""
      );
      formDataToSend.append(
        "day1_drink_preferences",
        formData.preferences.day1_drink || ""
      );
      formDataToSend.append(
        "day1_travel_mode",
        formData.preferences.day1_travel
          ? formData.preferences.day1_travel.toLowerCase()
          : ""
      );
      formDataToSend.append(
        "food_allergies",
        formData.preferences.day1_allergies
          ? formData.preferences.day1_allergies === "Yes"
          : false
      );
      formDataToSend.append(
        "specific_food_allergies",
        formData.preferences.day1_allergies_detail || ""
      );
      formDataToSend.append(
        "day2_food_preferences",
        formData.preferences.day2_food || ""
      );
      formDataToSend.append(
        "day3_food_preferences",
        formData.preferences.day3_food || ""
      );

      // Add the image file if it exists
      if (formData.image) {
        formDataToSend.append("image", formData.image, "profile.jpg");
      }

      // Use FormData instead of JSON
      await api.post(`${BASE_URL}/internship/register-event`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Don't set Content-Type header - let the browser set it with boundary for FormData
        },
      });

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error registering for event:", error);
      setError("Failed to complete registration. Please try again.");
    }
  };

  const handleSuccessModalClose = async () => {
    setShowSuccessModal(false);
    setCurrentStep("completion");
    window.location.reload(); // Reload to refresh the registration info
    // Fetch updated registration info after closing modal
    await fetchRegistrationInfoAfterRegistration();
  };

  const fetchRegistrationInfoAfterRegistration = async () => {
    setIsFetchingDetails(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Add a small delay to ensure backend has processed the registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await api.get(
        `${BASE_URL}/internship/registration-info`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      setRegistrationData(data);
      // Update the main registration info state as well
      setRegistrationInfo(data);
    } catch (error) {
      console.error("Error fetching updated registration info:", error);
      setError(
        "Registration completed but failed to fetch details. Please refresh the page."
      );
    } finally {
      setIsFetchingDetails(false);
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Successful Registration!
          </h3>
          <p className="text-gray-600 mb-6">
            Your registration has been completed successfully.
          </p>
          <button
            onClick={handleSuccessModalClose}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (currentStep === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Loading Registration Info...
          </h1>
          <p className="text-gray-600">
            Please wait while we fetch your registration details.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Registration not available state
  if (currentStep === "registration-not-available") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Registration will be available soon
          </h1>
          <p className="text-gray-600 mb-6">
            For registration contact to your relationship manager
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Payment required state
  if (currentStep === "payment-required") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">💳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Required
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment is pending. Please complete your payment to proceed
            with registration.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Registration Details:
            </h3>
            <div className="text-left text-sm space-y-1">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {registrationInfo?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {registrationInfo?.email}
              </p>
              <p>
                <span className="font-medium">Mobile:</span>{" "}
                {registrationInfo?.mobile_number}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Already registered - show ticket
  if (currentStep === "ticket") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <RegistrationBanner
            registrationInfo={registrationInfo}
            isFetchingDetails={isFetchingDetails}
          />
        </div>
      </div>
    );
  }

  // Registration form
  if (currentStep === "registration") {
    return (
      <>
        <StatusDisplayComponent
          registrationInfo={registrationInfo}
          onComplete={handleRegistrationComplete}
        />
        {showSuccessModal && <SuccessModal />}
      </>
    );
  }

  // Completion state - show ticket
  if (currentStep === "completion") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center mb-6">
            <div className="text-4xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Registration Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your registration has been completed successfully.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  fetchRegistrationInfo();
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Refresh Details
              </button>
            </div>
          </div>

          <RegistrationBanner
            registrationInfo={registrationData || registrationInfo}
            isFetchingDetails={isFetchingDetails}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default ConferenceApp;
