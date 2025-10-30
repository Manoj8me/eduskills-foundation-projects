import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Add Redux hooks
import {
  fetchStudentMetrics,
  selectStudentMetricsData,
  selectStudentMetricsError,
  selectStudentMetricsLoading,
} from "../../store/Slices/studentmetricsdashboard/studentMetricsSlice";
// Import Redux slices

// Custom styles for scrollbars and animations with gradients for different membership types
const customStyles = `
  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInFromLeft {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInFromRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInFromTop {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulseGold {
    0% { box-shadow: 0 0 0 0 rgba(218, 165, 32, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(218, 165, 32, 0); }
    100% { box-shadow: 0 0 0 0 rgba(218, 165, 32, 0); }
  }
  
  @keyframes pulseBlue {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
  
  @keyframes pulseBronze {
    0% { box-shadow: 0 0 0 0 rgba(205, 127, 50, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(205, 127, 50, 0); }
    100% { box-shadow: 0 0 0 0 rgba(205, 127, 50, 0); }
  }
  
  @keyframes pulseSilver {
    0% { box-shadow: 0 0 0 0 rgba(192, 192, 192, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(192, 192, 192, 0); }
    100% { box-shadow: 0 0 0 0 rgba(192, 192, 192, 0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  .animate-slideInFromLeft {
    animation: slideInFromLeft 0.5s ease-out;
  }
  
  .animate-slideInFromRight {
    animation: slideInFromRight 0.5s ease-out;
  }
  
  .animate-slideInFromTop {
    animation: slideInFromTop 0.5s ease-out;
  }
  
  .hover-lift {
    transition: transform 0.3s ease-out;
  }
  
  .hover-lift:hover {
    transform: translateY(-3px);
  }
  
  /* Gold/Premium Gradient Styles */
  .gold-gradient {
    background: linear-gradient(135deg, #f0d078 0%, #d4af37 50%, #f0d078 100%);
  }
  
  .gold-text {
    background: linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #d4af37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .gold-benefit-row:hover {
    background-color: rgba(218, 165, 32, 0.05) !important;
    transform: translateX(3px);
  }
  
  /* Light Blue/Lite Gradient Styles */
  .lite-gradient {
    background: linear-gradient(135deg, #a5c8ff 0%, #3b82f6 50%, #a5c8ff 100%);
  }
  
  .lite-text {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .lite-benefit-row:hover {
    background-color: rgba(59, 130, 246, 0.05) !important;
    transform: translateX(3px);
  }
  
  /* Bronze/Premier Gradient Styles */
  .bronze-gradient {
    background: linear-gradient(135deg, #e6b17e 0%, #cd7f32 50%, #e6b17e 100%);
  }
  
  .bronze-text {
    background: linear-gradient(135deg, #cd7f32 0%, #8b4513 50%, #cd7f32 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .bronze-benefit-row:hover {
    background-color: rgba(205, 127, 50, 0.05) !important;
    transform: translateX(3px);
  }
  
  /* Silver/Basic Gradient Styles */
  .silver-gradient {
    background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 50%, #e0e0e0 100%);
  }
  
  .silver-text {
    background: linear-gradient(135deg, #a0a0a0 0%, #707070 50%, #a0a0a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .silver-benefit-row:hover {
    background-color: rgba(192, 192, 192, 0.05) !important;
    transform: translateX(3px);
  }
  
  .benefit-row {
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .legend-item {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .legend-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ColoredIcon = ({ type }) => {
  switch (type) {
    case "✓":
      return <span className="text-green-600 font-bold text-lg">✓</span>;
    case "✘":
      return <span className="text-red-600 font-bold text-lg">✘</span>;
    case "★":
      return <span className="text-amber-500 font-bold text-lg">★</span>;
    case "TBA":
      return <span className="text-gray-600 font-medium">TBA</span>;
    default:
      return <span>{type}</span>;
  }
};

const MembershipTable = () => {
  // Add Redux hooks
  const dispatch = useDispatch();
  const metricsData = useSelector(selectStudentMetricsData);
  const loading = useSelector(selectStudentMetricsLoading);
  const error = useSelector(selectStudentMetricsError);

  // Dispatch the fetch action when component mounts if data doesn't exist
  useEffect(() => {
    if (!metricsData) {
      dispatch(fetchStudentMetrics());
    }
  }, [dispatch, metricsData]);

  // State for currently selected membership
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);

  // New state for see more functionality
  const [showAllMemberships, setShowAllMemberships] = useState(false);
  const INITIAL_MEMBERSHIPS_SHOWN = 3;

  // Membership type mapping with color schemes
  const membershipTypeMap = {
    1: "lite", // Lite Membership Engineering
    2: "lite", // Lite Membership Degree/Polytechnic/School
    3: "basic", // Basic Membership Engineering/University
    4: "basic", // Basic Membership Degree/Polytechnic/School
    5: "premier", // Premier Membership Engineering/University
    6: "premier", // Premier Membership Degree
    7: "premium", // Premier Plus Membership Engineering/University
    8: "premium", // Premier Plus Membership Degree
  };

  // Style configurations for each membership type
  const styleConfigs = {
    lite: {
      name: "Lite Membership",
      gradientClass: "lite-gradient",
      textClass: "lite-text",
      borderClass: "border-blue-200",
      titleTextClass: "text-blue-800",
      badgeClass: "bg-blue-100 text-blue-800",
      rowClass: "lite-benefit-row",
      oddBgClass: "bg-blue-50",
      borderBgClass: "border-blue-100",
      animationClass: "pulseBlue",
      valueTextClass: "text-blue-600",
      headerTextClass: "text-blue-900",
    },
    basic: {
      name: "Basic Membership",
      gradientClass: "silver-gradient",
      textClass: "silver-text",
      borderClass: "border-gray-200",
      titleTextClass: "text-gray-800",
      badgeClass: "bg-gray-100 text-gray-800",
      rowClass: "silver-benefit-row",
      oddBgClass: "bg-gray-50",
      borderBgClass: "border-gray-100",
      animationClass: "pulseSilver",
      valueTextClass: "text-gray-600",
      headerTextClass: "text-gray-800",
    },
    premier: {
      name: "Premier Membership",
      gradientClass: "bronze-gradient",
      textClass: "bronze-text",
      borderClass: "border-orange-200",
      titleTextClass: "text-orange-800",
      badgeClass: "bg-orange-100 text-orange-800",
      rowClass: "bronze-benefit-row",
      oddBgClass: "bg-orange-50",
      borderBgClass: "border-orange-100",
      animationClass: "pulseBronze",
      valueTextClass: "text-orange-600",
      headerTextClass: "text-orange-900",
    },
    premium: {
      name: "Premier Plus Membership",
      gradientClass: "gold-gradient",
      textClass: "gold-text",
      borderClass: "border-amber-200",
      titleTextClass: "text-amber-800",
      badgeClass: "bg-amber-100 text-amber-800",
      rowClass: "gold-benefit-row",
      oddBgClass: "bg-amber-50",
      borderBgClass: "border-amber-100",
      animationClass: "pulseGold",
      valueTextClass: "text-amber-600",
      headerTextClass: "text-amber-900",
    },
  };

  // Process memberships data from Redux store
  const memberships = React.useMemo(() => {
    if (!metricsData || !metricsData.membership_description) {
      return [];
    }

    const currentMembershipId = metricsData.membership_id;
    if (!selectedMembershipId) {
      setSelectedMembershipId(currentMembershipId);
    }

    const validMemberships = [];

    metricsData.membership_description.forEach((membership) => {
      const { membership_id, membership_name, membership_description } =
        membership;

      // Only process memberships with IDs 1-8
      if (membership_id >= 1 && membership_id <= 8 && membership_description) {
        try {
          // Clean up the JSON string (replace unicode escape sequences)
          let cleanedDesc = membership_description
            .replace(/u20b9/g, "₹")
            .replace(/u2713/g, "✓")
            .replace(/u2718/g, "✘")
            .replace(/u2605/g, "★");

          // Parse the membership description
          const descObj = eval(`(${cleanedDesc})`);

          // Add the parsed membership to our valid memberships
          validMemberships.push({
            id: membership_id,
            name: membership_name,
            type: membershipTypeMap[membership_id] || "basic", // Default to basic if type not found
            fee: descObj.fee,
            rows: descObj.rows,
            isCurrent: membership_id === currentMembershipId,
          });
        } catch (error) {
          console.error(
            `Error parsing membership data for ID ${membership_id}:`,
            error
          );
        }
      }
    });

    // Sort memberships: current first, then by ID
    return validMemberships.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      return a.id - b.id;
    });
  }, [metricsData, selectedMembershipId]);

  // Get membership details (mocked data - replace with actual data from your store)
  const getMembershipDetails = () => {
    // This should come from your Redux store or API
    // For now, using sample data
    return {
      signupDate: metricsData?.membership_details?.signupDate || "15 Jan 2024",
      renewalDate: "15 Jan 2027", 
      validTill: "14 Jan 2027",
      fee: selectedMembership?.fee || "₹15,000",
      invoiceNo: "INV-2024-001234",
      membershipId: `EDU-${selectedMembershipId || '001'}-2024`
    };
  };

  // Get remaining plan time (mocked for this example)
  const getRemainingTime = () => {
    // This would typically come from an API or props
    // For this example, we'll generate some sample data
    const plansTimeRemaining = {
      1: { years: 2, months: 3 }, // 27 months
      2: { years: 2, months: 0 }, // 24 months
      3: { years: 1, months: 8 }, // 20 months
      4: { years: 1, months: 5 }, // 17 months
      5: { years: 0, months: 4 }, // 4 months - expiring soon!
      6: { years: 0, months: 8 }, // 8 months
      7: { years: 2, months: 11 }, // 35 months
      8: { years: 2, months: 6 }, // 30 months
    };

    // Get time remaining for current plan
    const planTimeLeft = plansTimeRemaining[metricsData?.membership_id] || {
      years: 0,
      months: 0,
    };

    // Calculate total months for easy comparison
    const totalMonths = planTimeLeft.years * 12 + planTimeLeft.months;

    return {
      ...planTimeLeft,
      totalMonths,
    };
  };

  // Calculate remaining time
  const remainingTime = getRemainingTime();
  const isExpiringSoon = remainingTime.totalMonths < 6;

  // Legend for icons
  const legend = [
    { symbol: "✓", meaning: "Eligible / Applicable" },
    { symbol: "TBA", meaning: "To Be Announced Soon" },
    { symbol: "★", meaning: "Chargeable Services" },
    { symbol: "✘", meaning: "Not Applicable" },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 rounded-lg text-center">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full w-64 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full w-56 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full w-32"></div>
          <div className="text-gray-400 mt-4">Loading membership data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 rounded-lg text-center">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-500 mb-2">Error</div>
          <div className="text-gray-700">{error}</div>
        </div>
      </div>
    );
  }

  // Show empty state if no memberships
  if (!memberships.length) {
    return (
      <div className="p-6 rounded-lg text-center">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-gray-700">No membership data available.</div>
        </div>
      </div>
    );
  }

  // Get the selected membership
  const selectedMembership =
    memberships.find((m) => m.id === selectedMembershipId) || memberships[0];
  const membershipStyle = styleConfigs[selectedMembership.type];
  const membershipDetails = getMembershipDetails();


  // Determine which memberships to show based on the "see more" state
  const visibleMemberships = showAllMemberships
    ? memberships
    : [
        // Always include current membership first
        ...memberships.filter((m) => m.isCurrent),
        // Then add non-current memberships up to the limit
        ...memberships
          .filter((m) => !m.isCurrent)
          .slice(
            0,
            INITIAL_MEMBERSHIPS_SHOWN -
              memberships.filter((m) => m.isCurrent).length
          ),
      ];

  // Check if we need to show the "See More" button
  const needsSeeMoreButton = memberships.length > INITIAL_MEMBERSHIPS_SHOWN;

  return (
    <div className="p-6 rounded-lg mt-5 animate-fadeIn">
      {/* Add the custom styles */}
      <style>{customStyles}</style>

      {/* Membership selection buttons with See More button */}
      <div className="w-full mb-6">
        <div className="flex flex-wrap gap-2">
          {visibleMemberships.map((membership) => (
            <button
              key={membership.id}
              onClick={() => setSelectedMembershipId(membership.id)}
              className={`px-4 py-2 rounded-lg shadow-sm transition relative ${
                selectedMembershipId === membership.id
                  ? `${
                      styleConfigs[membership.type].gradientClass
                    } text-white font-bold`
                  : "bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              {membership.name}
              {membership.isCurrent && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md animate-fadeIn">
                  Current
                </span>
              )}
            </button>
          ))}

          {/* See More button */}
          {needsSeeMoreButton && (
            <button
              onClick={() => setShowAllMemberships(!showAllMemberships)}
              className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center justify-center ml-1 font-medium text-sm ${
                showAllMemberships
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  : "bg-gradient-to-r from-blue-400 to-teal-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {showAllMemberships ? (
                <>
                  <span>See Less</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <span>See More</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Header showing plan details */}
      <div className="w-full mb-6">
        <div className="flex items-center mb-2 animate-slideInFromLeft">
          <div
            className={`w-2 h-8 ${membershipStyle.gradientClass} rounded mr-3`}
          ></div>
          <h2 className={`text-xl font-bold ${membershipStyle.textClass}`}>
            New Subscription Plan Details
          </h2>
        </div>
      </div>

      {/* Content container */}
      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Plan card */}
        <div
          className="lg:w-3/4 animate-slideInFromLeft"
          style={{ animationDelay: "0.1s" }}
        >
          <div
            className={`bg-white rounded-lg shadow-sm ${membershipStyle.borderClass} overflow-hidden hover-lift`}
          >
            {/* Plan header with gradient */}
            <div
              className={`${membershipStyle.gradientClass} p-4 border-b ${membershipStyle.borderClass}`}
              style={{
                animation: selectedMembership.isCurrent
                  ? `${membershipStyle.animationClass} 2s infinite`
                  : "none",
              }}
            >
              <div className="flex flex-wrap items-center justify-between">
                <h3
                  className={`text-lg font-bold ${membershipStyle.headerTextClass}`}
                >
                  {selectedMembership.name}
                </h3>
                <div
                  className={`${membershipStyle.badgeClass} rounded-full px-3 py-1 text-sm font-medium hover-lift`}
                >
                  {selectedMembership.name.includes("Engineering")
                    ? "Engineering"
                    : selectedMembership.name.includes("Degree")
                    ? "Degree"
                    : selectedMembership.name.includes("Polytechnic")
                    ? "Polytechnic/School"
                    : "Education"}
                </div>
              </div>
              <p className={`text-sm ${membershipStyle.headerTextClass} mt-2`}>
                3 Year Membership
              </p>
            </div>

            {/* Benefits list with scrolling */}
            <div className="overflow-x-auto">
              <div
                className="min-w-full p-2 max-h-[60vh] overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
              >
                {selectedMembership.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`flex justify-between items-center py-3 px-4 ${
                      rowIndex % 2 === 0
                        ? membershipStyle.oddBgClass
                        : "bg-white"
                    } border-b ${membershipStyle.borderBgClass} ${
                      membershipStyle.rowClass
                    }`}
                    style={{ animationDelay: `${0.05 * rowIndex}s` }}
                  >
                    <div className="text-sm md:text-base text-gray-700">
                      {row.activity}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {row.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="text-center min-w-16">
                          {value === "✓" ||
                          value === "✘" ||
                          value === "★" ||
                          value === "TBA" ? (
                            <ColoredIcon type={value} />
                          ) : (
                            <span
                              className={`font-medium ${membershipStyle.valueTextClass}`}
                            >
                              {value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend sidebar */}
        <div
          className="lg:w-1/4 animate-slideInFromRight"
          style={{ animationDelay: "0.2s" }}
        >
          <div
            className={`bg-white p-4 rounded-lg shadow-sm ${membershipStyle.borderClass} sticky top-4 max-h-[60vh] overflow-y-auto`}
          >
            <div className="flex flex-col gap-2">
              {legend.map((item, index) => {
                let borderColor = "border-blue-300";
                let bgColor = "bg-blue-50";

                if (item.symbol === "✓") {
                  borderColor = "border-green-300";
                  bgColor = "bg-green-50";
                } else if (item.symbol === "✘") {
                  borderColor = "border-red-300";
                  bgColor = "bg-red-50";
                } else if (item.symbol === "TBA") {
                  borderColor = "border-gray-300";
                  bgColor = "bg-gray-50";
                } else if (item.symbol === "★") {
                  // Use the current theme color for the star items
                  if (selectedMembership.type === "premium") {
                    borderColor = "border-amber-300";
                    bgColor = "bg-amber-50";
                  } else if (selectedMembership.type === "lite") {
                    borderColor = "border-blue-300";
                    bgColor = "bg-blue-50";
                  } else if (selectedMembership.type === "premier") {
                    borderColor = "border-orange-300";
                    bgColor = "bg-orange-50";
                  } else if (selectedMembership.type === "basic") {
                    borderColor = "border-gray-300";
                    bgColor = "bg-gray-50";
                  }
                }

                return (
                  <div
                    key={index}
                    className={`flex items-center rounded py-2 px-3 ${bgColor} border-l-2 ${borderColor} legend-item`}
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <span className="mr-3 w-6 text-center">
                      <ColoredIcon type={item.symbol} />
                    </span>
                    <span className="text-sm text-gray-700">
                      {item.meaning}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Membership Details Card - Separate Card */}
          <div className="mt-4 animate-fadeIn">
            <div
              className={`rounded-lg p-4 shadow-sm bg-white border ${membershipStyle.borderClass} overflow-hidden relative`}
            >
              {/* Background decoration */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 -mt-6 -mr-6 rounded-full opacity-10 ${membershipStyle.gradientClass}`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-12 h-12 -mb-4 -ml-4 rounded-full opacity-5 ${membershipStyle.gradientClass}`}
              ></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${membershipStyle.valueTextClass} mr-2`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4
                    className={`text-sm font-bold ${membershipStyle.textClass}`}
                  >
                    Membership Details
                  </h4>
                </div>

                {/* Details Grid */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Signup Date:</span>
                    <span className={`text-xs font-medium ${membershipStyle.valueTextClass}`}>
                      {membershipDetails.signupDate}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Renewal Date:</span>
                    <span className={`text-xs font-medium ${membershipStyle.valueTextClass}`}>
                      {membershipDetails.renewalDate}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Valid Till:</span>
                    <span className={`text-xs font-medium ${membershipStyle.valueTextClass}`}>
                      {membershipDetails.validTill}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Fee:</span>
                    <span className={`text-xs font-bold ${membershipStyle.valueTextClass}`}>
                      {membershipDetails.fee}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Invoice No:</span>
                    <span className={`text-xs font-medium ${membershipStyle.valueTextClass}`}>
                      {membershipDetails.invoiceNo}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Membership ID:</span>
                    <span className={`text-xs font-medium ${membershipStyle.valueTextClass}`}>
                      {membershipDetails.membershipId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Relationship Manager Details - As a separate card */}
          <div className="mt-4 animate-fadeIn">
            <div
              className={`rounded-lg p-4 shadow-sm bg-white border ${membershipStyle.borderClass} overflow-hidden relative`}
            >
              {/* Background decoration */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full opacity-20 ${membershipStyle.gradientClass}`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-16 h-16 -mb-6 -ml-6 rounded-full opacity-10 ${membershipStyle.gradientClass}`}
              ></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${membershipStyle.valueTextClass} mr-2`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4
                    className={`text-sm font-bold ${membershipStyle.textClass}`}
                  >
                    Your Relationship Manager
                  </h4>
                </div>

                {/* RM Details */}
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="mb-3 sm:mb-0 sm:mr-4">
                    <div
                      className={`w-16 h-16 rounded-full overflow-hidden border-2 ${membershipStyle.borderClass} p-0.5 shadow-sm`}
                    >
                      <div
                        className={`w-full h-full rounded-full ${membershipStyle.gradientClass} flex items-center justify-center text-white text-lg font-bold`}
                      >
                        RS
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <p className="font-medium text-gray-800 text-sm">
                      Rahul Sharma
                    </p>
                    <p
                      className={`text-xs ${membershipStyle.valueTextClass} flex items-center justify-center sm:justify-start`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      rahul.s@eduskills.in
                    </p>
                    <p
                      className={`text-xs ${membershipStyle.valueTextClass} flex items-center justify-center sm:justify-start`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="mt-4 animate-fadeIn">
            <div
              className={`rounded-lg p-4 shadow-sm bg-white border ${membershipStyle.borderClass}`}
            >
              <div className={`text-xs text-gray-600 space-y-2`}>
                <h4
                  className={`text-sm font-medium ${membershipStyle.titleTextClass} mb-2`}
                >
                  Terms & Conditions
                </h4>
                <p className="flex items-start">
                  <span className="text-red-500 mr-2">*</span>
                  <span>T&C Applicable</span>
                </p>
                <p className="flex items-start">
                  <span className="text-red-500 mr-2">*</span>
                  <span>
                    The Membership Fees are Subject to Change without Prior Notice
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipTable;