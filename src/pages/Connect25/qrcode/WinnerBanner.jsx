import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trophy, Star, Crown, Sparkles, X, Users, Eye } from "lucide-react";

const WinnerBanner = ({
  name,
  category,
  votes,
  studentVotes,
  corporateVotes,
  onClose,
}) => {
  const [animateVotes, setAnimateVotes] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [confetti, setConfetti] = useState(null);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  useEffect(() => {
    // Check if confetti has already been shown for this session
    const confettiShown = sessionStorage.getItem("winner-confetti-shown");

    if (confettiShown) {
      setHasShownConfetti(true);
      return;
    }

    // Load canvas-confetti library
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.onload = () => {
      setConfetti(window.confetti);

      // Auto-trigger confetti only if not shown before in this session
      if (!hasShownConfetti) {
        setTimeout(() => {
          if (window.confetti) {
            // Mark confetti as shown in session storage
            sessionStorage.setItem("winner-confetti-shown", "true");
            setHasShownConfetti(true);

            // Find and modify the confetti canvas z-index
            const canvas = document.querySelector(
              'canvas[style*="position: fixed"]'
            );
            if (canvas) {
              canvas.style.zIndex = "2147483648";
            }

            // Initial celebration
            window.confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: [
                "#FFD700",
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#96CEB4",
                "#FECA57",
              ],
            });

            // Second burst
            setTimeout(() => {
              window.confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
              });
            }, 250);

            // Third burst
            setTimeout(() => {
              window.confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#96CEB4", "#FECA57", "#FFD700", "#FF6B6B"],
              });
            }, 500);
          }
        }, 1200);
      }
    };

    document.head.appendChild(script);

    const timer1 = setTimeout(() => setAnimateVotes(true), 800);

    return () => {
      clearTimeout(timer1);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [hasShownConfetti]);

  const triggerConfetti = () => {
    // Remove the crown click confetti functionality
    // Only show confetti on first load, not on crown click
    return;
  };

  const handleClose = () => {
    setShowModal(false);
    if (onClose) {
      onClose();
    }
  };

  if (!showModal) return null;

  // Check if we have vote breakdown data
  const hasVoteBreakdown = studentVotes > 0 || corporateVotes > 0;
  const totalBreakdownVotes = studentVotes + corporateVotes;
  const displayVotes = hasVoteBreakdown ? totalBreakdownVotes : votes;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{
        zIndex: 2147483647,
        position: "fixed !important",
      }}
    >
      {/* Additional Sparkle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute w-4 h-4 text-yellow-400 animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-bounce-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50"></div>

        {/* Content */}
        <div className="relative p-6 text-center">
          {/* Crown */}
          <div className="mb-4">
            <div
              className="hover:scale-110 transition-transform cursor-pointer group"
              title="Congratulations!"
            >
              <Crown className="w-12 h-12 text-yellow-500 mx-auto animate-pulse group-hover:text-yellow-600" />
            </div>
          </div>

          {/* Winner Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
            <Trophy className="w-4 h-4" />
            <span className="font-bold text-sm">WINNER</span>
          </div>

          {/* Winner Info */}
          <div className="mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2 break-words px-2">
              {name}
            </h2>

            {/* Category */}
            <p className="text-sm font-medium text-gray-600 mb-4 px-2">
              {category}
            </p>
          </div>

          {/* Vote Stats */}
          {/* <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-4 shadow-inner">
            {hasVoteBreakdown ? (
              // Show vote breakdown
              <div>
                
                <div className="text-center mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Total Votes
                  </div>
                  <div
                    className={`text-3xl font-bold text-purple-600 mb-2 ${
                      animateVotes ? "animate-pulse" : ""
                    }`}
                  >
                    {animateVotes ? displayVotes.toLocaleString() : "0"}
                  </div>
                </div>

                
                <div className="grid grid-cols-2 gap-3">
                  
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                      {animateVotes ? studentVotes.toLocaleString() : "0"}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Student Votes
                    </div>
                  </div>

                  
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-700">
                      {animateVotes ? corporateVotes.toLocaleString() : "0"}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      Corporate Votes
                    </div>
                  </div>
                </div>

                
                {totalBreakdownVotes > 0 && (
                  <div className="mt-3 text-xs text-gray-500">
                    Student:{" "}
                    {((studentVotes / totalBreakdownVotes) * 100).toFixed(1)}% •
                    Corporate:{" "}
                    {((corporateVotes / totalBreakdownVotes) * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            ) : (
              // Show simple total votes
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-1">
                  Total Votes
                </div>
                <div
                  className={`text-3xl font-bold text-purple-600 ${
                    animateVotes ? "animate-pulse" : ""
                  }`}
                >
                  {animateVotes ? votes.toLocaleString() : "0"}
                </div>
              </div>
            )}
          </div> */}

          
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current mx-0.5"
                style={{
                  animation: `bounce 1s infinite ${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Thank You */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              🎉 Congratulations! 🎉
            </h3>
            <p className="text-sm text-gray-600">
              Thank you for your trust and support!
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-2 left-2">
            <Trophy className="w-6 h-6 text-yellow-400 opacity-20 animate-spin-slow" />
          </div>
          <div className="absolute bottom-2 right-2">
            <Sparkles className="w-5 h-5 text-pink-400 opacity-30 animate-bounce" />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center border-t">
          <p className="text-xs text-gray-500">
            Election Results 2024 • Official Results
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        @media (max-width: 480px) {
          .max-w-lg {
            max-width: calc(100vw - 2rem);
          }

          .grid-cols-2 {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );

  // Use React Portal to render the modal at document.body level
  return createPortal(modalContent, document.body);
};

export default WinnerBanner;
