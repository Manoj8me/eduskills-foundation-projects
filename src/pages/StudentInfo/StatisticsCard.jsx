import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  BarChart,
  Calendar,
  CreditCard,
  Briefcase,
  BookmarkCheck,
  UserPlus,
  GraduationCap,
  Trash2,
  Pause,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

// Topup Modal Component with Pagination
const TopupModal = ({ isOpen, onClose, topupData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(topupData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = topupData.slice(startIndex, endIndex);

  // Reset to first page when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-amber-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap size={24} strokeWidth={2} />
            <div>
              <h2 className="text-xl font-bold">Student Topup History</h2>
              {/* <p className="text-amber-100 text-sm">
                View all topup allocations
              </p> */}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {topupData.length === 0 ? (
            <div className="text-center py-8">
              <Zap size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No topup data available</p>
              {/* <p className="text-gray-400 text-sm">
                Topup allocations will appear here when available
              </p> */}
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-right p-3 border-b border-gray-200 font-semibold text-gray-700">
                        Topup Limit Approved
                      </th>
                      {/* <th className="text-center p-3 border-b border-gray-200 font-semibold text-gray-700">
                        Status
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((topup, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="font-medium text-gray-800">
                              {formatDate(topup.topup_date)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 border-b border-gray-100 text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                            {topup.topup_limit}
                          </span>
                        </td>
                        {/* <td className="p-3 border-b border-gray-100 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Allocated
                          </span>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, topupData.length)} of {topupData.length}{" "}
                    entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${
                            currentPage === page
                              ? "bg-amber-500 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Summary */}
              {/* <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap size={20} className="text-amber-600" />
                    <span className="font-medium text-amber-800">
                      Total Topup Allocated
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-amber-800">
                    {topupData.reduce((sum, item) => sum + item.topup_limit, 0)}
                  </span>
                </div>
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Tooltip Component
const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-[99999] px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -mt-1"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 -mb-1"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 -ml-1"
                : "right-full top-1/2 -translate-y-1/2 -mr-1"
            }`}
          />
        </div>
      )}
    </div>
  );
};

// Modernized Compact DashboardCard component
const DashboardCard = ({
  title,
  value,
  icon,
  theme = "blue", // Options: purple, blue, green, amber, rose, indigo
  showInfinitySymbol = false,
  additionalInfo = null,
  percentage = null,
  usedValue = null,
  totalValue = null,
  isLoading = false,
  error = null,
  topupData = [], // New prop for topup data
  onClick = null, // New prop for click handler
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(usedValue);

  // Auto-assign theme based on title if not explicitly provided
  let cardTheme = theme;
  if (theme === "blue") {
    if (title === "Approved") {
      cardTheme = "green";
    } else if (title === "Used") {
      cardTheme = "purple";
    } else if (title === "TDS Hold") {
      cardTheme = "amber";
    } else if (title === "Available") {
      cardTheme =
        additionalInfo === "Contact RM" || title === "Limit Reached"
          ? "amber"
          : "indigo";
    } else if (title === "Deleted") {
      cardTheme = "rose";
    }
  }

  // Color themes mapping
  const themes = {
    purple: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-700",
      iconColor: "text-purple-600",
      progressBar: "bg-purple-500",
      border: "border-purple-200",
    },
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-700",
      iconColor: "text-blue-600",
      progressBar: "bg-blue-500",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      text: "text-emerald-700",
      iconColor: "text-emerald-600",
      progressBar: "bg-emerald-500",
      border: "border-emerald-200",
    },
    amber: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      text: "text-amber-700",
      iconColor: "text-amber-600",
      progressBar: "bg-amber-500",
      border: "border-amber-200",
    },
    rose: {
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      text: "text-rose-700",
      iconColor: "text-rose-600",
      progressBar: "bg-rose-500",
      border: "border-rose-200",
    },
    indigo: {
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      text: "text-indigo-700",
      iconColor: "text-indigo-600",
      progressBar: "bg-indigo-500",
      border: "border-indigo-200",
    },
  };

  // Get current theme
  const currentTheme = themes[cardTheme] || themes.blue;

  // Get the appropriate icon component with enhanced icon selection
  const getIcon = () => {
    switch (icon) {
      case "users":
        return <Users size={18} strokeWidth={2} />;
      case "students":
        return <GraduationCap size={18} strokeWidth={2} />;
      case "approved":
        return <CheckCircle size={18} strokeWidth={2} />;
      case "pending":
        return <Clock size={18} strokeWidth={2} />;
      case "rejected":
        return <XCircle size={18} strokeWidth={2} />;
      case "award":
        return <Award size={18} strokeWidth={2} />;
      case "warning":
        return <AlertTriangle size={18} strokeWidth={2} />;
      case "chart":
        return <BarChart size={18} strokeWidth={2} />;
      case "zap":
        return <Zap size={18} strokeWidth={2} />;
      case "calendar":
        return <Calendar size={18} strokeWidth={2} />;
      case "payment":
        return <CreditCard size={18} strokeWidth={2} />;
      case "business":
        return <Briefcase size={18} strokeWidth={2} />;
      case "task":
        return <BookmarkCheck size={18} strokeWidth={2} />;
      case "intake":
        return <UserPlus size={18} strokeWidth={2} />;
      case "deleted":
        return <Trash2 size={18} strokeWidth={2} />;
      case "hold":
        return <Pause size={18} strokeWidth={2} />;
      default:
        return <GraduationCap size={18} strokeWidth={2} />;
    }
  };

  // Handle card click
  const handleCardClick = () => {
    if (title === "Student Topup" || title.includes("Topup")) {
      setIsModalOpen(true);
    } else if (onClick) {
      onClick();
    }
  };

  // Determine if card should be clickable
  const isClickable =
    title === "Student Topup" || title.includes("Topup") || onClick;

  // Handle loading state
  if (isLoading) {
    return (
      <motion.div
        className={`rounded-lg shadow-sm border ${currentTheme.border} overflow-hidden bg-white flex items-center p-3 h-20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animate-pulse h-6 w-6 bg-gray-200 rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-12 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <motion.div
        className="rounded-lg shadow-sm border border-red-200 overflow-hidden bg-white flex items-center p-3 h-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-red-100 p-1.5 rounded-full mr-3">
          <AlertTriangle size={18} className="text-red-600" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-red-500 font-medium">Error</div>
          <div className="text-sm font-semibold text-red-700">
            Failed to load
          </div>
        </div>
      </motion.div>
    );
  }

  // Check if registration limit is zero (special case)
  const isZeroLimit = value === 0 && title === "Approved";

  // Calculate percentage for progress bar if applicable
  const calculatedPercentage =
    percentage !== null
      ? percentage
      : usedValue !== null && totalValue !== null && totalValue !== 0
      ? Math.min(100, Math.round((usedValue / totalValue) * 100))
      : null;

  // Special handling for TDS Hold card
  const isTDSHold = title === "TDS Hold";

  return (
    <>
      <motion.div
        className={`rounded-lg shadow-sm border ${currentTheme.border}  ${
          currentTheme.bg
        } flex items-center p-3 h-20 ${isClickable ? "cursor-pointer" : ""}`}
        whileHover={{
          y: -2,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          ...(isClickable && { scale: 1.02 }),
        }}
        whileTap={isClickable ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
      >
        {/* Icon section */}
        <div className={`${currentTheme.iconBg} p-1.5 rounded-full mr-3`}>
          <span className={currentTheme.iconColor}>
            {isTDSHold ? <Pause size={18} strokeWidth={2} /> : getIcon()}
          </span>
        </div>

        {/* Content section */}
        <div className="flex-1">
          {/* Title above the value */}
          <div className="text-xs text-gray-500 font-medium mb-1 flex items-center">
            {title}
            {/* Info icon with tooltip for Student Topup card */}
            {(title === "Student Topup" || title.includes("Topup")) &&
              totalValue && (
                <Tooltip
                  content={`Total Limit: ${totalValue} | Used: ${
                    usedValue || 0
                  }`}
                  position="top"
                >
                  <Info
                    size={12}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  />
                </Tooltip>
              )}
            {isClickable && (
              <span className="ml-1 text-gray-400">
                <ChevronRight size={12} />
              </span>
            )}
          </div>
          {/* Main value */}
          <div
            className={`text-xl font-bold ${currentTheme.text} leading-none`}
          >
            {showInfinitySymbol ? "∞" : value}
          </div>

          {/* Progress bar - only show if we have percentage data and value is not zero for "Approved" */}
          {calculatedPercentage !== null && !isZeroLimit && !isTDSHold && (
            <div className="mt-1.5">
              <div className="w-full bg-white bg-opacity-60 rounded-full h-1 mt-0.5">
                <div
                  className={`h-1 rounded-full ${
                    calculatedPercentage > 80
                      ? "bg-red-500"
                      : currentTheme.progressBar
                  }`}
                  style={{ width: `${calculatedPercentage}%` }}
                ></div>
              </div>

              {/* Usage info */}
              {usedValue !== null && totalValue !== null && (
                <div className="mt-0.5 text-xs text-gray-500 flex justify-end">
                  <span>
                    {usedValue}/{totalValue}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Additional info or warning message - show with higher priority when value is zero */}
          {(additionalInfo || isZeroLimit || (isTDSHold && value > 0)) && (
            <div className="mt-1 text-xs font-medium">
              {isZeroLimit ? (
                <span className="text-red-600">Registration Closed</span>
              ) : isTDSHold && value > 0 ? (
                <span className="text-amber-600">Due to TDS</span>
              ) : additionalInfo === "Contact RM" ? (
                <span className="text-red-600">Limit Reached</span>
              ) : additionalInfo?.includes("on TDS hold") ? (
                <span className="text-amber-600">{additionalInfo}</span>
              ) : additionalInfo ? (
                <span className="text-red-600">{additionalInfo}</span>
              ) : null}
            </div>
          )}
        </div>
      </motion.div>

      {/* Topup Modal */}
      <TopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topupData={topupData}
      />
    </>
  );
};

// Section Header Component that can be used above cards
export const SectionHeader = ({ title = "Intake Limit", theme = "purple" }) => {
  // Theme colors for the section header
  const headerColors = {
    purple: "text-purple-800 border-purple-300 bg-purple-50",
    blue: "text-blue-800 border-blue-300 bg-blue-50",
    green: "text-emerald-800 border-emerald-300 bg-emerald-50",
    amber: "text-amber-800 border-amber-300 bg-amber-50",
    rose: "text-rose-800 border-rose-300 bg-rose-50",
    indigo: "text-indigo-800 border-indigo-300 bg-indigo-50",
  };

  const headerColor = headerColors[theme] || headerColors.purple;

  return (
    <div
      className={`mb-3 ${headerColor} px-3 py-1.5 text-xs font-medium border-l-4 rounded-md`}
    >
      {title}
    </div>
  );
};

export default DashboardCard;
