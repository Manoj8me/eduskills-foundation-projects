import React, { useState } from "react";
import { Box, Tabs, Tab, Container } from "@mui/material";
import IntakeData from "./IntakeData";
import InternshipAll from "./InternshipAll";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const LayoutInfo = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box
        sx={{
          width: "100%",
          borderBottom: "2px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.info.dark
              : theme.palette.info.light,
          mb: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "transparent",
          borderRadius: "4px 4px 0 0",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="layout information tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTabs-flexContainer": {
              borderBottom: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.info.dark
                  : theme.palette.info.light,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.info.main
                  : theme.palette.info.main,
              height: "3px",
              borderRadius: "2px",
            },
          }}
        >
          <Tab
            label="Intake Data"
            id="tab-0"
            aria-controls="tabpanel-0"
            sx={{
              textTransform: "uppercase",
              
              fontWeight: 500,
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "text.secondary",
              "&.Mui-selected": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.info.light
                    : theme.palette.info.main,
                fontWeight: 600,
              },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          />
          <Tab
            label="Student Info"
            id="tab-1"
            aria-controls="tabpanel-1"
            sx={{
              textTransform: "uppercase",
              fontWeight: 500,
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "text.secondary",
              "&.Mui-selected": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.info.light
                    : theme.palette.info.main,
                fontWeight: 600,
              },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <IntakeData />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <InternshipAll />
      </TabPanel>
    </Container>
  );
};

export default LayoutInfo;
