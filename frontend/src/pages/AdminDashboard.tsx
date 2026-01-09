import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    api("/admin/users").then(setUsers);
    api("/admin/plans").then(setPlans);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div>
        <h2 className="text-xl font-medium">Users</h2>
        {users.map(u => (
          <div key={u.id}>{u.email} — {u.role}</div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-medium">Plans</h2>
        {plans.map(p => (
          <div key={p.id}>
            {p.type} — {p.userId}
          </div>
        ))}
      </div>
    </div>
  );
}
