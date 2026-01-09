import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function CorpusChart({ values, labels }: {
  values: number[];
  labels: string[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Retirement Corpus (₹)",
        data: values,
        borderColor: "#ef4444",
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <Line data={data} />
    </div>
  );
}
