import Sidebar from "@/Components/Sidebar";
import Home from "@/Pages/Home";
import Portfolio from "@/Pages/Portfolio";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="app-content w-full min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
