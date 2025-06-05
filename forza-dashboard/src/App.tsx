import React from "react";
import { useTelemetry } from "./hooks/useTelemetry";

function App() {
  const telemetry = useTelemetry();

  return (
    <div style={{ backgroundColor: "#121212", color: "white", padding: "2rem" }}>
      <h1>Forza Coach – Dashboard Tier 1</h1>
      <pre style={{ background: "#1e1e1e", padding: "1rem", borderRadius: "8px" }}>
        {telemetry ? JSON.stringify(telemetry, null, 2) : "Esperando datos..."}
      </pre>
    </div>
  );
}

export default App;
