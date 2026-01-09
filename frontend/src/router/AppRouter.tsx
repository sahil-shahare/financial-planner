import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import SipPage from "../pages/SipPage";
import SwpPage from "../pages/SwpPage";
import GoalPage from "../pages/GoalPage";
import RetirementPage from "../pages/RetirementPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import SavedPlans from "../pages/SavedPlans";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "../components/AdminRoute";

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/sip", element: <SipPage /> },
      { path: "/swp", element: <SwpPage /> },
      { path: "/goal", element: <GoalPage /> },
      { path: "/retirement", element: <RetirementPage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/plans", element: <SavedPlans /> },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
    ],
  },
]);
