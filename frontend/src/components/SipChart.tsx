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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Props {
  invested: number[];
  value: number[];
  labels: string[];
}

export default function SipChart({ invested, value, labels }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: "Invested Amount",
        data: invested,
        borderColor: "#2563eb",
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: "Final Value",
        data: value,
        borderColor: "#16a34a",
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
