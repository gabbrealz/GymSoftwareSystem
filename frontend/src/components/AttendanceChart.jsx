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

    const filteredLogs = logs.filter((log) => {
      if (!log.timestamp) return false;

      const logDate = new Date(log.timestamp);
      if (isNaN(logDate)) return false;

      const localYear = logDate.getFullYear();
      const localMonth = String(logDate.getMonth() + 1).padStart(2, "0");
      const logMonthString = `${localYear}-${localMonth}`;

      return logMonthString === month;
    });

    if (filteredLogs.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const grouped = {};

    filteredLogs.forEach((log) => {
      const dateObj = new Date(log.timestamp);
      let key = "";
      let displayLabel = "";

      if (range === "daily") {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        
        key = `${y}-${m}-${d}`;
        
        displayLabel = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

      } else {
        const startOfWeek = new Date(dateObj);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(dateObj.getDate() - dateObj.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const y = startOfWeek.getFullYear();
        const m = String(startOfWeek.getMonth() + 1).padStart(2, "0");
        const d = String(startOfWeek.getDate()).padStart(2, "0");
        
        key = `${y}-${m}-${d}`;

        const format = (date) =>
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

        displayLabel = `${format(startOfWeek)} - ${format(endOfWeek)}`;
      }

      if (!grouped[key]) {
        grouped[key] = { count: 0, label: displayLabel };
      }
      grouped[key].count += 1;
    });

    const sortedEntries = Object.entries(grouped).sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });

    const labels = sortedEntries.map((entry) => entry[1].label);
    const values = sortedEntries.map((entry) => entry[1].count);

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
    );
  }

  return (
    <div className="h-[350px]">
      <Line data={chartData} options={options} />
    </div>
  );
}