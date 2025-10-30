import React from "react";

const AwardCategories = ({ onVoteClick }) => {
  const awards = [
    {
      id: "dean-excellence",
      title: "Dean Excellence Award",
      description:
        "Recognizing outstanding academic leadership and administrative excellence in fostering student success and institutional growth.",
      color: "bg-gradient-to-br from-purple-400 to-pink-400",
      icon: "🎓",
    },
    {
      id: "placement-officer",
      title: "Placement Officer Award",
      description:
        "Honoring exceptional dedication in career guidance, industry connections, and successful student placements.",
      color: "bg-gradient-to-br from-blue-400 to-indigo-400",
      icon: "💼",
    },
    {
      id: "innovative-teaching",
      title: "Innovative Teaching Award",
      description:
        "Celebrating creative teaching methodologies that inspire learning and academic excellence among students.",
      color: "bg-gradient-to-br from-green-400 to-emerald-400",
      icon: "🌟",
    },
    {
      id: "research-excellence",
      title: "Research Excellence Award",
      description:
        "Acknowledging groundbreaking research contributions that advance knowledge and benefit society.",
      color: "bg-gradient-to-br from-orange-400 to-red-400",
      icon: "🔬",
    },
    {
      id: "student-mentor",
      title: "Student Mentor Award",
      description:
        "Appreciating exceptional mentorship that guides students toward personal and professional success.",
      color: "bg-gradient-to-br from-teal-400 to-cyan-400",
      icon: "👥",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            College Excellence Awards 2025
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in-delay">
            Vote for outstanding contributors in our academic community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <div
              key={award.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 transform animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`h-40 ${award.color} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}
              >
                <div className="text-6xl animate-bounce-slow">{award.icon}</div>
                <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {award.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {award.description}
                </p>

                <button
                  onClick={() => onVoteClick(award)}
                  className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  Vote Now
                  <svg
                    className="w-4 h-4 animate-pulse"
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
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default AwardCategories;
