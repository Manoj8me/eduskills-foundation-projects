import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const IdleDetector = ({ idleTimeout = 600000, children }) => {
  // 600000ms = 10 minutes
  const [dialogOpen, setDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use refs to prevent issues with stale closures
  const idleTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isDialogOpenRef = useRef(false);
  const systemSleepCheckRef = useRef(null);

  // Update ref when state changes
  useEffect(() => {
    isDialogOpenRef.current = dialogOpen;
  }, [dialogOpen]);

  // Add debug logging option
  const isDebugMode = false; // Set to true to enable debug logs

  const logDebug = (message) => {
    if (isDebugMode) {
      console.log(
        `[IdleDetector] ${new Date().toLocaleTimeString()} - ${message}`
      );
    }
  };

  const resetIdleTimer = (eventType = "unknown") => {
    const now = Date.now();
    lastActivityRef.current = now;
    logDebug(`Activity detected (${eventType}) - Timer reset`);

    // Clear any existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    // Only set a new timer if the dialog is not open
    if (!isDialogOpenRef.current) {
      idleTimerRef.current = setTimeout(() => {
        checkAndShowIdleDialog();
      }, idleTimeout);

      logDebug(`New idle timer set for ${idleTimeout}ms`);
    }
  };

  const checkAndShowIdleDialog = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    logDebug(
      `Checking idle status: ${timeSinceLastActivity}ms since last activity`
    );

    // Check for system sleep/suspend (if more than 2x the idle timeout has passed, likely system was suspended)
    const maxReasonableGap = idleTimeout * 2;
    if (timeSinceLastActivity > maxReasonableGap) {
      logDebug(
        `Detected potential system sleep (gap: ${timeSinceLastActivity}ms). Resetting timer instead of showing dialog.`
      );
      // Reset the activity time and restart the timer
      lastActivityRef.current = now;
      resetIdleTimer("system-wake");
      return;
    }

    // Only show dialog if truly idle and dialog not already open
    if (timeSinceLastActivity >= idleTimeout && !isDialogOpenRef.current) {
      logDebug(`Showing idle dialog - idle for ${timeSinceLastActivity}ms`);
      setDialogOpen(true);
      startCountdown();
    } else if (timeSinceLastActivity < idleTimeout) {
      logDebug(`User became active before timeout - restarting timer`);
      // User became active, restart the timer
      resetIdleTimer("late-activity");
    }
  };

  const startCountdown = () => {
    logDebug("Starting countdown");
    setCountdown(60);

    // Clear any existing countdown
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prevCount) => {
        logDebug(`Countdown: ${prevCount - 1}`);
        if (prevCount <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          handleLogout();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleContinue = () => {
    logDebug("User clicked continue");

    // Clear countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Close dialog and update activity time
    setDialogOpen(false);
    lastActivityRef.current = Date.now();

    // Reset the idle timer after a brief delay to ensure dialog is fully closed
    setTimeout(() => {
      if (!isDialogOpenRef.current) {
        resetIdleTimer("continue-session");
      }
    }, 100);
  };

  const handleLogout = () => {
    logDebug("Logging out user");

    // Clear all timers
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (systemSleepCheckRef.current) {
      clearInterval(systemSleepCheckRef.current);
      systemSleepCheckRef.current = null;
    }

    // Close dialog
    setDialogOpen(false);

    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("Authorise");

    // Navigate to login page
    navigate("/login");
  };

  // System sleep detection function
  const checkForSystemSleep = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // If more than 2x the idle timeout has passed without any registered activity,
    // and we're not showing the dialog, it's likely the system was sleeping
    if (timeSinceLastActivity > idleTimeout * 2 && !isDialogOpenRef.current) {
      logDebug(`Detected system sleep/suspend. Resetting activity time.`);
      lastActivityRef.current = now;
      resetIdleTimer("system-sleep-recovery");
    }
  };

  useEffect(() => {
    logDebug("Setting up idle detector");

    // Set up event listeners for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
      "click",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mouseenter",
      "focus",
      "resize",
    ];

    // Create the actual handler function
    const activityHandler = (event) => {
      resetIdleTimer(event.type);
    };

    // Special visibility handler for tab switching
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        logDebug("Tab became visible");
        // Check if system might have been sleeping
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;

        if (timeSinceLastActivity > idleTimeout * 1.5) {
          logDebug("Long gap detected on tab focus - likely system sleep");
          lastActivityRef.current = now;
        }

        resetIdleTimer("visibilitychange");
      } else {
        logDebug("Tab became hidden");
      }
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    // Add visibility change listener
    document.addEventListener("visibilitychange", visibilityHandler, {
      passive: true,
    });

    // Add event listeners at window level as well for better detection
    const windowEvents = ["scroll", "resize", "focus", "blur"];
    windowEvents.forEach((event) => {
      window.addEventListener(event, activityHandler, { passive: true });
    });

    // Initialize the idle timer
    resetIdleTimer("initial");

    // Set up periodic system sleep check (every 30 seconds)
    systemSleepCheckRef.current = setInterval(checkForSystemSleep, 30000);

    // Cleanup function
    return () => {
      logDebug("Cleaning up idle detector");

      events.forEach((event) => {
        document.removeEventListener(event, activityHandler);
      });

      document.removeEventListener("visibilitychange", visibilityHandler);

      windowEvents.forEach((event) => {
        window.removeEventListener(event, activityHandler);
      });

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }

      if (systemSleepCheckRef.current) {
        clearInterval(systemSleepCheckRef.current);
        systemSleepCheckRef.current = null;
      }
    };
  }, []); // Empty dependency array to ensure this only runs once

  // Simple, minimal styling
  const modalStyles = {
    dialog: {
      "& .MuiPaper-root": {
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "380px",
        width: "100%",
      },
    },
    content: {
      padding: "24px 24px 16px",
      "& .MuiDialogContentText-root": {
        color: "#333333",
        fontSize: "0.95rem",
        margin: 0,
      },
    },
    actions: {
      padding: "8px 16px 16px",
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
    },
    logoutButton: {
      color: "#F44336",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "rgba(244, 67, 54, 0.04)",
      },
    },
    continueButton: {
      backgroundColor: "#1976D2",
      color: "#FFFFFF",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "#1565C0",
      },
    },
    countdownText: {
      color: "#F44336",
      fontWeight: 400,
      fontSize: "0.9rem",
      marginTop: "16px",
      display: "block",
    },
  };

  return (
    <>
      {children}

      <Dialog
        open={dialogOpen}
        aria-labelledby="idle-dialog-description"
        sx={modalStyles.dialog}
        onClose={(event, reason) => {
          // Prevent closing dialog by clicking outside or pressing escape
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setDialogOpen(false);
          }
        }}
        disableEscapeKeyDown
      >
        <DialogContent sx={modalStyles.content}>
          <DialogContentText id="idle-dialog-description">
            Your session has been inactive for {Math.floor(idleTimeout / 60000)}{" "}
            minutes. Would you like to continue?
            <Typography sx={modalStyles.countdownText}>
              Auto-logout in {countdown} seconds
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={modalStyles.actions}>
          <Button onClick={handleLogout} sx={modalStyles.logoutButton}>
            Logout
          </Button>
          <Button
            onClick={handleContinue}
            sx={modalStyles.continueButton}
            variant="contained"
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IdleDetector;
