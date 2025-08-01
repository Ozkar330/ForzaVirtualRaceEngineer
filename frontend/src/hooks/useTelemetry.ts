import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.0.86:5000", {
    transports: ['websocket'], // Solo WebSocket para mejor performance
    reconnection: true,
    reconnectionAttempts: 10,
    timeout: 5000, // Timeout más corto para telemetría
    autoConnect: true
  });

export const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<unknown>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Conectado al servidor WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("❌ Desconectado del servidor WebSocket");
    });

    socket.on("connect_error", (error) => {
      console.error("🚨 Error de conexión:", error);
    });

    socket.on("telemetry", (data: unknown) => {
      console.log("📡 Telemetría recibida:", data);
      setTelemetry(data);
    });

    // Verificar si ya está conectado
    if (socket.connected) {
      console.log("🔄 Socket ya estaba conectado");
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("telemetry");
    };
  }, []);

  return telemetry;
};
