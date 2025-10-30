import { Box, Paper, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import CountCard from "../../../common/card/CountCard";
import { tokens } from "../../../../theme";
import { InternshipService } from "../../../../services/dataService";
// import { useSelector } from "react-redux";
// import DonutChart from "../../../common/app/DonutChart";

const CountCardSection = ({ total, loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeCohort, setActiveCohort] = React.useState(0);
  // const institute = useSelector((state) => state.adminDashboard.institute);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await InternshipService.cohort_list();
        // setCohortLists(response.data.cohort_list);
        setActiveCohort(response.data.cohort_active);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  const data = [
    {
      title: "Applied",
      count: total[0]?.applied,
      icon: "fluent:form-28-filled",
    },
    {
      title: "Shortlisted",
      count: total[0]?.shortlist,
      icon: "bxs:select-multiple",
    },
    {
      title: "Certificate Verified",
      count: total[0]?.inprogress,
      icon: "grommet-icons:in-progress",
    },
    {
      title: "Assessment Completed",
      count: total[0]?.provisional,
      icon: "carbon:in-progress",
    },
    {
      title: "Certificate Issued",
      count: total[0]?.completed,
      icon: "fluent-mdl2:completed-solid",
    },
  ];
  return (
    // <Paper elevation={0} sx={{ height: "100%", p: 1, bgcolor:'lightskyblue' }}>
    <Box
      // elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        height: "100%",
        m: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          color: colors.blueAccent[300],
          fontWeight: 600,
          mb: 1,
        }}
      >
        Cohort Summary
      </Typography>

      {/* <DonutChart data={institute} isLoading={false} isAdmin={false} /> */}
      <Paper
        elevation={0}
        sx={{ pt: 1, px: 1, bgcolor: colors.blueAccent[800] }}
      >
        <Typography
          sx={{
            fontSize: 12,
            color: colors.blueAccent[300],
            fontWeight: 600,
            mb: 0.9,
            textTransform: "uppercase",
          }}
        >
          Cohort - {activeCohort}
        </Typography>
        <CountCard
          data={loading ? [] : data}
          length={5}
          cardSize={{
            py: 0.8,
            px: 1,
            skeleton: { icon: 30, count: 18, title: 12 },
            // skeleton: { icon: 43, count: 25, title: 17.6 },
            // dataCard: { icon: 35, count: 20, title: 13 },
            dataCard: { icon: 23, count: 14, title: 9 },
          }}
          bgcolor={colors.blueAccent[900]}
          gridSize={{ xs: 12 }}
          spacing={1}
        />
      </Paper>
    </Box>
    // </Paper>
  );
};

export default CountCardSection;
