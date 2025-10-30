import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  HelpCircle,
  Star,
  Upload,
  Send,
  X,
} from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";

const SpocAwardNomination = () => {
  const [currentView, setCurrentView] = useState("category"); // 'category', 'form', 'loading', 'final'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formError, setFormError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const category = {
    id: 1,
    title: "Course Evaluation",
    description:
      "Help us improve by sharing your thoughts and experiences. Your feedback is valuable to us and helps us enhance our services and provide better learning experiences for all participants.",
    icon: <MessageSquare className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&crop=center",
    deadline: "March 30, 2025",
  };

  // Confetti Component
  const Confetti = () => {
    if (!showConfetti) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-orange-500 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found. Please login first.");
      }

      const response = await axios.get(
        `${BASE_URL}/internship/nomination/questions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
        setCurrentView("form");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = () => {
    setSelectedCategory(category);
    setAnswers({});
    fetchQuestions();
  };

  const handleAnswerSelect = (questionId, option, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        text: option,
        optionId: optionId,
      },
    }));
    // Clear form error when user starts answering
    if (formError) {
      setFormError("");
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
    if (formError) {
      setFormError("");
    }
  };

  const handleFeedbackChange = (e) => {
    if (formError) {
      setFormError("");
    }
  };

  const validateForm = () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => answers[q.question_id] === undefined
    );

    if (unansweredQuestions.length > 0) {
      setFormError(
        `Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`
      );
      return false;
    }

    if (rating === 0) {
      setFormError("Please provide a rating before submitting.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const accessToken = localStorage.getItem("accessToken");

      // Format answers for API
      const formattedAnswers = questions.map((question) => ({
        question_id: question.question_id,
        selected_option_id: answers[question.question_id]?.optionId,
      }));

      const submissionData = {
        answers: formattedAnswers,
        rating: rating,
      };

      const response = await axios.post(
        `${BASE_URL}/internship/feedback/submit`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setCurrentView("final");
        }, 3000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentView("category");
    setSelectedCategory(null);
    setAnswers({});
    setQuestions([]);
    setError(null);
    setRating(0);
    setHoverRating(0);
    setFormError("");
    setShowConfetti(false);
  };

  // Get rating text based on number
  const getRatingText = (value) => {
    if (value === 0) return "";
    if (value <= 2) return "Poor";
    if (value <= 4) return "Below Average";
    if (value <= 6) return "Average";
    if (value <= 8) return "Good";
    return "Excellent";
  };

  // Number Rating Component (1-10)
  const NumberRating = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <button
              key={number}
              onClick={() => handleRatingClick(number)}
              onMouseEnter={() => setHoverRating(number)}
              onMouseLeave={() => setHoverRating(0)}
              className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all duration-200 hover:scale-110 ${
                number <= (hoverRating || rating)
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-blue-300"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
        <div className="text-center">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
          {(hoverRating || rating) > 0 && (
            <p className="text-blue-600 font-medium">
              Rating: {hoverRating || rating}/10 -{" "}
              {getRatingText(hoverRating || rating)}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === "category") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1500px] mx-auto">
          {/* Header */}
          <div className="text-left mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Feedback Category
            </h1>
            <p className="text-lg text-gray-600">
              Share your experience and help us improve our services
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-600 mr-3">⚠️</div>
                <div>
                  <h3 className="text-red-800 font-medium">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Category Card */}
          <div
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            onClick={handleCategoryClick}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Image */}
              <div className="lg:w-2/5 relative h-48 lg:h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-blue-600 opacity-20 group-hover:opacity-10 transition-opacity duration-300"></div>

                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    <Clock className="w-4 h-4 mr-2" />
                    Deadline: {category.deadline}
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {category.title}
                  </h2>

                  <p className="text-base text-gray-600 leading-relaxed mb-6">
                    {category.description}
                  </p>
                </div>

                {/* Quiz Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      Multiple Questions
                    </p>
                    <p className="text-xs text-gray-500">All in One Form</p>
                  </div>

                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      Rating & Feedback
                    </p>
                    <p className="text-xs text-gray-500">Your Opinion</p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="w-full lg:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </span>
                  ) : (
                    <>
                      Start Feedback
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-8 text-left">
            <p className="text-gray-500 text-sm">
              Click the card above to begin your feedback survey
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (currentView === "form") {
    return (
      <>
        <Confetti />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={resetForm}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200 mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Category</span>
              </button>

              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-blue-500 text-white">
                  {selectedCategory?.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedCategory?.title}
                  </h1>
                  <p className="text-gray-600">Complete Feedback Form</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Questions Table */}
              <div className="mb-8">
                <div className="bg-blue-500 text-white p-6">
                  <h2 className="text-xl font-bold">Questions & Answers</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b w-12">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b w-1/3">
                          Questions
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b w-2/3">
                          Answers
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question, index) => (
                        <tr
                          key={question.question_id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-6 py-6 text-sm font-medium text-gray-900 w-12">
                            {index + 1}
                          </td>
                          <td className="px-6 py-6 text-sm text-gray-900 w-1/3">
                            <div className="font-medium">
                              {question.question_text}
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm text-gray-900 w-2/3">
                            <div className="flex flex-wrap gap-3">
                              {question.options.map((option) => (
                                <button
                                  key={option.option_id}
                                  onClick={() =>
                                    handleAnswerSelect(
                                      question.question_id,
                                      option.option_text,
                                      option.option_id
                                    )
                                  }
                                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                    answers[question.question_id]?.text ===
                                    option.option_text
                                      ? "border-blue-500 bg-blue-50 text-blue-700"
                                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                      answers[question.question_id]?.text ===
                                      option.option_text
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {answers[question.question_id]?.text ===
                                      option.option_text && (
                                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span className="text-sm font-medium whitespace-nowrap">
                                    {option.option_text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rating Section */}
              <div className="p-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  How would you rate your overall experience? (1-10)
                </h3>
                <NumberRating />
              </div>

              {/* Error Message */}
              {formError && (
                <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="p-6 bg-gray-50 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    submitting
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:scale-105"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      Submit Feedback
                      <Send className="w-4 h-4 ml-2 inline" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (currentView === "final") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <MessageSquare className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You for Your Feedback!
              </h1>
              <div className="bg-orange-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Your feedback has been submitted successfully
                </h3>
                <p className="text-orange-700">
                  We appreciate your time and valuable insights. Your feedback
                  helps us improve and provide better experiences for everyone!
                </p>
              </div>

              {/* Display submitted rating */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-600 text-sm mb-2">Your Rating:</p>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {rating}/10
                  </span>
                  <span className="text-gray-600">
                    - {getRatingText(rating)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-yellow-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Questions Available
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load the feedback questions. Please try again later.
            </p>
            <button
              onClick={resetForm}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              Back to Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SpocAwardNomination;
