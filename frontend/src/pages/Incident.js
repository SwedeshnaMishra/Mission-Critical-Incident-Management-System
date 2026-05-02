import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Incident() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(false);

  const [root, setRoot] = useState("");
  const [fix, setFix] = useState("");
  const [prev, setPrev] = useState("");

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await API.get(`/work-item/${id}`);
      setItem(res.data);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  const submitRCA = async () => {
    try {
      await API.post(`/work-item/${id}/rca`, {
        root_cause: root,
        fix_applied: fix,
        prevention: prev,
        end_time: Date.now() / 1000,
      });

      alert("✅ RCA submitted!");
      fetchItem();
    } catch (err) {
      alert("❌ Error submitting RCA");
    }
  };

  const closeIncident = async () => {
    try {
      await API.post(`/work-item/${id}/status?new_status=CLOSED`);
      alert("✅ Incident Closed");
      fetchItem();
    } catch (err) {
      alert(err.response?.data?.detail || "Error closing incident");
    }
  };

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        ❌ Failed to load incident. Check backend API.
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Loading incident details...</p>
      </div>
    );
  }

  const duration =
    item.end_time && item.start_time
      ? item.end_time - item.start_time
      : null;

  const mins = duration ? Math.floor(duration / 60) : null;
  const secs = duration ? Math.floor(duration % 60) : null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">🚨 Incident #{id}</h2>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Component: {item.component_id}
          </span>

          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
            {item.severity}
          </span>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded ${
            item.status === "OPEN"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {item.status}
        </span>

        {duration && (
          <p className="mt-3 text-sm text-green-600 font-medium">
            ⏱ MTTR: {mins}m {secs}s
          </p>
        )}
      </div>

      {!item.rca && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="font-bold mb-4">📝 Root Cause Analysis</h3>

          <textarea
            className="w-full border p-3 mb-3 rounded-lg"
            placeholder="Root Cause"
            onChange={(e) => setRoot(e.target.value)}
          />

          <textarea
            className="w-full border p-3 mb-3 rounded-lg"
            placeholder="Fix Applied"
            onChange={(e) => setFix(e.target.value)}
          />

          <textarea
            className="w-full border p-3 mb-3 rounded-lg"
            placeholder="Prevention Steps"
            onChange={(e) => setPrev(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={submitRCA}
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Submit RCA
            </button>

            <button
              onClick={closeIncident}
              disabled={!root || !fix || !prev}
              className={`px-5 py-2 rounded-lg text-white ${
                !root || !fix || !prev
                  ? "bg-gray-400"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Close Incident
            </button>
          </div>
        </div>
      )}

      {item.rca && (
        <div className="bg-green-50 border p-5 rounded-xl shadow-md">
          <h3 className="font-bold mb-3 text-green-700">
            ✅ RCA Submitted
          </h3>

          <p><b>Root Cause:</b> {item.rca.root_cause}</p>
          <p><b>Fix Applied:</b> {item.rca.fix_applied}</p>
          <p><b>Prevention:</b> {item.rca.prevention}</p>

          {item.status !== "CLOSED" && (
            <button
              onClick={closeIncident}
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Close Incident
            </button>
          )}
        </div>
      )}
    </div>
  );
}