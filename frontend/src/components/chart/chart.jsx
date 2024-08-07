import React from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponenet = ({ data }) => {
  const chartData = {
    labels: data.map((_, index) => index + 1),
    datasets: [
      {
        label: "Speed (WPM)",
        data: data,
        fill: false,
        borderColor: "rgb(255, 255, 255,0.6)",
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Word Index",
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Speed (WPM)",
        },
      },
    },
  };

  const chartRef = React.createRef();

  return <Line ref={chartRef} data={chartData} options={options} />;
};

export default ChartComponenet;
