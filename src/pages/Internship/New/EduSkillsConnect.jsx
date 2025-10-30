// EduSkillsConnect.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { ChevronDown, Trophy, Star, Users } from "lucide-react";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

// EduSkills Connect Accordion Component
const EduSkillsConnectAccordion = ({ connectData, filterOptions, loading }) => {
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const handleAccordionToggle = (yearIndex) => {
    setExpandedAccordion((prev) => {
      if (prev === yearIndex) {
        return null;
      }
      return yearIndex;
    });
  };

  const getParticipantTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "winner":
        return { bg: "#fef3c7", text: "#f59e0b", icon: Trophy };
      case "nominated":
        return { bg: "#e0f2fe", text: "#0288d1", icon: Star };
      case "attendee":
        return { bg: "#f3e8ff", text: "#8b5cf6", icon: Users };
      default:
        return { bg: "#f5f5f5", text: "#666", icon: Users };
    }
  };

  const getStatusBadge = (status) => {
    const colors = getParticipantTypeColor(status);
    const IconComponent = colors.icon;

    return (
      <Chip
        icon={<IconComponent size={14} />}
        label={status}
        size="small"
        sx={{
          backgroundColor: colors.bg,
          color: colors.text,
          fontWeight: 600,
          fontSize: "0.7rem",
          height: 24,
          "& .MuiChip-icon": {
            color: colors.text,
          },
        }}
      />
    );
  };

  // Group connect data by year and separate by categories
  const groupConnectDataByYear = () => {
    if (!connectData || typeof connectData !== "object") return [];

    const groupedData = {};

    // Process the API response structure where data is grouped by year
    Object.keys(connectData).forEach((year) => {
      const yearData = connectData[year];

      if (Array.isArray(yearData)) {
        // Separate participants by status
        const attendees = yearData.filter(
          (item) => item.status?.toLowerCase() === "attendee"
        );
        const nominated = yearData.filter(
          (item) => item.status?.toLowerCase() === "nominated"
        );
        const winners = yearData.filter(
          (item) => item.status?.toLowerCase() === "winner"
        );

        groupedData[year] = {
          year: year.toString(),
          attendees: attendees.map((item) => ({
            name: item.name || "Unknown",
            email: item.email || "",
            organization: item.organization || "N/A",
            position: item.position || "N/A",
            location: item.location || "N/A",
            experience: item.experience || "N/A",
          })),
          nominated: nominated.map((item) => ({
            name: item.name || "Unknown",
            email: item.email || "",
            organization: item.organization || "N/A",
            position: item.position || "N/A",
            location: item.location || "N/A",
            experience: item.experience || "N/A",
          })),
          winners: winners.map((item) => ({
            name: item.name || "Unknown",
            email: item.email || "",
            organization: item.organization || "N/A",
            position: item.position || "N/A",
            location: item.location || "N/A",
            experience: item.experience || "N/A",
          })),
          counts: {
            attendees: attendees.length,
            nominated: nominated.length,
            winners: winners.length,
          },
        };
      }
    });

    // Convert to array and sort by year (newest first)
    const sortedYears = Object.keys(groupedData)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((year) => groupedData[year]);

    // Color scheme for years
    const colors = [
      { color: "#6366f1", bgColor: "#eef2ff" }, // Indigo
      { color: "#8b5cf6", bgColor: "#f3e8ff" }, // Violet
      { color: "#06b6d4", bgColor: "#ecfeff" }, // Cyan
      { color: "#ec4899", bgColor: "#fdf2f8" }, // Pink
      { color: "#3b82f6", bgColor: "#eff6ff" }, // Blue
    ];

    return sortedYears.map((yearData, index) => ({
      ...yearData,
      ...colors[index % colors.length],
    }));
  };

  const connectDataByYear = groupConnectDataByYear();

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={60}
              sx={{ borderRadius: 2 }}
            />
          ))}
      </Box>
    );
  }

  if (!connectData || Object.keys(connectData).length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 200,
          color: "#666",
        }}
      >
        <Typography variant="body2">
          No EduSkills Connect data available
        </Typography>
      </Box>
    );
  }

  const renderParticipantList = (participants, status, statusColor) => {
    if (participants.length === 0) {
      return (
        <Typography
          variant="body2"
          sx={{
            color: "#999",
            fontStyle: "italic",
            textAlign: "center",
            py: 2,
          }}
        >
          No {status.toLowerCase()} for this year
        </Typography>
      );
    }

    return participants.map((participant, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1.5,
          borderRadius: 1,
          backgroundColor: statusColor.bg,
          border: `1px solid ${statusColor.text}20`,
          mb: 1,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: "0.8rem",
            backgroundColor: statusColor.text,
            color: "white",
          }}
        >
          {participant.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#333",
            }}
          >
            {participant.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              fontSize: "0.75rem",
              display: "block",
            }}
          >
            {participant.position} at {participant.organization}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#888",
              fontSize: "0.7rem",
            }}
          >
            {participant.location} • {participant.experience}
          </Typography>
        </Box>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        flex: 1,
        maxHeight: "100%",
        overflow: "auto",
      }}
    >
      {connectDataByYear.map((yearData, yearIndex) => {
        const isExpanded = expandedAccordion === yearIndex;
        const { attendees, nominated, winners } = yearData.counts;

        return (
          <Accordion
            key={yearIndex}
            expanded={isExpanded}
            onChange={() => handleAccordionToggle(yearIndex)}
            elevation={0}
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: 2,
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={null}
              sx={{
                backgroundColor: yearData.bgColor,
                borderRadius: "8px 8px 0 0",
                minHeight: 44,
                "&.Mui-expanded": {
                  minHeight: 44,
                  borderRadius: "8px 8px 0 0",
                },
                "& .MuiAccordionSummary-content": {
                  margin: "6px 0",
                  "&.Mui-expanded": {
                    margin: "6px 0",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: yearData.color,
                  }}
                />
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{ color: "#333", fontSize: "0.9rem" }}
                >
                  Year {yearData.year}
                </Typography>

                {/* Participant counts */}
                <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
                  {winners > 0 && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        backgroundColor: "#f59e0b",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Trophy size={10} />
                      {winners} Winners
                    </Box>
                  )}
                  {nominated > 0 && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        backgroundColor: "#0288d1",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Star size={10} />
                      {nominated} Nominated
                    </Box>
                  )}
                  {attendees > 0 && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        backgroundColor: "#8b5cf6",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Users size={10} />
                      {attendees} Attendees
                    </Box>
                  )}
                </Box>

                {/* View Details button */}
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: "auto",
                    px: 1,
                    py: 0.25,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    borderColor: yearData.color,
                    color: yearData.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    ml: "auto",
                    "&:hover": {
                      backgroundColor: `${yearData.color}20`,
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccordionToggle(yearIndex);
                  }}
                >
                  View Details
                  <ChevronDown
                    size={14}
                    style={{
                      transition: "transform 0.2s ease",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Winners Column */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Trophy size={16} color="#f59e0b" />
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#f59e0b",
                      }}
                    >
                      Winners ({yearData.winners.length})
                    </Typography>
                  </Box>
                  {renderParticipantList(
                    yearData.winners,
                    "Winners",
                    getParticipantTypeColor("winner")
                  )}
                </Box>

                {/* Nominated Column */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Star size={16} color="#0288d1" />
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#0288d1",
                      }}
                    >
                      Nominated ({yearData.nominated.length})
                    </Typography>
                  </Box>
                  {renderParticipantList(
                    yearData.nominated,
                    "Nominated",
                    getParticipantTypeColor("nominated")
                  )}
                </Box>

                {/* Attendees Column */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Users size={16} color="#8b5cf6" />
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#8b5cf6",
                      }}
                    >
                      Attendees ({yearData.attendees.length})
                    </Typography>
                  </Box>
                  {renderParticipantList(
                    yearData.attendees,
                    "Attendees",
                    getParticipantTypeColor("attendee")
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

// Main EduSkills Connect Component
const EduSkillsConnect = ({
  filterOptions,
  isStaffDashboard = false,
  refreshTrigger = null,
}) => {
  const [connectData, setConnectData] = useState(null);
  const [connectLoading, setConnectLoading] = useState(true);

  // Fetch EduSkills Connect data
  const fetchConnectData = async () => {
    try {
      setConnectLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dummy data for EduSkills Connect - Members only (no students, domains, or cohorts)
      const dummyConnectData = {
        2024: [
          {
            name: "Dr. Rajesh Kumar",
            email: "rajesh.kumar@eduskills.com",
            status: "Winner",
            organization: "EduSkills Foundation",
            position: "Senior Program Manager",
            location: "New Delhi",
            experience: "8 years",
          },
          {
            name: "Meera Sharma",
            email: "meera.sharma@tech.org",
            status: "Winner",
            organization: "TechForward Solutions",
            position: "Training Head",
            location: "Bangalore",
            experience: "6 years",
          },
          {
            name: "Amit Patel",
            email: "amit.patel@skilldev.in",
            status: "Nominated",
            organization: "SkillDev Institute",
            position: "Curriculum Designer",
            location: "Mumbai",
            experience: "5 years",
          },
          {
            name: "Priya Gupta",
            email: "priya.gupta@corporatetraining.com",
            status: "Nominated",
            organization: "Corporate Training Hub",
            position: "Learning Specialist",
            location: "Pune",
            experience: "4 years",
          },
          {
            name: "Rohit Singh",
            email: "rohit.singh@innovateedu.org",
            status: "Attendee",
            organization: "InnovateEdu",
            position: "Content Developer",
            location: "Hyderabad",
            experience: "3 years",
          },
          {
            name: "Kavitha Reddy",
            email: "kavitha.reddy@learntech.in",
            status: "Attendee",
            organization: "LearnTech Solutions",
            position: "Training Coordinator",
            location: "Chennai",
            experience: "2 years",
          },
          {
            name: "Suresh Jain",
            email: "suresh.jain@skillsacademy.com",
            status: "Attendee",
            organization: "Skills Academy",
            position: "Program Coordinator",
            location: "Jaipur",
            experience: "4 years",
          },
        ],
        2023: [
          {
            name: "Dr. Sunita Verma",
            email: "sunita.verma@eduskills.com",
            status: "Winner",
            organization: "EduSkills Foundation",
            position: "Director of Programs",
            location: "New Delhi",
            experience: "12 years",
          },
          {
            name: "Vikram Mishra",
            email: "vikram.mishra@futurelearning.org",
            status: "Winner",
            organization: "Future Learning Institute",
            position: "Head of Innovation",
            location: "Bangalore",
            experience: "10 years",
          },
          {
            name: "Anjali Nair",
            email: "anjali.nair@skillbridge.in",
            status: "Winner",
            organization: "SkillBridge Academy",
            position: "Lead Trainer",
            location: "Kochi",
            experience: "7 years",
          },
          {
            name: "Deepak Agarwal",
            email: "deepak.agarwal@trainingexcellence.com",
            status: "Nominated",
            organization: "Training Excellence Center",
            position: "Senior Consultant",
            location: "Gurgaon",
            experience: "9 years",
          },
          {
            name: "Ritu Sahu",
            email: "ritu.sahu@learningpartners.org",
            status: "Nominated",
            organization: "Learning Partners",
            position: "Program Manager",
            location: "Bhopal",
            experience: "6 years",
          },
          {
            name: "Manish Mehta",
            email: "manish.mehta@skillhub.in",
            status: "Attendee",
            organization: "SkillHub India",
            position: "Training Associate",
            location: "Ahmedabad",
            experience: "3 years",
          },
          {
            name: "Sneha Bansal",
            email: "sneha.bansal@educorp.com",
            status: "Attendee",
            organization: "EduCorp Solutions",
            position: "Learning Designer",
            location: "Indore",
            experience: "2 years",
          },
          {
            name: "Rahul Tiwari",
            email: "rahul.tiwari@digitallearning.org",
            status: "Attendee",
            organization: "Digital Learning Hub",
            position: "Content Specialist",
            location: "Lucknow",
            experience: "4 years",
          },
        ],
        2022: [
          {
            name: "Dr. Ashok Chopra",
            email: "ashok.chopra@skillsnetwork.in",
            status: "Winner",
            organization: "Skills Network India",
            position: "Chief Learning Officer",
            location: "Mumbai",
            experience: "15 years",
          },
          {
            name: "Pooja Pandey",
            email: "pooja.pandey@moderntraining.com",
            status: "Winner",
            organization: "Modern Training Solutions",
            position: "Vice President Training",
            location: "Delhi",
            experience: "11 years",
          },
          {
            name: "Arjun Joshi",
            email: "arjun.joshi@skillsplus.org",
            status: "Nominated",
            organization: "SkillsPlus Academy",
            position: "Senior Training Manager",
            location: "Pune",
            experience: "8 years",
          },
          {
            name: "Divya Yadav",
            email: "divya.yadav@learningcenter.in",
            status: "Nominated",
            organization: "Advanced Learning Center",
            position: "Curriculum Head",
            location: "Kolkata",
            experience: "7 years",
          },
          {
            name: "Gaurav Saxena",
            email: "gaurav.saxena@trainingworld.com",
            status: "Attendee",
            organization: "Training World",
            position: "Program Associate",
            location: "Noida",
            experience: "3 years",
          },
          {
            name: "Nisha Singhal",
            email: "nisha.singhal@skillsdevelopment.org",
            status: "Attendee",
            organization: "Skills Development Corp",
            position: "Training Executive",
            location: "Chandigarh",
            experience: "2 years",
          },
        ],
      };

      setConnectData(dummyConnectData);
    } catch (error) {
      console.error("Error fetching EduSkills Connect data:", error);
      setConnectData([]);
    } finally {
      setConnectLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchConnectData();
  }, [isStaffDashboard]);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== null) {
      fetchConnectData();
    }
  }, [refreshTrigger]);

  return (
    <EduSkillsConnectAccordion
      connectData={connectData}
      filterOptions={filterOptions}
      loading={connectLoading}
    />
  );
};

export default EduSkillsConnect;
