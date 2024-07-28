"use client";
import React from "react";
import { Card } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  height: 100,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sept",
  "Octobar",
];

const SalePurchaseChart = () => {
  const theme = "light-bg";
  const text = "text-dark";

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
      },
    ],
  };

  return (
    <Card
      className={`${theme} ${text} border-0`}
      title={<span className={text}>Sales & Purchases report</span>}
      size="small"
    >
      <Bar data={data} options={options} />
    </Card>
  );
};

export default SalePurchaseChart;
