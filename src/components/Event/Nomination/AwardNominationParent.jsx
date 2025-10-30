import React, { useState } from "react";
import axios from "axios";
import CategorySelection from "./CategorySelection";
import QuizForm from "./QuizForm";
import { BASE_URL } from "../../../services/configUrls";

const AwardNominationSystem = () => {
  const [currentView, setCurrentView] = useState("category"); // 'category', 'form', 'loading'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchQuestions();
  };

  const handleBackToCategory = () => {
    setCurrentView("category");
    setSelectedCategory(null);
    setQuestions([]);
    setError(null);
  };

  const handleQuizComplete = () => {
    setCurrentView("category");
    setSelectedCategory(null);
    setQuestions([]);
    setError(null);
  };

  // Show loading skeleton when fetching questions
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show category selection view
  if (currentView === "category") {
    return (
      <CategorySelection
        onCategorySelect={handleCategorySelect}
        loading={loading}
        error={error}
      />
    );
  }

  // Show quiz form view
  if (currentView === "form" && questions.length > 0) {
    return (
      <QuizForm
        selectedCategory={selectedCategory}
        questions={questions}
        onBack={handleBackToCategory}
        onComplete={handleQuizComplete}
      />
    );
  }

  // Show no questions available message
  if (currentView === "form" && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-yellow-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Questions Available
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load the quiz questions. Please try again later.
            </p>
            <button
              onClick={handleBackToCategory}
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

export default AwardNominationSystem;
