import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export default function DonutChart({ data, isLoading, isAdmin }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const covertData = data?.map(item => ({
    name: item.title,
    value: item.count
  }));

  const options = {
    series: covertData?.map((item) => item.value),
    labels: covertData?.map((item) => item.name),
    chart: {
      type: "donut",
      height: isAdmin ? 135 : 200,  // Reduced height
      animations: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: "45%",  // Adjusted donut hole size
        },
        customScale: 0.9  // Slightly reduced scale
      },
    },
    stroke: {
      show: true,
      colors: [colors.primary[400]],
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: "11px",  // Smaller font size for legend
      offsetY: isAdmin ? 5 : 0,
      markers: {
        width: 8,  // Smaller legend markers
        height: 8,
      },
    },
  };

  return (
    <Card
      elevation={isLoading ? 4 : 0}
      sx={{
        bgcolor: isLoading ? colors.blueAccent[800] : colors.primary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        minHeight: isAdmin ? "150px" : "220px",  // Reduced minimum height
        p: 1,  // Added small padding
      }}
    >
      <ReactApexChart
        options={options}
        series={options.series}
        type={options.chart.type}
        height={options.chart.height}
      />
    </Card>
  );
}