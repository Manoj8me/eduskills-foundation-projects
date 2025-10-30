import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Award,
  ArrowRight,
  Trophy,
  Calendar,
  Star,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";

const CategorySelection = ({ onCategorySelect, loading, error }) => {
  const [submissionData, setSubmissionData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  const [statusError, setStatusError] = useState(null);
  const [isNominationNotStarted, setIsNominationNotStarted] = useState(false);

  const defaultCategory = {
    id: 1,
    title: "Excellence in Leadership",
    description:
      "Recognizing outstanding leadership that drives innovation and inspires teams to achieve exceptional results. This prestigious award celebrates individuals and organizations that have demonstrated exceptional leadership qualities, fostering innovation, and inspiring their teams to reach new heights of success.",
    icon: <Award className="w-8 h-8" />,
  };

  useEffect(() => {
    fetchSubmissionStatus();
  }, []);

  const fetchSubmissionStatus = async () => {
    try {
      setFetchingStatus(true);
      setStatusError(null);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setFetchingStatus(false);
        return;
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

      if (response.data && Object.keys(response.data).length === 0) {
        setIsNominationNotStarted(true);
      } else if (response.data && response.data.already_nominated) {
        setSubmissionData(response.data);
      } else if (response.data) {
        setCategoryData({
          id: response.data.category_id,
          title: response.data.category_name,
          description: defaultCategory.description,
          icon: defaultCategory.icon,
        });
      }
    } catch (err) {
      console.error("Error fetching submission status:", err);
      setStatusError(err.response?.data?.message || "Failed to load status");
    } finally {
      setFetchingStatus(false);
    }
  };

  const handleCategoryClick = () => {
    const categoryToPass = categoryData || defaultCategory;
    onCategorySelect(categoryToPass);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  if (fetchingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="text-left mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Award Category
            </h1>
            <p className="text-lg text-gray-600">
              Loading your submission status...
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isNominationNotStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center mb-2">
                Nomination Will Start Soon
              </h1>
              <p className="text-center text-orange-100 text-lg">
                Stay tuned for the nomination period to begin
              </p>
            </div>

            <div className="p-8 text-center">
              <div className="bg-orange-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  The nomination process hasn't started yet
                </h3>
                <p className="text-orange-700">
                  We're preparing for the upcoming nomination period. Please
                  check back later or stay tuned for announcements about when
                  nominations will open.
                </p>
              </div>

              <button
                onClick={handleBackToHome}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submissionData && submissionData.already_nominated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center mb-2">
                Nomination Submitted!
              </h1>
              <p className="text-center text-green-100 text-lg">
                Your nomination has been successfully received
              </p>
            </div>

            <div className="p-8">
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold text-gray-900">
                        {submissionData.category_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(submissionData.submitted_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Your Scores
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {submissionData.total_mcq_score}
                    </div>
                    <div className="text-sm text-gray-600">MCQ Score</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {submissionData.spoc_score}
                    </div>
                    <div className="text-sm text-gray-600">SPOC Score</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {submissionData.dspoc_score}
                    </div>
                    <div className="text-sm text-gray-600">DSPOC Score</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {submissionData.student_score}
                    </div>
                    <div className="text-sm text-gray-600">Student Score</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-200">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {submissionData.final_score}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Final Score
                    </div>
                  </div>
                </div>
              </div>

              {submissionData.documents &&
                submissionData.documents.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Document Status
                    </h3>
                    <div className="space-y-3">
                      {submissionData.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Document {doc.file_number}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                {doc.file_path.split("/").pop()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Score: {doc.score}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                doc.verified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {doc.verified ? "Verified" : "Under Review"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Your application is under review
                </h3>
                <p className="text-blue-700">
                  Our evaluation team is reviewing your submission. You will be
                  notified once the process is complete. Thank you for your
                  participation!
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={handleBackToHome}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = categoryData || defaultCategory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-left mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Award Category
          </h1>
          <p className="text-lg text-gray-600">
            Take our quiz to participate in this prestigious award category
          </p>
        </div>

        {(error || statusError) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm">{error || statusError}</p>
              </div>
            </div>
          </div>
        )}

        <div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
          onClick={handleCategoryClick}
        >
          <div className="p-6 lg:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-full bg-blue-500 text-white">
                {currentCategory.icon}
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {currentCategory.title}
                </h2>
              </div>
            </div>

            <p className="text-base text-gray-600 leading-relaxed mb-8">
              {currentCategory.description}
            </p>

            <div className="flex justify-center lg:justify-start">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </span>
                ) : (
                  <>
                    Start Quiz
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-left">
          <p className="text-gray-500 text-sm">
            Click the card above to begin your award evaluation quiz
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
