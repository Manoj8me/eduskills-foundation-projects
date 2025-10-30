import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import Chart from "react-apexcharts";

const MultiYAxisChart = () => {
  const options = {
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: "Multiple Y-Axis Chart",
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: [
      "01 Jan",
      "02 Jan",
      "03 Jan",
      "04 Jan",
      "05 Jan",
      "06 Jan",
      "07 Jan",
    ],
    xaxis: {
      type: "datetime",
    },
    yaxis: [
      {
        title: {
          text: "Series A",
        },
      },
      {
        opposite: true,
        title: {
          text: "Series B",
        },
      },
    ],
  };

  const series = [
    {
      name: "Series A",
      type: "column",
      data: [23, 11, 45, 56, 33, 44, 21],
    },
    {
      name: "Series B",
      type: "line",
      data: [30, 20, 50, 40, 60, 70, 80],
    },
  ];

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", my: 2 }}>
      <CardHeader title="Multiple Y-Axis Chart" />
      <CardContent>
        <Chart options={options} series={series} type="line" height={250} />
      </CardContent>
    </Card>
  );
};

export default MultiYAxisChart;
