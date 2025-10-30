import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Users,
  Star,
  Trophy,
  Calendar,
  X,
  MapPin,
  Menu,
  Crown,
} from "lucide-react";
import DataTable from "./DataTable"; // Import your updated DataTable

import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";
import ConferenceApp from "./ConferenceApp";
import EastBourneResortMap from "./Venue";
import EnhancedMinimalistAgenda from "./Agenda";
import EventFeedbackForm from "../Admin/NominationMarking/EventFeedbackForm";
import ConferenceTicketGenerator from "../Trainer FDP/Slots/ConferenceTicketGenerator";
import AwardsByCategory from "./AwardsByCategory";

// For demo purposes, we'll create mock versions

// Skeleton components
const SkeletonCard = () => (
  <div className="bg-white/60 rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
        <div className="h-5 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

const SkeletonAccordion = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-200 p-2 rounded-lg w-10 h-10"></div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const AwardsAccordion = () => {
  const [activeYear, setActiveYear] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("registration");
  const [yearsData, setYearsData] = useState({});
  const [regStatus, setRegStatus] = useState(0); // Add regStatus state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Add sidebar state for mobile
  const itemsPerPage = 5;

  // API call to fetch data using axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("No access token found. Please login again.");
        }

        const response = await api.get(`${BASE_URL}/internship/event/summary`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        // Extract reg_status and years data
        const { reg_status, ...years } = response.data;
        setRegStatus(reg_status || 0);
        setYearsData(years);
      } catch (err) {
        console.error("Error fetching data:", err);

        // Handle axios specific errors
        if (err.response) {
          // Server responded with error status
          if (err.response.status === 401) {
            setError("Unauthorized. Please login again.");
          } else {
            setError(
              `Server error: ${err.response.status} - ${
                err.response.data?.message || "Unknown error"
              }`
            );
          }
        } else if (err.request) {
          // Request was made but no response received
          setError("Network error. Please check your internet connection.");
        } else {
          // Something else happened
          setError(err.message);
        }

        // Fallback to empty data structure
        setYearsData({});
        setRegStatus(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleYear = (year) => {
    setActiveYear(activeYear === year ? null : year);
    // Reset tab to registration when opening any year
    setActiveTab("registration");
    // Close sidebar on mobile when changing year
    setSidebarOpen(false);
  };

  const openModal = (type, data, year) => {
    setModalData({ type, data, year });
    setCurrentPage(1);
  };

  const closeModal = () => {
    setModalData(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Close sidebar when tab changes on mobile
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  // Coming Soon component
  const ComingSoon = ({ title }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-4">
            This section is coming soon. Stay tuned for updates!
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-amber-700 font-medium">
              Under Development
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Compact Stats Card Component
  const StatsCard = ({
    icon,
    label,
    value,
    color,
    onClick,
    clickable = false,
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
      yellow: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
      green:
        "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
      gray: "bg-gray-50 border-gray-200 text-gray-700",
    };

    const iconClasses = {
      blue: "bg-blue-500 text-white",
      yellow: "bg-amber-500 text-white",
      green: "bg-emerald-500 text-white",
      gray: "bg-gray-500 text-white",
    };

    const Component = clickable ? "button" : "div";

    return (
      <Component
        onClick={clickable ? onClick : undefined}
        className={`
          ${colorClasses[color]} 
          ${clickable ? "cursor-pointer transform hover:scale-105" : ""}
          rounded-xl border p-4 transition-all duration-200 shadow-sm
        `}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconClasses[color]}`}>{icon}</div>
          <div className="text-left">
            <p className="text-xs font-medium opacity-75 uppercase tracking-wide">
              {label}
            </p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </Component>
    );
  };

  // Awards Tab Component
  const AwardsTab = ({ data, year }) => {
    return (
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard
            icon={<Star className="w-4 h-4" />}
            label="Nominated"
            value={data.nominated?.length || 0}
            color="yellow"
            onClick={() => openModal("nominated", data.nominated || [], year)}
            clickable={true}
          />
          <StatsCard
            icon={<Trophy className="w-4 h-4" />}
            label="Winners"
            value={data.winners?.length || 0}
            color="green"
            onClick={() => openModal("winners", data.winners || [], year)}
            clickable={true}
          />
        </div>
      </div>
    );
  };

  // Registration Tab Component with Attendees
  const RegistrationTab = ({ data, year }) => {
    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4">
          <StatsCard
            icon={<Users className="w-4 h-4" />}
            label="Attendees"
            value={data.attendees?.length || 0}
            color="blue"
            onClick={() => openModal("attendees", data.attendees || [], year)}
            clickable={true}
          />
        </div>

        {/* Conference App for 2025 - with proper z-index isolation */}
        {year === "2025" && (
          <div className="relative">
            <ConferenceApp />
          </div>
        )}
      </div>
    );
  };

  // Dynamic tabs based on regStatus
  const getAvailableTabs = () => {
    const baseTabs = [
      // { id: "registration", label: "Registration", icon: Users, color: "blue" },
      { id: "awards", label: "Awards", icon: Trophy, color: "amber" },
      { id: "winners", label: "Winners", icon: Crown, color: "green" },
    ];

    // Add conditional tabs only if regStatus is 1
    if (regStatus === 1) {
      baseTabs.push(
        // { id: "venue", label: "Venue", icon: MapPin, color: "green" },
        // { id: "agenda", label: "Agenda", icon: Calendar, color: "green" },
        // { id: "attending", label: "Attending", icon: Users, color: "green" },
        // { id: "photos", label: "Event Photos", icon: Users, color: "green" },
        { id: "feedback", label: "Feedback", icon: Star, color: "purple" }
      );
    }

    return baseTabs;
  };

  const tabs = getAvailableTabs();

  const renderTabContent = (data, year) => {
    switch (activeTab) {
      // case "registration":
      //   return <RegistrationTab data={data} year={year} />;
      case "awards":
        return <AwardsTab data={data} year={year} />;
      case "winners":
        return <AwardsByCategory data={data} year={year} />;

      // case "venue":
      //   return regStatus === 1 ? (
      //     <EastBourneResortMap />
      //   ) : (
      //     <RegistrationTab data={data} year={year} />
      //   );
      // case "agenda":
      //   return regStatus === 1 ? (
      //     <EnhancedMinimalistAgenda />
      //   ) : (
      //     <RegistrationTab data={data} year={year} />
      //   );
      // case "attending":
      //   return regStatus === 1 ? (
      //     <ConferenceTicketGenerator />
      //   ) : (
      //     <RegistrationTab data={data} year={year} />
      //   );
      case "feedback":
        return regStatus === 1 ? <EventFeedbackForm /> : <ComingSoon />;
      default:
        return <AwardsTab data={data} year={year} />;
    }
  };

  // Reset active tab if it's not available anymore
  useEffect(() => {
    const availableTabIds = tabs.map((tab) => tab.id);
    if (!availableTabIds.includes(activeTab)) {
      setActiveTab("registration");
    }
  }, [regStatus, tabs, activeTab]);

  const renderModalContent = () => {
    if (!modalData) return null;

    const { type, data, year } = modalData;
    const yearData = yearsData[year];
    const instituteNominatedCategories =
      yearData?.instituteNominatedCategories || [];
    const instituteWinnerCategories = yearData?.instituteWinnerCategories || [];

    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        style={{ zIndex: 50000 }}
      >
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {type === "attendees"
                  ? "Event Attendees"
                  : type === "nominated"
                  ? "Nominated Candidates"
                  : "Award Winners"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {year} • {data.length} entries
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 140px)" }}
          >
            <DataTable
              data={data}
              type={type}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              instituteNominatedCategories={instituteNominatedCategories}
              instituteWinnerCategories={instituteWinnerCategories}
            />
          </div>
        </div>
      </div>
    );
  };

  // Mobile Tab Navigation Component
  const MobileTabNavigation = ({ tabs, activeTab, onTabChange }) => {
    return (
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            const colorClasses = {
              blue: isActive
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
              amber: isActive
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "text-gray-600 hover:bg-amber-50 hover:text-amber-600",
              green: isActive
                ? "bg-green-100 text-green-700 border-green-200"
                : "text-gray-600 hover:bg-green-50 hover:text-green-600",
              purple: isActive
                ? "bg-purple-100 text-purple-700 border-purple-200"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-600",
            };

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap border
                  ${
                    isActive
                      ? `${colorClasses[tab.color]} shadow-sm`
                      : `${colorClasses[tab.color]} border-transparent`
                  }
                `}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-[1500px] mx-auto bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-4 max-w-[1500px] mx-auto bg-gray-50 min-h-screen">
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <SkeletonAccordion key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content - Lower z-index */}
      <div
        className="p-4 max-w-[1700px] mx-auto min-h-screen relative"
        style={{ zIndex: 1 }}
      >
        {/* Year Accordions */}
        <div className="space-y-4">
          {Object.keys(yearsData).length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Data Available
                </h3>
                <p className="text-gray-500 text-sm">
                  There are no awards data to display at the moment.
                </p>
              </div>
            </div>
          ) : (
            Object.entries(yearsData)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, data]) => (
                <div
                  key={year}
                  className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100 relative"
                  style={{
                    zIndex: year === "2025" && activeYear === year ? 10 : 2,
                  }}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {year}
                        </h2>
                        <p className="text-xs text-gray-500 hidden sm:block">
                          {data.attendees?.length || 0} attendees •{" "}
                          {data.nominated?.length || 0} nominated •{" "}
                          {data.winners?.length || 0} winners
                        </p>
                        <p className="text-xs text-gray-500 sm:hidden">
                          {data.attendees?.length || 0} attendees
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        activeYear === year ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      activeYear === year
                        ? "max-h-[80vh] opacity-100 overflow-visible"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="border-t border-gray-100">
                      {year === "2025" ? (
                        // Enhanced Responsive Layout for 2025
                        <>
                          {/* Mobile Tab Navigation */}
                          <MobileTabNavigation
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                          />

                          {/* Desktop Sidebar Layout + Mobile Stack Layout */}
                          <div className="lg:flex lg:h-[70vh] lg:overflow-visible">
                            {/* Desktop Sidebar Navigation */}
                            <div className="hidden lg:block w-64 bg-gray-50/50 border-r border-gray-100 p-4 flex-shrink-0 overflow-y-auto">
                              <div className="space-y-2">
                                {tabs.map((tab) => {
                                  const IconComponent = tab.icon;
                                  const isActive = activeTab === tab.id;

                                  const colorClasses = {
                                    blue: isActive
                                      ? "bg-blue-100 text-blue-700 border-blue-200"
                                      : "hover:bg-blue-50 hover:text-blue-600",
                                    amber: isActive
                                      ? "bg-amber-100 text-amber-700 border-amber-200"
                                      : "hover:bg-amber-50 hover:text-amber-600",
                                    green: isActive
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "hover:bg-green-50 hover:text-green-600",
                                    purple: isActive
                                      ? "bg-purple-100 text-purple-700 border-purple-200"
                                      : "hover:bg-purple-50 hover:text-purple-600",
                                  };

                                  return (
                                    <button
                                      key={tab.id}
                                      onClick={() => setActiveTab(tab.id)}
                                      className={`
                                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                        ${
                                          isActive
                                            ? `${
                                                colorClasses[tab.color]
                                              } border shadow-sm`
                                            : `text-gray-600 ${
                                                colorClasses[tab.color]
                                              } border border-transparent`
                                        }
                                      `}
                                    >
                                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                                      <span className="text-left">
                                        {tab.label}
                                      </span>
                                      {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-current rounded-full opacity-60"></div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Main Content Area - responsive padding */}
                            <div className="flex-1 p-4 sm:p-6 lg:overflow-y-auto lg:overflow-x-visible min-h-[50vh] lg:min-h-0">
                              {renderTabContent(data, year)}
                            </div>
                          </div>
                        </>
                      ) : (
                        // Original Simple Card Layout for other years (no tabs)
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 px-4 sm:px-6 pb-6">
                          {loading ? (
                            <>
                              <SkeletonCard />
                              <SkeletonCard />
                              <SkeletonCard />
                            </>
                          ) : (
                            <>
                              {/* Attendees Card */}
                              <button
                                onClick={() =>
                                  openModal(
                                    "attendees",
                                    data.attendees || [],
                                    year
                                  )
                                }
                                className="bg-blue-50 rounded-lg shadow-sm p-3 border-l-4 border-blue-500 hover:shadow-md transition-shadow text-left w-full"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xs font-medium text-blue-700 mb-1">
                                      Attendees
                                    </h3>
                                    <p className="text-xl font-bold text-blue-600">
                                      {data.attendees?.length || 0}
                                    </p>
                                  </div>
                                  <div className="bg-blue-100 p-1.5 rounded">
                                    <Users className="w-4 h-4 text-blue-600" />
                                  </div>
                                </div>
                              </button>

                              {/* Nominated Card */}
                              <button
                                onClick={() =>
                                  openModal(
                                    "nominated",
                                    data.nominated || [],
                                    year
                                  )
                                }
                                className="bg-yellow-50 rounded-lg shadow-sm p-3 border-l-4 border-yellow-500 hover:shadow-md transition-shadow text-left w-full"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xs font-medium text-yellow-700 mb-1">
                                      Nominated
                                    </h3>
                                    <p className="text-xl font-bold text-yellow-600">
                                      {data.nominated?.length || 0}
                                    </p>
                                  </div>
                                  <div className="bg-yellow-100 p-1.5 rounded">
                                    <Star className="w-4 h-4 text-yellow-600" />
                                  </div>
                                </div>
                              </button>

                              {/* Winners Card */}
                              <button
                                onClick={() =>
                                  openModal("winners", data.winners || [], year)
                                }
                                className="bg-green-50 rounded-lg shadow-sm p-3 border-l-4 border-green-500 hover:shadow-md transition-shadow text-left w-full"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xs font-medium text-green-700 mb-1">
                                      Winners
                                    </h3>
                                    <p className="text-xl font-bold text-green-600">
                                      {data.winners?.length || 0}
                                    </p>
                                  </div>
                                  <div className="bg-green-100 p-1.5 rounded">
                                    <Trophy className="w-4 h-4 text-green-600" />
                                  </div>
                                </div>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Modal - Highest z-index, rendered outside main content */}
      {renderModalContent()}
    </>
  );
};

export default AwardsAccordion;
