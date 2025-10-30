// CertificateDashboard.js - Updated to work with self-contained modal
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

const CertificateDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalStatusType, setModalStatusType] = useState("");
  const [modalCohortId, setModalCohortId] = useState(null);
  const [studentListCount, setStudentListCount] = useState(0);
  const [dashboardDataCounts, setDashboardDataCounts] = useState(null);

  // Cohort selection state
  const [selectedCohorts, setSelectedCohorts] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    certificate_verified: 0,
    verification_in_progress: 0,
    not_uploaded: 0,
    rejected: 0,
    cert_uploaded: 0,
    issue_pending: 0,
    issued: 0,
  });

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const dashboardCountsRes = await api.get(
          `${BASE_URL}/internship/internship_dashboard_counts`,
          {},
          { headers }
        );

        if (dashboardCountsRes.data) {
          setDashboardDataCounts(dashboardCountsRes.data);

          // Set the latest cohort as selected by default
          if (dashboardCountsRes.data && dashboardCountsRes.data.length > 0) {
            const sortedCohorts = [...dashboardCountsRes.data].sort(
              (a, b) => b.cohort_id - a.cohort_id
            );

            if (sortedCohorts.length > 0) {
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

    fetchDashboardData();
  }, []);

  // Handle cohort selection change
  const handleCohortChange = (cohortId, isChecked) => {
    let newSelectedCohorts;

    if (isChecked) {
      newSelectedCohorts = [cohortId];
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
    if (!dashboardDataCounts || selectedCohorts.length === 0) return;

    // Reset counts
    const newDashboardData = {
      certificate_verified: 0,
      verification_in_progress: 0,
      not_uploaded: 0,
      rejected: 0,
      cert_uploaded: 0,
      issue_pending: 0,
      issued: 0,
    };

    // Filter cohorts based on selection and aggregate data
    const filteredCohorts = dashboardDataCounts.filter((cohort) =>
      selectedCohorts.includes(`cohort${cohort.cohort_id}`)
    );

    filteredCohorts.forEach((cohort) => {
      newDashboardData.certificate_verified += cohort?.cert_verified || 0;
      newDashboardData.verification_in_progress +=
        cohort?.cert_in_progress || 0;
      newDashboardData.not_uploaded += cohort?.cert_not_uploaded || 0;
      newDashboardData.rejected += cohort?.cert_rejected || 0;
      newDashboardData.issue_pending += cohort?.cert_pending || 0;
      newDashboardData.issued += cohort?.cert_issued || 0;

      if (cohort.cert_uploaded !== undefined) {
        newDashboardData.cert_uploaded += cohort?.cert_uploaded || 0;
      }
    });

    setDashboardData(newDashboardData);
  }, [dashboardDataCounts, selectedCohorts]);

  // Handle status card click - simplified version
  const handleStatusCardClick = (title, statusType, studentCount) => {
    setModalTitle(title);
    setModalStatusType(statusType);
    setStudentListCount(studentCount || 0);

    // Extract cohort ID from selected cohort
    const cohortId = Number(selectedCohorts[0]?.replace("cohort", ""));
    setModalCohortId(cohortId);

    setModalOpen(true);
  };

  // Map dashboard data to certificate status cards
  const certificateStatusData = [
    {
      title: "Uploaded",
      count: dashboardData.cert_uploaded,
      icon: <Upload />,
      color: "#14b8a6",
      bgColor: "#f0fdfa",
      onClick: () =>
        handleStatusCardClick(
          "Certificates Uploaded",
          "cert_uploaded",
          dashboardData.cert_uploaded
        ),
    },
    {
      title: "Verified",
      count: dashboardData.certificate_verified,
      icon: <CheckCircle />,
      color: "#10b981",
      bgColor: "#ecfdf5",
      onClick: () =>
        handleStatusCardClick(
          "Certificate Verified",
          "cert_verified",
          dashboardData.certificate_verified
        ),
    },
    {
      title: "Verification Pending",
      count: dashboardData.verification_in_progress,
      icon: <Clock />,
      color: "#6366f1",
      bgColor: "#eef2ff",
      onClick: () =>
        handleStatusCardClick(
          "Certificate Verification In Progress",
          "cert_in_progress",
          dashboardData.verification_in_progress
        ),
    },
    {
      title: "Not Uploaded",
      count: dashboardData.not_uploaded,
      icon: <FileCheck />,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      onClick: () =>
        handleStatusCardClick(
          "Certificate Not Uploaded",
          "cert_not_uploaded",
          dashboardData.not_uploaded
        ),
    },
    {
      title: "Rejected",
      count: dashboardData.rejected,
      icon: <AlertCircle />,
      color: "#f43f5e",
      bgColor: "#fff1f2",
      onClick: () =>
        handleStatusCardClick(
          "Certificate Rejected",
          "cert_rejected",
          dashboardData.rejected
        ),
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
        dashboardDataCounts={dashboardDataCounts}
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
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <StatusCardSkeleton />
                      </Grid>
                    ))
                : certificateStatusData.map((status, index) => (
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
            modalCohortId={modalCohortId}
            modalStatusType={modalStatusType}
            api={api}
            BASE_URL={BASE_URL}
            showRejectionReason={modalStatusType === "cert_rejected"}
            selectedCohorts={selectedCohorts}
            dashboardDataCounts={dashboardDataCounts}
          />
        </Grid>

        {/* Final Certificate Dashboard */}
        <Grid item xs={12} md={12}>
          <FinalCertificateDashboard
            modalCohortId={modalCohortId}
            modalStatusType={modalStatusType}
            api={api}
            BASE_URL={BASE_URL}
            showRejectionReason={modalStatusType === "cert_rejected"}
            selectedCohorts={selectedCohorts}
            dashboardDataCounts={dashboardDataCounts}
          />
        </Grid>
      </Grid>

      {/* Student Detail Modal - Self-contained with API calls */}
      <StudentDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        cohortId={modalCohortId}
        statusType={modalStatusType}
        api={api}
        BASE_URL={BASE_URL}
        showRejectionReason={modalStatusType === "cert_rejected"}
        student_list_count={studentListCount}
      />
    </Box>
  );
};

export default CertificateDashboard;
