import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<unknown>(null);
  const [config, setConfig] = useState({ flask_host: '192.168.0.86', flask_port: '5000' });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Cargar configuración
    fetch('./config.json')
      .then(res => res.json())
      .then(setConfig)
      .catch(err => {
        console.warn("⚠️ No se pudo cargar config.json, usando valores por defecto:", err);
      });
  }, []);

  useEffect(() => {
    // Crear socket cuando tengamos la configuración
    if (!socketRef.current) {
      socketRef.current = io(`http://${config.flask_host}:${config.flask_port}`, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        timeout: 5000,
        autoConnect: true
      });

      const socket = socketRef.current;

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

      if (socket.connected) {
        console.log("🔄 Socket ya estaba conectado");
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [config.flask_host, config.flask_port]);

  return telemetry;
};
