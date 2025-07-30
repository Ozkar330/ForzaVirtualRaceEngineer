import { useState } from "react";
import { useTelemetry } from "./hooks/useTelemetry";
import { HeaderInfo } from "./components/HeaderInfo";
import { Dashboard } from "./components/Dashboard";

function App() {
  const telemetry = useTelemetry();

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | undefined>(undefined);

  const handleStart = () => {
    setSessionActive(true);
    setSessionStart(Date.now());
    console.log("🚦 Sesión iniciada");
  };

  const handleStop = () => {
    setSessionActive(false);
    console.log("⛔ Sesión detenida");
  };

  const handleExport = () => {
    console.log("📤 Exportando datos...");
    // ... lógica de exportación futura
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "white", minHeight: "100vh", width: "100vw", overflowX: "hidden", boxSizing: "border-box" }}>
      <HeaderInfo
        driverName="Pilot01"
        udpConnected={!!telemetry}
        wsConnected={true}
        sessionActive={sessionActive}
        sessionStartTime={sessionStart}
      />
      <Dashboard
        telemetry={telemetry}
        onStart={handleStart}
        onStop={handleStop}
        onExport={handleExport}
        sessionActive={sessionActive}
      />
    </div>
  );
}

export default App;
