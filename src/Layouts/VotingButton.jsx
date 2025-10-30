import {
  Box,
  Tooltip,
  Modal,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Vote,
  Sparkles,
  CheckCircle,
  Users,
  Eye,
  X,
  TrendingUp,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  XCircle,
  Trophy,
  Crown,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../services/configUrls";
import WinnerBanner from "../pages/Connect25/qrcode/WinnerBanner";
import ThankYouBanner from "../pages/Connect25/qrcode/ThankyouBanner";

const VoteNowBadge = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.authorise.userRole);
  const theme = useTheme();
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down("md"));

  const [nominationStatus, setNominationStatus] = useState({
    nomination: false,
    nomination_submitted: false,
    nomination_open: false,
    category_name: "",
    nomination_status: "",
    voting_status: "",
    voting_start_date: "",
    voting_end_date: "",
    student_count: 0,
    public_count: 0,
    leader_id: "",
    category_id: "",
    is_winner: false,
    winner_votes: 0,
    full_name: "",
    student_votes: 0,
    corporate_votes: 0,
    results_announced: false,
    voters_count: 0,
    corporate_voters_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasShownAutoBanner, setHasShownAutoBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false); // New state to track if banner was dismissed
  // Add these states alongside your existing ones
  const [showParticipationBanner, setShowParticipationBanner] = useState(false);
  const [participationBannerDismissed, setParticipationBannerDismissed] =
    useState(false);
  const [showParticipationModal, setShowParticipationModal] = useState(false); // For manual clicks

  // Fetch nomination status
  useEffect(() => {
    const fetchNominationStatus = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(
          `${BASE_URL}/internship/nomination/status`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setNominationStatus(response.data);

          // Auto-show banner only once when winner status is first detected
          if (
            response.data.is_winner &&
            !hasShownAutoBanner &&
            !bannerDismissed
          ) {
            setHasShownAutoBanner(true);
          }
        }
      } catch (error) {
        console.error("Error fetching nomination status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNominationStatus();
  }, []);

  // Fetch voting statistics and nomination details (for TPO and Leaders)
  const fetchVotingStats = async () => {
    setStatsLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");

      // Since the data is already available in nominationStatus from the same API,
      // we don't need to make additional API calls. Just simulate loading.
      setTimeout(() => {
        setStatsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching nomination data:", error);
      setStatsLoading(false);
    }
  };

  // Generate voting link
  const generateVotingLink = () => {
    const leaderId = nominationStatus.leader_id || "e3454-345";
    const categoryId = nominationStatus.category_id || "default-category";
    return `${"http://erp.eduskillsfoundation.org"}/e344rtyuty6/rt576/${leaderId}/${categoryId}`;
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateVotingLink());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleVoteNow = () => {
    if (userRole === "leaders") {
      navigate("/award/e3454-345");
    } else if (userRole === "tpo") {
      navigate("/tpoaward");
    } else {
      navigate("/award/e3454-345"); // Default navigation
    }
  };

  const handleSubmittedClick = () => {
    // Don't open modal if nomination is rejected
    if (nominationStatus.nominationstatus === "Nomination Rejected") {
      return;
    }

    // If winner, show winner modal
    if (nominationStatus.is_winner) {
      setShowWinnerModal(true);
      return;
    }

    // If results are announced but not winner, show participation banner
    if (
      // nominationStatus.results_announced &&
      !nominationStatus.is_winner
      // nominationStatus.nomination_submitted
    ) {
      setShowParticipationModal(true);
      return;
    }

    // Otherwise show stats modal (for TPO/Leaders)
    if (userRole === "tpo" || userRole === "leaders") {
      setModalOpen(true);
      fetchVotingStats();
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCloseWinnerModal = () => {
    setShowWinnerModal(false);
  };

  // Add this handler alongside your existing handlers
  const handleCloseParticipationModal = () => {
    setShowParticipationModal(false);
  };

  const handleCloseParticipationBanner = () => {
    setShowParticipationBanner(false);
    setParticipationBannerDismissed(true);
  };

  // Handle auto banner close
  const handleAutoWinnerBannerClose = () => {
    setHasShownAutoBanner(false);
    setBannerDismissed(true); // Mark that banner was dismissed by user
  };

  // Hide button if nomination is false
  if (loading || !nominationStatus.nomination) {
    return null;
  }

  // Determine if user has already submitted nomination
  const isSubmitted = nominationStatus.nomination_submitted;
  const isRejected =
    nominationStatus.nomination_status === "Nomination Rejected";
  const resultsAnnounced = nominationStatus.is_winner;

  // Determine button appearance based on status
  const getButtonConfig = () => {
    if (isRejected) {
      return {
        gradient:
          "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #f87171 100%)",
        icon: XCircle,
        text: "Nomination Rejected",
        shadow:
          "0 4px 15px rgba(239, 68, 68, 0.4), 0 2px 8px rgba(239, 68, 68, 0.2)",
        hoverGradient: null,
        hoverShadow: null,
      };
    } else if (resultsAnnounced && nominationStatus.iswinner) {
      return {
        gradient:
          "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
        icon: Crown,
        text: "Winner - Results Announced",
        shadow:
          "0 4px 15px rgba(255, 215, 0, 0.4), 0 2px 8px rgba(255, 215, 0, 0.2)",
        hoverGradient:
          "linear-gradient(135deg, #FFA500 0%, #FFD700 50%, #FF8C00 100%)",
        hoverShadow:
          "0 12px 30px rgba(255, 215, 0, 0.6), 0 6px 20px rgba(255, 215, 0, 0.3)",
      };
    } else if (!nominationStatus.is_winner) {
      // New case for non-winners when results are announced
      return {
        gradient:
          "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #a855f7 100%)",
        icon: Heart, // Import Heart from lucide-react
        text: "Thank You for Participating",
        shadow:
          "0 4px 15px rgba(139, 92, 246, 0.4), 0 2px 8px rgba(139, 92, 246, 0.2)",
        hoverGradient:
          "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #9333ea 100%)",
        hoverShadow:
          "0 12px 30px rgba(139, 92, 246, 0.6), 0 6px 20px rgba(139, 92, 246, 0.3)",
      };
    } else if (resultsAnnounced) {
      return {
        gradient:
          "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #8b5cf6 100%)",
        icon: Trophy,
        text: "Results Announced",
        shadow:
          "0 4px 15px rgba(99, 102, 241, 0.4), 0 2px 8px rgba(99, 102, 241, 0.2)",
        hoverGradient:
          "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)",
        hoverShadow:
          "0 12px 30px rgba(99, 102, 241, 0.6), 0 6px 20px rgba(99, 102, 241, 0.3)",
      };
    } else if (isSubmitted) {
      return {
        gradient:
          "linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #42A5F5 100%)",
        icon: CheckCircle,
        text:
          userRole === "tpo" || userRole === "leaders"
            ? "View Stats"
            : "Nomination Submitted",
        shadow:
          "0 4px 15px rgba(33, 150, 243, 0.4), 0 2px 8px rgba(33, 150, 243, 0.2)",
        hoverGradient:
          "linear-gradient(135deg, #1976D2 0%, #2196F3 50%, #1E88E5 100%)",
        hoverShadow:
          "0 12px 30px rgba(33, 150, 243, 0.6), 0 6px 20px rgba(33, 150, 243, 0.3)",
      };
    } else {
      return {
        gradient:
          "linear-gradient(135deg, #4CAF50 0%, #2E7D32 50%, #66BB6A 100%)",
        icon: Vote,
        text: "Click to Nominate",
        shadow:
          "0 4px 15px rgba(76, 175, 80, 0.4), 0 2px 8px rgba(76, 175, 80, 0.2)",
        hoverGradient:
          "linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #43A047 100%)",
        hoverShadow:
          "0 12px 30px rgba(76, 175, 80, 0.6), 0 6px 20px rgba(76, 175, 80, 0.3)",
      };
    }
  };

  const buttonConfig = getButtonConfig();
  const IconComponent = buttonConfig.icon;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mr: 2,
        }}
      >
        {/* Compact Category Name with Nomination Action */}
        {nominationStatus.category_name && (
          <Tooltip
            title={
              isRejected
                ? "Your nomination has been rejected"
                : resultsAnnounced
                ? "Click to view results"
                : isSubmitted
                ? userRole === "tpo" || userRole === "leaders"
                  ? "You have successfully submitted your Nomination! Click to view voting stats"
                  : "You have successfully submitted your Nomination!"
                : "Click to nominate yourself"
            }
            arrow
          >
            {isTabletOrSmaller ? (
              // Icon-only version for tablet and smaller
              <Box
                onClick={
                  isSubmitted || resultsAnnounced
                    ? handleSubmittedClick
                    : handleVoteNow
                }
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: buttonConfig.gradient,
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: buttonConfig.shadow,
                  cursor: isRejected ? "default" : "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation:
                    isSubmitted || isRejected || resultsAnnounced
                      ? "none"
                      : "pulse-glow-compact 4s ease-in-out infinite",
                  backdropFilter: "blur(10px)",
                  overflow: "hidden",

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-3px",
                    left: "-3px",
                    right: "-3px",
                    bottom: "-3px",
                    background: buttonConfig.gradient,
                    backgroundSize: "400% 400%",
                    borderRadius: "50%",
                    zIndex: -1,
                    animation:
                      isSubmitted || isRejected || resultsAnnounced
                        ? "none"
                        : "gradient-shift-compact 4s ease infinite",
                    opacity: 0.8,
                  },

                  "&:hover":
                    !isRejected && buttonConfig.hoverGradient
                      ? {
                          background: buttonConfig.hoverGradient,
                          transform: "translateY(-2px) scale(1.1)",
                          boxShadow: buttonConfig.hoverShadow,
                          animation: "none",
                        }
                      : {},

                  "&:active": !isRejected
                    ? {
                        transform: "translateY(-1px) scale(1.05)",
                        transition: "all 0.15s ease",
                      }
                    : {},
                }}
              >
                <IconComponent
                  size={20}
                  color="#FFFFFF"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                  }}
                />
              </Box>
            ) : (
              // Full version for larger screens
              <Box
                onClick={
                  isSubmitted || resultsAnnounced
                    ? handleSubmittedClick
                    : handleVoteNow
                }
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: buttonConfig.gradient,
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
                  boxShadow: buttonConfig.shadow,
                  cursor: isRejected ? "default" : "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  animation:
                    isSubmitted || isRejected || resultsAnnounced
                      ? "none"
                      : "pulse-glow-compact 4s ease-in-out infinite",
                  backdropFilter: "blur(10px)",
                  overflow: "hidden",
                  minWidth: "fit-content",

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-3px",
                    left: "-3px",
                    right: "-3px",
                    bottom: "-3px",
                    background: buttonConfig.gradient,
                    backgroundSize: "400% 400%",
                    borderRadius: "23px",
                    zIndex: -1,
                    animation:
                      isSubmitted || isRejected || resultsAnnounced
                        ? "none"
                        : "gradient-shift-compact 4s ease infinite",
                    opacity: 0.8,
                  },

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,255,255,0.2), transparent)",
                    animation:
                      isSubmitted || isRejected || resultsAnnounced
                        ? "none"
                        : "shimmer-compact 3s ease-in-out infinite",
                    zIndex: 1,
                  },

                  "&:hover":
                    !isRejected && buttonConfig.hoverGradient
                      ? {
                          background: buttonConfig.hoverGradient,
                          transform: "translateY(-2px) scale(1.05)",
                          boxShadow: buttonConfig.hoverShadow,
                          animation: "none",
                          "&::after": {
                            animation:
                              "shimmer-compact 1.5s ease-in-out infinite",
                          },
                        }
                      : {},

                  "&:active": !isRejected
                    ? {
                        transform: "translateY(-1px) scale(1.02)",
                        transition: "all 0.15s ease",
                      }
                    : {},
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    zIndex: 2,
                  }}
                >
                  <IconComponent
                    size={16}
                    color="#FFFFFF"
                    style={{
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                    }}
                  />
                  {!isSubmitted && !isRejected && !resultsAnnounced && (
                    <Sparkles
                      size={10}
                      color="#FFFFFF"
                      style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-4px",
                        animation: "sparkle-compact 3s ease-in-out infinite",
                        opacity: 0.7,
                      }}
                    />
                  )}
                </Box>

                {/* Category Name */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    fontFamily: "'Inter', 'Roboto', sans-serif",
                  }}
                >
                  {nominationStatus.category_name}
                </Box>

                {/* Status Text */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    fontSize: "0.7rem",
                    opacity: 0.9,
                    fontWeight: 500,
                    letterSpacing: "0.3px",
                  }}
                >
                  {buttonConfig.text}
                </Box>
              </Box>
            )}
          </Tooltip>
        )}
      </Box>

      {/* Winner Banner Modal - Auto-show when winner (only if not dismissed) */}
      {nominationStatus.is_winner &&
        hasShownAutoBanner &&
        !bannerDismissed &&
        !showWinnerModal && (
          <WinnerBanner
            name={nominationStatus.full_name || "Winner"}
            category={nominationStatus.category_name}
            votes={nominationStatus.winner_votes || 0}
            studentVotes={nominationStatus.student_votes || 0}
            corporateVotes={nominationStatus.corporate_votes || 0}
            onClose={handleAutoWinnerBannerClose}
          />
        )}

      {/* Manual Winner Modal - Show when clicked */}
      {showWinnerModal && (
        <WinnerBanner
          name={nominationStatus.full_name || "Winner"}
          category={nominationStatus.category_name}
          votes={nominationStatus.winner_votes || 0}
          studentVotes={nominationStatus.student_votes || 0}
          corporateVotes={nominationStatus.corporate_votes || 0}
          onClose={handleCloseWinnerModal}
        />
      )}

      {/* Auto Thank You Banner - Show for non-winners who participated when results announced */}
      {showParticipationBanner && (
        <ThankYouBanner
          name={nominationStatus.full_name || "Participant"}
          // category={nominationStatus.category_name}
          onClose={handleCloseParticipationBanner}
        />
      )}

      {/* Manual Thank You Banner - Show when badge is clicked */}
      {showParticipationModal && (
        <ThankYouBanner
          name={nominationStatus.full_name || "Participant"}
          // category={nominationStatus.category_name}
          onClose={handleCloseParticipationModal}
        />
      )}

      {/* Voting Statistics Modal - Only show if not rejected and not results announced */}
      {!isRejected && !resultsAnnounced && (
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Card
            sx={{
              minWidth: 400,
              maxWidth: 600,
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 15,
                right: 15,
                color: "#64748b",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                zIndex: 10,
                "&:hover": {
                  backgroundColor: "rgba(248, 250, 252, 0.9)",
                  color: "#475569",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <X size={18} />
            </IconButton>

            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    mb: 2,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: -2,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8)",
                      zIndex: -1,
                      opacity: 0.3,
                    },
                  }}
                >
                  <TrendingUp size={24} color="white" />
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    mb: 0.5,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Nomination Statistics
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {nominationStatus.category_name}
                </Typography>
              </Box>

              <Divider
                sx={{
                  mb: 3,
                  background:
                    "linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent)",
                }}
              />

              {/* Content */}
              {statsLoading ? (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading nomination details...
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* TWO COLUMN LAYOUT FOR STATISTICS */}
                  <Grid container spacing={2}>
                    {/* LEFT COLUMN */}
                    <Grid item xs={12} md={6}>
                      {/* NOMINATION STATUS */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                            mb: 1.5,
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          Nomination Status
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                            border: "1px solid rgba(99, 102, 241, 0.3)",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 35,
                              height: 35,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                              mr: 1.5,
                              boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
                            }}
                          >
                            <CheckCircle size={18} color="white" />
                          </Box>

                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: "#111827",
                                mb: 0.2,
                                fontSize: "0.95rem",
                                textTransform: "capitalize",
                              }}
                            >
                              {nominationStatus.nomination_status ||
                                "Not Available"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#6b7280",
                                fontSize: "0.75rem",
                              }}
                            >
                              Current status
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* VOTING STATUS - Show based on voting_status */}
                      {(nominationStatus.voting_status === "Started" ||
                        nominationStatus.voting_status === "Closed") &&
                        nominationStatus.nomination_status ===
                          "Nomination Accepted" && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#1f2937",
                                mb: 1.5,
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              Vote Count
                            </Typography>

                            {/* Student Votes */}
                            <Box
                              sx={{
                                textAlign: "center",
                                p: 2,
                                borderRadius: "10px",
                                background:
                                  "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                border: "1px solid rgba(14, 165, 233, 0.1)",
                                mb: 1.5,
                                position: "relative",
                                overflow: "hidden",
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: 2,
                                  background:
                                    "linear-gradient(90deg, #0ea5e9, #0284c7)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 30,
                                  height: 30,
                                  borderRadius: "8px",
                                  background:
                                    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                  mb: 1,
                                  boxShadow:
                                    "0 4px 10px rgba(14, 165, 233, 0.3)",
                                }}
                              >
                                <Users size={16} color="white" />
                              </Box>

                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 800,
                                  color: "#0c4a6e",
                                  mb: 0.2,
                                  fontSize: "1.8rem",
                                  lineHeight: 1,
                                }}
                              >
                                {nominationStatus.voters_count || 0}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#075985",
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                Student Votes
                              </Typography>
                            </Box>

                            {/* Public Votes - Show only for TPO */}
                            {userRole === "tpo" && (
                              <Box
                                sx={{
                                  textAlign: "center",
                                  p: 2,
                                  borderRadius: "10px",
                                  background:
                                    "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                                  border: "1px solid rgba(34, 197, 94, 0.1)",
                                  mb: 1.5,
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 2,
                                    background:
                                      "linear-gradient(90deg, #22c55e, #16a34a)",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 30,
                                    height: 30,
                                    borderRadius: "8px",
                                    background:
                                      "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                    mb: 1,
                                    boxShadow:
                                      "0 4px 10px rgba(34, 197, 94, 0.3)",
                                  }}
                                >
                                  <Eye size={16} color="white" />
                                </Box>

                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 800,
                                    color: "#14532d",
                                    mb: 0.2,
                                    fontSize: "1.8rem",
                                    lineHeight: 1,
                                  }}
                                >
                                  {nominationStatus.corporate_voters_count || 0}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#166534",
                                    fontWeight: 600,
                                    fontSize: "0.7rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3px",
                                  }}
                                >
                                  Corporate Votes
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                    </Grid>

                    {/* RIGHT COLUMN */}
                    <Grid item xs={12} md={6}>
                      {/* VOTING LINK SECTION - Only show for TPO */}
                      {(nominationStatus.voting_status === "Not Started" ||
                        nominationStatus.voting_status === "Started") &&
                        nominationStatus.nomination_status ===
                          "Nomination Accepted" &&
                        userRole === "tpo" && (
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#1f2937",
                                mb: 1.5,
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              Voting Link
                            </Typography>

                            <Box
                              sx={{
                                p: 2,
                                borderRadius: "10px",
                                background:
                                  "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                border: "1px solid rgba(14, 165, 233, 0.2)",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                    mr: 1.5,
                                    boxShadow:
                                      "0 4px 10px rgba(14, 165, 233, 0.3)",
                                  }}
                                >
                                  <LinkIcon size={16} color="white" />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#111827",
                                      mb: 0.2,
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    Share Link to the Corporates
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Link Display */}
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: "6px",
                                  background: "rgba(255, 255, 255, 0.8)",
                                  border: "1px solid rgba(14, 165, 233, 0.1)",
                                  mb: 1.5,
                                  fontFamily: "monospace",
                                  fontSize: "0.7rem",
                                  color: "#374151",
                                  wordBreak: "break-all",
                                }}
                              >
                                {generateVotingLink()}
                              </Box>

                              {/* Action Buttons */}
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <Tooltip
                                  title={copySuccess ? "Copied!" : "Copy Link"}
                                >
                                  <IconButton
                                    onClick={handleCopyLink}
                                    size="small"
                                    sx={{
                                      backgroundColor: copySuccess
                                        ? "rgba(34, 197, 94, 0.1)"
                                        : "rgba(14, 165, 233, 0.1)",
                                      color: copySuccess
                                        ? "#16a34a"
                                        : "#0ea5e9",
                                      border: `1px solid ${
                                        copySuccess
                                          ? "rgba(34, 197, 94, 0.2)"
                                          : "rgba(14, 165, 233, 0.2)"
                                      }`,
                                      "&:hover": {
                                        backgroundColor: copySuccess
                                          ? "rgba(34, 197, 94, 0.2)"
                                          : "rgba(14, 165, 233, 0.2)",
                                        transform: "scale(1.05)",
                                      },
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    {copySuccess ? (
                                      <CheckCircle size={16} />
                                    ) : (
                                      <Copy size={16} />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        )}

                      {/* VOTING DATES SECTION */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1f2937",
                            mb: 1.5,
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          Voting Dates
                        </Typography>

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                            border: "1px solid rgba(245, 158, 11, 0.2)",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {/* Start Date */}
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: "#92400e",
                                mb: 0.5,
                                fontSize: "0.8rem",
                              }}
                            >
                              Start Date
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#78350f",
                                fontSize: "0.75rem",
                              }}
                            >
                              {nominationStatus.voting_start_date || "TBA"}
                            </Typography>
                          </Box>

                          {/* End Date */}
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: "#92400e",
                                mb: 0.5,
                                fontSize: "0.8rem",
                              }}
                            >
                              End Date
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#78350f",
                                fontSize: "0.75rem",
                              }}
                            >
                              {nominationStatus.voting_end_date || "TBA"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Modal>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes gradient-shift-compact {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 0%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pulse-glow-compact {
            0% {
              box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4), 0 2px 8px rgba(76, 175, 80, 0.2);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 8px 25px rgba(76, 175, 80, 0.6), 0 4px 15px rgba(76, 175, 80, 0.3);
              transform: scale(1.02);
            }
            100% {
              box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4), 0 2px 8px rgba(76, 175, 80, 0.2);
              transform: scale(1);
            }
          }

          @keyframes shimmer-compact {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }

          @keyframes icon-bounce {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-2px) rotate(-1deg); }
            50% { transform: translateY(-1px) rotate(0deg); }
            75% { transform: translateY(-1px) rotate(1deg); }
          }

          @keyframes sparkle-compact {
            0%, 100% {
              opacity: 0;
              transform: scale(0.5) rotate(0deg);
            }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
          }
        `}
      </style>
    </>
  );
};

export default VoteNowBadge;
