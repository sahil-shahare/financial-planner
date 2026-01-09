import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function MonteCarloChart({ p5, p50, p95, labels }: {
  p5: number[];
  p50: number[];
  p95: number[];
  labels: string[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Worst Case (5%)",
        data: p5,
        borderColor: "#dc2626",
        borderWidth: 1.5,
        fill: false,
        tension: 0.3,
      },
      {
        label: "Median (50%)",
        data: p50,
        borderColor: "#1d4ed8",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
      },
      {
        label: "Best Case (95%)",
        data: p95,
        borderColor: "#16a34a",
        borderWidth: 1.5,
        fill: "+1",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.3,
      },
      {
        label: "5-95% Band",
        data: p5,
        fill: "origin",
        backgroundColor: "rgba(220,38,38,0.15)",
        borderWidth: 0,
        pointRadius: 0,
      }
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <Line data={data} />
    </div>
  );
}
