import React, { useState } from "react";
import AwardCategories from "./Awards";
import VotingModal from "./VotingModal";

const MainVotingApp = () => {
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [submittedAward, setSubmittedAward] = useState(null);

  const handleVoteClick = (award) => {
    setSelectedAward(award);
    setIsVotingModalOpen(true);
  };

  const handleCloseVotingModal = () => {
    setIsVotingModalOpen(false);
    setSelectedAward(null);
  };

  const handleSubmitVote = (voteData) => {
    console.log("Vote submitted:", voteData);
    setSubmittedAward(voteData.award);
    setIsVotingModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSubmittedAward(null);
  };

  return (
    <div className="relative">
      <AwardCategories onVoteClick={handleVoteClick} />

      <VotingModal
        isOpen={isVotingModalOpen}
        onClose={handleCloseVotingModal}
        selectedAward={selectedAward}
        onSubmitVote={handleSubmitVote}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        submittedAward={submittedAward}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
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

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, submittedAward }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center animate-bounce-in">
        <div className="text-6xl mb-4 animate-pulse">🎉</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Vote Successfully Submitted!
        </h3>
        <p className="text-gray-600 mb-6">
          Thank you for voting for the <strong>{submittedAward?.title}</strong>.
          Your participation helps recognize excellence in our academic
          community.
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default MainVotingApp;
