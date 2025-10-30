import React, { useState, useEffect } from "react";
import { Box, Typography, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/configUrls";

// Define membership styles configuration
const membershipConfigs = {
  Premier: {
    name: "Premier Membership",
    background:
      "linear-gradient(135deg, #CD7F32 0%, #E2A76F 50%, #B87333 100%)",
    boxShadow: "0 4px 8px rgba(205, 127, 50, 0.4)",
    border: "1px solid rgba(205, 127, 50, 0.5)",
    hoverBoxShadow: "0 6px 12px rgba(205, 127, 50, 0.6)",
    textColor: "#8B4513",
    icon: "mdi:medal",
    iconColor: "#8B4513",
  },
  "Premier Plus": {
    name: "Premier Plus Membership",
    background:
      "linear-gradient(135deg, #DAA520 0%, #FFD700 50%, #B8860B 100%)",
    boxShadow: "0 4px 8px rgba(184, 134, 11, 0.4)",
    border: "1px solid rgba(255, 215, 0, 0.5)",
    hoverBoxShadow: "0 6px 12px rgba(184, 134, 11, 0.6)",
    textColor: "#8B4513",
    icon: "mdi:medal",
    iconColor: "#8B4513",
  },
  Lite: {
    name: "Lite Membership",
    background:
      "linear-gradient(135deg, #1E88E5 0%, #64B5F6 50%, #0D47A1 100%)",
    boxShadow: "0 4px 8px rgba(13, 71, 161, 0.4)",
    border: "1px solid rgba(13, 71, 161, 0.5)",
    hoverBoxShadow: "0 6px 12px rgba(13, 71, 161, 0.6)",
    textColor: "#FFFFFF",
    icon: "mdi:medal",
    iconColor: "#FFFFFF",
  },
  Basic: {
    name: "Basic Membership",
    background:
      "linear-gradient(135deg, #9E9E9E 0%, #E0E0E0 50%, #757575 100%)",
    boxShadow: "0 4px 8px rgba(117, 117, 117, 0.4)",
    border: "1px solid rgba(117, 117, 117, 0.5)",
    hoverBoxShadow: "0 6px 12px rgba(117, 117, 117, 0.6)",
    textColor: "#424242",
    icon: "mdi:medal",
    iconColor: "#424242",
  },
  Other: {
    name: "Membership",
    background:
      "linear-gradient(135deg, #03A9F4 0%, #81D4FA 50%, #039BE5 100%)",
    boxShadow: "0 4px 8px rgba(3, 169, 244, 0.4)",
    border: "1px solid rgba(3, 169, 244, 0.5)",
    hoverBoxShadow: "0 6px 12px rgba(3, 169, 244, 0.6)",
    textColor: "#FFFFFF",
    icon: "mdi:medal",
    iconColor: "#FFFFFF",
  },
};

const MembershipBadge = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down("md"));

  const [membershipData, setMembershipData] = useState({
    type: "Premier Plus",
    fullName: "Premier Plus Membership",
    expiryDate: new Date(),
    timeLeft: "2 years 2 months",
    needsRenewal: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to determine membership type based on membership_id
  const getMembershipTypeById = (membershipId) => {
    const id = parseInt(membershipId, 10);

    if (id === 1 || id === 2) {
      return "Lite";
    } else if (id === 3 || id === 4) {
      return "Basic";
    } else if (id === 5 || id === 6) {
      return "Premier";
    } else if (id === 7 || id === 8) {
      return "Premier Plus";
    } else {
      return "Other";
    }
  };

  // Function to calculate time left in years and months
  const calculateTimeLeft = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);

    // Validate dates
    if (isNaN(expiry.getTime()) || isNaN(now.getTime())) {
      return { timeLeft: "N/A", needsRenewal: false, months: 0 };
    }

    // Calculate difference in months
    let months = (expiry.getFullYear() - now.getFullYear()) * 12;
    months += expiry.getMonth() - now.getMonth();

    // Adjust for days - if we haven't reached the day of the month yet, subtract 1
    if (expiry.getDate() < now.getDate()) {
      months--;
    }

    // Calculate years and remaining months
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    // Check if renewal is needed (less than or equal to 6 months)
    const needsRenewal = months <= 6 && months >= 0;

    // Handle expired memberships
    if (months < 0) {
      return { timeLeft: "Expired", needsRenewal: true, months };
    }

    // Format the time left string
    let timeLeft = "";
    if (years > 0) {
      timeLeft += `${years} ${years === 1 ? "year" : "years"}`;
    }
    if (remainingMonths > 0) {
      if (timeLeft) timeLeft += " ";
      timeLeft += `${remainingMonths} ${
        remainingMonths === 1 ? "month" : "months"
      }`;
    }

    // If no time left but not expired
    if (!timeLeft && months >= 0) {
      timeLeft = "Less than 1 month";
    }

    return { timeLeft: timeLeft.trim(), needsRenewal, months };
  };

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

      // Process the membership data
      const fullName = data.membership_name || "Membership";
      const membershipId = data.membership_id || 10;
      const expiryString = data.expiry;
      localStorage.setItem("instituteName", data.institute_name || "");

      // Parse the expiry date properly
      let expiryDate;
      if (expiryString) {
        if (expiryString.includes(" ")) {
          const dateStr = expiryString.split(" ")[0];
          expiryDate = new Date(dateStr);
        } else {
          expiryDate = new Date(expiryString);
        }

        if (isNaN(expiryDate.getTime())) {
          console.warn("Invalid expiry date:", expiryString);
          expiryDate = new Date();
        }
      } else {
        console.warn("No expiry date found in data");
        expiryDate = new Date();
      }

      // Determine membership type based on membership name or ID
      let type;
      const lowerName = fullName.toLowerCase();
      if (lowerName.includes("lite")) {
        type = "Lite";
      } else if (lowerName.includes("basic")) {
        type = "Basic";
      } else if (
        lowerName.includes("premier plus") ||
        lowerName.includes("premium")
      ) {
        type = "Premier Plus";
      } else if (lowerName.includes("premier")) {
        type = "Premier";
      } else {
        type = getMembershipTypeById(membershipId);
      }

      // Calculate time left and renewal status
      const { timeLeft, needsRenewal } = calculateTimeLeft(expiryDate);

      setMembershipData({
        type,
        fullName,
        expiryDate,
        timeLeft,
        needsRenewal,
      });
    } catch (err) {
      console.error("Error fetching membership data:", err);
      setError(err.message);
      // Set default membership data on error
      setMembershipData({
        type: "Other",
        fullName: "Membership",
        expiryDate: new Date(),
        timeLeft: "N/A",
        needsRenewal: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch membership data on component mount
  useEffect(() => {
    fetchMembershipData();
  }, []);

  // Format expiry date for tooltip
  const formattedExpiry = new Date(
    membershipData.expiryDate
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create date 1 month before expiry for renewal notification
  const renewalDate = new Date(membershipData.expiryDate);
  renewalDate.setMonth(renewalDate.getMonth() - 1);

  const shortFormattedRenewalDate = renewalDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  // If still loading, show a placeholder
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: "#f0f0f0",
          borderRadius: isTabletOrSmaller ? "50%" : "16px",
          padding: isTabletOrSmaller ? "0" : "6px 14px",
          marginRight: "16px",
          opacity: 0.7,
          width: isTabletOrSmaller ? "40px" : "220px",
          height: isTabletOrSmaller ? "40px" : "40px",
        }}
      />
    );
  }

  // If error, return minimal badge
  if (error) {
    return (
      <Tooltip title="View Membership Details">
        <Box
          onClick={() => navigate("/subscription")}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f0f0",
            borderRadius: isTabletOrSmaller ? "50%" : "16px",
            padding: isTabletOrSmaller ? "0" : "6px 14px",
            marginRight: "16px",
            cursor: "pointer",
            width: isTabletOrSmaller ? "40px" : "auto",
            height: isTabletOrSmaller ? "40px" : "auto",
          }}
        >
          {isTabletOrSmaller ? (
            <Icon icon="mdi:medal" width={24} height={24} color="#666" />
          ) : (
            <Typography variant="caption" sx={{ color: "#666" }}>
              Membership Info
            </Typography>
          )}
        </Box>
      </Tooltip>
    );
  }

  // Get membership config based on type, or default to Other if not found
  const membershipType = membershipData.type;
  const membershipConfig =
    membershipConfigs[membershipType] || membershipConfigs.Other;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {/* Main membership badge */}
      <Tooltip title={`Membership expires on ${formattedExpiry}`}>
        {isTabletOrSmaller ? (
          // Icon-only version for tablet and smaller
          <Box
            onClick={() => navigate("/subscription")}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: membershipConfig.background,
              marginRight: membershipData.needsRenewal ? "6px" : "16px",
              boxShadow: membershipConfig.boxShadow,
              border: membershipConfig.border,
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-2px) scale(1.1)",
                boxShadow: membershipConfig.hoverBoxShadow,
              },
              "&:active": {
                transform: "translateY(0px) scale(1.05)",
                boxShadow: membershipConfig.boxShadow.replace("8px", "4px"),
              },
            }}
          >
            <Icon
              icon={membershipConfig.icon}
              width={24}
              height={24}
              color={membershipConfig.iconColor}
              style={{ flexShrink: 0 }}
            />
          </Box>
        ) : (
          // Full badge version for larger screens
          <Box
            onClick={() => navigate("/subscription")}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: membershipConfig.background,
              borderRadius: "16px",
              padding: "6px 14px",
              marginRight: membershipData.needsRenewal ? "6px" : "16px",
              boxShadow: membershipConfig.boxShadow,
              border: membershipConfig.border,
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: membershipConfig.hoverBoxShadow,
              },
              "&:active": {
                transform: "translateY(0px)",
                boxShadow: membershipConfig.boxShadow.replace("8px", "4px"),
              },
            }}
          >
            <Icon
              icon={membershipConfig.icon}
              width={21}
              height={21}
              color={membershipConfig.iconColor}
              style={{ marginRight: "8px", flexShrink: 0 }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: membershipConfig.textColor,
                  fontWeight: "bold",
                  fontSize: "0.72rem",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  textShadow: `0px 1px 1px ${
                    membershipConfig.textColor === "#FFFFFF"
                      ? "rgba(0,0,0,0.3)"
                      : "rgba(255,255,255,0.5)"
                  }`,
                  mb: "1px",
                }}
              >
                {membershipData.fullName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: membershipConfig.textColor,
                  fontWeight: "medium",
                  fontSize: "0.68rem",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  textShadow: `0px 1px 1px ${
                    membershipConfig.textColor === "#FFFFFF"
                      ? "rgba(0,0,0,0.2)"
                      : "rgba(255,255,255,0.3)"
                  }`,
                }}
              >
                {membershipData.timeLeft} left
              </Typography>
            </Box>
          </Box>
        )}
      </Tooltip>

      {/* Separate renewal notification on the side */}
      {membershipData.needsRenewal && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background:
              "linear-gradient(135deg, #FF5252 0%, #FF8A80 50%, #D50000 100%)",
            padding: isTabletOrSmaller ? "6px" : "4px 8px",
            borderRadius: isTabletOrSmaller ? "50%" : "12px",
            marginRight: "16px",
            boxShadow: "0 2px 6px rgba(213, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            animation: "warningBlink 1.5s infinite",
            minWidth: isTabletOrSmaller ? "32px" : "auto",
            height: isTabletOrSmaller ? "32px" : "auto",
            justifyContent: "center",
            "@keyframes warningBlink": {
              "0%": {
                background:
                  "linear-gradient(135deg, #D50000 0%, #FF5252 50%, #D50000 100%)",
              },
              "50%": {
                background:
                  "linear-gradient(135deg, #FF1744 0%, #FF5252 50%, #FF1744 100%)",
                boxShadow: "0 2px 8px rgba(213, 0, 0, 0.7)",
              },
              "100%": {
                background:
                  "linear-gradient(135deg, #D50000 0%, #FF5252 50%, #D50000 100%)",
              },
            },
          }}
        >
          <Icon
            icon="mdi:alarm"
            width={15}
            height={15}
            color="#FFFFFF"
            style={{
              marginRight: isTabletOrSmaller ? 0 : "5px",
              flexShrink: 0,
            }}
          />
          {!isTabletOrSmaller && (
            <Typography
              variant="caption"
              sx={{
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "0.65rem",
                whiteSpace: "nowrap",
                textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Renew by {shortFormattedRenewalDate}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MembershipBadge;
