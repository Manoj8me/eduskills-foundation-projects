import React, { useState } from "react";
import CustomAccordion from "./CustomAccordion";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export default function StudentAccordions({ data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [expandedPanel, setExpandedPanel] = useState(null);

  const handleAccordionToggle = (panelId, isExpanded) => {
    setExpandedPanel(isExpanded ? panelId : null);
  };

  const formatKey = (key) => {
    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
    return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
  };

  return (
    <div>
      {data?.map((item) => (
        <CustomAccordion
          key={item?.cohort}
          panelId={item?.cohort}
          heading={item?.cohort}
          secondaryText={item?.domain_name}
          isOpen={expandedPanel === item?.cohort}
          onToggle={handleAccordionToggle}
          bgColor={
            item?.status === "Completed"
              ? colors.greenAccent[800]
              : colors.redAccent[800]
          }
        >
          <Paper
            elevation={0}
            sx={{ py: 1, px: 2, bgcolor: colors.blueAccent[900] }}
          >
            <Typography variant="subtitle2">
              {Object.entries(item)
                .filter(([key]) => key !== "cohort" && key !== "domain_name")
                .map(([key, value]) => (
                  <Box
                    key={key}
                    component="div"
                    sx={{ my: 0.8, display: "flex", alignItems: "center" }}
                  >
                    <Box component="span" sx={{ width: "15%", flexShrink: 0 }}>
                      <Box
                        fontWeight="bold"
                        component="span"
                        sx={{
                          // bgcolor: value === "Yes" || value ==="Completed"? colors.greenAccent[700] :value === "No" || value ==="Not Upload"? colors.redAccent[700] :colors.blueAccent[600],
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                        }}
                      >
                        {formatKey(key)}
                      </Box>
                    </Box>

                    <Box sx={{ width: "85%" }}>: {value}</Box>
                  </Box>
                ))}
            </Typography>
          </Paper>
        </CustomAccordion>
      ))}
    </div>
  );
}
