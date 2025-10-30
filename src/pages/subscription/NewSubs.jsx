import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../services/configUrls";

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

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 900px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideInFromTop 0.3s ease-out;
  }

  /* Membership row styles with type-based coloring */
  .membership-row {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .membership-row:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Lite membership rows */
  .membership-row.lite-row {
    background-color: rgba(59, 130, 246, 0.08);
    border-left: 4px solid #3b82f6;
  }
  
  .membership-row.lite-row:hover {
    background-color: rgba(59, 130, 246, 0.12);
  }
  
  .membership-row.lite-row.current-membership {
    background-color: rgba(59, 130, 246, 0.15);
    border-left: 6px solid #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
  }
  
  /* Basic membership rows */
  .membership-row.basic-row {
    background-color: rgba(156, 163, 175, 0.08);
    border-left: 4px solid #9ca3af;
  }
  
  .membership-row.basic-row:hover {
    background-color: rgba(156, 163, 175, 0.12);
  }
  
  .membership-row.basic-row.current-membership {
    background-color: rgba(156, 163, 175, 0.15);
    border-left: 6px solid #9ca3af;
    box-shadow: 0 0 0 1px rgba(156, 163, 175, 0.2);
  }
  
  /* Premier membership rows */
  .membership-row.premier-row {
    background-color: rgba(205, 127, 50, 0.08);
    border-left: 4px solid #cd7f32;
  }
  
  .membership-row.premier-row:hover {
    background-color: rgba(205, 127, 50, 0.12);
  }
  
  .membership-row.premier-row.current-membership {
    background-color: rgba(205, 127, 50, 0.15);
    border-left: 6px solid #cd7f32;
    box-shadow: 0 0 0 1px rgba(205, 127, 50, 0.2);
  }
  
  /* Premium membership rows */
  .membership-row.premium-row {
    background-color: rgba(218, 165, 32, 0.08);
    border-left: 4px solid #daa520;
  }
  
  .membership-row.premium-row:hover {
    background-color: rgba(218, 165, 32, 0.12);
  }
  
  .membership-row.premium-row.current-membership {
    background-color: rgba(218, 165, 32, 0.15);
    border-left: 6px solid #daa520;
    box-shadow: 0 0 0 1px rgba(218, 165, 32, 0.2);
  }
`;

const ColoredIcon = ({ type }) => {
  // Convert numeric values to symbols
  const getSymbol = (value) => {
    if (value === 1 || value === "1") return "✓";
    if (value === 0 || value === "0") return "✗";
    if (value === 2 || value === "2") return "★";
    if (value === "TBA") return "TBA";
    return value; // Return as is if it's already a symbol or text
  };

  const symbol = getSymbol(type);

  switch (symbol) {
    case "✓":
      return <span className="text-green-600 font-bold text-lg">✓</span>;
    case "✗":
      return <span className="text-red-600 font-bold text-lg">✗</span>;
    case "★":
      return <span className="text-amber-500 font-bold text-lg">★</span>;
    case "TBA":
      return <span className="text-gray-600 font-medium">TBA</span>;
    default:
      return <span>{symbol}</span>;
  }
};

// Date formatting function - Full date for signup (keeps day, month, year)
const formatDate = (dateString) => {
  if (!dateString || dateString === "N/A") return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
};

// Date formatting function for renewal and valid till dates - Only month and year
const formatMonthYear = (dateString) => {
  if (!dateString || dateString === "N/A") return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
};

const NewSubs = () => {
  // State for API data
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for currently selected membership for benefits modal
  const [selectedMembershipForBenefits, setSelectedMembershipForBenefits] =
    useState(null);

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch membership data from new API
  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/internship/spocMembershipData`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiData(data);
    } catch (err) {
      console.error("Error fetching membership data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMembershipData();
  }, []);

  // Determine membership type based on name
  const getMembershipType = (membershipName) => {
    const name = membershipName.toLowerCase();
    if (name.includes("lite")) return "lite";
    if (name.includes("basic")) return "basic";
    if (name.includes("premier plus") || name.includes("premium"))
      return "premium";
    if (name.includes("premier")) return "premier";
    return "basic"; // default
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

  // Process memberships data from API response
  const memberships = React.useMemo(() => {
    if (!apiData || !apiData.membership_description) {
      return [];
    }

    const currentMembershipId = apiData.membership_id;
    const validMemberships = [];

    apiData.membership_description.forEach((membership) => {
      const {
        id,
        membership_name,
        signup_date,
        renewal_date,
        valid_till,
        membership_fee,
        invoice_no,
        ...benefits
      } = membership;

      // Create benefits array from the API data
      const benefitRows = [
        { activity: "MOU Signing", values: [benefits.membership_mou] },
        { activity: "EduSkills FDP", values: [benefits.eduskills_fdp] },
        {
          activity: "Educators Training",
          values: [benefits.educators_training],
        },
        {
          activity: "Educators Company Visit",
          values: [benefits.educators_company_visit],
        },
        { activity: "Physical CoE", values: [benefits.physical_coe] },
        { activity: "Annual Conclave", values: [benefits.annual_conclave] },
        { activity: "HR Summit", values: [benefits.hr_summit] },
        {
          activity: "Awards & Recognition",
          values: [benefits.awards_recognition],
        },
        { activity: "Annual Ranking", values: [benefits.annual_ranking] },
        {
          activity: "International Conference",
          values: [benefits.international_conference],
        },
        {
          activity: "EduSkills Publication",
          values: [benefits.eduskills_publication],
        },
        { activity: "Editorial Board", values: [benefits.editorial_board] },
        { activity: "Talent Connect", values: [benefits.talent_connect] },
        { activity: "Job Fair", values: [benefits.job_fair] },
        { activity: "Student Camp", values: [benefits.student_camp] },
        { activity: "Career Talk", values: [benefits.career_talk] },
        { activity: "Project Challenge", values: [benefits.project_challenge] },
        {
          activity: "Student Rising Star",
          values: [benefits.student_risingstar],
        },
        {
          activity: "EduSkills Internship",
          values: [benefits.eduskills_internship],
        },
        { activity: "Institute Insight", values: [benefits.institute_insight] },
        {
          activity: "Student Skill Test",
          values: [benefits.student_skilltest],
        },
        { activity: "Student Mentor", values: [benefits.student_mentor] },
      ];

      const membershipType = getMembershipType(membership_name);

      // Add the parsed membership to our valid memberships
      validMemberships.push({
        id: id,
        name: membership_name,
        type: membershipType,
        fee: `₹${membership_fee ? membership_fee.toLocaleString() : "0"}`,
        rows: benefitRows,
        isCurrent: id === currentMembershipId,
        signup_date: signup_date,
        renewal_date: renewal_date,
        valid_till: valid_till,
        invoice_no: invoice_no,
      });
    });

    // Sort memberships: current first, then by ID
    return validMemberships.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      return a.id - b.id;
    });
  }, [apiData]);

  // Extract RM data from API response
  const rmData = React.useMemo(() => {
    if (!apiData) {
      return {
        name: "Rahul Sharma",
        email: "rahul.s@eduskills.in",
        mobile: "+91 98765 43210",
        initials: "RS",
      };
    }

    const name = apiData.rm_name || "Rahul Sharma";
    const email = apiData.rm_email || "rahul.s@eduskills.in";
    const mobile = apiData.rm_mobile
      ? `+91 ${apiData.rm_mobile}`
      : "+91 98765 43210";

    // Generate initials from name
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);

    return {
      name,
      email,
      mobile,
      initials,
    };
  }, [apiData]);

  // Get subscription details (using the first membership's data as they're all same)
  const subscriptionDetails = React.useMemo(() => {
    if (!memberships.length) {
      return {
        signupDate: "N/A",
        lastUpdated: "N/A",
      };
    }

    // Use the first membership since signup date is same for all
    const firstMembership = memberships[0];
    const lastUpdated = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return {
      signupDate: formatDate(firstMembership.signup_date),
      lastUpdated: lastUpdated,
    };
  }, [memberships]);

  // Legend for icons - Updated to match the correct mapping
  const legend = [
    { symbol: 1, meaning: "Eligible / Applicable", displaySymbol: "✓" },
    { symbol: "TBA", meaning: "To Be Announced Soon", displaySymbol: "TBA" },
    { symbol: 2, meaning: "Chargeable Services", displaySymbol: "★" },
    { symbol: 0, meaning: "Not Applicable", displaySymbol: "✗" },
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

  // Handle view benefits click
  const handleViewBenefits = (membership) => {
    setSelectedMembershipForBenefits(membership);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-6 rounded-lg mt-5 animate-fadeIn">
      {/* Add the custom styles */}
      <style>{customStyles}</style>

      {/* Content container - Using grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Left side - All Memberships Table (2/3 width) */}
        <div
          className="lg:col-span-2 animate-slideInFromLeft"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="rounded-lg shadow-sm bg-white border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4 className="text-sm font-bold text-white">
                    Subscription Details
                  </h4>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1.5">
                    <div className="text-white text-xs">
                      <span className="text-blue-100 mr-1">Signup Date:</span>
                      <span className="font-medium">
                        {subscriptionDetails.signupDate}
                      </span>
                    </div>
                  </div>
                  {/* <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1.5">
                    <div className="text-white text-xs">
                      <span className="text-blue-100 mr-1">Last Updated:</span>
                      <span className="font-medium">
                        {subscriptionDetails.lastUpdated}
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Table with all memberships */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-xs font-bold text-gray-600 text-left">
                      Particulars
                    </th>
                    <th className="px-3 py-3 text-xs font-bold text-gray-600 text-left">
                      Invoice No
                    </th>
                    <th className="px-3 py-3 text-xs font-bold text-gray-600 text-left">
                      Valid Till
                    </th>
                    <th className="px-3 py-3 text-xs font-bold text-gray-600 text-left">
                      Renewal Date
                    </th>
                    <th className="px-3 py-3 text-xs font-bold text-gray-600 text-left">
                      Fee
                    </th>
                    <th className="px-3 py-3 text-xs font-bold text-gray-600 text-center">
                      View Benefits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((membership, index) => {
                    const membershipStyle = styleConfigs[membership.type];
                    return (
                      <tr
                        key={membership.id}
                        className={`membership-row ${
                          membership.type
                        }-row border-b border-gray-100 ${
                          membership.isCurrent ? "current-membership" : ""
                        }`}
                      >
                        <td className="px-3 py-3 text-xs text-gray-700 font-medium">
                          {membership.name}
                          {membership.isCurrent && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-700">
                          {membership.invoice_no || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-700">
                          {formatMonthYear(membership.valid_till)}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-700">
                          {formatMonthYear(membership.renewal_date)}
                        </td>
                        <td
                          className={`px-3 py-3 text-xs font-bold ${membershipStyle.valueTextClass}`}
                        >
                          {membership.fee}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleViewBenefits(membership)}
                            className={`p-2 rounded-md transition-all duration-200 ${membershipStyle.gradientClass} ${membershipStyle.headerTextClass} hover:shadow-md transform hover:-translate-y-0.5`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side - Relationship Manager Section (1/3 width) */}
        <div
          className="lg:col-span-1 animate-slideInFromRight"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="rounded-lg p-4 shadow-sm bg-white border border-gray-200 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 -mt-6 -mr-6 rounded-full opacity-20 bg-gradient-to-br from-blue-400 to-indigo-500"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 -mb-4 -ml-4 rounded-full opacity-10 bg-gradient-to-br from-blue-400 to-indigo-500"></div>

            <div className="relative z-10">
              {/* Header - Left aligned */}
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <h4 className="text-base font-bold text-blue-800">
                  Your Relationship Manager
                </h4>
              </div>

              {/* RM Details - Left aligned layout with dynamic data */}
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-blue-200 p-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">
                      {rmData.initials}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-left">
                  <h5 className="text-lg font-bold text-gray-800 mb-1">
                    {rmData.name}
                  </h5>

                  <div className="space-y-2">
                    <p className="text-xs text-blue-600 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-2"
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
                      {rmData.email}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-2"
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
                      {rmData.mobile}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Mon-Sat, 9 AM - 6 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Modal */}
      {showDetailsModal && selectedMembershipForBenefits && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div
              className={`${
                styleConfigs[selectedMembershipForBenefits.type].gradientClass
              } p-6 rounded-t-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                      styleConfigs[selectedMembershipForBenefits.type]
                        .headerTextClass
                    } mr-3`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3
                    className={`text-xl font-bold ${
                      styleConfigs[selectedMembershipForBenefits.type]
                        .headerTextClass
                    }`}
                  >
                    Membership Benefits - {selectedMembershipForBenefits.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors ${
                    styleConfigs[selectedMembershipForBenefits.type]
                      .headerTextClass
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Membership Benefits Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4
                    className={`text-lg font-semibold ${
                      styleConfigs[selectedMembershipForBenefits.type].textClass
                    }`}
                  >
                    {selectedMembershipForBenefits.name} Benefits
                  </h4>
                  <div
                    className={`${
                      styleConfigs[selectedMembershipForBenefits.type]
                        .badgeClass
                    } rounded-full px-3 py-1 text-sm font-medium`}
                  >
                    {selectedMembershipForBenefits.name.includes("Engineering")
                      ? "Engineering"
                      : selectedMembershipForBenefits.name.includes(
                          "University"
                        )
                      ? "University"
                      : selectedMembershipForBenefits.name.includes("Degree")
                      ? "Degree"
                      : selectedMembershipForBenefits.name.includes(
                          "Polytechnic"
                        )
                      ? "Polytechnic/School"
                      : "Education"}
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  {selectedMembershipForBenefits.rows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className={`flex justify-between items-center py-3 px-4 ${
                        rowIndex % 2 === 0
                          ? styleConfigs[selectedMembershipForBenefits.type]
                              .oddBgClass
                          : "bg-white"
                      } border-b ${
                        styleConfigs[selectedMembershipForBenefits.type]
                          .borderBgClass
                      }`}
                    >
                      <div className="text-sm text-gray-700">
                        {row.activity}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {row.values.map((value, valueIndex) => (
                          <div
                            key={valueIndex}
                            className="text-center min-w-16"
                          >
                            {value === 1 ||
                            value === 0 ||
                            value === 2 ||
                            value === "1" ||
                            value === "0" ||
                            value === "2" ||
                            value === "TBA" ? (
                              <ColoredIcon type={value} />
                            ) : (
                              <span
                                className={`font-medium ${
                                  styleConfigs[
                                    selectedMembershipForBenefits.type
                                  ].valueTextClass
                                }`}
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

              {/* Legend Section */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {legend.map((item, index) => {
                    let borderColor = "border-blue-300";
                    let bgColor = "bg-blue-50";

                    if (item.symbol === 1) {
                      borderColor = "border-green-300";
                      bgColor = "bg-green-50";
                    } else if (item.symbol === 0) {
                      borderColor = "border-red-300";
                      bgColor = "bg-red-50";
                    } else if (item.symbol === "TBA") {
                      borderColor = "border-gray-300";
                      bgColor = "bg-gray-50";
                    } else if (item.symbol === 2) {
                      if (selectedMembershipForBenefits.type === "premium") {
                        borderColor = "border-amber-300";
                        bgColor = "bg-amber-50";
                      } else if (
                        selectedMembershipForBenefits.type === "lite"
                      ) {
                        borderColor = "border-blue-300";
                        bgColor = "bg-blue-50";
                      } else if (
                        selectedMembershipForBenefits.type === "premier"
                      ) {
                        borderColor = "border-orange-300";
                        bgColor = "bg-orange-50";
                      } else if (
                        selectedMembershipForBenefits.type === "basic"
                      ) {
                        borderColor = "border-gray-300";
                        bgColor = "bg-gray-50";
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg ${bgColor} border-l-4 ${borderColor}`}
                      >
                        <span className="mr-3 w-8 text-center">
                          <ColoredIcon type={item.symbol} />
                        </span>
                        <span className="text-sm text-gray-700 font-medium">
                          {item.meaning}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Terms and Conditions Section */}
              <div className="mb-6">
                <h4
                  className={`text-lg font-semibold ${
                    styleConfigs[selectedMembershipForBenefits.type].textClass
                  } mb-4`}
                >
                  Terms & Conditions
                </h4>
                <div
                  className={`p-4 rounded-lg border ${
                    styleConfigs[selectedMembershipForBenefits.type].borderClass
                  } bg-gray-50`}
                >
                  <div className="space-y-3">
                    <p className="flex items-start text-sm text-gray-700">
                      <span className="text-red-500 mr-2 mt-0.5">*</span>
                      <span>
                        Terms & Conditions are applicable as per the membership
                        agreement.
                      </span>
                    </p>
                    <p className="flex items-start text-sm text-gray-700">
                      <span className="text-red-500 mr-2 mt-0.5">*</span>
                      <span>
                        The Membership Fees are Subject to Change without Prior
                        Notice based on company policies.
                      </span>
                    </p>
                    <p className="flex items-start text-sm text-gray-700">
                      <span className="text-red-500 mr-2 mt-0.5">*</span>
                      <span>
                        All benefits are subject to availability and may vary
                        based on membership type.
                      </span>
                    </p>
                    <p className="flex items-start text-sm text-gray-700">
                      <span className="text-red-500 mr-2 mt-0.5">*</span>
                      <span>
                        For any queries or issues, please contact your assigned
                        Relationship Manager.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSubs;
