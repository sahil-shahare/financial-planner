import { useState } from "react";
import SipChart from "../components/SipChart";
import { api } from "../api/api";

export default function SipPage() {
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<null | {
    invested: number;
    totalValue: number;
    gain: number;
    investedArr: number[];
    fvArr: number[];
    labels: string[];
  }>(null);

  const savePlan = async () => {
    if (!result) return;

    await api("/plans", "POST", {
      type: "SIP",
      inputs: { monthly, rate, years },
      results: result,
    });

    alert("Plan saved!");
  };

  const calculateSIP = () => {
    const P = Number(monthly);
    const r = Number(rate) / 100 / 12;
    const months = Number(years) * 12;

    if (P <= 0 || r <= 0 || months <= 0) return;

    let investedArr: number[] = [];
    let fvArr: number[] = [];
    let labels: string[] = [];

    let totalInvested = 0;
    let totalValue = 0;

    for (let i = 1; i <= months; i++) {
      totalInvested += P;
      totalValue = P * (((Math.pow(1 + r, i) - 1) / r) * (1 + r));

      if (i % 12 === 0) {
        investedArr.push(Math.round(totalInvested));
        fvArr.push(Math.round(totalValue));
        labels.push("Year " + i / 12);
      }
    }

    const gain = totalValue - totalInvested;

    setResult({
      invested: Math.round(totalInvested),
      totalValue: Math.round(totalValue),
      gain: Math.round(gain),
      investedArr,
      fvArr,
      labels,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">SIP Calculator</h1>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputCard
          label="Monthly Investment (₹)"
          value={monthly}
          setter={setMonthly}
          placeholder="e.g. 5000"
        />
        <InputCard
          label="Expected Return (% p.a)"
          value={rate}
          setter={setRate}
          placeholder="e.g. 12"
        />
        <InputCard
          label="Time Period (Years)"
          value={years}
          setter={setYears}
          placeholder="e.g. 10"
        />
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        onClick={calculateSIP}
      >
        Calculate
      </button>

      <button
        className="px-4 py-2 bg-green-600 text-white rounded shadow ml-4"
        onClick={savePlan}
      >
        Save Plan
      </button>

      {/* Result Panel */}
      {result && (
        <div className="bg-white p-4 rounded shadow space-y-2 w-full md:w-1/2">
          <div className="flex justify-between text-gray-700">
            <span>Total Invested:</span>
            <span className="font-semibold">
              ₹{result.invested.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Final Value:</span>
            <span className="font-semibold">
              ₹{result.totalValue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Wealth Gain:</span>
            <span className="font-semibold text-green-600">
              ₹{result.gain.toLocaleString()}
            </span>
          </div>
        </div>
      )}
      {result && (
        <SipChart
          invested={result.investedArr}
          value={result.fvArr}
          labels={result.labels}
        />
      )}
    </div>
  );
}

function InputCard({
  label,
  value,
  setter,
  placeholder,
}: {
  label: string;
  value: string;
  setter: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => setter(e.target.value)}
        type="number"
        placeholder={placeholder}
        className="mt-1 w-full border rounded p-2"
      />
    </div>
  );
}
