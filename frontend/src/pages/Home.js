import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
  fetchData();
  const interval = setInterval(fetchData, 3000);
  return () => clearInterval(interval);
}, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/work-items");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!items.length) {
  return (
    <div className="text-center text-gray-500 mt-20">
      <h3 className="text-xl">🚫 No active incidents</h3>
      <p className="text-sm mt-2">System is running smoothly</p>
    </div>
  );
}

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">🚨 Active Incidents</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-sm text-gray-500">Total</p>
    <h3 className="text-xl font-bold">{items.length}</h3>
  </div>

  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-sm text-gray-500">Open</p>
    <h3 className="text-xl font-bold text-blue-600">
      {items.filter(i => i.status === "OPEN").length}
    </h3>
  </div>

  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-sm text-gray-500">Closed</p>
    <h3 className="text-xl font-bold text-green-600">
      {items.filter(i => i.status === "CLOSED").length}
    </h3>
  </div>

  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-sm text-gray-500">High Severity</p>
    <h3 className="text-xl font-bold text-red-600">
      {items.filter(i => i.severity === "P0").length}
    </h3>
  </div>

</div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/incident/${item.id}`}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl hover:scale-105 transition transform duration-200 border"
          >
            <div className="flex justify-between items-center mb-3">
              
              <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                {item.severity}
              </span>

              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                item.status === "OPEN"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
                  }`}
              >
                {item.status}
              </span>

            </div>

            <h3 className="font-semibold text-xl tracking-wide">{item.component_id}</h3>

            <p className="text-sm text-gray-400 mt-3">
              Incident ID: #{item.id}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}