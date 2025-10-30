import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const TalentConnectDashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Total Statistics Data
  const totalStatisticsData = [
    {
      name: "Posted",
      value: 28,
      color: "#e8f4f8",
      icon: (
        <DescriptionIcon
          fontSize="small"
          sx={{ color: theme.palette.info.main }}
        />
      ),
    },
    {
      name: "Openings",
      value: 45,
      color: "#fff8e1",
      icon: (
        <BusinessCenterIcon
          fontSize="small"
          sx={{ color: theme.palette.warning.main }}
        />
      ),
    },
    {
      name: "Eligible",
      value: 387,
      color: "#e8f5e9",
      icon: (
        <PersonIcon
          fontSize="small"
          sx={{ color: theme.palette.success.main }}
        />
      ),
    },
    {
      name: "Applied",
      value: 298,
      color: "#f3e5f5",
      icon: (
        <SearchIcon
          fontSize="small"
          sx={{ color: theme.palette.secondary.main }}
        />
      ),
    },
    {
      name: "Shortlisted",
      value: 56,
      color: "#e0f7fa",
      icon: (
        <CheckCircleIcon
          fontSize="small"
          sx={{ color: theme.palette.info.dark }}
        />
      ),
    },
  ];

  // Application Statistics Data
  const applicationData = [
    {
      name: "Eligible",
      value: 387,
      color: "#8884d8",
      icon: <PersonIcon fontSize="small" sx={{ color: "#8884d8" }} />,
    },
    {
      name: "Single Applied",
      value: 246,
      color: "#82ca9d",
      icon: <AssignmentIcon fontSize="small" sx={{ color: "#82ca9d" }} />,
    },
    {
      name: "Multi Applied",
      value: 118,
      color: "#ffc658",
      icon: <ListAltIcon fontSize="small" sx={{ color: "#ffc658" }} />,
    },
  ];

  // CGPA Based Result Statistics with updated labels
  const cgpaResultData = [
    { cgpa: "Above 7.0", count: 45, color: "#8884d8" },
    { cgpa: "Above 7.5", count: 72, color: "#82ca9d" },
    { cgpa: "Above 8.0", count: 94, color: "#ffc658" },
    { cgpa: "Above 8.5", count: 65, color: "#ff8042" },
    { cgpa: "Above 9.0", count: 24, color: "#0088fe" },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
        Talent Connect Dashboard
      </Typography>

      <Grid container spacing={2}>
        {/* Total Statistics */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "medium", mb: 1 }}
            >
              Total Statistics
            </Typography>
            <Grid container spacing={1}>
              {totalStatisticsData.map((item, index) => (
                <Grid item xs={6} sm={4} md={2.4} key={index}>
                  <Card sx={{ bgcolor: item.color, borderRadius: 1 }}>
                    <CardContent
                      sx={{
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        "&:last-child": { pb: 1 },
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="caption" color="text.secondary">
                          {item.name}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {item.value}
                        </Typography>
                      </Box>
                      {item.icon}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Application Statistics with Graph */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                Application Statistics
              </Typography>
              <Box sx={{ bgcolor: "#e3d0f5", borderRadius: "50%", p: 0.5 }}>
                <AssignmentIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.main }}
                />
              </Box>
            </Box>
            <Grid container spacing={1}>
              <Grid item xs={12} md={5}>
                {/* Small statistic cards with icons */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    height: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  {applicationData.map((item, index) => (
                    <Card
                      key={index}
                      sx={{ bgcolor: item.color + "20", borderRadius: 1 }}
                    >
                      <CardContent
                        sx={{
                          p: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          "&:last-child": { pb: 1 },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {item.icon}
                          <Typography variant="body2" color="text.secondary">
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: item.color }}
                        >
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                {/* Pie chart with proper sizing */}
                <Box
                  sx={{
                    height: isSmallScreen ? 200 : 180,
                    width: "100%",
                    mt: 1,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={applicationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={isSmallScreen ? 70 : 60}
                        innerRadius={isSmallScreen ? 40 : 30}
                        fill="#8884d8"
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {applicationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* CGPA Based Result Statistics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: 1, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                CGPA Based Result Statistics
              </Typography>
              <Box sx={{ bgcolor: "#e3f2fd", borderRadius: "50%", p: 0.5 }}>
                <SchoolIcon
                  fontSize="small"
                  sx={{ color: theme.palette.info.main }}
                />
              </Box>
            </Box>

            <Grid container spacing={1}>
              {/* CGPA Count Cards - Side by side with graph */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    height: "100%",
                  }}
                >
                  {cgpaResultData.map((item, index) => (
                    <Card
                      key={index}
                      sx={{
                        bgcolor: `${item.color}20`,
                        borderLeft: `3px solid ${item.color}`,
                        borderRadius: 1,
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          "&:last-child": { pb: 1 },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "medium" }}
                        >
                          {item.cgpa}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold", color: item.color }}
                        >
                          {item.count}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>

              {/* Bar Chart */}
              <Grid item xs={12} md={8}>
                <Box sx={{ height: isSmallScreen ? 200 : 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cgpaResultData}
                      margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
                      barSize={isSmallScreen ? 25 : 20}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="cgpa"
                        tick={{ fontSize: 9 }}
                        tickMargin={8}
                        axisLine={true}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        domain={[0, "dataMax + 15"]}
                        axisLine={true}
                      />
                      <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
                      <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: "top",
                          fill: "#666",
                          fontSize: 10,
                          formatter: (value) => `${value}`,
                        }}
                      >
                        {cgpaResultData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TalentConnectDashboard;
