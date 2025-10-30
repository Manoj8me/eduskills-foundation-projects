import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  Mic,
  Utensils,
  Presentation,
  Calendar,
  Flag,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";

const bgColors = {
  keynote: "bg-blue-50 border-l-4 border-blue-500",
  panel: "bg-orange-50 border-l-4 border-orange-500",
  lunch: "bg-green-50 border-l-4 border-green-500",
  inauguration: "bg-indigo-50 border-l-4 border-indigo-500",
};

const iconColors = {
  keynote: "text-blue-600",
  panel: "text-orange-600",
  lunch: "text-green-600",
  inauguration: "text-indigo-600",
};

const icons = {
  keynote: <Mic size={14} />,
  panel: <Users size={14} />,
  lunch: <Utensils size={14} />,
  inauguration: <Flag size={14} />,
};

// Dummy topics for fallback
const dummyTopics = [
  "Digital Transformation in Modern Organizations",
  "Innovation and Future Technologies",
  "Leadership in the Digital Age",
  "Sustainable Business Practices",
  "Data-Driven Decision Making",
  "Customer Experience Excellence",
  "Emerging Market Trends",
  "Artificial Intelligence and Ethics",
  "Building Resilient Teams",
  "Strategic Planning for Growth",
];

function getType(title) {
  if (title.toLowerCase().includes("keynote")) return "keynote";
  if (title.toLowerCase().includes("panel")) return "panel";
  if (title.toLowerCase().includes("lunch")) return "lunch";
  if (title.toLowerCase().includes("inauguration")) return "inauguration";
  return "panel";
}

