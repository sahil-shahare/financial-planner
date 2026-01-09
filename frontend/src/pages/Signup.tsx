import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const signup = async () => {
    await api("/auth/register", "POST", { email, password });
    nav("/login");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-semibold">Sign Up</h1>
      <input className="w-full border p-2" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border p-2" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button className="w-full bg-blue-600 text-white p-2" onClick={signup}>
        Create Account
      </button>
    </div>
  );
}
