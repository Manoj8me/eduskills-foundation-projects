import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

// Mock BASE_URL for demo - replace with your actual import

const NominationVotingSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [showVotingForm, setShowVotingForm] = useState(false);
  const [votes, setVotes] = useState({});
  const [submittedVotes, setSubmittedVotes] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [votingQuestions, setVotingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from API
  const fetchData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No access token found. Please login.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/internship/vote/questions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCategories(response.data.categories || []);
      setVotingQuestions(response.data.voting_questions || []);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load voting data. Please try again.");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to get category gradient based on index
  const getCategoryGradient = (index) => {
    const gradients = [
      "from-purple-600 via-purple-700 to-indigo-800",
      "from-blue-600 via-blue-700 to-cyan-800",
      "from-emerald-600 via-green-700 to-teal-800",
      "from-rose-600 via-pink-700 to-red-800",
      "from-amber-600 via-orange-700 to-red-800",
      "from-indigo-600 via-purple-700 to-pink-800",
    ];
    return gradients[index % gradients.length];
  };

  // Helper function to get category icon based on index
  const getCategoryIcon = (index) => {
    const icons = ["👑", "🎓", "🔬", "🌟", "⭐", "🏆"];
    return icons[index % icons.length];
  };

  // Check if voting is allowed for a nominee
  const canVote = (category, nominee) => {
    return category.nomination_open && nominee.final_score === 0;
  };

  const handleVoteSubmit = (nomineeId, voteData) => {
    setVotes((prev) => ({
      ...prev,
      [nomineeId]: voteData,
    }));
    setSubmittedVotes((prev) => new Set([...prev, nomineeId]));
    setShowVotingForm(false);
    setSelectedNominee(null);
  };

  // Skeleton Components
  const CategorySkeleton = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 animate-pulse">
      <div className="w-16 h-16 bg-gray-300 rounded-2xl mb-6"></div>
      <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );

  const NomineeSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden animate-pulse">
      <div className="h-2 bg-gray-300"></div>
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-2xl"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-300 rounded mb-4 w-full"></div>
        <div className="h-12 bg-gray-300 rounded-2xl w-full"></div>
      </div>
    </div>
  );

  const VotingFormSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-300 rounded-2xl"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-300 rounded mb-2 w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded mb-1 w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden animate-pulse">
        <div className="p-8">
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/3 mx-auto"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gray-300 rounded-lg mr-4 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-3 w-full"></div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div
                          key={j}
                          className="h-8 bg-gray-300 rounded-xl w-16"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
          <div className="flex justify-center">
            <div className="h-12 bg-gray-300 rounded-2xl w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const VotingForm = ({ nominee, onSubmit }) => {
    const [responses, setResponses] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async () => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found. Please login.");
        }

        // Convert responses to the required format
        const answers = Object.entries(responses).map(
          ([questionId, optionId]) => ({
            question_id: parseInt(questionId),
            option_id: parseInt(optionId),
          })
        );

        const payload = {
          leader_id: nominee.id,
          answers: answers,
        };

        const response = await axios.post(
          `${BASE_URL}/internship/vote/submit`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Vote submitted successfully:", response.data);

        // Call the original onSubmit function
        onSubmit(nominee.id, responses);

        // Refetch the data with refresh loader
        await fetchData(true);
      } catch (err) {
        console.error("Error submitting vote:", err);
        setSubmitError(
          err.response?.data?.message ||
            err.message ||
            "Failed to submit vote. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleOptionChange = (questionId, optionId) => {
      setResponses((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    };

    const isFormComplete = votingQuestions.every(
      (q) => responses[q.question_id] !== undefined
    );

    if (refreshing) {
      return <VotingFormSkeleton />;
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with nominee info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setShowVotingForm(false);
                setSelectedNominee(null);
              }}
              className="group flex items-center text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-blue-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mr-3 transition-colors duration-200">
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              Back to Nominees
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {nominee.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {nominee.name}
              </h2>
              <p className="text-blue-600 font-semibold text-lg">
                {nominee.designation}
              </p>
              <p className="text-gray-600">{nominee.email}</p>
            </div>
          </div>
        </div>

        {/* Voting Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Evaluation Questions
            </h3>

            {/* Fixed scrolling container with custom scrollbar */}
            <div className="overflow-x-auto">
              <div
                className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#3b82f6 #f1f5f9",
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 8px;
                  }
                  div::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: #3b82f6;
                    border-radius: 4px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: #2563eb;
                  }
                `}</style>
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b-2 border-blue-200 w-1/2">
                        Question
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 border-b-2 border-blue-200 w-1/2">
                        Options
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {votingQuestions.map((question, index) => (
                      <tr
                        key={question.question_id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-6 text-sm text-gray-900 font-medium border-r border-gray-200 w-1/2">
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4 mt-1 flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="leading-relaxed">
                              {question.question_text}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 w-1/2">
                          <div className="flex flex-wrap justify-center gap-2 items-center">
                            {question.options.map((option) => (
                              <button
                                key={option.option_id}
                                onClick={() =>
                                  handleOptionChange(
                                    question.question_id,
                                    option.option_id
                                  )
                                }
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                                  responses[question.question_id] ===
                                  option.option_id
                                    ? "border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                                    : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 bg-white shadow-sm hover:scale-105"
                                }`}
                              >
                                {option.option_text}
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
          </div>

          {/* Submit Button */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete || isSubmitting}
                className={`flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  isFormComplete && !isSubmitting
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 mr-3"
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
                    Submit Vote
                  </>
                )}
              </button>
            </div>

            {!isFormComplete && !isSubmitting && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Please answer all questions to submit your vote
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="h-8 bg-gray-300 rounded mb-4 w-64 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>

      <div className="relative">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                EduSkills Awards Nomination
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                Celebrate excellence and vote for outstanding members of our
                academic community
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {refreshing && (
            <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Refreshing data...
            </div>
          )}

          {!selectedCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(
                      index
                    )} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${getCategoryGradient(
                        index
                      )} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <span className="filter drop-shadow-sm">
                        {getCategoryIcon(index)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-200">
                      {category.title}
                    </h3>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {category.nominees.length} Nominees
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : showVotingForm && selectedNominee ? (
            <VotingForm nominee={selectedNominee} onSubmit={handleVoteSubmit} />
          ) : (
            <div>
              <div className="mb-12">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="group flex items-center text-blue-600 hover:text-purple-600 mb-6 font-semibold transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-blue-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mr-3 transition-colors duration-200">
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  Back to Categories
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
                    {selectedCategory.title}
                  </h2>
                  {!selectedCategory.nomination_open && (
                    <div className="inline-flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Voting is currently closed for this category
                    </div>
                  )}
                </div>
              </div>

              {refreshing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <NomineeSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {selectedCategory.nominees.map((nominee, index) => {
                    const votingAllowed = canVote(selectedCategory, nominee);
                    const categoryGradient = getCategoryGradient(
                      categories.findIndex(
                        (cat) => cat.id === selectedCategory.id
                      )
                    );

                    return (
                      <div
                        key={nominee.id}
                        className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div
                          className={`h-2 bg-gradient-to-r ${categoryGradient}`}
                        ></div>

                        <div className="p-8">
                          <div className="flex items-center space-x-4 mb-6">
                            <div
                              className={`w-16 h-16 bg-gradient-to-br ${categoryGradient} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                            >
                              {nominee.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {nominee.name}
                              </h3>
                              <p className="text-blue-600 font-semibold">
                                {nominee.designation}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4">
                            {nominee.email}
                          </p>

                          {nominee.final_score > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800 font-semibold">
                                Current Score: {nominee.final_score}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-center">
                            {submittedVotes.has(nominee.id) ? (
                              <div className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg">
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Vote Submitted
                              </div>
                            ) : votingAllowed ? (
                              <button
                                onClick={() => {
                                  setSelectedNominee(nominee);
                                  setShowVotingForm(true);
                                }}
                                className={`w-full py-3 bg-gradient-to-r ${categoryGradient} text-white rounded-2xl hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold`}
                              >
                                Vote Now
                              </button>
                            ) : (
                              <div className="w-full py-3 bg-gray-400 text-white rounded-2xl font-semibold text-center opacity-50 cursor-not-allowed">
                                {!selectedCategory.nomination_open
                                  ? "Voting Closed"
                                  : "Already Scored"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NominationVotingSystem;
