// AssessmentDashboard.js - Updated for self-contained modal
import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Skeleton } from "@mui/material";
import {
  CheckCircle,
  ClipboardList,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";
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

const AssessmentDashboard = ({
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
    active_students: 0,
    first_attempt_completed: 0,
    first_attempt_pending: 0,
    second_attempt_completed: 0,
    second_attempt_pending: 0,
  });

  // Process assessment data from API
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
      active_students: 0,
      first_attempt_completed: 0,
      first_attempt_pending: 0,
      second_attempt_completed: 0,
      second_attempt_pending: 0,
    };

    // Filter and aggregate data from selected cohorts
    dashboardDataCounts
      .filter((cohort) =>
        selectedCohortIds.includes(cohort.cohort_id.toString())
      )
      .forEach((cohort) => {
        newDashboardData.active_students += cohort?.ass_activated || 0;
        newDashboardData.first_attempt_completed +=
          cohort?.ass_completed_first || 0;
        newDashboardData.first_attempt_pending +=
          cohort?.ass_pending_first || 0;
        newDashboardData.second_attempt_completed +=
          cohort?.ass_completed_second || 0;
        newDashboardData.second_attempt_pending +=
          cohort?.ass_pending_second || 0;
      });

    setDashboardData(newDashboardData);
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

  // Active section data
  const activeStatusData = [
    {
      title: "Activated",
      count: dashboardData.active_students,
      icon: <Users size={20} />,
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      onClick: () =>
        handleStatusCardClick(
          "Active Students",
          "ass_activated",
          dashboardData.active_students
        ),
    },
  ];

  // First attempt section data
  const firstAttemptStatusData = [
    {
      title: "Completed",
      count: dashboardData.first_attempt_completed,
      icon: <CheckCircle size={20} />,
      color: "#10b981",
      bgColor: "#ecfdf5",
      onClick: () =>
        handleStatusCardClick(
          "First Attempt Completed",
          "ass_completed_first",
          dashboardData.first_attempt_completed
        ),
    },
    {
      title: "Pending",
      count: dashboardData.first_attempt_pending,
      icon: <Clock size={20} />,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      onClick: () =>
        handleStatusCardClick(
          "First Attempt Pending",
          "ass_pending_first",
          dashboardData.first_attempt_pending
        ),
    },
  ];

  // Second attempt section data
  const secondAttemptStatusData = [
    {
      title: "Completed",
      count: dashboardData.second_attempt_completed,
      icon: <CheckCircle size={20} />,
      color: "#10b981",
      bgColor: "#ecfdf5",
      onClick: () =>
        handleStatusCardClick(
          "Second Attempt Completed",
          "ass_completed_second",
          dashboardData.second_attempt_completed
        ),
    },
    {
      title: "Pending",
      count: dashboardData.second_attempt_pending,
      icon: <Clock size={20} />,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      onClick: () =>
        handleStatusCardClick(
          "Second Attempt Pending",
          "ass_pending_second",
          dashboardData.second_attempt_pending
        ),
    },
  ];

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
        title="Assessment Status"
        tooltipText="This section displays the status of student assessments. Click to view the students lists"
      >
        <Grid container spacing={2.5}>
          {/* Active Section Block */}
          <Grid item xs={12} md={4}>
            <SectionBlock
              title="Activated"
              bgColor="rgba(139, 92, 246, 0.05)"
              borderColor="rgba(139, 92, 246, 0.2)"
              tooltipText="Shows the total number of students who have activated their assessments."
            >
              {loading ? (
                <Grid item xs={12}>
                  <StatusCardSkeleton />
                </Grid>
              ) : (
                activeStatusData.map((status, index) => (
                  <Grid item xs={12} key={index}>
                    <StatusCard
                      title={status.title}
                      count={status.count}
                      icon={status.icon}
                      color={status.color}
                      bgColor={status.bgColor}
                      onClick={status.onClick}
                    />
                  </Grid>
                ))
              )}
            </SectionBlock>
          </Grid>

          {/* First Attempt Section Block */}
          <Grid item xs={12} md={4}>
            <SectionBlock
              title="First Attempt"
              bgColor="rgba(16, 185, 129, 0.05)"
              borderColor="rgba(16, 185, 129, 0.2)"
              tooltipText="Shows the status of students' first assessment attempts."
            >
              {loading
                ? Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <Grid item xs={6} key={index}>
                        <StatusCardSkeleton />
                      </Grid>
                    ))
                : firstAttemptStatusData.map((status, index) => (
                    <Grid item xs={6} key={index}>
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

          {/* Second Attempt Section Block */}
          <Grid item xs={12} md={4}>
            <SectionBlock
              title="Second Attempt"
              bgColor="rgba(59, 130, 246, 0.05)"
              borderColor="rgba(59, 130, 246, 0.2)"
              tooltipText="Shows the status of students' second assessment attempts. This is the final assessment stage before certification."
            >
              {loading
                ? Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <Grid item xs={6} key={index}>
                        <StatusCardSkeleton />
                      </Grid>
                    ))
                : secondAttemptStatusData.map((status, index) => (
                    <Grid item xs={6} key={index}>
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

export default AssessmentDashboard;
