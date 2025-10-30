import React, { useState } from "react";

const VotingModal = ({ isOpen, onClose, selectedAward, onSubmitVote }) => {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    "Does the nominee demonstrate exceptional leadership qualities?",
    "Has the nominee shown consistent dedication to their role?",
    "Does the nominee inspire and motivate others effectively?",
    "Has the nominee contributed innovative ideas or solutions?",
    "Does the nominee maintain high professional standards?",
    "Has the nominee positively impacted student outcomes?",
    "Does the nominee collaborate well with colleagues?",
    "Has the nominee shown commitment to continuous improvement?",
    "Does the nominee handle challenges with professionalism?",
    "Would you recommend this nominee for this prestigious award?",
  ];

  const handleAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onSubmitVote({
      award: selectedAward,
      answers: answers,
      timestamp: new Date().toISOString(),
    });

    setIsSubmitting(false);
    resetModal();
  };

  const resetModal = () => {
    setAnswers({});
    onClose();
  };

  const allQuestionsAnswered = questions.every(
    (_, index) => answers[index] !== undefined
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 sm:p-6">
          <div className="flex justify-between items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 truncate">
                Voting Form
              </h2>
              <p className="text-blue-100 text-sm sm:text-base truncate">
                {selectedAward?.title}
              </p>
            </div>
            <button
              onClick={resetModal}
              className="text-white hover:text-gray-200 transition-colors duration-200 ml-2 flex-shrink-0"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-blue-100 mb-2">
              <span className="truncate">
                Answered: {Object.keys(answers).length}/{questions.length}
              </span>
              <span className="flex-shrink-0">
                {Math.round(
                  (Object.keys(answers).length / questions.length) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-blue-600 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
                style={{
                  width: `${
                    (Object.keys(answers).length / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Questions Content */}
        <div className="p-2 sm:p-8 max-h-[60vh] overflow-y-auto">
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">
                  {index + 1}. {question}
                </h3>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleAnswer(index, true)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 font-medium text-xs transition-all duration-300 hover:scale-105 active:scale-95 ${
                      answers[index] === true
                        ? "bg-green-50 border-green-500 text-green-700 shadow-md transform scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        answers[index] === true
                          ? "border-green-500 bg-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {answers[index] === true && (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    Yes
                  </button>

                  <button
                    onClick={() => handleAnswer(index, false)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 font-medium text-xs transition-all duration-300 hover:scale-105 active:scale-95 ${
                      answers[index] === false
                        ? "bg-red-50 border-red-500 text-red-700 shadow-md transform scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        answers[index] === false
                          ? "border-red-500 bg-red-500"
                          : "border-gray-400"
                      }`}
                    >
                      {answers[index] === false && (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-800 border-b border-gray-200">
                    Evaluation Questions
                  </th>
                  <th className="px-4 md:px-6 py-4 text-center text-sm font-semibold text-gray-800 border-b border-gray-200 w-32 md:w-48">
                    Your Response
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200 animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-800 leading-relaxed">
                      {index + 1}. {question}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <div className="flex gap-2 md:gap-3 justify-center">
                        <button
                          onClick={() => handleAnswer(index, true)}
                          className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg border-2 font-medium text-xs md:text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                            answers[index] === true
                              ? "bg-green-50 border-green-500 text-green-700 shadow-md transform scale-105"
                              : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300"
                          }`}
                        >
                          <div
                            className={`w-4 md:w-5 h-4 md:h-5 rounded-full border-2 flex items-center justify-center ${
                              answers[index] === true
                                ? "border-green-500 bg-green-500"
                                : "border-gray-400"
                            }`}
                          >
                            {answers[index] === true && (
                              <svg
                                className="w-2 md:w-3 h-2 md:h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          Yes
                        </button>

                        <button
                          onClick={() => handleAnswer(index, false)}
                          className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg border-2 font-medium text-xs md:text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                            answers[index] === false
                              ? "bg-red-50 border-red-500 text-red-700 shadow-md transform scale-105"
                              : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300"
                          }`}
                        >
                          <div
                            className={`w-4 md:w-5 h-4 md:h-5 rounded-full border-2 flex items-center justify-center ${
                              answers[index] === false
                                ? "border-red-500 bg-red-500"
                                : "border-gray-400"
                            }`}
                          >
                            {answers[index] === false && (
                              <svg
                                className="w-2 md:w-3 h-2 md:h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                          </div>
                          No
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Vote"
              )}
            </button>
          </div>
        </div>
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

        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VotingModal;
