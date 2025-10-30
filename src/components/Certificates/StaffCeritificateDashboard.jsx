// CertificateDashboard.js with added Uploaded card and localStorage integration
import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Skeleton, Alert } from "@mui/material";
import {
  CheckCircle,
  FileCheck,
  AlertCircle,
  Clock,
  Upload,
} from "lucide-react";
import AssessmentDashboard from "./AssessmentDashboard";
import FinalCertificateDashboard from "./FinalCertificateDashboard";
import StudentDetailModal from "./StudentDetailModal";
import StatusCard from "./StatusCard";
import CohortSelector from "./CohortSelector";
import SectionCard from "./SectionCard";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

// Loading Skeleton for Status Card
const StatusCardSkeleton = () => {
  return (
    <Box
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <Skeleton
        variant="rectangular"
        width={32}
        height={32}
        sx={{ borderRadius: 1, mr: 1.5 }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        <Skeleton variant="text" width={40} height={30} />
        <Skeleton variant="text" width={80} height={20} />
      </Box>
    </Box>
  );
};

const StaffCertificateDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Cohort selection state - will be populated after API fetch
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    certificate_verified: 0,
    verification_in_progress: 0,
    not_uploaded: 0,
    rejected: 0,
    cert_uploaded: 0, // Added new state for uploaded certificates
    issue_pending: 0,
    issued: 0,
  });

  // API data
  const [apiData, setApiData] = useState(null);

  // Modified approach for localStorage state tracking
  // Using this approach ensures we catch all changes to these values
  const getCurrentStateId = () => localStorage.getItem("selectedStateId");
  const getCurrentInstituteId = () =>
    localStorage.getItem("selectedInstituteId");

  const [selectedStateId, setSelectedStateId] = useState(getCurrentStateId());
  const [selectedInstituteId, setSelectedInstituteId] = useState(
    getCurrentInstituteId()
  );

  // Setup interval to check for localStorage changes within the same tab
  useEffect(() => {
    // Check for changes within the same tab
    const intervalId = setInterval(() => {
      const currentStateId = getCurrentStateId();
      const currentInstituteId = getCurrentInstituteId();

      if (
        currentStateId !== selectedStateId ||
        currentInstituteId !== selectedInstituteId
      ) {
        console.log("Local storage values changed within the same tab");
        setSelectedStateId(currentStateId);
        setSelectedInstituteId(currentInstituteId);
      }
    }, 1000); // Check every second

    // Also handle cross-tab changes
    const handleStorageChange = (e) => {
      if (e.key === "selectedStateId" || e.key === "selectedInstituteId") {
        console.log("Local storage values changed from another tab");
        setSelectedStateId(getCurrentStateId());
        setSelectedInstituteId(getCurrentInstituteId());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [selectedStateId, selectedInstituteId]);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Always get fresh values directly from localStorage for the API call
      const stateId = localStorage.getItem("selectedStateId");
      const instituteId = localStorage.getItem("selectedInstituteId");

      console.log("Fetching dashboard data with:", { stateId, instituteId });

      // Add to payload
      const payload = {
        state_id: stateId || null,
        institute_id: instituteId || null,
      };

      const response = await api.post(
        `${BASE_URL}/internship/internship-dashboard-staff`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data) {
        setApiData(response.data);

        // Set the latest cohort as selected by default
        if (response.data.cohort_data && response.data.cohort_data.length > 0) {
          // Find the cohort with the highest ID (most recent)
          const sortedCohorts = [...response.data.cohort_data].sort(
            (a, b) => b.cohort_id - a.cohort_id
          );

          if (sortedCohorts.length > 0) {
            // Select the latest cohort
            const latestCohortId = `cohort${sortedCohorts[0].cohort_id}`;
            setSelectedCohorts([latestCohortId]);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger API refresh when selectedStateId or selectedInstituteId change
  useEffect(() => {
    console.log("State or Institute ID changed, refreshing data");
    fetchDashboardData();
  }, [selectedStateId, selectedInstituteId]);

  // Handle cohort selection change
  const handleCohortChange = (cohortId, isChecked) => {
    let newSelectedCohorts;

    if (isChecked) {
      newSelectedCohorts = [...selectedCohorts, cohortId];
    } else {
      newSelectedCohorts = selectedCohorts.filter((id) => id !== cohortId);
    }

    // Ensure at least one cohort is selected
    if (newSelectedCohorts.length === 0) {
      return;
    }

    setSelectedCohorts(newSelectedCohorts);
  };

  // Process data based on selected cohorts
  useEffect(() => {
    if (!apiData || selectedCohorts.length === 0) return;

    // Reset counts
    const newDashboardData = {
      certificate_verified: 0,
      verification_in_progress: 0,
      not_uploaded: 0,
      rejected: 0,
      cert_uploaded: 0, // Added for uploaded certificates
      issue_pending: 0,
      issued: 0,
    };

    // Filter cohorts based on selection and aggregate data
    const filteredCohorts = apiData.cohort_data.filter((cohort) =>
      selectedCohorts.includes(`cohort${cohort.cohort_id}`)
    );

    filteredCohorts.forEach((cohort) => {
      newDashboardData.certificate_verified += cohort.cert_verified?.count || 0;
      newDashboardData.verification_in_progress +=
        cohort.cert_in_progress?.count || 0;
      newDashboardData.not_uploaded += cohort.cert_not_uploaded?.count || 0;
      newDashboardData.rejected += cohort.cert_rejected?.count || 0;
      newDashboardData.issue_pending += cohort.cert_pending?.count || 0;
      newDashboardData.issued += cohort.cert_issued?.count || 0;

      // Add uploaded certificates count, if the key exists
      if (cohort.cert_uploaded !== undefined) {
        newDashboardData.cert_uploaded += cohort.cert_uploaded.count || 0;
      }
    });

    setDashboardData(newDashboardData);
  }, [apiData, selectedCohorts]);

  // Handle status card click
  const handleStatusCardClick = (title, statusType) => {
    setModalTitle(title);
    setModalOpen(true);
    setDataLoading(true);

    try {
      // Filter students based on selected cohorts and status type
      const students = [];

      if (apiData) {
        apiData.cohort_data
          .filter((cohort) =>
            selectedCohorts.includes(`cohort${cohort.cohort_id}`)
          )
          .forEach((cohort) => {
            if (cohort[statusType] && cohort[statusType].students) {
              // Map API student data to match StudentDetailModal expected format
              const mappedStudents = cohort[statusType].students.map(
                (student) => ({
                  id: student.internship_id,
                  name: student.name,
                  email: student.email,
                  rollNo: student.roll_no,
                  year: student.final_year,
                  cohort: `Cohort ${cohort.cohort_id}`,
                  branch: student.branch,
                  domain: student.domain_name,
                })
              );

              students.push(...mappedStudents);
            }
          });
      }

      setStudentData(students);
    } catch (err) {
      console.error("Error processing student data:", err);
      setStudentData([]);
    } finally {
      setDataLoading(false);
    }
  };

  // Map dashboard data to certificate status cards
  const certificateStatusData = [
    {
      title: "Uploaded", // New card for uploaded certificates
      count: dashboardData.cert_uploaded,
      icon: <Upload />,
      color: "#14b8a6", // Teal 500
      bgColor: "#f0fdfa", // Teal 50
      onClick: () =>
        handleStatusCardClick("Certificates Uploaded", "cert_uploaded"),
    },
    {
      title: "Verified",
      count: dashboardData.certificate_verified,
      icon: <CheckCircle />,
      color: "#10b981", // Emerald 500
      bgColor: "#ecfdf5", // Emerald 50
      onClick: () =>
        handleStatusCardClick("Certificate Verified", "cert_verified"),
    },
    {
      title: "Verification Pending",
      count: dashboardData.verification_in_progress,
      icon: <Clock />,
      color: "#6366f1", // Indigo 500
      bgColor: "#eef2ff", // Indigo 50
      onClick: () =>
        handleStatusCardClick(
          "Certificate Verification In Progress",
          "cert_in_progress"
        ),
    },
    {
      title: "Not Uploaded",
      count: dashboardData.not_uploaded,
      icon: <FileCheck />,
      color: "#3b82f6", // Blue 500
      bgColor: "#eff6ff", // Blue 50
      onClick: () =>
        handleStatusCardClick("Certificate Not Uploaded", "cert_not_uploaded"),
    },
    {
      title: "Rejected",
      count: dashboardData.rejected,
      icon: <AlertCircle />,
      color: "#f43f5e", // Rose 500
      bgColor: "#fff1f2", // Rose 50
      onClick: () =>
        handleStatusCardClick("Certificate Rejected", "cert_rejected"),
    },
  ];

  if (error) {
    return (
      <Box sx={{ mt: 2, mb: 3, width: "100%", textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, mb: 3, width: "100%" }}>
      {/* Cohort Selector */}
      <CohortSelector
        selectedCohorts={selectedCohorts}
        onCohortChange={handleCohortChange}
        apiData={apiData}
        loading={loading}
      />

      {/* Dashboard Content */}
      <Grid container spacing={2}>
        {/* First row */}
        <Grid item xs={12} md={12}>
          <SectionCard
            title="Certificate Verification Status"
            tooltipText="This section shows the status of student all certificates verification status. Click on any card to view the list of students in that category."
          >
            <Grid container spacing={1.5}>
              {loading
                ? // Show skeletons while loading
                  Array(5) // Increased to 5 for the new card
                    .fill(0)
                    .map((_, index) => (
                      <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <StatusCardSkeleton />
                      </Grid>
                    ))
                : // Show actual cards with data
                  certificateStatusData.map((status, index) => (
                    <Grid item xs={12} sm={6} md={2.4} key={index}>
                      <StatusCard
                        title={status.title}
                        count={status.count}
                        icon={status.icon}
                        color={status.color}
                        bgColor={status.bgColor}
                        onClick={status.onClick}
                      />
                    </Grid>
                  ))}
            </Grid>
          </SectionCard>
        </Grid>

        {/* Assessment Dashboard */}
        <Grid item xs={12} md={12}>
          <AssessmentDashboard
            selectedCohorts={selectedCohorts}
            apiData={apiData}
          />
        </Grid>

        {/* Final Certificate Dashboard */}
        <Grid item xs={12} md={12}>
          <FinalCertificateDashboard
            selectedCohorts={selectedCohorts}
            apiData={apiData}
          />
        </Grid>
      </Grid>

      {/* Student Detail Modal */}
      <StudentDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={studentData}
        loading={dataLoading}
        showRejectionReason={false}
      />
    </Box>
  );
};

export default StaffCertificateDashboard;
