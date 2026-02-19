import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { fill } from "three/src/extras/TextureUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AttendanceChart({ logs, range }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!logs || logs.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const grouped = {};

    logs.forEach((log) => {
      const dateObj = new Date(log.timestamp);

      if (range === "daily") {
        const key = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
        grouped[key] = (grouped[key] || 0) + 1;
      } else {

        const startOfWeek = new Date(dateObj);
        startOfWeek.setDate(dateObj.getDate() - dateObj.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const format = (date) =>
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

        const key = `${format(startOfWeek)} - ${format(endOfWeek)}`;

        grouped[key] = (grouped[key] || 0) + 1;
      }
    });

    const sortedEntries = Object.entries(grouped).sort((a, b) => {
      const getStartDate = (label) => {
        if (range === "daily") return new Date(label);
        return new Date(label.split(" - ")[0] + " 2026");
      };
      return getStartDate(a[0]) - getStartDate(b[0]);
    });

    const labels = sortedEntries.map((entry) => entry[0]);
    const values = sortedEntries.map((entry) => entry[1]);

    setChartData({
      labels,
      datasets: [
        {
          label:
            range === "daily"
              ? "Daily Visitors"
              : "Weekly Visitors",
          data: values,
          borderColor: "#00FFC6",
          backgroundColor: "rgba(0, 255, 198, 0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    });
  }, [logs, range]);

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: { stepSize: 1, color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          color: "#ccc",
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  if (chartData.labels.length === 0) {
    return (
      <p className="text-gray-400">
        No attendance data available for the selected range.
      </p>
    );
  }

  return (
    <div className="h-[350px]">
      <Line data={chartData} options={options} />
    </div>
  );
}