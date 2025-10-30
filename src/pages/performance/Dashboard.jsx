import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Icon,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import Chart from "react-apexcharts";
import SearchableDropdownCard from "./SearchableDropdownCard";
import AcademicDetailsTable from "./AcademicDetailsTable";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [loading, setLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(300);

  const dummyData = {
    donut: {
      All: [25.33, 21.33, 14.67, 16, 22.67],
      2023: [20, 30, 15, 20, 15],
      2024: [30, 10, 20, 30, 10],
    },
    bar: {
      All: [89, 87.67, 87.33, 85.33, 82.33],
      2023: [85, 88, 90, 80, 82],
      2024: [88, 86, 84, 82, 80],
    },
    examination: {
      All: {
        pass: [250, 200, 220, 210, 230],
        fail: [30, 40, 50, 45, 55],
        notAttended: [10, 10, 30, 25, 15],
      },
      2023: {
        pass: [240, 210, 215, 220, 225],
        fail: [35, 45, 40, 40, 50],
        notAttended: [25, 15, 20, 15, 25],
      },
      2024: {
        pass: [260, 190, 225, 200, 235],
        fail: [25, 35, 55, 50, 60],
        notAttended: [15, 20, 30, 25, 15],
      },
    },
  };

  const updateChartData = () => {
    setDonutChartData((prevData) => ({
      ...prevData,
      series: dummyData.donut[selectedYear],
    }));

    setBarChartData((prevData) => ({
      ...prevData,
      series: [
        {
          data: dummyData.bar[selectedYear],
        },
      ],
    }));

    setExaminationResultsData((prevData) => ({
      ...prevData,
      series: [
        {
          name: "Pass",
          data: dummyData.examination[selectedYear].pass,
        },
        {
          name: "Fail",
          data: dummyData.examination[selectedYear].fail,
        },
        {
          name: "Not Attended",
          data: dummyData.examination[selectedYear].notAttended,
        },
      ],
    }));

    setLoading(true);
    setTimeout(() => {
      if (selectedYear === "All" && selectedGrade === "All") {
        setTotalStudents(300);
      } else if (selectedYear !== "All" && selectedGrade === "All") {
        setTotalStudents(100);
      } else if (selectedYear === "All" && selectedGrade !== "All") {
        setTotalStudents(150);
      } else {
        setTotalStudents(50);
      }
      setLoading(false);
    }, 1000);
  };

  const [donutChartData, setDonutChartData] = useState({
    series: dummyData.donut.All,
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [barChartData, setBarChartData] = useState({
    series: [
      {
        data: dummyData.bar.All,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["English", "Arts", "Maths", "Phys. Ed", "Science"],
      },
    },
  });

  const [examinationResultsData, setExaminationResultsData] = useState({
    series: [
      {
        name: "Pass",
        data: dummyData.examination.All.pass,
      },
      {
        name: "Fail",
        data: dummyData.examination.All.fail,
      },
      {
        name: "Not Attended",
        data: dummyData.examination.All.notAttended,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: "50%",
        },
      },
      xaxis: {
        categories: ["Phys. Ed", "Arts", "English", "Science", "Maths"],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      legend: {
        position: "top",
      },
      fill: {
        opacity: 1,
      },
    },
  });

  const years = ["All", "2023", "2024"];
  const grades = ["All", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
  };

  useEffect(() => {
    updateChartData();
  }, [selectedYear, selectedGrade]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
        minHeight: "100vh",
        padding: "10px 15px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent style={{ padding: "10px 15px" }}>
              <Grid container alignItems="center">
                <Grid item>
                  <SchoolIcon style={{ fontSize: 40, marginRight: 10 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h6" component="div">
                    Students
                  </Typography>
                </Grid>
              </Grid>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant="h4" component="div">
                  {totalStudents}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent style={{ padding: "10px 15px" }}>
              <SearchableDropdownCard
                label="Select Year"
                options={years}
                value={selectedYear}
                onChange={handleYearChange}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent style={{ padding: "10px 15px" }}>
              <SearchableDropdownCard
                label="Select Grade"
                options={grades}
                value={selectedGrade}
                onChange={handleGradeChange}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card style={{ height: "100%" }}>
            <CardContent style={{ padding: "10px 15px" }}>
              <Typography variant="subtitle1" component="div">
                Students by Grade and Gender
              </Typography>
              {loading ? (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ minHeight: "200px" }}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                <Chart
                  options={donutChartData.options}
                  series={donutChartData.series}
                  type="donut"
                  width="100%"
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card style={{ height: "100%" }}>
            <CardContent style={{ padding: "10px 15px" }}>
              <Typography variant="subtitle1" component="div">
                Student Participation Rate by Branch
              </Typography>
              {loading ? (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ minHeight: "200px" }}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                <Chart
                  options={barChartData.options}
                  series={barChartData.series}
                  type="bar"
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent style={{ padding: "10px 15px" }}>
              <Typography variant="subtitle1" component="div">
                Examination Results by Branch
              </Typography>
              {loading ? (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  style={{ minHeight: "200px" }}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                <Chart
                  options={examinationResultsData.options}
                  series={examinationResultsData.series}
                  type="bar"
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              style={{ minHeight: "200px" }}
            >
              <CircularProgress />
            </Grid>
          ) : (
            <AcademicDetailsTable />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
