import React, { useState } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  styled,
  ThemeProvider,
  createTheme,
  IconButton,
  alpha,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ResultStep from "./ResultStep";
import SimplifiedFilterStep from "./FilterStep";

// Create a modern blue theme
const blueTheme = createTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2027",
      secondary: "#637381",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 10px 0 rgba(0,0,0,0.08)",
          },
        },
      },
    },
  },
});

// Custom styled components for the stepper design
const StepperContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(2, 0),
}));

const StepNumber = styled(Box)(({ theme, active, completed }) => ({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(1),
  backgroundColor: active
    ? theme.palette.primary.main
    : completed
    ? theme.palette.primary.light
    : theme.palette.grey[300],
  color: active || completed ? "#fff" : theme.palette.text.secondary,
  fontSize: "0.75rem",
  fontWeight: "bold",
}));

const StepLabel = styled(Typography)(({ theme, active, completed }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  fontWeight: active || completed ? 600 : 400,
  color: active
    ? theme.palette.primary.main
    : completed
    ? theme.palette.text.secondary
    : theme.palette.text.primary,
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.1)
    : "transparent",
  fontSize: "0.875rem",
  borderBottom: active ? `2px solid ${theme.palette.primary.main}` : "none",
}));

const StepDivider = styled(Box)(({ theme, active, completed }) => ({
  display: "flex",
  alignItems: "center",
  margin: theme.spacing(0, 1),
  color: completed ? theme.palette.primary.main : theme.palette.text.secondary,
  fontWeight: "bold",
  fontSize: "1rem",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: "8px 20px",
  boxShadow: "0 2px 5px 0 rgba(0,0,0,0.08)",
  margin: theme.spacing(1),
  fontSize: "0.875rem",
  fontWeight: 500,
  "&:hover": {
    boxShadow: "0 4px 12px 0 rgba(0,0,0,0.12)",
  },
}));

// Define steps
const steps = ["Configure Filters", "Results"];

const CustomReportBuilder = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [reportName, setReportName] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const handleNext = () => {
    // Check if the form is valid before proceeding
    const hasAnyFilter = Object.values(filterCriteria).some(
      (filters) => filters && filters.length > 0
    );

    if (!reportName.trim() || !hasAnyFilter) {
      setShowValidationErrors(true);
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      // Go back to previous screen
      if (onBack) onBack();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SimplifiedFilterStep
            filterCriteria={filterCriteria}
            setFilterCriteria={setFilterCriteria}
            reportName={reportName}
            setReportName={setReportName}
            showValidationErrors={showValidationErrors}
          />
        );
      case 1:
        return (
          <ResultStep
            reportName={reportName}
            filterCriteria={filterCriteria}
            onBack={() => setActiveStep(0)}
          />
        );
      default:
        return "Unknown step";
    }
  };

  // Custom stepper with tab-like design and step numbers
  const renderStepper = () => {
    return (
      <StepperContainer>
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <StepNumber
                active={activeStep === index ? 1 : 0}
                completed={activeStep > index ? 1 : 0}
              >
                {index + 1}
              </StepNumber>
              <StepLabel
                active={activeStep === index ? 1 : 0}
                completed={activeStep > index ? 1 : 0}
              >
                {label}
              </StepLabel>
            </Box>

            {index < steps.length - 1 && (
              <StepDivider
                active={activeStep > index ? 1 : 0}
                completed={activeStep > index ? 1 : 0}
              >
                &gt;
              </StepDivider>
            )}
          </React.Fragment>
        ))}
      </StepperContainer>
    );
  };

  return (
    <ThemeProvider theme={blueTheme}>
      <Box sx={{ width: "100%" }}>
        {activeStep === 0 && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Create Bulk Report
            </Typography>
          </Box>
        )}

        {activeStep === 0 && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            {renderStepper()}
          </Paper>
        )}

        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            minHeight: 400,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Box>
            {getStepContent(activeStep)}
            {activeStep === 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  pt: 2,
                }}
              >
                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Generate Report
                </ActionButton>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default CustomReportBuilder;
