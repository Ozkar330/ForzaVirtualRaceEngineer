import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Conectado al servidor WebSocket");
    });

    socket.on("telemetry", (data: any) => {
      setTelemetry(data);
      console.log("📡 Telemetría recibida:", data);
    });

    return () => {
      socket.off("telemetry");
    };
  }, []);

  return telemetry;
};
