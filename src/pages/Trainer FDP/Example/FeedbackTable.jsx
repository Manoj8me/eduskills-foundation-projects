import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../services/configUrls";

const FeedbackTables = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/get-feedback`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch feedback data");
      }
      const data = await response.json();
      setFeedbackData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFeedback(null);
  };

  const getRatingColor = (rating) => {
    if (rating === "excellent") return "success";
    if (rating === "good") return "primary";
    if (rating === "fair") return "warning";
    return "default";
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 900,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    overflow: "hidden",
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading feedback data: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
        Feedback Management System
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Institute
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Mobile Number
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Designation
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbackData.map((feedback, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                    {feedback.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                    {feedback.email}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <SchoolIcon sx={{ mr: 1, color: "text.secondary" }} />
                    {feedback.institute}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                    {feedback.mobile_number}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={feedback.designation}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(feedback)}
                      sx={{ borderRadius: 2 }}
                    >
                      View
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {selectedFeedback && (
            <>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">
                  Detailed Feedback - {selectedFeedback.name}
                </Typography>
                <IconButton onClick={handleCloseModal} sx={{ color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box
                sx={{ p: 3, maxHeight: "calc(90vh - 120px)", overflow: "auto" }}
              >
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Basic Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Name:</strong> {selectedFeedback.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Email:</strong> {selectedFeedback.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Institute:</strong>{" "}
                              {selectedFeedback.institute}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Mobile:</strong>{" "}
                              {selectedFeedback.mobile_number}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Designation:</strong>{" "}
                              {selectedFeedback.designation}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Registration Code:</strong>{" "}
                              {selectedFeedback.registrationCode}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Overall Rating:</strong>{" "}
                              {selectedFeedback.rating}/10
                            </Typography>
                            <Rating
                              value={selectedFeedback.rating / 2}
                              readOnly
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Expectations Met:</strong>{" "}
                              {selectedFeedback.expectations}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Speaker Ratings */}
                  <Grid item xs={12}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Speaker Ratings
                        </Typography>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                              View All Speaker Ratings (
                              {selectedFeedback.speaker_ratings?.length || 0}{" "}
                              speakers)
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2}>
                              {selectedFeedback.speaker_ratings?.map(
                                (speaker, idx) => (
                                  <Grid item xs={12} md={6} key={idx}>
                                    <Card variant="outlined">
                                      <CardContent sx={{ p: 2 }}>
                                        <Typography
                                          variant="subtitle2"
                                          sx={{ fontWeight: "bold" }}
                                        >
                                          {speaker.speaker_name}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{ mb: 1 }}
                                        >
                                          {speaker.topic}
                                        </Typography>
                                        <Chip
                                          label={speaker.rating}
                                          color={getRatingColor(speaker.rating)}
                                          size="small"
                                        />
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Panel Discussion */}
                  {selectedFeedback.panel && (
                    <Grid item xs={12}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Panel Discussion
                          </Typography>
                          <Typography>
                            <strong>Topic:</strong>{" "}
                            {selectedFeedback.panel.topic}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={`Rating: ${selectedFeedback.panel.rating}`}
                              color={getRatingColor(
                                selectedFeedback.panel.rating
                              )}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Likes and Dislikes */}
                  <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          color="success.main"
                          gutterBottom
                        >
                          What They Liked
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {selectedFeedback.like1 && (
                            <Chip
                              label={selectedFeedback.like1}
                              color="success"
                              variant="outlined"
                            />
                          )}
                          {selectedFeedback.like2 && (
                            <Chip
                              label={selectedFeedback.like2}
                              color="success"
                              variant="outlined"
                            />
                          )}
                          {selectedFeedback.like3 && (
                            <Chip
                              label={selectedFeedback.like3}
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          color="error.main"
                          gutterBottom
                        >
                          Areas for Improvement
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {selectedFeedback.dislike1 && (
                            <Chip
                              label={selectedFeedback.dislike1}
                              color="error"
                              variant="outlined"
                            />
                          )}
                          {selectedFeedback.dislike2 && (
                            <Chip
                              label={selectedFeedback.dislike2}
                              color="error"
                              variant="outlined"
                            />
                          )}
                          {selectedFeedback.dislike3 && (
                            <Chip
                              label={selectedFeedback.dislike3}
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Suggestions and Referral */}
                  <Grid item xs={12}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          Suggestions & Referral
                        </Typography>
                        <Typography sx={{ mb: 2 }}>
                          <strong>Suggestions:</strong>{" "}
                          {selectedFeedback.suggestions}
                        </Typography>
                        <Typography sx={{ mb: 2 }}>
                          <strong>Would Refer:</strong>{" "}
                          {selectedFeedback.referral}
                        </Typography>

                        {selectedFeedback.referral === "Yes" &&
                          selectedFeedback.referenceName && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: "action.hover",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="subtitle2" gutterBottom>
                                Reference Details:
                              </Typography>
                              <Typography>
                                <strong>Name:</strong>{" "}
                                {selectedFeedback.referenceName}
                              </Typography>
                              <Typography>
                                <strong>Email:</strong>{" "}
                                {selectedFeedback.referenceEmail}
                              </Typography>
                              <Typography>
                                <strong>Contact:</strong>{" "}
                                {selectedFeedback.referenceContact}
                              </Typography>
                              <Typography>
                                <strong>Institute:</strong>{" "}
                                {selectedFeedback.referenceInstitute}
                              </Typography>
                            </Box>
                          )}

                        {selectedFeedback.noReferralReason && (
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              bgcolor: "error.light",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="subtitle2" gutterBottom>
                              Reason for No Referral:
                            </Typography>
                            <Typography>
                              {selectedFeedback.noReferralReason}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default FeedbackTables;
