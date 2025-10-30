import React, { useState, useEffect } from "react";
import { User, Check, X, FileText, Star, Loader } from "lucide-react";

const ActionButtons = ({ selectedPerson, onAccept, onReject, apiCall }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filesScore, setFilesScore] = useState("");
  const [questionScore, setQuestionScore] = useState("");
  const [loading, setLoading] = useState({
    accept: false,
    reject: false,
    fetchingStatus: false,
  });
  const [nominationStatus, setNominationStatus] = useState(null);

  // Fetch nomination full details to get is_accepted status
  useEffect(() => {
    const fetchNominationStatus = async () => {
      if (!selectedPerson?.nomination_id) return;

      try {
        setLoading((prev) => ({ ...prev, fetchingStatus: true }));
        const data = await apiCall(
          `/admin/nomination/full/${selectedPerson.leader_id}/${selectedPerson.category_id}`
        );
        setNominationStatus(data);
      } catch (error) {
        console.error("Error fetching nomination status:", error);
      } finally {
        setLoading((prev) => ({ ...prev, fetchingStatus: false }));
      }
    };

    fetchNominationStatus();
  }, [selectedPerson?.nomination_id, apiCall]);

  if (!selectedPerson) return null;

  // Check if person is already accepted or rejected
  const isAlreadyProcessed =
    nominationStatus?.is_accepted === 1 || nominationStatus?.is_accepted === 2;
  const isAccepted = nominationStatus?.is_accepted === 1;
  const isRejected = nominationStatus?.is_accepted === 2;

  const handleRejectClick = () => {
    setShowRejectForm(true);
    setShowAcceptForm(false);
    setRejectionReason("");
  };

  const handleAcceptClick = () => {
    setShowAcceptForm(true);
    setShowRejectForm(false);
    setFilesScore("");
    setQuestionScore("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, reject: true }));

      const payload = {
        nomination_id: selectedPerson.nomination_id,
        leader_id: selectedPerson.leader_id || selectedPerson.user_id,
        rejection_reason: rejectionReason,
      };

      await apiCall("/admin/nomination/reject", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert(`${selectedPerson.name} has been rejected successfully!`);
      setShowRejectForm(false);
      setRejectionReason("");

      // Refresh nomination status
      const updatedData = await apiCall(
        `/admin/nomination/full/${selectedPerson.leader_id}/${selectedPerson.category_id}`
      );
      setNominationStatus(updatedData);

      // Call the original onReject if needed for UI updates
      if (onReject) onReject(selectedPerson);
    } catch (error) {
      console.error("Error rejecting nomination:", error);
      alert("Failed to reject nomination. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, reject: false }));
    }
  };

  const handleAcceptSubmit = async () => {
    if (!filesScore || !questionScore) {
      alert("Please provide both files score and question score");
      return;
    }

    const filesScoreNum = parseFloat(filesScore);
    const questionScoreNum = parseFloat(questionScore);

    if (isNaN(filesScoreNum) || isNaN(questionScoreNum)) {
      alert("Please provide valid numeric scores");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, accept: true }));

      const payload = {
        nomination_id: selectedPerson.nomination_id,
        leader_id: selectedPerson.leader_id || selectedPerson.user_id,
        files_score: filesScoreNum,
        question_score: questionScoreNum,
      };

      await apiCall("/admin/nomination/accept", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert(`${selectedPerson.name} has been accepted successfully!`);
      setShowAcceptForm(false);
      setFilesScore("");
      setQuestionScore("");

      // Refresh nomination status
      const updatedData = await apiCall(
        `/admin/nomination/full/${selectedPerson.leader_id}/${selectedPerson.category_id}`
      );
      setNominationStatus(updatedData);

      // Call the original onAccept if needed for UI updates
      if (onAccept) onAccept(selectedPerson);
    } catch (error) {
      console.error("Error accepting nomination:", error);
      alert("Failed to accept nomination. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, accept: false }));
    }
  };

  const cancelReject = () => {
    setShowRejectForm(false);
    setRejectionReason("");
  };

  const cancelAccept = () => {
    setShowAcceptForm(false);
    setFilesScore("");
    setQuestionScore("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6 animate-fade-in border-l-4 border-green-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-600 mr-2" />
          <div>
            <span className="font-semibold text-gray-800">
              {selectedPerson.name}
            </span>
            <span className="text-gray-500 ml-2 block text-sm">
              {selectedPerson.category}
            </span>
          </div>
        </div>

        {/* Show status if already processed */}
        {isAlreadyProcessed ? (
          <div className="flex items-center">
            {isAccepted ? (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-300">
                <Check className="w-4 h-4 mr-2" />
                <span className="font-medium">Accepted</span>
              </div>
            ) : (
              <div className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg border border-red-300">
                <X className="w-4 h-4 mr-2" />
                <span className="font-medium">Rejected</span>
              </div>
            )}
          </div>
        ) : (
          /* Show action buttons if not processed */
          <div className="flex space-x-2">
            <button
              onClick={handleRejectClick}
              disabled={loading.reject || loading.accept}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </button>
            <button
              onClick={handleAcceptClick}
              disabled={loading.reject || loading.accept}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </button>
          </div>
        )}
      </div>

      {/* Reject Form - Only show if not already processed */}
      {showRejectForm && !isAlreadyProcessed && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 animate-slide-down">
          <div className="flex items-center mb-3">
            <FileText className="w-4 h-4 text-red-600 mr-2" />
            <h4 className="font-medium text-red-800">Rejection Details</h4>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                rows="3"
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <button
                onClick={cancelReject}
                disabled={loading.reject}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={loading.reject || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.reject ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Form - Only show if not already processed */}
      {showAcceptForm && !isAlreadyProcessed && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 animate-slide-down">
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 text-green-600 mr-2" />
            <h4 className="font-medium text-green-800">Scoring Details</h4>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Files Score *
                </label>
                <input
                  type="number"
                  value={filesScore}
                  onChange={(e) => setFilesScore(e.target.value)}
                  placeholder="0-25"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Question Score *
                </label>
                <input
                  type="number"
                  value={questionScore}
                  onChange={(e) => setQuestionScore(e.target.value)}
                  placeholder="0-25"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <button
                onClick={cancelAccept}
                disabled={loading.accept}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptSubmit}
                disabled={loading.accept || !filesScore || !questionScore}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.accept ? "Accepting..." : "Confirm Acceptance"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 300px;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ActionButtons;
