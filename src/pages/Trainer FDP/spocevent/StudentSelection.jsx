import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import StudentTable from "./StudentSelectionModal";

const StudentSelection = ({
  selectedBooking,
  onBackToCalendar,
  onStudentsAdded,
  showNotification,
}) => {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3} mt={2}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBackToCalendar}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Back to Calendar
        </Button>
        <Typography variant="h4">Add Students to Event</Typography>
      </Box>

      <StudentTable
        selectedBooking={selectedBooking}
        onAddStudents={onStudentsAdded}
        onNotification={showNotification}
      />
    </Box>
  );
};

export default StudentSelection;
