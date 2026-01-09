import { useState } from "react";
import SwpChart from "../components/SwpChart";
import { api } from "../api/api";

export default function SwpPage() {
  const [corpus, setCorpus] = useState("");
  const [withdrawal, setWithdrawal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");

  const [result, setResult] = useState<null | {
    totalWithdrawal: number;
    endingCorpus: number;
    monthsSurvived: number;
    values: number[];
    labels: string[];
  }>(null);

  const savePlan = async () => {
    if (!result) return;

    await api("/plans", "POST", {
      type: "SIP",
      inputs: { monthly: withdrawal, rate, years },
      results: result,
    });

    alert("Plan saved!");
  };

  const calculateSWP = () => {
    const C = Number(corpus);
    const W = Number(withdrawal);
    const r = Number(rate) / 100 / 12;
    const months = Number(years) * 12;

    if (C <= 0 || W <= 0 || r < 0 || months <= 0) return;

    let corpusValue = C;
    let totalWithdraw = 0;
    let values: number[] = [];
    let labels: string[] = [];
    let survived = 0;

    for (let i = 1; i <= months; i++) {
      corpusValue += corpusValue * r; // monthly growth
      corpusValue -= W; // monthly withdrawal
      totalWithdraw += W;

      if (corpusValue <= 0) {
        corpusValue = 0;
        survived = i;
        break;
      }

      if (i % 12 === 0) {
        values.push(Math.round(corpusValue));
        labels.push("Year " + i / 12);
      }
    }

    if (survived === 0) survived = months;

    setResult({
      totalWithdrawal: totalWithdraw,
      endingCorpus: Math.round(corpusValue),
      monthsSurvived: survived,
      values,
      labels,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">SWP Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputCard
          label="Initial Corpus (₹)"
          value={corpus}
          setter={setCorpus}
          placeholder="e.g. 1000000"
        />
        <InputCard
          label="Monthly Withdrawal (₹)"
          value={withdrawal}
          setter={setWithdrawal}
          placeholder="e.g. 15000"
        />
        <InputCard
          label="Expected Return (% p.a)"
          value={rate}
          setter={setRate}
          placeholder="e.g. 8"
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
        onClick={calculateSWP}
      >
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
            <span>Total Withdrawal:</span>
            <span className="font-semibold">
              ₹{result.totalWithdrawal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ending Corpus:</span>
            <span className="font-semibold">
              ₹{result.endingCorpus.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Corpus Survived:</span>
            <span className="font-semibold">
              {(result.monthsSurvived / 12).toFixed(1)} Years
            </span>
          </div>
        </div>
      )}
      {result && <SwpChart values={result.values} labels={result.labels} />}
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
