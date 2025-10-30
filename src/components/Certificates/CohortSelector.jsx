// CohortSelector.js
import React, { useEffect, useState } from "react";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Divider,
  Skeleton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Users } from "lucide-react";

const CohortSelector = ({
  selectedCohorts,
  onCohortChange,
  dashboardDataCounts,
  loading,
}) => {
  const [cohorts, setCohorts] = useState([]);

  // Extract cohort information from API data
  useEffect(() => {
    if (!dashboardDataCounts) return;

    // Extract unique cohort IDs from the data
    const cohortData = dashboardDataCounts || [];

    // Sort cohorts in descending order (latest first)
    const sortedCohorts = cohortData
      .map((cohort) => ({
        id: `cohort${cohort.cohort_id}`,
        label: `Cohort ${cohort.cohort_id}`,
        cohortId: cohort.cohort_id,
      }))
      .sort((a, b) => b.cohortId - a.cohortId);

    // ✅ Correct way to log
    console.log("---------cohort-", sortedCohorts[0]);
    // Or log the first cohort ID:
    // console.log("---------cohort-", sortedCohorts[0]?.cohortId);

    setCohorts(sortedCohorts);
  }, [dashboardDataCounts]);

  // Skeleton loading state for checkboxes
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Skeleton
            variant="rectangular"
            width={28}
            height={28}
            sx={{ borderRadius: 1, mr: 1.5 }}
          />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: "flex" }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", mr: 3 }}>
              <Skeleton
                variant="rectangular"
                width={24}
                height={24}
                sx={{ borderRadius: 0.5, mr: 1 }}
              />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        backgroundColor: "#ffffff",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <Box
          sx={{
            backgroundColor: "#8b5cf6",
            borderRadius: 1,
            p: 0.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            mr: 1.5,
          }}
        >
          <Users size={14} color="white" />
        </Box>
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ color: "#1a1a1a", fontSize: "0.95rem" }}
        >
          Filter by Cohort
        </Typography>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      <FormGroup row>
        <RadioGroup
          value={selectedCohorts[0] || ""} // selectedCohorts should be a string like "cohort13"
          onChange={(e) => onCohortChange(e.target.value, true)}
          sx={{ display: "flex", flexDirection: "row", gap: 1 }}
        >
          {cohorts.length > 0 ? (
            cohorts.map((cohort) => (
              <FormControlLabel
                key={cohort.id}
                value={cohort.id}
                control={
                  <Radio
                    sx={{
                      color: "#8b5cf6",
                      "&.Mui-checked": {
                        color: "#8b5cf6",
                      },
                    }}
                    size="small"
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    {cohort.label}
                  </Typography>
                }
                sx={{ mr: 2 }}
              />
            ))
          ) : (
            <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
              No cohorts available
            </Typography>
          )}
        </RadioGroup>
      </FormGroup>
    </Paper>
  );
};

export default CohortSelector;
