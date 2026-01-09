import { Outlet, Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const menuItems = [
  { label: "Dashboard", to: "/" },
  { label: "SIP Calculator", to: "/sip" },
  { label: "SWP Calculator", to: "/swp" },
  { label: "Goal Planner", to: "/goal" },
  { label: "Retirement", to: "/retirement" },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
          Financial Planner
        </div>

        <nav className="flex-1 mt-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={clsx(
                "block px-6 py-2 text-sm rounded-sm hover:bg-gray-700 hover:text-white transition",
                location.pathname === item.to && "bg-gray-800"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
