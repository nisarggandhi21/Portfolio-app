import { BarChart3, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-3 shadow-md bg-white sticky top-0 z-50">
      <h1 className="text-xl font-bold text-green-600">CapitalMind Premium</h1>
      <div className="flex gap-6">
        <Link to="/" className="flex items-center gap-2 hover:text-green-500">
          <Home size={18} /> Home
        </Link>
        <Link
          to="/portfolio"
          className="flex items-center gap-2 hover:text-green-500"
        >
          <BarChart3 size={18} /> Portfolio
        </Link>
      </div>
    </nav>
  );
}
