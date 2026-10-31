import { useEffect, useState } from "react";
import ArchitectureGraph from "./ArchitectureGraph";

const API_URL = "http://localhost:8081";

export default function ArchitecturePreview() {
  const [repoId, setRepoId] = useState("3168f12e");
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadArchitecture() {
    if (!repoId.trim()) return;

    setLoading(true);
    setError("");
    setGraphData(null);

    try {
      const response = await fetch(
        `${API_URL}/architecture/${encodeURIComponent(repoId.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not load architecture");
      }

      setGraphData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArchitecture();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080d18", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ color: "white" }}>CodeAtlas Architecture Explorer</h2>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            value={repoId}
            onChange={(e) => setRepoId(e.target.value)}
            placeholder="Enter repository ID"
            style={{
              padding: 12,
              flex: 1,
              borderRadius: 8,
              border: "1px solid #334155",
            }}
          />

          <button
            onClick={loadArchitecture}
            disabled={loading}
            style={{
              padding: "12px 20px",
              background: "#2563eb",
              color: "white",
              border: 0,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {loading ? "Loading..." : "Load Graph"}
          </button>
        </div>

        {error && (
          <p style={{ color: "#f87171" }}>Error: {error}</p>
        )}

        {loading && (
          <p style={{ color: "#94a3b8" }}>Analysing repository...</p>
        )}

        {graphData && (
          <>
            <p style={{ color: "#94a3b8" }}>
              {graphData.total_files} files · {graphData.total_connections} connections
            </p>

            <div style={{ height: 700 }}>
              <ArchitectureGraph
                nodes={graphData.nodes}
                edges={graphData.edges}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}