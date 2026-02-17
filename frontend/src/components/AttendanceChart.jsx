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

export default function AttendanceChart({ range }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);

  // TOGGLE THIS TO FALSE IF BACKEND IS READY
  const USE_SAMPLE_DATA = true;

  useEffect(() => {
    setLoading(true);

    if (USE_SAMPLE_DATA) {
      loadSampleData();
    } else {
      fetch(`http://localhost:5000/api/attendance/${range}`)
        .then((res) => res.json())
        .then((data) => {
          buildChart(data);
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
          loadSampleData(); // fallback to sample if API fails
        });
    }
  }, [range]);

  // SAMPLE DATA
  const loadSampleData = () => {
    let sample;

    if (range === "daily") {
      sample = [
        { date: "Sun", visitors: 12 },
        { date: "Mon", visitors: 18 },
        { date: "Tue", visitors: 9 },
        { date: "Wed", visitors: 22 },
        { date: "Thu", visitors: 50 },
        { date: "Fri", visitors: 27 },
        { date: "Sat", visitors: 15 },
      ];
    } else {
      sample = [
        { date: "Week 1", visitors: 120 },
        { date: "Week 2", visitors: 150 },
        { date: "Week 3", visitors: 98 },
        { date: "Week 4", visitors: 175 },
      ];
    }

    buildChart(sample);
  };

  // Build Chart Data
  const buildChart = (data) => {
    setChartData({
      labels: data.map((item) => item.date),
      datasets: [
        {
          label:
            range === "daily"
              ? "Daily Visitors"
              : "Weekly Visitors",
          data: data.map((item) => item.visitors),
          borderColor: "#00FFC6",
          backgroundColor: "rgba(0, 255, 198, 0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });

    setLoading(false);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  if (loading) return <p className="text-gray-400">Loading chart...</p>;
  if (chartData.labels.length === 0)
    return <p className="text-gray-400">No attendance data available.</p>;

  return (
    <div className="h-[350px]">
      <Line data={chartData} options={options} />
    </div>
  );
}