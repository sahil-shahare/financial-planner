import { useState } from "react";
import InflationChart from "../components/InflationChart";
import CorpusChart from "../components/CorpusChart";
import MonteCarloChart from "../components/MonteCarloChart";
import { api } from "../api/api";

export default function RetirementPage() {
  const [currentAge, setCurrentAge] = useState("");
  const [retireAge, setRetireAge] = useState("");
  const [expense, setExpense] = useState("");
  const [inflation, setInflation] = useState("");
  const [preRate, setPreRate] = useState("");
  const [postRate, setPostRate] = useState("");
  const [life, setLife] = useState("85");
  const [volatility, setVolatility] = useState("");

  const [result, setResult] = useState<null | {
    retirementCorpus: number;
    requiredSIP: number;
    inflationAdjustedExpense: number;
    retirementYears: number;

    inflationValues: number[];
    inflationLabels: string[];

    corpusValues: number[];
    corpusLabels: string[];

    p5: number[];
    p50: number[];
    p95: number[];
  }>(null);

  const savePlan = async () => {
    if (!result) return;

    await api("/plans", "POST", {
      type: "SIP",
      inputs: {
        currentAge: Number(currentAge),
        retireAge: Number(retireAge),
        expense: Number(expense),
        inflation: Number(inflation),
        preRate: Number(preRate),
        postRate: Number(postRate),
        life: Number(life),
        volatility: Number(volatility),
      },
      results: result,
    });

    alert("Plan saved!");
  };

  const calculateRetirement = () => {
    const curr = Number(currentAge);
    const retire = Number(retireAge);
    const exp = Number(expense);
    const inf = Number(inflation) / 100;
    const pre = Number(preRate) / 100 / 12;
    const post = Number(postRate) / 100;
    const vol = Number(volatility);
    const lifeExpectancy = Number(life);

    const yearsToRetire = retire - curr;
    const monthsToRetire = yearsToRetire * 12;
    const retirementYears = lifeExpectancy - retire;
    const retirementMonths = retirementYears * 12;

    if (yearsToRetire <= 0 || retirementYears <= 0) return;

    // --- Inflation Projection ---
    let inflationValues: number[] = [];
    let inflationLabels: string[] = [];

    let expYr = exp;
    for (let i = 1; i <= yearsToRetire; i++) {
      expYr *= 1 + inf;
      inflationValues.push(Math.round(expYr));
      inflationLabels.push("Year " + i);
    }

    // Inflation-adjusted expense at retirement
    const expenseRet = exp * Math.pow(1 + inf, yearsToRetire);

    // Corpus Required (SWP PV)
    const monthlyPost = post / 12 / 100;
    const corpus =
      expenseRet *
      ((1 - Math.pow(1 + monthlyPost, -retirementMonths)) / monthlyPost);

    // SIP Required
    const P = (corpus * pre) / (Math.pow(1 + pre, monthsToRetire) - 1);

    // --- Corpus Simulation (no volatility) ---
    let corpusValues: number[] = [];
    let corpusLabels: string[] = [];
    let corpusSim = corpus;

    for (let i = 1; i <= retirementMonths; i++) {
      corpusSim += corpusSim * monthlyPost;
      corpusSim -= expenseRet;
      if (i % 12 === 0) {
        corpusValues.push(Math.max(0, Math.round(corpusSim)));
        corpusLabels.push("Year " + i / 12);
      }
      if (corpusSim <= 0) break;
    }

    // --- Monte Carlo Simulation ---
    // --- Monte Carlo Simulation ---
    const runs = 1000;
    const mcResults: number[][] = [];

    for (let r = 0; r < runs; r++) {
      let c = corpus;
      const path: number[] = [];

      for (let m = 0; m < retirementMonths; m++) {
        // convert post return + vol to monthly
        const meanMonthly = Number(postRate) / 100 / 12;
        const volMonthly = Number(volatility) / 100 / 12;

        // random draw from approx normal distribution
        const randomMonthly =
          meanMonthly + volMonthly * (Math.random() * 2 - 1);

        c += c * randomMonthly; // growth
        c -= expenseRet; // withdrawal

        path.push(Math.max(0, Math.round(c)));
        if (c <= 0) break;
      }
      mcResults.push(path);
    }

    const percentile = (arr: number[], p: number) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const idx = Math.floor((p / 100) * sorted.length);
      return sorted[idx];
    };

    let p5: number[] = [];
    let p50: number[] = [];
    let p95: number[] = [];

    for (let y = 1; y <= retirementYears; y++) {
      const idx = y * 12 - 1;
      const vals = mcResults.map((path) => path[idx] || 0);
      p5.push(percentile(vals, 5));
      p50.push(percentile(vals, 50));
      p95.push(percentile(vals, 95));
    }

    setResult({
      retirementCorpus: Math.round(corpus),
      requiredSIP: Math.round(P),
      inflationAdjustedExpense: Math.round(expenseRet),
      retirementYears,
      inflationValues,
      inflationLabels,
      corpusValues,
      corpusLabels,
      p5,
      p50,
      p95,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Retirement Planner</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputCard
          label="Current Age"
          value={currentAge}
          setter={setCurrentAge}
          placeholder="e.g. 30"
        />
        <InputCard
          label="Retirement Age"
          value={retireAge}
          setter={setRetireAge}
          placeholder="e.g. 60"
        />
        <InputCard
          label="Monthly Expense (₹ today)"
          value={expense}
          setter={setExpense}
          placeholder="e.g. 40000"
        />
        <InputCard
          label="Inflation (% p.a)"
          value={inflation}
          setter={setInflation}
          placeholder="e.g. 6"
        />
        <InputCard
          label="Return before Retirement (% p.a)"
          value={preRate}
          setter={setPreRate}
          placeholder="e.g. 12"
        />
        <InputCard
          label="Return after Retirement (% p.a)"
          value={postRate}
          setter={setPostRate}
          placeholder="e.g. 7"
        />
        <InputCard
          label="Volatility (% p.a)"
          value={volatility}
          setter={setVolatility}
          placeholder="e.g. 12"
        />

        <InputCard
          label="Life Expectancy (Years)"
          value={life}
          setter={setLife}
          placeholder="e.g. 85"
        />
      </div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        onClick={calculateRetirement}
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
            <span>Corpus Needed at Retirement:</span>
            <span className="font-semibold">
              ₹{result.retirementCorpus.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Required SIP per month:</span>
            <span className="font-semibold">
              ₹{result.requiredSIP.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Inflation Adjusted Expense:</span>
            <span className="font-semibold">
              ₹{result.inflationAdjustedExpense.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Retirement Duration:</span>
            <span className="font-semibold">
              {result.retirementYears} Years
            </span>
          </div>
        </div>
      )}
      {result && (
        <InflationChart
          values={result.inflationValues}
          labels={result.inflationLabels}
        />
      )}
      {result && result.corpusValues.length > 0 && (
        <CorpusChart
          values={result.corpusValues}
          labels={result.corpusLabels}
        />
      )}

      {result && (
        <MonteCarloChart
          p5={result.p5}
          p50={result.p50}
          p95={result.p95}
          labels={result.corpusLabels}
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
