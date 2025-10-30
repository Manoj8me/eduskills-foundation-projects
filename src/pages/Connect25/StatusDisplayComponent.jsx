import { useState } from "react";
import ImageUploadComponent from "./ImageUpload"; // Import the image upload component

// Enhanced Status Display with Preferences Form and Image Upload
const StatusDisplayComponent = ({ registrationInfo, onComplete }) => {
  const [preferences, setPreferences] = useState({});
  const [errors, setErrors] = useState({});
  const [allergiesDetail, setAllergiesDetail] = useState("");
  const [showAllergiesInput, setShowAllergiesInput] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Extract user details from registrationInfo
  const userDetails = {
    name: registrationInfo.name,
    email: registrationInfo.email,
    mobile: registrationInfo.mobile_number,
    whatsapp: registrationInfo.whatsup_number,
  };

  // Use reg_title from API response
  const regTitle = registrationInfo.reg_title || "Registration";

  // Handle image selection
  const handleImageSelect = (blob) => {
    setSelectedImage(blob);
    const url = URL.createObjectURL(blob);
    setImagePreviewUrl(url);
    // Clear image error if exists
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  // Determine config based on reg_status
  const getConfigFromRegStatus = () => {
    const regStatus = registrationInfo.reg_status;

    switch (regStatus) {
      case 1:
        return {
          title:
            "Member Institution One Complimentary Pass Without Stay 2 days",
          subtitle: "Complimentary Member Pass - 2 Days",
          icon: "🎫",
          color: "green",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          buttonColor:
            "from-green-400 to-green-500 hover:from-green-500 hover:to-green-600",
        };
      case 2:
        return {
          title:
            "Member Institution One Complimentary Pass Without Stay 3 days",
          subtitle: "Complimentary Member Pass - 3 Days",
          icon: "🎫",
          color: "green",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          buttonColor:
            "from-green-400 to-green-500 hover:from-green-500 hover:to-green-600",
        };
      case 3:
        return {
          title:
            "Member Institution One Complimentary Pass With 4 Days & 3 Nights Accommodation",
          subtitle: "Complimentary Member Pass with Accommodation",
          icon: "🏨",
          color: "blue",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          buttonColor:
            "from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600",
        };
      case 4:
        return {
          title:
            "Member Institution: No Complimentary Pass Without Stay 2 days",
          subtitle: "Member Institution Pass - 2 Days",
          icon: "🌟",
          color: "purple",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-700",
          buttonColor:
            "from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600",
        };
      case 5:
        return {
          title:
            "Member Institution: No Complimentary Pass Without Stay 3 days",
          subtitle: "Member Institution Pass - 3 Days",
          icon: "🌟",
          color: "purple",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-700",
          buttonColor:
            "from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600",
        };
      case 6:
        return {
          title:
            "Member Institution: No Complimentary Pass With 4 Days & 3 Nights Accommodation",
          subtitle: "Member Institution Pass with Accommodation",
          icon: "🏨",
          color: "indigo",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          textColor: "text-indigo-700",
          buttonColor:
            "from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600",
        };
      default:
        const title = regTitle.toLowerCase();
        if (title.includes("member") && title.includes("without stay")) {
          return {
            title: regTitle,
            subtitle: "Member Institution Pass",
            icon: "🎫",
            color: "green",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            textColor: "text-green-700",
            buttonColor:
              "from-green-400 to-green-500 hover:from-green-500 hover:to-green-600",
          };
        } else if (
          title.includes("member") &&
          (title.includes("with stay") || title.includes("accommodation"))
        ) {
          return {
            title: regTitle,
            subtitle: "Member Institution Pass with Accommodation",
            icon: "🏨",
            color: "blue",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            textColor: "text-blue-700",
            buttonColor:
              "from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600",
          };
        } else if (title.includes("non-member")) {
          return {
            title: regTitle,
            subtitle: "Non-Member Institution Pass",
            icon: "🌟",
            color: "red",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            textColor: "text-red-700",
            buttonColor:
              "from-red-400 to-red-500 hover:from-red-500 hover:to-red-600",
          };
        } else {
          return {
            title: regTitle,
            subtitle: "Event Registration",
            icon: "🎫",
            color: "orange",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            textColor: "text-orange-700",
            buttonColor:
              "from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600",
          };
        }
    }
  };

  const config = getConfigFromRegStatus();

  // Determine if includes stay based on reg_status
  const includesStay = [3, 6].includes(registrationInfo.reg_status);

  // Get available days and their schedules based on registration status
  const getScheduleByStatus = (regStatus) => {
    const schedules = {
      1: {
        days: ["day1", "day2"],
        activities: {
          day1: {
            name: "Day 1 - EduSkills Connect (17th Sep, Wednesday)",
            icon: "🎓",
            activities: ["• Dinner"],
          },
          day2: {
            name: "Day 2 - EduSkills Connect (18th Sep, Thursday)",
            icon: "📚",
            activities: [
              "• Lunch",
              "• Dinner",
              "• Conference Kit, Goodies & Participation Certificate",
            ],
          },
        },
      },
      2: {
        days: ["day1", "day2", "day3"],
        activities: {
          day1: {
            name: "Day 1 - EduSkills Connect (17th Sep, Wednesday)",
            icon: "🎓",
            activities: ["• Dinner"],
          },
          day2: {
            name: "Day 2 - EduSkills Connect (18th Sep, Thursday)",
            icon: "📚",
            activities: [
              "• Lunch",
              "• Dinner",
              "• Conference Kit, Goodies & Participation Certificate",
            ],
          },
          day3: {
            name: "Day 3 - HR Summit (19th Sep, Friday)",
            icon: "👥",
            activities: [
              "• Lunch",
              "• Networking Cocktail Dinner",
              "• Participation Certificate",
            ],
          },
        },
      },
      3: {
        days: ["day1", "day2", "day3"],
        activities: {
          day1: {
            name: "Day 1 - EduSkills Connect (17th Sep, Wednesday)",
            icon: "🎓",
            activities: ["• Check-in by 1 PM", "• Lunch", "• Dinner"],
          },
          day2: {
            name: "Day 2 - EduSkills Connect (18th Sep, Thursday)",
            icon: "📚",
            activities: ["• Lunch", "• Dinner"],
          },
          day3: {
            name: "Day 3 - HR Summit (19th Sep, Friday)",
            icon: "👥",
            activities: ["• Lunch", "• Networking Cocktail Dinner"],
          },
        },
      },
      4: {
        days: ["day1", "day2"],
        activities: {
          day1: {
            name: "Day 1 - EduSkills Connect (17th Sep, Wednesday)",
            icon: "🎓",
            activities: ["• Dinner"],
          },
          day2: {
            name: "Day 2 - EduSkills Connect (18th Sep, Thursday)",
            icon: "📚",
            activities: [
              "• Lunch",
              "• Dinner",
              "• Conference Kit, Goodies & Participation Certificate",
            ],
          },
        },
      },
      5: {
        days: ["day1", "day2", "day3"],
        activities: {
          day1: {
            name: "Day 1 - EduSkills Connect (17th Sep, Wednesday)",
            icon: "🎓",
            activities: ["• Dinner"],
          },
          day2: {
            name: "Day 2 - EduSkills Connect (18th Sep, Thursday)",
            icon: "📚",
            activities: [
              "• Lunch",
              "• Dinner",
              "• Conference Kit, Goodies & Participation Certificate",
            ],
          },
          day3: {
            name: "Day 3 - HR Summit (19th Sep, Friday)",
            icon: "👥",
            activities: [
              "• Lunch",
              "• Networking Cocktail Dinner",
              "• Participation Certificate",
            ],
          },
        },
      },
      6: {
        days: ["day1", "day2", "day3"],
        activities: {
          day1: {
            name: "Day 1 - EduSkills Connect (17th Sep, Wednesday)",
            icon: "🎓",
            activities: ["• Check-in by 1 PM", "• Lunch", "• Dinner"],
          },
          day2: {
            name: "Day 2 - EduSkills Connect (18th Sep, Thursday)",
            icon: "📚",
            activities: ["• Lunch", "• Dinner"],
          },
          day3: {
            name: "Day 3 - HR Summit (19th Sep, Friday)",
            icon: "👥",
            activities: ["• Lunch", "• Networking Cocktail Dinner"],
          },
        },
      },
    };

    return schedules[regStatus] || schedules[1];
  };

  const scheduleData = getScheduleByStatus(registrationInfo.reg_status);

  const availableDays = [];
  scheduleData.days.forEach((dayKey) => {
    if (registrationInfo[dayKey]) {
      availableDays.push({
        key: dayKey,
        ...scheduleData.activities[dayKey],
      });
    }
  });

  // Get additional preferences data
  const getAdditionalPreferencesData = () => {
    const preferences = [];

    if (registrationInfo.day1) {
      preferences.push({
        id: "day1_allergies",
        label: "Food Allergies",
        icon: "🚨",
        options: ["Yes", "No"],
        required: true,
      });

      preferences.push({
        id: "day1_drink",
        label: "Drink Preference",
        icon: "🍷",
        options: ["Alcohol", "Non-Alcohol"],
        required: true,
      });

      preferences.push({
        id: "day1_travel",
        label: "Travel Mode",
        icon: "🚗",
        options: ["Bus", "Train", "Car", "Flight"],
        required: true,
      });
    }

    return preferences;
  };

  const handlePreferenceChange = (questionId, value) => {
    setPreferences((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: null }));
    }

    if (questionId === "day1_allergies") {
      if (value === "Yes") {
        setShowAllergiesInput(true);
      } else {
        setShowAllergiesInput(false);
        setAllergiesDetail("");
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate image upload
    if (!selectedImage) {
      newErrors.image = "Profile picture is required";
    }

    // Validate food preferences for each available day
    availableDays.forEach((day) => {
      const foodId = `${day.key}_food`;
      if (!preferences[foodId]) {
        newErrors[foodId] = "This field is required";
      }
    });

    // Validate additional preferences
    const additionalPrefs = getAdditionalPreferencesData();
    additionalPrefs.forEach((pref) => {
      if (pref.required && !preferences[pref.id]) {
        newErrors[pref.id] = "This field is required";
      }
    });

    // Validate allergies detail if user selected "Yes"
    if (preferences.day1_allergies === "Yes" && !allergiesDetail.trim()) {
      newErrors.day1_allergies_detail = "Please specify your food allergies";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        let finalPreferences = { ...preferences };
        if (preferences.day1_allergies === "Yes" && allergiesDetail.trim()) {
          finalPreferences.day1_allergies_detail = allergiesDetail;
        }

        await onComplete({
          userDetails,
          preferences: finalPreferences,
          registrationInfo,
          image: selectedImage, // Include the selected image blob
        });
      } catch (error) {
        console.error("Registration error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Travel Advisory Component
  const TravelAdvisory = () => (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start">
        <span className="text-blue-500 text-xl mr-3">🏔️</span>
        <div>
          <h4 className="text-blue-800 font-semibold text-sm mb-2">
            Travel Advisory for Annual Conclave – Shimla
          </h4>
          <p className="text-blue-700 text-sm mb-3">
            To ensure a smooth and hassle-free journey, please note:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              <p className="text-blue-700">
                <strong>Avoid direct flights to Shimla</strong> – high risk of
                cancellation due to unpredictable weather.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              <p className="text-blue-700">
                <strong>Preferred route:</strong> Book your flight to{" "}
                <strong>Chandigarh</strong> (more reliable connectivity).
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2">🚖</span>
              <p className="text-blue-700">
                From Chandigarh, hire a cab to Shimla –{" "}
                <strong>approx. 2 hours</strong> of a scenic drive.
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2">✨</span>
              <p className="text-blue-700">
                This route is safer, more dependable, and ensures you reach the
                event on time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl relative z-[10000]">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Contact Information
          </h3>
          <p className="text-gray-600">
            Get in touch with our team for assistance
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-1">
                Event Support
              </h4>
              <p className="text-sm text-blue-600">
                For registration and event queries
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-semibold text-gray-800">
                  Preetipragyan Mohapatra
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                <p className="font-semibold text-gray-800">+91 8093254905</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowContactModal(false)}
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Loading Modal Component
  const LoadingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Processing Registration
          </h3>
          <p className="text-gray-600 mb-6">
            Please wait while we complete your registration...
          </p>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4" style={{ scrollBehavior: "smooth" }}>
      <div className="max-w-6xl mx-auto" style={{ contain: "layout" }}>
        {/* Status Header */}
        <div
          className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-8 mb-8 shadow-2xl`}
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{config.icon}</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {config.title}
            </h1>
          </div>

          {/* User Details */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-semibold text-gray-800">
                  {userDetails.name}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-semibold text-gray-800">
                  {userDetails.email}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Mobile:</span>
                <p className="font-semibold text-gray-800">
                  +91 {userDetails.mobile}
                </p>
              </div>
              <div>
                <span className="text-gray-600">WhatsApp:</span>
                <p className="font-semibold text-gray-800">
                  +91 {userDetails.whatsapp}
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Profile Information
            </h3>
            <ImageUploadComponent
              onImageSelect={handleImageSelect}
              currentImage={imagePreviewUrl}
              hasError={!!errors.image}
            />
          </div>

          {/* Event Days with Food Preferences */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Event Schedule & Food Preferences
            </h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <table className="w-full border-collapse">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 border-b-2 border-orange-200 border-r border-gray-200">
                      Day, Date & Event
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 border-b-2 border-orange-200 border-r border-gray-200">
                      Schedule & Activities
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 border-b-2 border-orange-200">
                      Food Preference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {availableDays.map((day, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 border-r border-gray-200">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">📅</span>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {day.name.split(" - ")[0]}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              {day.name.split("(")[1].split(")")[0]}
                            </p>
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{day.icon}</span>
                              <span className="font-medium text-gray-700 text-xs">
                                {day.name.split(" - ")[1].split(" (")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-200">
                        <div className="text-xs text-gray-700 space-y-1">
                          {day.activities.map((activity, actIndex) => (
                            <p key={actIndex}>{activity}</p>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {["Vegetarian", "Non-Vegetarian"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 group border border-gray-200 hover:border-orange-400"
                            >
                              <input
                                type="radio"
                                name={`${day.key}_food`}
                                value={option}
                                checked={
                                  preferences[`${day.key}_food`] === option
                                }
                                onChange={(e) => {
                                  handlePreferenceChange(
                                    `${day.key}_food`,
                                    e.target.value
                                  );
                                }}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                                  preferences[`${day.key}_food`] === option
                                    ? "border-orange-400 bg-gradient-to-r from-orange-400 to-orange-500"
                                    : "border-blue-400 group-hover:border-orange-400"
                                }`}
                              >
                                {preferences[`${day.key}_food`] === option && (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-gray-700 font-medium text-xs">
                                {option === "Vegetarian" ? "Veg" : "Non-Veg"}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors[`${day.key}_food`] && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors[`${day.key}_food`]}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Day 4 Row - only for accommodation packages (status 3 & 6) */}
                  {includesStay && availableDays.length > 0 && (
                    <tr className="border-b border-gray-200 hover:bg-red-50">
                      <td className="px-4 py-4 border-r border-gray-200">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">📅</span>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              Day 4
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              20th Sep, Friday
                            </p>
                            <div className="flex items-center">
                              <span className="text-lg mr-2">🚪</span>
                              <span className="font-medium text-red-600 text-xs">
                                Check-out
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-200">
                        <div className="text-xs text-gray-700 space-y-1">
                          <p>• Checkout By 10:00 AM</p>
                          <p>
                            • Conference Kit, Goodies & Participation
                            Certificate
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500 italic">
                          Breakfast provided
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Preferences Table */}
          {getAdditionalPreferencesData().length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Additional Preferences
              </h3>
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <table className="w-full border-collapse">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 border-b-2 border-orange-200 border-r border-gray-200">
                        Preference Category
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 border-b-2 border-orange-200">
                        Your Selection
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAdditionalPreferencesData().map((pref, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 border-r border-gray-200">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{pref.icon}</span>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
                                {pref.label}
                                {pref.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-3 flex-wrap mb-2">
                            {pref.options.map((option) => (
                              <label
                                key={option}
                                className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 group border border-gray-200 hover:border-orange-400"
                              >
                                <input
                                  type="radio"
                                  name={pref.id}
                                  value={option}
                                  checked={preferences[pref.id] === option}
                                  onChange={(e) => {
                                    handlePreferenceChange(
                                      pref.id,
                                      e.target.value
                                    );
                                  }}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                                    preferences[pref.id] === option
                                      ? "border-orange-400 bg-gradient-to-r from-orange-400 to-orange-500"
                                      : "border-blue-400 group-hover:border-orange-400"
                                  }`}
                                >
                                  {preferences[pref.id] === option && (
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <span className="text-gray-700 font-medium text-sm">
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>

                          {errors[pref.id] && (
                            <p className="text-red-500 text-sm mb-4">
                              {errors[pref.id]}
                            </p>
                          )}

                          {/* Food Allergies Detail Input */}
                          {pref.id === "day1_allergies" &&
                            showAllergiesInput && (
                              <div className="mt-4 transition-all duration-300">
                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                  Please specify your food allergies{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  value={allergiesDetail}
                                  onChange={(e) =>
                                    setAllergiesDetail(e.target.value)
                                  }
                                  placeholder="e.g., Nuts, Dairy, Seafood, etc."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none text-sm"
                                  rows="3"
                                />
                                {errors.day1_allergies_detail && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.day1_allergies_detail}
                                  </p>
                                )}
                              </div>
                            )}

                          {/* Alcohol Note */}
                          {pref.id === "day1_drink" &&
                            preferences[pref.id] === "Alcohol" && (
                              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start">
                                  <span className="text-amber-500 text-xl mr-3">
                                    ⚠️
                                  </span>
                                  <div>
                                    <p className="text-amber-800 font-medium text-sm">
                                      <strong>Important Note:</strong> A maximum
                                      of two 30ml servings of alcohol will be
                                      permitted per individual during the event.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* Travel Advisory */}
                          {pref.id === "day1_travel" && <TravelAdvisory />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button and Contact Support */}
        <div className="text-center space-y-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform bg-gradient-to-r ${
              config.buttonColor
            } text-white shadow-lg hover:shadow-xl ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {isSubmitting ? "Processing..." : "Complete Registration"}
          </button>

          <div className="flex items-center justify-center">
            <span className="text-gray-600 text-sm mr-2">Need help?</span>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-orange-500 hover:text-orange-600 font-medium text-sm underline transition-colors duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && <ContactModal />}

      {/* Loading Modal */}
      {isSubmitting && <LoadingModal />}
    </div>
  );
};

export default StatusDisplayComponent;
