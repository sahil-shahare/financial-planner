import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  values: number[];
  labels: string[];
}

export default function InflationChart({ values, labels }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Expense (Inflation Adjusted)",
        data: values,
        borderColor: "#3b82f6",
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
