import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Dialog,
  Slide,
  IconButton,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import OnboardingForm from "./OnboardingForm";
import OnboardingTable from "./OnboardingTable";
import { BASE_URL } from "../../services/configUrls";

// Transition component for smooth slide-up animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OnboardingManagement = () => {
  const [openForm, setOpenForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statesInstitutes, setStatesInstitutes] = useState([]);

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
    fetchStatesInstitutes();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/staff/activities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatesInstitutes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/staff/states-institutes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch states and institutes");
      }

      const data = await response.json();
      setStatesInstitutes(data);
    } catch (error) {
      console.error("Error fetching states and institutes:", error);
    }
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleAddActivity = async (formData) => {
    try {
      const payload = {
        start_date: formData.startDate || "",
        end_date: formData.endDate || null,
        state_id: formData.stateId,
        institute_id: formData.instituteId,
        mode_of_meeting: formData.modeOfMeeting,
        current_status: formData.currentStatus,
        summary: formData.summaryText,
        institute_attendees: formData.instituteAttendees,
        own_attendees: formData.ownAttendees,
        contact_persons: formData.contactPersons.map((person) => ({
          name: person.name,
          email: person.email,
          designation: person.designation,
          phone: person.phone,
          whatsapp: person.whatsapp || null,
          is_whatsapp_same_as_phone: person.sameAsPhone,
        })),
        status_history: [
          {
            status: formData.currentStatus,
            status_date:
              formData.startDate || new Date().toISOString().split("T")[0],
            description: formData.statusDescription,
          },
        ],
      };

      const response = await fetch(`${BASE_URL}/staff/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save activity");
      }

      const result = await response.json();

      // Refresh the activities list after successful submission
      await fetchActivities();

      handleCloseForm();

      return { success: true, message: "Activity saved successfully!" };
    } catch (error) {
      console.error("Error saving activity:", error);
      return {
        success: false,
        message: error.message || "Failed to save activity",
      };
    }
  };

  const handleUpdateActivity = async (activityId, updateData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/staff/activities/${activityId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Refresh the activities list after successful update
        await fetchActivities();
        return {
          success: true,
          message: data?.message || "Status updated successfully",
        };
      } else {
        return {
          success: false,
          message: data?.detail || "Failed to update status",
        };
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      return { success: false, message: "Failed to update status" };
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <Paper
        sx={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Header with Add New Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#1F2937",
                fontWeight: 600,
                mb: 0.5,
                fontSize: "1.5rem",
              }}
            >
              Onboarding Activities
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6B7280", fontSize: "0.875rem" }}
            >
              Manage all your onboarding activities
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: "1.2rem" }} />}
            onClick={handleOpenForm}
            sx={{
              backgroundColor: "#2196F3",
              "&:hover": {
                backgroundColor: "#1976D2",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.4)",
              },
              textTransform: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontSize: "0.875rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            Add New
          </Button>
        </Box>

        {/* Table Content */}
        <Box sx={{ p: 2 }}>
          <OnboardingTable
            activities={activities}
            loading={loading}
            onUpdate={handleUpdateActivity}
          />
        </Box>
      </Paper>

      {/* Form Dialog with Smooth Animation */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            m: 2,
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        {/* Dialog Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2.5,
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F8FAFC",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#1F2937",
              fontWeight: 600,
              fontSize: "1.125rem",
            }}
          >
            Add New Onboarding Activity
          </Typography>
          <IconButton
            onClick={handleCloseForm}
            size="small"
            sx={{
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "#E5E7EB",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Dialog Content */}
        <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <OnboardingForm
            onSubmit={handleAddActivity}
            statesInstitutes={statesInstitutes}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default OnboardingManagement;
