import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

export default function EventFeedbackForm() {
  const [formData, setFormData] = useState({
    rating: "1",
    expectations: "",
    like1: "",
    like2: "",
    like3: "",
    dislike1: "",
    dislike2: "",
    dislike3: "",
    suggestions: "",
    referral: "",
    referenceName: "",
    referenceEmail: "",
    referenceContact: "",
    referenceInstitute: "",
    noReferralReason: "",
    registrationCode: "",
    panelRatings: {
      panel1: "",
      panel2: "",
      panel3: "",
      panel4: "",
      panel5: "",
    },
    speakerRatings: {}, // This will store speaker_id -> rating mapping
  });

  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Panel and Speaker data - to be populated from API
  const [panelData, setPanelData] = useState({});
  const [speakersByDay, setSpeakersByDay] = useState({});

  // Function to get material color classes based on color string
  const getMaterialColor = (colorString) => {
    const colorMap = {
      red: {
        bg: "bg-red-500",
        text: "text-white",
        border: "border-red-500",
        shadow: "shadow-red-200",
        hover: "hover:bg-red-600",
      },
      blue: {
        bg: "bg-blue-500",
        text: "text-white",
        border: "border-blue-500",
        shadow: "shadow-blue-200",
        hover: "hover:bg-blue-600",
      },
      green: {
        bg: "bg-green-500",
        text: "text-white",
        border: "border-green-500",
        shadow: "shadow-green-200",
        hover: "hover:bg-green-600",
      },
      orange: {
        bg: "bg-orange-500",
        text: "text-white",
        border: "border-orange-500",
        shadow: "shadow-orange-200",
        hover: "hover:bg-orange-600",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-white",
        border: "border-purple-500",
        shadow: "shadow-purple-200",
        hover: "hover:bg-purple-600",
      },
      pink: {
        bg: "bg-pink-500",
        text: "text-white",
        border: "border-pink-500",
        shadow: "shadow-pink-200",
        hover: "hover:bg-pink-600",
      },
      indigo: {
        bg: "bg-indigo-500",
        text: "text-white",
        border: "border-indigo-500",
        shadow: "shadow-indigo-200",
        hover: "hover:bg-indigo-600",
      },
      yellow: {
        bg: "bg-yellow-500",
        text: "text-white",
        border: "border-yellow-500",
        shadow: "shadow-yellow-200",
        hover: "hover:bg-yellow-600",
      },
      teal: {
        bg: "bg-teal-500",
        text: "text-white",
        border: "border-teal-500",
        shadow: "shadow-teal-200",
        hover: "hover:bg-teal-600",
      },
      cyan: {
        bg: "bg-cyan-500",
        text: "text-white",
        border: "border-cyan-500",
        shadow: "shadow-cyan-200",
        hover: "hover:bg-cyan-600",
      },
    };

    // Default to blue if color not found
    return colorMap[colorString?.toLowerCase()] || colorMap.blue;
  };

  // Function to extract rating from API response string like "Panel Name (excellent)"
  const extractRating = (str) => {
    if (!str) return "";
    const match = str.match(/\((\w+)\)$/);
    return match ? match[1] : "";
  };

  // Fetch feedback status on component mount
  const fetchFeedbackStatus = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/internship/feedback-status/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data;
      setFeedbackStatus(data);

      // Pre-fill form data if feedback exists
      if (data && !data.feedback_submitted) {
        const updatedPanelRatings = {};

        // Extract panel ratings and populate panelData
        const panels = {};
        Object.keys(data.panels || {}).forEach((panelKey) => {
          const rating = extractRating(data.panels[panelKey]);
          updatedPanelRatings[panelKey] = rating;
          // Extract panel description (remove the rating part)
          panels[panelKey] = data.panels[panelKey].replace(/\s*\([^)]*\)$/, "");
        });
        setPanelData(panels);

        // Process speakers from new day-wise structure
        const speakers = data.speakers || {};
        setSpeakersByDay(speakers);

        // Initialize speaker ratings
        const initialSpeakerRatings = {};
        Object.keys(speakers).forEach((day) => {
          if (Array.isArray(speakers[day])) {
            speakers[day].forEach((speaker) => {
              // Initialize with empty rating
              initialSpeakerRatings[speaker.speaker_id] = "";
            });
          }
        });

        setFormData((prev) => ({
          ...prev,
          registrationCode: data.registration_code || "",
          panelRatings: { ...prev.panelRatings, ...updatedPanelRatings },
          speakerRatings: initialSpeakerRatings,
        }));
      }
    } catch (error) {
      console.error("Error fetching feedback status:", error);
      if (error.response?.status === 401) {
        console.error("Unauthorized access - invalid or expired token");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackStatus();
  }, []);

  const handleRatingChange = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleExpectationsChange = (value) => {
    setFormData({ ...formData, expectations: value });
  };

  const handleLikeChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDislikeChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePanelRatingChange = (panel, rating) => {
    setFormData({
      ...formData,
      panelRatings: {
        ...formData.panelRatings,
        [panel]: rating,
      },
    });
  };

  const handleSpeakerRatingChange = (speakerId, rating) => {
    setFormData({
      ...formData,
      speakerRatings: {
        ...formData.speakerRatings,
        [speakerId]: rating,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Check if feedback is open
      if (feedbackStatus && !feedbackStatus.feedback_open) {
        alert("Feedback submission is currently closed.");
        return;
      }

      // Check if feedback already submitted
      if (feedbackStatus && feedbackStatus.feedback_submitted) {
        alert("Feedback has already been submitted.");
        return;
      }

      // Get access token
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Access token not found. Please log in again.");
        return;
      }

      // Prepare speaker ratings array
      const speakerRatingsArray = Object.keys(formData.speakerRatings)
        .filter((speakerId) => formData.speakerRatings[speakerId]) // Only include speakers with ratings
        .map((speakerId) => ({
          speaker_id: parseInt(speakerId),
          rating: formData.speakerRatings[speakerId],
        }));

      // Prepare submission data in the required format
      const submissionData = {
        registrationCode: formData.registrationCode,
        rating: formData.rating,
        expectations: formData.expectations,
        like1: formData.like1,
        like2: formData.like2,
        like3: formData.like3,
        dislike1: formData.dislike1,
        dislike2: formData.dislike2,
        dislike3: formData.dislike3,
        suggestions: formData.suggestions,
        referral: formData.referral,
        referenceName: formData.referenceName,
        referenceEmail: formData.referenceEmail,
        referenceContact: formData.referenceContact,
        referenceInstitute: formData.referenceInstitute,
        noReferralReason: formData.noReferralReason,
        speaker_ratings: speakerRatingsArray,
      };

      // Add panel ratings only if they exist and have values
      Object.keys(formData.panelRatings).forEach((panelKey) => {
        if (formData.panelRatings[panelKey] && panelData[panelKey]) {
          // Convert panel1 -> pd1, panel2 -> pd2, etc.
          const pdKey = panelKey.replace("panel", "pd");
          submissionData[pdKey] = formData.panelRatings[panelKey];
        }
      });

      console.log("Form Data Submitted:", submissionData);

      const response = await axios.post(
        `${BASE_URL}/internship/submit-feedback/`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setJustSubmitted(true);
        await fetchFeedbackStatus();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else if (error.response?.status === 400) {
        alert("Invalid data. Please check your input and try again.");
      } else {
        alert("Error submitting feedback. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const RatingCircle = ({ number, label, selected, onClick }) => (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
          selected
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-600 border-gray-300 hover:border-blue-300"
        }`}
      >
        {number}
      </button>
      {label && (
        <span className="text-xs text-gray-600 mt-1 text-center">{label}</span>
      )}
    </div>
  );

  const getDayLabel = (dayKey) => {
    const dayMap = {
      day_1: "Day 1",
      day_2: "Day 2",
      day_3: "Day 3",
      day_4: "Day 4",
      day_5: "Day 5",
    };
    return dayMap[dayKey] || dayKey;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  // Show message if feedback is already submitted or just submitted
  if ((feedbackStatus && feedbackStatus.feedback_submitted) || justSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          {/* Success Header */}
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thank You For Your Feedback!
            </h2>
            <p className="text-gray-600 mb-6">
              You can collect your goodies and check out our event photos below.
            </p>
          </div>

          {/* Photo Links Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📸 Event Photos
            </h3>

            {/* Day 1 Photos */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Day 1 Photos
                    </h4>
                    <p className="text-sm text-gray-600">
                      View and download Day 1 event memories
                    </p>
                  </div>
                </div>
                <a
                  href="https://drive.google.com/drive/folders/1-xkFdi7-N1eALFCHJtbUghfvIuDLMfYM?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Photos
                </a>
              </div>
            </div>

            {/* Day 2 Photos */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Day 2 Photos
                    </h4>
                    <p className="text-sm text-gray-600">
                      View and download Day 2 event memories
                    </p>
                  </div>
                </div>
                <a
                  href="https://drive.google.com/drive/folders/1bdzo6acPX2kCJTXkj4fD9twuSqG-jc6i?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Photos
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Click on the links above to access the Google Drive folders with
              all event photos. Photos will open in a new tab.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show message if feedback is closed
  if (feedbackStatus && !feedbackStatus.feedback_open) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Feedback Will Open Soon!
          </h2>
        </div>
      </div>
    );
  }

  // Get the color scheme for registration code
  const colorScheme = getMaterialColor(feedbackStatus?.is_color);

  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Event Feedback
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced Registration Code Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Registration Code *
            </label>
            <div className="flex justify-left">
              <div
                className={`inline-flex items-center px-6 py-4 rounded-xl border-2 ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border} ${colorScheme.shadow} shadow-lg transform transition-all duration-200 hover:scale-105 ${colorScheme.hover} cursor-default select-none`}
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="text-sm font-bold tracking-wider">
                    {formData.registrationCode || "LOADING..."}
                  </span>
                </div>
              </div>
            </div>
            <input
              type="hidden"
              value={formData.registrationCode}
              readOnly
              required
            />
          </div>

          {/* Rating Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate the event? *
            </label>
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <RatingCircle
                    key={num}
                    number={num}
                    label={num === 1 ? "Poor" : num === 10 ? "Excellent" : null}
                    selected={formData.rating === num.toString()}
                    onClick={() => handleRatingChange(num.toString())}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Expectations Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Did the event meet your expectations? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="expectations"
                  value="Yes, definitely"
                  checked={formData.expectations === "Yes, definitely"}
                  onChange={(e) => handleExpectationsChange(e.target.value)}
                  className="mr-2"
                  required
                />
                <span className="text-sm text-gray-700">Yes, definitely</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="expectations"
                  value="Maybe"
                  checked={formData.expectations === "Maybe"}
                  onChange={(e) => handleExpectationsChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Maybe</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="expectations"
                  value="No, never"
                  checked={formData.expectations === "No, never"}
                  onChange={(e) => handleExpectationsChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">No, never</span>
              </label>
            </div>
          </div>

          {/* Panel Discussions Section - Only show if panels exist */}
          {Object.keys(panelData).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-4">
                Please rate.
              </h3>
              <h4 className="text-base font-medium text-blue-600 mb-3">
                Panel Discussions
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                        Panel Discussion
                      </th>
                      <th className="py-2 px-4 text-center text-xs text-gray-600">
                        Excellent
                      </th>
                      <th className="py-2 px-4 text-center text-xs text-gray-600">
                        Good
                      </th>
                      <th className="py-2 px-4 text-center text-xs text-gray-600">
                        Average
                      </th>
                      <th className="py-2 px-4 text-center text-xs text-gray-600">
                        Fair
                      </th>
                      <th className="py-2 px-4 text-center text-xs text-gray-600">
                        Poor
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(panelData).map(
                      ([panelKey, description], index) => (
                        <tr key={panelKey} className="border-b border-gray-200">
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {index + 1}. {description}
                          </td>
                          {["excellent", "good", "average", "fair", "poor"].map(
                            (rating) => (
                              <td
                                key={rating}
                                className="py-3 px-4 text-center"
                              >
                                <input
                                  type="radio"
                                  name={panelKey}
                                  value={rating}
                                  checked={
                                    formData.panelRatings[panelKey] === rating
                                  }
                                  onChange={() =>
                                    handlePanelRatingChange(panelKey, rating)
                                  }
                                  className="w-4 h-4 text-blue-600"
                                />
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Industry Sessions Section - Day-wise */}
          {Object.keys(speakersByDay).length > 0 && (
            <div>
              <h4 className="text-base font-medium text-blue-600 mb-3">
                Keynote Sessions *
              </h4>

              {Object.entries(speakersByDay)
                .filter(
                  ([day, speakers]) =>
                    Array.isArray(speakers) && speakers.length > 0
                )
                .map(([day, speakers]) => (
                  <div key={day} className="mb-6">
                    <h5 className="text-sm font-semibold text-blue-500 mb-3 bg-blue-50 px-3 py-2 rounded">
                      {getDayLabel(day)} Sessions
                    </h5>

                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 mb-4">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                              Speaker/Session
                            </th>
                            <th className="py-2 px-4 text-center text-xs text-gray-600">
                              Excellent
                            </th>
                            <th className="py-2 px-4 text-center text-xs text-gray-600">
                              Good
                            </th>
                            <th className="py-2 px-4 text-center text-xs text-gray-600">
                              Average
                            </th>
                            <th className="py-2 px-4 text-center text-xs text-gray-600">
                              Fair
                            </th>
                            <th className="py-2 px-4 text-center text-xs text-gray-600">
                              Poor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {speakers.map((speaker) => (
                            <tr
                              key={speaker.speaker_id}
                              className="border-b border-gray-200"
                            >
                              <td className="py-3 px-4 text-sm text-gray-700">
                                <div>
                                  <div className="font-medium">
                                    {speaker.name}
                                  </div>
                                  <div className="mt-2">
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md border border-blue-200">
                                      Topic: {speaker.topic}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              {[
                                "excellent",
                                "good",
                                "average",
                                "fair",
                                "poor",
                              ].map((rating) => (
                                <td
                                  key={rating}
                                  className="py-3 px-4 text-center"
                                >
                                  <input
                                    type="radio"
                                    name={`speaker_${speaker.speaker_id}`}
                                    value={rating}
                                    checked={
                                      formData.speakerRatings[
                                        speaker.speaker_id
                                      ] === rating
                                    }
                                    onChange={() =>
                                      handleSpeakerRatingChange(
                                        speaker.speaker_id,
                                        rating
                                      )
                                    }
                                    className="w-4 h-4 text-blue-600"
                                    required
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* 3 Things You Liked */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3 Things you most liked in the event. *
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={formData.like1}
                  onChange={(e) => handleLikeChange("like1", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter what you liked most"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">
                  1
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.like2}
                  onChange={(e) => handleLikeChange("like2", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter what you liked"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">
                  2
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.like3}
                  onChange={(e) => handleLikeChange("like3", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter what you liked"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">
                  3
                </span>
              </div>
            </div>
          </div>

          {/* 3 Things You Disliked */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3 Things you most disliked in the event. *
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={formData.dislike1}
                  onChange={(e) =>
                    handleDislikeChange("dislike1", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter what you disliked most"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">
                  1
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.dislike2}
                  onChange={(e) =>
                    handleDislikeChange("dislike2", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter what you disliked"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">
                  2
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.dislike3}
                  onChange={(e) =>
                    handleDislikeChange("dislike3", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter what you disliked"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">
                  3
                </span>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your suggestions please... *
            </label>
            <textarea
              value={formData.suggestions}
              onChange={(e) =>
                setFormData({ ...formData, suggestions: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please share your suggestions for improvement..."
              required
            />
          </div>

          {/* Referral Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Would you like to refer EduSkills Center Of Excellence Program? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="referral"
                  value="yes"
                  checked={formData.referral === "yes"}
                  onChange={(e) =>
                    setFormData({ ...formData, referral: e.target.value })
                  }
                  className="mr-2"
                  required
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="referral"
                  value="no"
                  checked={formData.referral === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, referral: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          {/* Reference Details (shown when Yes is selected) */}
          {formData.referral === "yes" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                If Yes, Please give one reference. *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={formData.referenceName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                    required={formData.referral === "yes"}
                  />
                  <label className="block text-xs text-gray-500 mt-1">
                    Name
                  </label>
                </div>
                <div>
                  <input
                    type="email"
                    value={formData.referenceEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    required={formData.referral === "yes"}
                  />
                  <label className="block text-xs text-gray-500 mt-1">
                    Email
                  </label>
                </div>
                <div>
                  <input
                    type="tel"
                    value={formData.referenceContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceContact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact number"
                    required={formData.referral === "yes"}
                  />
                  <label className="block text-xs text-gray-500 mt-1">
                    Contact Number
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.referenceInstitute}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceInstitute: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter institute/organization name"
                    required={formData.referral === "yes"}
                  />
                  <label className="block text-xs text-gray-500 mt-1">
                    Institute Name
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* No Referral Reason (shown when No is selected) */}
          {formData.referral === "no" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                If No, Please give the reason. *
              </label>
              <textarea
                value={formData.noReferralReason}
                onChange={(e) =>
                  setFormData({ ...formData, noReferralReason: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please explain why you would not refer this program..."
                required={formData.referral === "no"}
              />
            </div>
          )}

          {/* Submit Button with Loader */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`font-medium py-3 px-12 rounded-md transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto ${
                submitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {submitting ? (
                <>
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
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
