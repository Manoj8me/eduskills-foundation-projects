import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../services/configUrls";

const VotingSubmission = ({
  candidate,
  onVoteComplete,
  onCancel,
  corporateId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [hasStartedVoting, setHasStartedVoting] = useState(true); // Always true since user is in voting step
  const [comments, setComments] = useState(""); // Add comments state

  // Add beforeunload event listener for page refresh/close during voting
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasStartedVoting && !isSubmitting) {
        e.preventDefault();
        e.returnValue =
          "Your vote is in progress. If you leave this page, you will need to start the voting process again. Are you sure you want to continue?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasStartedVoting, isSubmitting]);

  if (!candidate) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleCancel = () => {
    if (hasStartedVoting) {
      const confirmLeave = window.confirm(
        "Your vote is in progress. If you go back, you will need to start the voting process again. Are you sure you want to continue?"
      );
      if (!confirmLeave) {
        return;
      }
    }
    onCancel();
  };

  const handleSubmitVote = async () => {
    if (!confirmed) {
      alert("Please confirm your vote before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/internship/corporate-vote/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          corporate_id: corporateId,
          leader_id: candidate.leader_id,
          category_id: candidate.category_id,
          nomination_id: candidate.nomination_id,
          question: "Please share your reason for supporting this nominee",
          answer: comments.trim(), // Include comments in the request
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setHasStartedVoting(false); // Clear warning flag after successful submission
        alert("Vote submitted successfully!");
        onVoteComplete();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit vote");
      }
    } catch (error) {
      alert(error.message || "Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Cast Your Vote</h2>
          <p className="text-green-100 text-sm">
            Please confirm your selection before submitting
          </p>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Vote in Progress Warning */}
        {hasStartedVoting && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h4 className="text-orange-800 font-semibold text-sm mb-1">
                  Vote in Progress
                </h4>
                <p className="text-orange-700 text-sm">
                  Warning: Your vote is in progress. If you refresh or leave
                  this page, you will need to start the voting process again.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Candidate Confirmation Card */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4 shadow-md">
              <span className="text-xl font-bold text-white">
                {getInitials(candidate.name)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {candidate.name}
              </h3>
              <p className="text-blue-600 text-sm font-medium mb-1">
                {candidate.designation}
              </p>
              <p className="text-gray-600 text-sm">
                {candidate.institute_name}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Category:
              </span>
              <span className="text-sm text-blue-600 font-medium">
                {candidate.category_name}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please share your reason for supporting this nominee.*
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200"
            maxLength="500"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">Share your thoughts</p>
            <span className="text-xs text-gray-400">{comments.length}/500</span>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="mb-6">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I confirm that I want to vote for{" "}
              <span className="font-semibold text-blue-600">
                {candidate.name}
              </span>{" "}
              in the{" "}
              <span className="font-semibold">{candidate.category_name}</span>{" "}
              category. I understand that this vote is final and cannot be
              changed.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </div>
          </button>

          <button
            type="button"
            onClick={handleSubmitVote}
            disabled={!confirmed || isSubmitting}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
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
                Submitting Vote...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Vote
              </div>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Your vote is encrypted and secure. All voting data is confidential.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingSubmission;
