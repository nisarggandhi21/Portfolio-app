import { BarChart2, Home, Layers } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-600" />
          <h1 className="text-lg font-semibold text-green-700">CapitalMind</h1>
        </div>
      </div>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive ? "bg-gray-100" : "hover:bg-gray-50"
            }`
          }
        >
          <Home size={16} /> Home
        </NavLink>

        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive ? "bg-gray-100" : "hover:bg-gray-50"
            }`
          }
        >
          <BarChart2 size={16} /> Portfolios
        </NavLink>

        <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-500">
          <Layers size={16} /> Experimentals
        </a>
      </nav>
    </aside>
  );
}
