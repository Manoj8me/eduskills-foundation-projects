import {
  Box,
  Card,
  Divider,
  Paper,
  // ToggleButton,
  // ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { tokens } from "../../../theme";
// import CostomSearch from "../../../common/search/costomSearch";
import { useSelector } from "react-redux";
// const stateCount = [];
const HiringDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const corporateList = useSelector(
    (state) => state.adminDashboard.corporate_list
  );

  const updateAcademyList = corporateList?.map((academy, i) => ({
    company_name: `Abc Company ${i}`,
    company_id: i,
    job_title: `Title ${i}`,
    status: i % 2 === 0 ? "Active" : "Inactive",
  }));

  return (
    <>
      <Paper elevation={0} sx={{ px: 1.5, py: 0.5 }}>
        <Box sx={{ overflow: "auto", height: 175, cursor: "pointer" }}>
          {updateAcademyList?.map((academy, i) => (
            <Card
              key={i}
              sx={{
                px: 1,
                py: 0.2,
                my: 1,
                bgcolor: colors.blueAccent[800],
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    maxWidth: "25ch", // Adjust this value as needed
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 70,
                  }}
                >
                  {academy.company_name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "500", minWidth: 50, fontSize: 10 }}
                >
                  {academy.job_title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "500",
                    fontSize: 8,
                    bgcolor:
                      academy.status === "Active"
                        ? colors.greenAccent[800]
                        : colors.redAccent[800],
                    px: 0.5,
                    py: 0.1,
                    borderRadius: 1,
                  }}
                >
                  {academy.status}
                </Typography>
              </Box>
              <Divider />
              <Typography
                variant="h6"
                sx={{ fontWeight: "500", fontSize: 10, height: 50 }}
              >
                description...........................
              </Typography>
            </Card>
          ))}
        </Box>
      </Paper>
    </>
  );
};

export default HiringDetails;
