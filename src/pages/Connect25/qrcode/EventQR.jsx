import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

const EventQRPlanner = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodes, setQrCodes] = useState({});
  const [qrLoading, setQrLoading] = useState({});

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Access token not found. Please login again.");
        }

        const response = await axios.get(
          `${BASE_URL}/internship/qrcode-filter`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        setApiData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Authentication failed. Please login again.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message || "Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  // Format time function
  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${displayHour} ${ampm}`;
  };

  // Get note for different categories
  const getCategoryNote = (iconType) => {
    switch (iconType) {
      case "lunch":
        return "Scan to verify and take your lunch coupon";
      case "dinner":
        return "Scan to verify and take your dinner coupon";
      case "breakfast":
        return "Scan to verify and take your breakfast coupon";
      case "beverages":
      case "coffee":
        return "Scan to verify and take your drink coupon";
      case "snacks":
        return "Scan to verify and take your snack coupon";
      case "registration":
        return "Scan to verify your registration process";
      default:
        return "Scan to verify and proceed";
    }
  };

  // Generate categories based on API data
  const getCategories = () => {
    if (!apiData || !apiData.items || apiData.items.length === 0) return [];

    return apiData.items.map((item, index) => {
      const itemName = item.item_name.toLowerCase();
      let iconType = "default";

      // Match icon type based on item name
      if (itemName.includes("registration")) iconType = "registration";
      else if (itemName.includes("lunch")) iconType = "lunch";
      else if (itemName.includes("dinner")) iconType = "dinner";
      else if (itemName.includes("beverage") || itemName.includes("drink"))
        iconType = "beverages";
      else if (itemName.includes("breakfast")) iconType = "breakfast";
      else if (itemName.includes("snack")) iconType = "snacks";
      else if (itemName.includes("coffee")) iconType = "coffee";

      return {
        id: `item-${index}`,
        name: item.item_name,
        iconType: iconType,
        apiItem: item,
      };
    });
  };

  // Component to render icons based on type
  const renderIcon = (iconType) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";

    switch (iconType) {
      case "registration":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "lunch":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        );
      case "dinner":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        );
      case "beverages":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        );
      case "breakfast":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
        );
      case "snacks":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.701 2.701 0 003 15.546V9c0-5.523 4.477-10 10-10s10 4.477 10 10v6.546z"
            />
          </svg>
        );
      case "coffee":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0H4m8 4v10"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
        );
    }
  };

  const handleGenerateQR = async (categoryId, category) => {
    // If QR code already exists for this category, don't do anything
    if (qrCodes[categoryId]) {
      return;
    }

    setExpandedCard(categoryId);

    try {
      setQrLoading((prev) => ({ ...prev, [categoryId]: true }));

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found. Please login again.");
      }

      const payload = {
        registration_id: apiData.registration_id,
        day_id: apiData.day_id || 6, // Use day_id from API or default to 6
        item_id: category.apiItem.item_id || 1, // Use item_id from API or default to 1
      };

      const response = await axios.post(
        `${BASE_URL}/internship/generate_qr`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.qr_data_uri) {
        setQrCodes((prev) => ({
          ...prev,
          [categoryId]: response.data.qr_data_uri,
        }));
      } else {
        throw new Error("Invalid QR code response");
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      let errorMessage = "Failed to generate QR code";

      if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Show error in a temporary way
      alert(errorMessage);
    } finally {
      setQrLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const generatePayload = (category) => {
    if (!apiData || !category.apiItem) return null;

    return {
      registration_id: apiData.registration_id,
      date: apiData.date,
      items: [
        {
          item_name: category.apiItem.item_name,
          start_time: category.apiItem.start_time,
          end_time: category.apiItem.end_time,
        },
      ],
    };
  };

  const copyPayload = (category) => {
    const payload = generatePayload(category);
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  };

  const categories = getCategories();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading QR data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!apiData || !apiData.items || apiData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Empty State */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
              No Event Items Available
            </h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto">
              There are currently no items available for QR code generation.
              Please contact the event organizer or try again later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white text-sm sm:text-base rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 text-sm sm:text-base rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {/* Global Registration Info */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4">
              <div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Registration ID:{" "}
                </span>
                <span className="text-xs sm:text-sm text-gray-900 font-mono">
                  {apiData.registration_id}
                </span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Date:{" "}
                </span>
                <span className="text-xs sm:text-sm text-gray-900">
                  {formatDate(apiData.date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="space-y-3 sm:space-y-4">
          {categories.map((category) => {
            const payload = generatePayload(category);
            const timeRange = payload?.items?.[0]
              ? `${formatTime(payload.items[0].start_time)} to ${formatTime(
                  payload.items[0].end_time
                )}`
              : "9 am to 5 pm";

            return (
              <div
                key={category.id}
                className={`bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
                  expandedCard === category.id ? "shadow-lg" : "hover:shadow-md"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                      {renderIcon(category.iconType)}
                    </div>
                    <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-1 rounded-full">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">{timeRange}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerateQR(category.id, category)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg font-medium transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={qrLoading[category.id] || qrCodes[category.id]}
                  >
                    {qrLoading[category.id] ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : qrCodes[category.id] ? (
                      "QR Generated"
                    ) : (
                      "Generate QR"
                    )}
                  </button>
                </div>

                {/* Expanded QR Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedCard === category.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100">
                    <div className="pt-3 sm:pt-4">
                      {/* Category Note */}
                      <div className="mb-3 sm:mb-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-blue-800 text-sm font-medium">
                              {getCategoryNote(category.iconType)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="flex justify-center">
                        <div className="bg-white p-2 sm:p-4 rounded-lg border">
                          {qrCodes[category.id] ? (
                            <img
                              src={qrCodes[category.id]}
                              alt={`QR Code for ${category.name}`}
                              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
                            />
                          ) : (
                            <svg
                              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
                              viewBox="0 0 200 200"
                            >
                              <rect width="200" height="200" fill="white" />

                              {/* Corner squares */}
                              <rect
                                x="10"
                                y="10"
                                width="50"
                                height="50"
                                fill="black"
                              />
                              <rect
                                x="20"
                                y="20"
                                width="30"
                                height="30"
                                fill="white"
                              />
                              <rect
                                x="30"
                                y="30"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="140"
                                y="10"
                                width="50"
                                height="50"
                                fill="black"
                              />
                              <rect
                                x="150"
                                y="20"
                                width="30"
                                height="30"
                                fill="white"
                              />
                              <rect
                                x="160"
                                y="30"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="10"
                                y="140"
                                width="50"
                                height="50"
                                fill="black"
                              />
                              <rect
                                x="20"
                                y="150"
                                width="30"
                                height="30"
                                fill="white"
                              />
                              <rect
                                x="30"
                                y="160"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              {/* Pattern blocks */}
                              <rect
                                x="70"
                                y="10"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="90"
                                y="10"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="110"
                                y="10"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="130"
                                y="10"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="10"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="30"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="50"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="70"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="90"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="110"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="130"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="150"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="170"
                                y="70"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="70"
                                y="90"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="110"
                                y="90"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="150"
                                y="90"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="70"
                                y="110"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="90"
                                y="110"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="130"
                                y="110"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="170"
                                y="110"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="70"
                                y="130"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="110"
                                y="130"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="130"
                                y="130"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="150"
                                y="130"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="70"
                                y="150"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="90"
                                y="150"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="110"
                                y="150"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="150"
                                y="150"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="170"
                                y="150"
                                width="10"
                                height="10"
                                fill="black"
                              />

                              <rect
                                x="70"
                                y="170"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="110"
                                y="170"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="130"
                                y="170"
                                width="10"
                                height="10"
                                fill="black"
                              />
                              <rect
                                x="170"
                                y="170"
                                width="10"
                                height="10"
                                fill="black"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventQRPlanner;
