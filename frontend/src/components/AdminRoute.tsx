import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const role = localStorage.getItem("role");
  return role === "ADMIN" ? children : <Navigate to="/" />;
}
