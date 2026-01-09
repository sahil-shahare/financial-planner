import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function SavedPlans() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    api("/plans").then(setPlans);
  }, []);

  const del = async (id: string) => {
    await api(`/plans/${id}`, "DELETE");
    setPlans(plans.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Saved Plans</h1>

      {plans.map(p => (
        <div key={p.id} className="bg-white p-4 rounded shadow flex justify-between">
          <div>
            <div className="font-semibold">{p.type}</div>
            <div className="text-sm text-gray-500">
              {new Date(p.createdAt).toLocaleString()}
            </div>
          </div>
          <button
            className="text-red-600"
            onClick={() => del(p.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