// Function to parse time string to minutes for comparison
function parseTimeToMinutes(timeString) {
  const [time, ampm] = timeString.split(/([AP]M)/);
  let [hours, minutes] = time.split(":").map(Number);

  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

// Function to check if current time is within agenda item time range
function isCurrentTimeInRange(timeRange, currentTime) {
  const [startTime, endTime] = timeRange.split(" - ");
  const currentMinutes = parseTimeToMinutes(currentTime);
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// Function to format date for display
function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-IN", options).toUpperCase();
}

// Function to format time from ISO string to 12-hour format
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Function to create time range string
function createTimeRange(startTime, endTime) {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

// Function to get a random dummy topic
function getDummyTopic(index) {
  return dummyTopics[index % dummyTopics.length];
}

// Function to format designation with line breaks for "/"
function formatDesignation(designation) {
  if (!designation) return "";
  return designation.split("/").map((part, index, array) => (
    <span key={index}>
      {part.trim()}
      {index < array.length - 1 && <br />}
    </span>
  ));
}

function EnhancedMinimalistAgenda() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [agendaData, setAgendaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agendaDays, setAgendaDays] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);

  // Fetch agenda data from API
  useEffect(() => {
    const fetchAgendaData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/hr-community/agendas?agenda_type=connect`
        );

        // Filter for summit type only
        const summitData = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setAgendaData(summitData);

        // Create agenda days
        const days = summitData.map((agenda, index) => ({
          day: `DAY-${String(index + 1).padStart(2, "0")}`,
          date: formatDateForDisplay(agenda.date),
          isActive: index === 0,
          agendaId: agenda.id,
        }));

        setAgendaDays(days);

        // Set initial agenda items (first day)
        if (summitData.length > 0) {
          const firstDayItems = summitData[0].details.map((detail) => ({
            time: createTimeRange(detail.start_time, detail.end_time),
            title: detail.title,
            subTitle: detail.sub_title || "",
            speakers: detail.speakers || [],
          }));
          setAgendaItems(firstDayItems);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching agenda data:", err);
        setError("Failed to load agenda data");
      } finally {
        setLoading(false);
      }
    };

    fetchAgendaData();
  }, []);

  // Handle day change
  const handleDayChange = (dayIndex) => {
    setActiveDay(dayIndex);

    // Update agenda items for selected day
    if (agendaData[dayIndex]) {
      const dayItems = agendaData[dayIndex].details.map((detail) => ({
        time: createTimeRange(detail.start_time, detail.end_time),
        title: detail.title,
        subTitle: detail.sub_title || "",
        speakers: detail.speakers || [],
      }));
      setAgendaItems(dayItems);
    }

    // Reset expanded state when changing days
    setExpandedIndex(null);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const formattedTime = `${formattedHours}:${formattedMinutes}${ampm}`;
      setCurrentTime(formattedTime);

      // Find current agenda item based on time
      const currentIndex = agendaItems.findIndex((item) =>
        isCurrentTimeInRange(item.time, formattedTime)
      );
      setCurrentItemIndex(currentIndex !== -1 ? currentIndex : null);
    };

    // Initial time set
    updateTime();

    // Update time every minute
    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, [agendaItems]);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-6 px-3">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading agenda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-6 px-3">
        <div className="text-center">
          <p className="text-red-500 text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if we should show date tabs (more than one date)
  const showDateTabs = agendaDays.length > 1;

  return (
    <>
      <div className="max-w-6xl mx-auto my-6 px-3">
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              max-height: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              max-height: 1000px;
              transform: translateY(0);
            }
          }

          @keyframes bounceIn {
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

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes bounce {
            0%,
            20%,
            53%,
            80%,
            100% {
              transform: translate3d(0, 0, 0);
            }
            40%,
            43% {
              transform: translate3d(0, -8px, 0);
            }
            70% {
              transform: translate3d(0, -4px, 0);
            }
            90% {
              transform: translate3d(0, -2px, 0);
            }
          }

          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }

          .animate-slideDown {
            animation: slideDown 0.4s ease-out;
          }

          .animate-bounceIn {
            animation: bounceIn 0.6s ease-out;
          }

          .animate-pulse-custom {
            animation: pulse 2s infinite;
          }

          .animate-bounce-custom {
            animation: bounce 2s infinite;
          }

          .gradient-text {
            background: linear-gradient(
              -45deg,
              #667eea,
              #764ba2,
              #f093fb,
              #f5576c
            );
            background-size: 400% 400%;
            animation: gradientShift 3s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }

          .hover-scale {
            transition: all 0.2s ease-in-out;
          }

          .hover-scale:hover {
            transform: scale(1.01);
          }

          .smooth-scroll {
            scroll-behavior: smooth;
          }

          .topic-badge {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            color: #495057;
            transition: all 0.3s ease;
          }

          .topic-badge:hover {
            background: #e9ecef;
            border-color: #dee2e6;
            transform: translateY(-1px);
          }
        `}</style>

        {/* Header */}
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-2xl  text-blue-800 mb-2 hover-scale">Agenda</h1>
        </div>

        {/* Date Tabs - Only show if multiple dates */}
        {showDateTabs && (
          <div className="flex justify-center mb-6 animate-fadeIn">
            <div className="flex bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {agendaDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDayChange(index)}
                  className={`px-4 py-2.5 text-xs transition-all duration-300 hover-scale ${
                    activeDay === index
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold">{day.day}</div>
                    <div className="text-xs mt-0.5 opacity-90">{day.date}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Agenda Items */}
        <div className="space-y-3">
          {agendaItems.map((item, idx) => {
            const type = getType(item.title);
            const isExpanded = idx === expandedIndex;
            const isCurrent = idx === currentItemIndex;

            return (
              <div
                key={idx}
                className={`group transition-all duration-500 ease-in-out rounded-lg overflow-hidden hover-lift transform hover:scale-[1.005] ${
                  isExpanded ? "mb-3" : "mb-0"
                } ${isCurrent ? "animate-bounce-custom" : ""}`}
                style={{
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <div
                  className={`cursor-pointer transition-all duration-500 ease-in-out hover:shadow-md ${
                    bgColors[type]
                  } ${isExpanded ? "rounded-t-lg" : "rounded-lg"}`}
                  onClick={() =>
                    item.speakers &&
                    item.speakers.length > 0 &&
                    toggleExpand(idx)
                  }
                >
                  <div className="px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Time Display */}
                        <div className="flex flex-col items-center min-w-[90px]">
                          <div className="flex items-center space-x-1.5">
                            <div
                              className={`p-1.5 rounded-md transition-all duration-300 hover:scale-110 hover:rotate-6 ${iconColors[type]}`}
                            >
                              {icons[type]}
                            </div>
                            <div className="font-medium text-gray-700 text-xs">
                              <div className="font-bold transition-all duration-300 group-hover:text-blue-600">
                                {item.time.split(" - ")[0]}
                              </div>
                              <div className="text-xs opacity-80">
                                {item.time.split(" - ")[1]}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Session Info */}
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-base font-bold text-gray-800 mb-1 transition-all duration-300 group-hover:text-blue-700">
                              {item.title}
                            </h3>
                          </div>

                          {item.subTitle && (
                            <p className="text-xs text-gray-600 mt-1">
                              {item.subTitle}
                            </p>
                          )}

                          {item.speakers && item.speakers.length > 0 && (
                            <div className="flex items-center space-x-1.5 text-xs text-gray-600 mt-1.5 transition-all duration-300 group-hover:text-gray-700">
                              <Users className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />
                              <span>
                                {item.speakers.length} speaker
                                {item.speakers.length > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expand Button - Only show if there are speakers */}
                      {item.speakers && item.speakers.length > 0 && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <button
                            className={`p-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-180 ${
                              isExpanded
                                ? "bg-blue-100 text-blue-600 rotate-180"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {isExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Speaker Section */}
                {isExpanded && item.speakers && item.speakers.length > 0 && (
                  <div className="bg-white px-4 py-4 rounded-b-lg border-t border-gray-100 animate-slideDown">
                    <h4 className="font-bold text-gray-700 text-sm mb-3 flex items-center animate-fadeIn">
                      <Presentation className="mr-1.5 w-4 h-4 text-blue-600 transition-transform duration-300 hover:scale-110" />
                      Featured Speakers
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.speakers.map((speaker, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-xl p-4 transition-all duration-500 ease-in-out hover:shadow-lg hover:border-blue-200 border border-transparent hover-lift transform hover:scale-105"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                          }}
                        >
                          <div className="animate-fadeIn">
                            {/* Speaker Profile Section */}
                            <div className="flex items-start mb-3">
                              <div className="relative mr-3">
                                <img
                                  src={
                                    speaker.profile_image ||
                                    speaker.img ||
                                    "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=" +
                                      (
                                        speaker.speaker_name || speaker.name
                                      ).charAt(0)
                                  }
                                  alt={speaker.speaker_name || speaker.name}
                                  className="w-12 h-12 rounded-xl object-cover transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-md"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg transition-all duration-300 hover:scale-110">
                                  <div className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-600">
                                    <Mic className="text-white w-2.5 h-2.5 transition-transform duration-300 hover:scale-110" />
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm leading-tight transition-all duration-300 hover:text-blue-600">
                                  {speaker.speaker_name || speaker.name}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed transition-all duration-300 hover:text-gray-700">
                                  {formatDesignation(
                                    speaker.designation || speaker.position_role
                                  )}
                                </p>
                                {speaker.company_name && (
                                  <p className="text-xs text-gray-500 mt-1 font-medium">
                                    {speaker.company_name}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Speaker Topic Section */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-start space-x-2">
                                <div className="p-1 rounded-md bg-gradient-to-r from-blue-100 to-purple-100 transition-all duration-300 hover:scale-110">
                                  <BookOpen className="w-3 h-3 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-500 mb-1">
                                    Speaking On:
                                  </p>
                                  <div className="topic-badge px-2 py-1 rounded-lg text-xs  font-bold shadow-sm">
                                    <div className="flex items-center space-x-1">
                                      <span>{speaker.topic}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default EnhancedMinimalistAgenda;
