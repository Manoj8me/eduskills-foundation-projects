import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
const DashboardCountsPage = () => {
  // API Configuration
 

  // State management
  const [accessToken, setAccessToken] = useState("");
  const [dashboardCounts, setDashboardCounts] = useState({
    supportMeetingsAll: 0,
    supportMeetingsResolved: 0,
    supportMeetingsUnresolved: 0,
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [countsError, setCountsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [previousCounts, setPreviousCounts] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Initialize access token
  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  // Load counts when token is available
  useEffect(() => {
    if (accessToken) {
      fetchDashboardCounts();
    }
  }, [accessToken]);

  // Auto-refresh mechanism
  useEffect(() => {
    let interval;
    if (autoRefresh && accessToken) {
      interval = setInterval(() => {
        fetchDashboardCounts();
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, accessToken]);

  // Handle token errors
  const handleTokenError = useCallback(() => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    setCountsError("Session expired. Please login again.");
    setAccessToken("");
  }, []);

  // Fetch dashboard counts API call
  const fetchDashboardCounts = useCallback(async () => {
    if (!accessToken) {
      setCountsError("No access token available");
      return;
    }

    setIsLoadingCounts(true);
    setCountsError(null);

    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/supportDashboard`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.request(config);
      console.log("Dashboard counts API response:", response.data);

      // Store previous counts for comparison
      setPreviousCounts(dashboardCounts);

      // Update dashboard counts state
      const newCounts = {
        supportMeetingsAll: response.data.supportMeetingsAll || 0,
        supportMeetingsResolved: response.data.supportMeetingsResolved || 0,
        supportMeetingsUnresolved: response.data.supportMeetingsUnresolved || 0,
      };

      setDashboardCounts(newCounts);
      setLastUpdated(new Date());
      setCountsError(null);
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
      setCountsError(
        error.response?.data?.message || "Failed to fetch dashboard counts"
      );

      if (error.response?.status === 401) {
        handleTokenError();
      }
    } finally {
      setIsLoadingCounts(false);
    }
  }, [accessToken, dashboardCounts, handleTokenError]);

  // Utility functions
  const formatCount = (count) => count.toLocaleString();

  const getResolutionPercentage = () => {
    if (dashboardCounts.supportMeetingsAll === 0) return 0;
    return Math.round(
      (dashboardCounts.supportMeetingsResolved /
        dashboardCounts.supportMeetingsAll) *
        100
    );
  };

  const getChangeIndicator = (current, previous) => {
    if (!previous || current === previous) return null;
    const change = current - previous;
    const isIncrease = change > 0;
    return {
      change: Math.abs(change),
      isIncrease,
      percentage:
        previous > 0 ? Math.round((Math.abs(change) / previous) * 100) : 0,
    };
  };

  // Main statistics cards configuration
  const stats = [
    {
      title: "Total Requests",
      value: dashboardCounts.supportMeetingsAll,
      previousValue: previousCounts?.supportMeetingsAll,
      subtitle: "All support meetings",
      icon: FileText,
      color: "#1161A0",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Pending Requests",
      value: dashboardCounts.supportMeetingsUnresolved,
      previousValue: previousCounts?.supportMeetingsUnresolved,
      subtitle: "Awaiting resolution",
      icon: Clock,
      color: "#F47D34",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Solved Requests",
      value: dashboardCounts.supportMeetingsResolved,
      previousValue: previousCounts?.supportMeetingsResolved,
      subtitle: "Successfully resolved",
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Resolution Rate",
      value: `${getResolutionPercentage()}%`,
      subtitle: "Overall efficiency",
      icon: TrendingUp,
      color: "#8B5CF6",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                Tickets
              </h3>
            </div>
          </div>
        </div>

        {accessToken && (
          <>
            {/* Error Display */}
            {countsError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-xs font-medium text-red-800">
                      Error Loading Data
                    </h3>
                    <p className="text-xs text-red-700 mt-1">{countsError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => {
                const changeIndicator =
                  typeof stat.value === "number"
                    ? getChangeIndicator(stat.value, stat.previousValue)
                    : null;

                return (
                  <div
                    key={index}
                    className={`${stat.bgColor} rounded-lg p-2 border ${stat.borderColor} hover:shadow-md transition-all duration-300 ${
                      countsError ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: stat.color }}
                        >
                          <stat.icon className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                          {stat.title}
                        </p>
                      </div>
                      {changeIndicator && (
                        <div
                          className={`flex items-center text-[11px] ${
                            changeIndicator.isIncrease
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {changeIndicator.isIncrease ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {changeIndicator.change}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-base font-bold text-gray-900 mb-1">
                        {isLoadingCounts
                          ? "..."
                          : typeof stat.value === "number"
                          ? formatCount(stat.value)
                          : stat.value}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {stat.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardCountsPage;
