import { useState } from "react";
import { api } from "../api/api";


export default function GoalPage() {
  const [target, setTarget] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("");
  const [inflation, setInflation] = useState("");

  const [result, setResult] = useState<null | {
    requiredSIP: number;
    inflationAdjusted: number;
    invested: number;
    gain: number;
  }>(null);

  const savePlan = async () => {
  if (!result) return;

  await api("/plans", "POST", {
    type: "SIP",
    inputs: { target, rate, years },
    results: result,
  });

  alert("Plan saved!");
};


  const calculateGoal = () => {
    const FV = Number(target);
    const r = Number(rate) / 100 / 12;
    const yrs = Number(years);
    const inf = Number(inflation) / 100;
    const months = yrs * 12;

    if (FV <= 0 || r <= 0 || yrs <= 0) return;

    // Inflation adjustment (optional)
    const FV_adj = inf > 0 ? FV * Math.pow(1 + inf, yrs) : FV;

    // Reverse SIP formula
    const P = FV_adj * r / (Math.pow(1 + r, months) - 1);

    const invested = P * months;
    const gain = FV_adj - invested;

    setResult({
      requiredSIP: Math.round(P),
      inflationAdjusted: Math.round(FV_adj),
      invested: Math.round(invested),
      gain: Math.round(gain),
    });
  };

  

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Goal Planner</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputCard label="Target Amount (₹ in Future)" value={target} setter={setTarget} placeholder="e.g. 2000000" />
        <InputCard label="Time Period (Years)" value={years} setter={setYears} placeholder="e.g. 10" />
        <InputCard label="Expected Return (% p.a)" value={rate} setter={setRate} placeholder="e.g. 12" />
        <InputCard label="Inflation (% p.a)" value={inflation} setter={setInflation} placeholder="optional e.g. 6" />
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded shadow" onClick={calculateGoal}>
        Calculate
      </button>

      <button
  className="px-4 py-2 bg-green-600 text-white rounded shadow ml-4"
  onClick={savePlan}
>
  Save Plan
</button>


      {result && (
        <div className="bg-white p-4 rounded shadow w-full md:w-1/2 space-y-2">
          <div className="flex justify-between">
            <span>Required SIP per month:</span>
            <span className="font-semibold">₹{result.requiredSIP.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Inflation Adjusted Target:</span>
            <span className="font-semibold">₹{result.inflationAdjusted.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Invested:</span>
            <span>₹{result.invested.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Gain:</span>
            <span className="font-semibold text-green-600">₹{result.gain.toLocaleString()}</span>
          </div>
        </div>
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
