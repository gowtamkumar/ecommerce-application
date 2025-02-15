"use client";
import React from "react";
import { Card } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  height: 100,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const RevenueExpenseChart = () => {
  // const ui = useSelector(selectUI)
  const theme = "light-bg";
  const text = "text-dark";

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2],
        borderColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card
      className={`${theme} border-0`}
      title={<span className={text}>Revenue, Expense Chart</span>}
      size="small"
    >
      <div className="px-5 pt-3">
        <Pie options={options} data={data} />
      </div>
    </Card>
  );
};

export default RevenueExpenseChart;
