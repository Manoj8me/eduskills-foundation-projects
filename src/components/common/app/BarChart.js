import React from "react";
import ReactApexChart from "react-apexcharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export default function DynamicBarChart({ chartData, title, height }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength);
    }
    return str;
  };

  const options = {
    chart: {
      type: "bar",

      toolbar: {
        show: false, // This hides the download button
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: 8,
        colors: [colors.primary[100]], // Text color for data labels (if enabled)
      },
    },
    stroke: {
      show: true,
      // width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.map((item) => truncateString(item.title, 5)),
      labels: {
        style: {
          fontSize: 8,
          colors: colors.greenAccent[200], // Specify text colors for each category label
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val) {
          return val;
        },
      },
      style: {
        fontSize: "10px",
        whiteSpace: "nowrap", // Set white-space to nowrap
      },
      formatter: function (series, { seriesIndex, w }) {
        return `<strong>${truncateString(chartData[seriesIndex].title, 5)}:</strong> ${w.config.series[seriesIndex]}`;
      },
    },
    // toolbar: { show: false },
  };

  const series = [
    {
      data: chartData.map((item) => item.count),
    },
  ];

  return (
    <Card elevation={0}>
      <CardContent
        sx={{ pr: 0.5, pl: 0, mt: -1, pt: 0, mb: 1, height: height }}
      >
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={height}
        />
      </CardContent>
    </Card>
  );
}
