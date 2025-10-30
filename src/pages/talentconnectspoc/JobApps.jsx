import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  useMediaQuery,
  useTheme,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  CircularProgress,
} from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import {
  Archive as ArchiveIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CurrencyRupee as SalaryIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  WorkOutline as WorkOutlineIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

// Material UI blue color palette
const colors = {
  primary: "#1976d2",
  light: "#42a5f5",
  main: "#2196f3",
  dark: "#1565c0",
  darker: "#0d47a1",
  background: "#f5f9ff",
  paperBg: "#ffffff",
  lightText: "#64b5f6",
  contrastText: "#ffffff",
  border: "#bbdefb",
  hover: "#e3f2fd",
};

// API endpoints
const API_ENDPOINTS = {
  CURRENT_JOBS: "http://192.168.0.136:8000/talent/connect/student/jobs/",
  ARCHIVED_JOBS:
    "http://192.168.0.136:8000/talent/connect/student/archivedJobs",
  JOB_DETAILS: (jobId) =>
    `http://192.168.0.136:8000/talent/connect/student/jobs/${jobId}`,
};

// Styled components
const JobPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  borderLeft: `4px solid ${colors.main}`,
  borderRadius: "4px",
  backgroundColor: colors.paperBg,
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0 6px 12px rgba(33, 150, 243, 0.12)",
    transform: "translateY(-3px)",
    borderLeft: `4px solid ${colors.dark}`,
  },
}));

const JobTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: colors.dark,
  marginBottom: theme.spacing(1),
  lineHeight: 1.3,
}));

const JobInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.5),
  "& svg": {
    marginRight: theme.spacing(1),
    fontSize: "1.1rem",
    color: colors.main,
  },
}));

const JobStatus = styled(Chip)(({ theme, status }) => ({
  marginRight: theme.spacing(1),
  fontWeight: 500,
  backgroundColor:
    status === "Publish"
      ? colors.main
      : status === "Closed"
      ? "#9c27b0"
      : "#ff9800",
  color: colors.contrastText,
}));

const CompanyAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: colors.light,
  color: colors.contrastText,
  marginRight: theme.spacing(2),
  width: theme.spacing(6),
  height: theme.spacing(6),
  boxShadow: "0 2px 4px rgba(33, 150, 243, 0.2)",
  fontWeight: "bold",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${colors.border}`,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: colors.darker,
  display: "inline-block",
}));

const PostedChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "transparent",
  border: `1px solid ${colors.border}`,
  color: colors.dark,
  "& .MuiChip-icon": {
    color: colors.light,
  },
}));

const ArchiveButton = styled(IconButton)(({ theme }) => ({
  color: colors.main,
  backgroundColor: colors.hover,
  "&:hover": {
    backgroundColor: colors.border,
  },
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: colors.border,
    },
    "&:hover fieldset": {
      borderColor: colors.light,
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.main,
    },
  },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: "flex",
  justifyContent: "center",
  "& .MuiPaginationItem-root": {
    color: colors.dark,
  },
  "& .Mui-selected": {
    backgroundColor: `${colors.main} !important`,
    color: colors.contrastText,
  },
}));

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Helper function to get company initials
const getInitials = (companyName) => {
  return companyName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const JOBS_PER_PAGE = 3;

const JobsApps = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [showArchived, setShowArchived] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);

  // Fetch jobs based on archive status
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found in local storage");
          setJobs([]);
          setLoading(false);
          return;
        }

        const endpoint = showArchived
          ? API_ENDPOINTS.ARCHIVED_JOBS
          : API_ENDPOINTS.CURRENT_JOBS;
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setJobs(response.data.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [showArchived]);

  // Filter jobs based on search term
  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.job_role &&
          job.job_role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredJobs(filtered);
    setTotalPages(Math.ceil(filtered.length / JOBS_PER_PAGE));
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, jobs]);

  const toggleArchiveView = () => {
    setShowArchived(!showArchived);
    setSearchTerm("");
  };

  const handleJobClick = async (job) => {
    setJobDetailsLoading(true);
    setOpen(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found in local storage");
        setSelectedJob(job); // Fallback to basic job info
        setJobDetailsLoading(false);
        return;
      }

      const response = await axios.get(API_ENDPOINTS.JOB_DETAILS(job.job_id), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSelectedJob({
        ...job,
        ...response.data.data,
      });
    } catch (error) {
      console.error("Error fetching job details:", error);
      setSelectedJob(job); // Fallback to basic job info
    } finally {
      setJobDetailsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get current jobs for pagination
  const indexOfLastJob = page * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, backgroundColor: colors.background, minHeight: "100vh" }}
    >
      <HeaderSection>
        <SectionTitle variant="h4" component="h1">
          {showArchived ? "Archived Jobs" : "Current Openings"}
        </SectionTitle>
        <ArchiveButton
          onClick={toggleArchiveView}
          aria-label={showArchived ? "view current jobs" : "view archived jobs"}
          title={showArchived ? "View Current Openings" : "View Archived Jobs"}
        >
          <ArchiveIcon />
        </ArchiveButton>
      </HeaderSection>

      <SearchBar
        fullWidth
        variant="outlined"
        placeholder="Search by job title, company or role..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: colors.main }} />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="body2" color="textSecondary">
          Showing {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "job" : "jobs"}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <Grid item xs={12} key={job.job_id}>
                <JobPaper elevation={1} onClick={() => handleJobClick(job)}>
                  <Box
                    display="flex"
                    flexDirection={isTablet ? "column" : "row"}
                    alignItems={isTablet ? "flex-start" : "center"}
                  >
                    <Box
                      display="flex"
                      alignItems={isMobile ? "flex-start" : "center"}
                      flexDirection={isMobile ? "column" : "row"}
                      flex="1"
                    >
                      <CompanyAvatar>{getInitials(job.company)}</CompanyAvatar>

                      <Box flex="1">
                        <Box>
                          <JobTitle variant={isMobile ? "h6" : "h5"}>
                            {job.job_title}
                          </JobTitle>

                          <Box
                            display="flex"
                            flexWrap="wrap"
                            mb={2}
                            alignItems="center"
                          >
                            <JobStatus
                              label={job.status}
                              status={job.status}
                              size="small"
                            />
                            <PostedChip
                              icon={<TimeIcon />}
                              label={`Reg: ${formatDate(
                                job.reg_start
                              )} - ${formatDate(job.reg_end)}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <JobInfo>
                              <BusinessIcon />
                              <Typography variant="body1">
                                {job.company}
                              </Typography>
                            </JobInfo>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <JobInfo>
                              <PersonIcon />
                              <Typography variant="body1">
                                Openings: {job.no_of_post}
                              </Typography>
                            </JobInfo>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <JobInfo>
                              <WorkOutlineIcon />
                              <Typography variant="body1">
                                {job.job_role || "Not specified"}
                              </Typography>
                            </JobInfo>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </JobPaper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="textSecondary">
                  {searchTerm
                    ? `No ${
                        showArchived ? "archived" : "current"
                      } jobs match your search criteria`
                    : `No ${
                        showArchived ? "archived jobs" : "current openings"
                      } to display`}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {filteredJobs.length > JOBS_PER_PAGE && (
        <Stack spacing={2} alignItems="center">
          <StyledPagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
          />
        </Stack>
      )}

      {/* Job Description Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderTop: `4px solid ${colors.main}`,
            borderRadius: "4px",
          },
        }}
      >
        {jobDetailsLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : selectedJob ? (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight="bold"
                  color={colors.dark}
                >
                  {selectedJob.jd_title || selectedJob.job_title}
                </Typography>
                <IconButton onClick={handleClose} size="large">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box mb={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CompanyAvatar sx={{ width: 40, height: 40, mr: 1 }}>
                        {getInitials(
                          selectedJob.company_name || selectedJob.company
                        )}
                      </CompanyAvatar>
                      <Typography variant="h6">
                        {selectedJob.company_name || selectedJob.company}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      justifyContent={isTablet ? "flex-start" : "flex-end"}
                      flexWrap="wrap"
                    >
                      <JobStatus
                        label={selectedJob.status}
                        status={selectedJob.status}
                        sx={{ mr: 1 }}
                      />
                      <PostedChip
                        icon={<TimeIcon />}
                        label={`Ref: ${selectedJob.reference || "N/A"}`}
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <JobInfo>
                    <BusinessIcon />
                    <Typography variant="body1">
                      {selectedJob.company_name || selectedJob.company}
                    </Typography>
                  </JobInfo>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <JobInfo>
                    <LocationIcon />
                    <Typography variant="body1">
                      {selectedJob.jd_location || "Location not specified"}
                    </Typography>
                  </JobInfo>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <JobInfo>
                    <SalaryIcon />
                    <Typography variant="body1">
                      {selectedJob.package || "Package not specified"}
                    </Typography>
                  </JobInfo>
                </Grid>
              </Grid>

              <Divider sx={{ mb: 3 }} />

              <Box
                className="job-description"
                sx={{
                  "& h3": {
                    color: colors.dark,
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    mt: 3,
                    mb: 2,
                  },
                  "& p": {
                    mb: 2,
                    lineHeight: 1.6,
                  },
                  "& ul": {
                    pl: 2,
                    mb: 3,
                    listStyleType: "disc",
                    listStylePosition: "outside",
                  },
                  "& li": {
                    mb: 1,
                    display: "list-item",
                  },
                }}
              >
                {selectedJob.company_description ? (
                  parse(DOMPurify.sanitize(selectedJob.company_description))
                ) : (
                  <Typography variant="body1">
                    No detailed description available for this position.
                  </Typography>
                )}
              </Box>

              {/* Additional Job Details */}
              {selectedJob.workplace_type && (
                <Box mt={3}>
                  <Typography variant="h6" color={colors.dark} gutterBottom>
                    Additional Details
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedJob.workplace_type && (
                      <Grid item xs={12} sm={6}>
                        <JobInfo>
                          <WorkOutlineIcon />
                          <Typography variant="body1">
                            Workplace Type: {selectedJob.workplace_type}
                          </Typography>
                        </JobInfo>
                      </Grid>
                    )}

                    {selectedJob.jobtype && (
                      <Grid item xs={12} sm={6}>
                        <JobInfo>
                          <TimeIcon />
                          <Typography variant="body1">
                            Job Type: {selectedJob.jobtype}
                          </Typography>
                        </JobInfo>
                      </Grid>
                    )}

                    {selectedJob.year_of_passing && (
                      <Grid item xs={12} sm={6}>
                        <JobInfo>
                          <PersonIcon />
                          <Typography variant="body1">
                            Year of Passing: {selectedJob.year_of_passing}
                          </Typography>
                        </JobInfo>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleClose}
                sx={{
                  color: colors.main,
                  borderColor: colors.main,
                  "&:hover": {
                    borderColor: colors.dark,
                    color: colors.dark,
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Container>
  );
};

export default JobsApps;
