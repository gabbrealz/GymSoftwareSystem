import { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function InventoryAnalytics() {
  const [data, setData] = useState(null);

  const USE_SAMPLE_DATA = true;

  useEffect(() => {
    if (USE_SAMPLE_DATA) {
      loadSample();
    } else {
      fetch("http://localhost:5000/api/products/analytics")
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error(err));
    }
  }, []);

  const loadSample = () => {
    setData({
      totalProducts: 7,
      lowStock: 2,
      totalValue: 58200,
      products: [
        { name: "Protein Powder", quantity: 25 },
        { name: "Pre-workout", quantity: 8 },
        { name: "Banana", quantity: 40 },
        { name: "Shaker Bottle", quantity: 15 },
        { name: "Pocari Sweat", quantity: 5 },
        { name: "Protein Bar", quantity: 30 },
        { name: "Gym Towel", quantity: 12 },
      ],
    });
  };

  if (!data) return <p className="text-gray-400">Loading inventory...</p>;

  const chartData = {
    labels: data.products.map(p => p.name),
    datasets: [
      {
        label: "Stock Quantity",
        data: data.products.map(p => p.quantity),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1f1f1f] p-5 rounded-lg shadow">
          <p className="text-gray-400 text-sm">Total Products</p>
          <h3 className="text-2xl font-bold">{data.totalProducts}</h3>
        </div>

        <div className="bg-[#1f1f1f] p-5 rounded-lg shadow">
          <p className="text-gray-400 text-sm">Low Stock Items</p>
          <h3 className="text-2xl font-bold text-red-400">
            {data.lowStock}
          </h3>
        </div>

        <div className="bg-[#1f1f1f] p-5 rounded-lg shadow">
          <p className="text-gray-400 text-sm">Total Inventory Value</p>
          <h3 className="text-2xl font-bold text-green-400">
            ₱{data.totalValue.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[#303030] p-6 rounded-[10px] shadow-lg border border-white/5 h-[350px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}