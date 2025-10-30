import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CandidateProfile from "./CandidateProfile";
import VoterRegistration from "./VoterRegistration";
import VotingSubmission from "./VotingSubmission";
import { BASE_URL } from "../../../services/configUrls";

const VoteSuccessMessage = ({ candidate }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Vote Successfully Submitted
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for participating in the voting process.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">You voted for:</p>
          <h3 className="font-semibold text-blue-800">{candidate?.name}</h3>
          <p className="text-blue-600 text-sm">{candidate?.designation}</p>
          <p className="text-blue-500 text-xs">{candidate?.institute_name}</p>
          <p className="text-blue-500 text-xs mt-2">
            {candidate?.category_name}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Your vote has been recorded successfully and cannot be changed.
        </p>
      </div>
    </div>
  );
};

const VotingClosedMessage = ({ candidate }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Voting is Closed
        </h2>
        <p className="text-gray-600 mb-6">
          The voting period for this category has ended. Thank you for your
          interest.
        </p>
        {candidate && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Candidate:</p>
            <h3 className="font-semibold text-gray-800">{candidate?.name}</h3>
            <p className="text-gray-600 text-sm">{candidate?.designation}</p>
            <p className="text-gray-500 text-xs">{candidate?.institute_name}</p>
            <p className="text-gray-500 text-xs mt-2">
              {candidate?.category_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading candidate information...</p>
      </div>
    </div>
  );
};

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Error Loading Data
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const MainCorporate = () => {
  const [currentStep, setCurrentStep] = useState("loading");
  const [isRegistered, setIsRegistered] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [corporateId, setCorporateId] = useState(null); // Store corporate_id from registration

  const { leaderId, categoryId } = useParams();

  const fetchCandidateData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/internship/corporate/${leaderId}/${categoryId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCandidate(data);

      // Check voting status first
      if (data.voting_status === "Closed") {
        setCurrentStep("voting_closed");
      } else if (data.voting_submitted) {
        setCurrentStep("success");
      } else {
        setCurrentStep("profile");
      }
    } catch (err) {
      setError(err.message || "Failed to load candidate data");
      setCurrentStep("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateData();
  }, [leaderId, categoryId]);

  const handleVoteNowClick = () => {
    if (!isRegistered) {
      setCurrentStep("registration");
    } else {
      setCurrentStep("voting");
    }
  };

  const handleRegistrationComplete = (corporate_id) => {
    setIsRegistered(true);
    setCorporateId(corporate_id); // Store the corporate_id received from registration
    setCurrentStep("voting");
  };

  const handleVoteComplete = async () => {
    // Update candidate state to show vote was submitted
    setCandidate((prev) => ({ ...prev, voting_submitted: true }));
    setCurrentStep("success");
  };

  const handleBackToProfile = () => {
    setCurrentStep("profile");
  };

  const handleRetry = () => {
    fetchCandidateData();
  };

  const renderCurrentComponent = () => {
    switch (currentStep) {
      case "loading":
        return <LoadingSpinner />;

      case "error":
        return <ErrorMessage message={error} onRetry={handleRetry} />;

      case "voting_closed":
        return <VotingClosedMessage candidate={candidate} />;

      case "success":
        return <VoteSuccessMessage candidate={candidate} />;

      case "profile":
        return (
          <CandidateProfile
            candidate={candidate}
            onVoteNow={handleVoteNowClick}
            isRegistered={isRegistered}
          />
        );

      case "registration":
        return (
          <VoterRegistration
            onRegistrationComplete={handleRegistrationComplete}
            onCancel={handleBackToProfile}
          />
        );

      case "voting":
        return (
          <VotingSubmission
            candidate={candidate}
            onVoteComplete={handleVoteComplete}
            onCancel={handleBackToProfile}
            corporateId={corporateId}
          />
        );

      default:
        return <LoadingSpinner />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "voting_closed":
        return "Voting Closed";
      case "success":
        return "Vote Submitted";
      case "profile":
        return "Candidate Profile";
      case "registration":
        return "Voter Registration";
      case "voting":
        return "Cast Your Vote";
      default:
        return "Voting System";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {getStepTitle()}
                </h1>
                {candidate && !loading && (
                  <p className="text-sm text-gray-600 mt-1">
                    {candidate.category_name}
                  </p>
                )}
              </div>

              {!loading &&
                !error &&
                currentStep !== "success" &&
                currentStep !== "voting_closed" && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          currentStep === "profile"
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={`text-sm ${
                          currentStep === "profile"
                            ? "text-blue-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        Candidate
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          currentStep === "registration"
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={`text-sm ${
                          currentStep === "registration"
                            ? "text-blue-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        Registration
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          currentStep === "voting"
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={`text-sm ${
                          currentStep === "voting"
                            ? "text-blue-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        Vote
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {renderCurrentComponent()}
        </div>
      </div>
    </div>
  );
};

export default MainCorporate;
