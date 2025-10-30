import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export default function AppBars({ chartData, chartOptions, title }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  var options = {
    series: [
      {
        name: "Applied",
        data: chartData?.Applied || [],
      },
      {
        name: "Approved",
        data: chartData?.Approved || [],
      },

      {
        name: "Certificate Verified",
        data: chartData?.Certificate_Verified || [],
      },

      {
        name: "Rejected",
        data: chartData?.Rejected || [],
      },

      {
        name: "Assessment Completed",
        data: chartData?.Assessment_Completed || [],
      },

      {
        name: "Internship Certificate Issued",
        data: chartData?.Internship_Certificate_Issued || [],
      },
    ],
    chart: {
      type: "bar",
      height: "100%",
      toolbar: {
        show: false, // This hides the download button
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "90%",
        endingShape: "rounded",
      },
    },
    labels: {
      colors: colors.primary[100], // Text color for labels on the x-axis and y-axis
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: [colors.primary[100]], // Text color for data labels (if enabled)
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData?.category || [],
      labels: {
        style: {
          colors: colors.greenAccent[200], // Specify text colors for each category label
        },
      },
    },
    yaxis: {
      title: {
        // text: title,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    legend: {
      position: "top",
      labels: {
        colors: colors.redAccent[200], // Set a color for the series names
      },
    },
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          p: 1,
          height: 200,
        }}
      >
        <CardHeader title={title} sx={{ my: -1.5 }} />
        <ReactApexChart
          options={options}
          series={options.series}
          type={options.chart.type}
          height={options.chart.height}
        />
      </Card>
    </>
  );
}
