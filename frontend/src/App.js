import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Incident from "./pages/Incident";

export default function App() {
  return (
    <Router>
      <div className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <h1 className="font-bold text-xl tracking-wide flex items-center gap-2">
          ⚡ IMS Dashboard
      </h1>
      <div className="text-sm text-gray-300">
            Live Incident Monitor
      </div>
    </div>

      <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/incident/:id" element={<Incident />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}