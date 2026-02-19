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

export default function AttendanceChart({ logs, range, month }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

    useEffect(() => {
    if (!logs || logs.length === 0 || !month) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    // 🔥 FILTER VALID LOGS FIRST
    const filteredLogs = logs.filter((log) => {
      if (!log.timestamp) return false;

      const logDate = new Date(log.timestamp);
      if (isNaN(logDate)) return false;

      const logMonth = logDate.toISOString().slice(0, 7);
      return logMonth === month;
    });

    if (filteredLogs.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const grouped = {};

    filteredLogs.forEach((log) => {
      const dateObj = new Date(log.timestamp);

      if (range === "daily") {
        const key = dateObj.toISOString().split("T")[0];
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
      if (range === "daily") {
        return new Date(a[0]) - new Date(b[0]);
      } else {
        const year = month.split("-")[0];
        return (
          new Date(a[0].split(" - ")[0] + ` ${year}`) -
          new Date(b[0].split(" - ")[0] + ` ${year}`)
        );
      }
    });

    const labels = sortedEntries.map((entry) => entry[0]);
    const values = sortedEntries.map((entry) => entry[1]);

    setChartData({
      labels,
      datasets: [
        {
          label: range === "daily" ? "Daily Visitors" : "Weekly Visitors",
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
  }, [logs, range, month]);

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
      <div className="flex items-center justify-center h-full text-gray-400">
        No attendance data available for the selected month.
      </div>
    )
  }

  return (
    <div className="h-[350px]">
      <Line data={chartData} options={options} />
    </div>
  );
}