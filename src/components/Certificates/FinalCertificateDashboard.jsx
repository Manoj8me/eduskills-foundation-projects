// FinalCertificateDashboard.js - Updated for self-contained modal
import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Skeleton, Divider } from "@mui/material";
import { Award, Clock, Users, FileText, Scroll } from "lucide-react";
import StudentDetailModal from "./StudentDetailModal";
import StatusCard from "./StatusCard";
import SectionCard from "./SectionCard";
import SectionBlock from "./SectionBlock";
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

const FinalCertificateDashboard = ({
  selectedCohorts = ["cohort12"],
  dashboardDataCounts,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalStatusType, setModalStatusType] = useState("");
  const [modalCohortId, setModalCohortId] = useState(null);
  const [studentListCount, setStudentListCount] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    eligible_students: 0,
    certificate_pending: 0,
    certificate_issued: 0,
  });

  // State for APSCHE certificate data and availability flags
  const [showAPSCHESection, setShowAPSCHESection] = useState(false);
  const [hasShortTermCert, setHasShortTermCert] = useState(false);
  const [hasLongTermCert, setHasLongTermCert] = useState(false);
  const [shortTermCount, setShortTermCount] = useState(0);
  const [longTermCount, setLongTermCount] = useState(0);

  // Process certificate data from API
  useEffect(() => {
    if (!dashboardDataCounts) return;

    // Reset loading status based on API data availability
    setLoading(dashboardDataCounts ? false : true);

    // Convert cohortXX format to just XX for API data matching
    const selectedCohortIds = selectedCohorts.map((id) =>
      id.replace("cohort", "")
    );

    // Reset dashboard data
    const newDashboardData = {
      eligible_students: 0,
      certificate_pending: 0,
      certificate_issued: 0,
    };

    // Reset APSCHE-related flags and counts
    let hasShortTerm = false;
    let hasLongTerm = false;
    let shortTermTotal = 0;
    let longTermTotal = 0;

    // Filter and aggregate data from selected cohorts
    dashboardDataCounts
      .filter((cohort) =>
        selectedCohortIds.includes(cohort.cohort_id.toString())
      )
      .forEach((cohort) => {
        newDashboardData.eligible_students += cohort?.eligible_students || 0;
        newDashboardData.certificate_pending += cohort?.cert_pending || 0;
        newDashboardData.certificate_issued += cohort?.cert_issued || 0;

        // Check for APSCHE certificate data keys
        if (cohort.short_term_certificate !== undefined) {
          hasShortTerm = true;
          shortTermTotal += cohort?.short_term_certificate || 0;
        }

        if (cohort.long_term_certificate !== undefined) {
          hasLongTerm = true;
          longTermTotal += cohort?.long_term_certificate || 0;
        }
      });

    setDashboardData(newDashboardData);

    // Update APSCHE-related states
    setHasShortTermCert(hasShortTerm);
    setHasLongTermCert(hasLongTerm);
    setShortTermCount(shortTermTotal);
    setLongTermCount(longTermTotal);
    setShowAPSCHESection(hasShortTerm || hasLongTerm);

    setLoading(false);
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

  // Map dashboard data to final certificate status cards
  const finalCertificateStatusData = [
    {
      title: "Eligible",
      count: dashboardData.eligible_students,
      icon: <Users />,
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      onClick: () =>
        handleStatusCardClick(
          "Eligible Students",
          "eligible_students",
          dashboardData.eligible_students
        ),
    },
    {
      title: "In Progress",
      count: dashboardData.certificate_pending,
      icon: <Clock />,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      onClick: () =>
        handleStatusCardClick(
          "Certificate Pending",
          "cert_pending",
          dashboardData.certificate_pending
        ),
    },
    {
      title: "Issued",
      count: dashboardData.certificate_issued,
      icon: <Award />,
      color: "#10b981",
      bgColor: "#ecfdf5",
      onClick: () =>
        handleStatusCardClick(
          "Certificate Issued",
          "cert_issued",
          dashboardData.certificate_issued
        ),
    },
  ];

  // APSCHE certificate status cards
  const apscheCertificateStatusData = [];

  if (hasShortTermCert) {
    apscheCertificateStatusData.push({
      title: "Short Term",
      count: shortTermCount,
      icon: <FileText />,
      color: "#0ea5e9",
      bgColor: "#f0f9ff",
      onClick: () =>
        handleStatusCardClick(
          "Short Term Certificate",
          "short_term_certificate",
          shortTermCount
        ),
    });
  }

  if (hasLongTermCert) {
    apscheCertificateStatusData.push({
      title: "Long Term",
      count: longTermCount,
      icon: <Scroll />,
      color: "#6366f1",
      bgColor: "#eef2ff",
      onClick: () =>
        handleStatusCardClick(
          "Long Term Certificate",
          "long_term_certificate",
          longTermCount
        ),
    });
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <SectionCard
        title="AICTE Internship Certificate"
        tooltipText="This section displays the AICTE certification status for students who have completed all requirements, including assessments and verification. Click to view the student lists."
      >
        <Grid container spacing={1.5}>
          {/* Main certificate status cards */}
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <StatusCardSkeleton />
                  </Grid>
                ))
            : finalCertificateStatusData.map((status, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
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

        {/* APSCHE Certificate Block */}
        {showAPSCHESection && !loading && (
          <>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <SectionBlock
                  title="APSCHE Certificate"
                  bgColor="rgba(14, 165, 233, 0.05)"
                  borderColor="rgba(14, 165, 233, 0.2)"
                  tooltipText="APSCHE (Andhra Pradesh State Council of Higher Education) certificates issued to qualifying students."
                >
                  {apscheCertificateStatusData.map((status, index) => (
                    <Grid item xs={12} sm={6} key={index}>
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
                </SectionBlock>
              </Grid>
            </Grid>
          </>
        )}
      </SectionCard>

      {/* Student Detail Modal - Self-contained with API calls */}
      <StudentDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        cohortId={modalCohortId}
        statusType={modalStatusType}
        api={api}
        BASE_URL={BASE_URL}
        showRejectionReason={false}
        student_list_count={studentListCount}
      />
    </>
  );
};

export default FinalCertificateDashboard;
