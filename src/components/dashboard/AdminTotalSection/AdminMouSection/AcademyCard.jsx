import {
  Box,
  Card,
  CircularProgress,
  Paper,
  // ToggleButton,
  // ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { tokens } from "../../../../theme";
// import CostomSearch from "../../../common/search/costomSearch";
// import { useSelector } from "react-redux";
// const stateCount = [];
const AcademySection = ({ data, viewType, loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Paper elevation={0} sx={{ p: 1, bgcolor: colors.blueAccent[800] }}>
        <Box
          sx={{
            mb: 0.4,
            mx: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: colors.blueAccent[300],
              fontWeight: 600,
              // minWidth: 200,
              flex: 1,
            }}
          >
            {viewType === 2 ? "Academy Name" : "State Name"}
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: colors.blueAccent[300],
              flex:0.7, textAlign: 'center'
            }}
          >
            Applied
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: colors.blueAccent[300],
              flex:0.7, textAlign: 'center'
            }}
          >
            Shortlisted
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: colors.blueAccent[300],
              flex:0.7, textAlign: 'center'
            }}
          >
            Certificate Verified
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: colors.blueAccent[300],
              flex:0.7, textAlign: 'center'
            }}
          >
           Assessment Completed
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: colors.blueAccent[300],
              flex:0.4, textAlign: 'right'
            }}
          >
           Certificate Issued
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ px: 1.5, py: 0.5 }}>
          <Box sx={{ overflow: "auto", height: 240, cursor: "pointer" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 230,
                }}
              >
                <CircularProgress size={60} color="info" />
              </Box>
            ) : (
              data?.map((academy, i) => (
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
                        fontSize: viewType === 2 ? 10 : 12,
                        // maxWidth: 170, // Adjust this value as needed
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        // minWidth:170,
                        flex: 1,

                      }}
                    >
                      {academy.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "500", fontSize: 12, flex:0.7, textAlign: 'center' }}
                    >
                      {academy.applied}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "500", fontSize: 12,flex:0.7, textAlign: 'center' }}
                    >
                      {academy.shortlist}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "500", fontSize: 12 ,flex:0.7, textAlign: 'center'}}
                    >
                      {academy.inprogress}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "500", fontSize: 12,flex:0.7, textAlign: 'center' }}
                    >
                      {academy.provisional}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "500", fontSize: 12,flex:0.4, textAlign: 'right' }}
                    >
                      {academy.completed}
                    </Typography>
                  </Box>
                </Card>
              ))
            )}
          </Box>
        </Paper>
      </Paper>
    </>
  );
};

export default AcademySection;
