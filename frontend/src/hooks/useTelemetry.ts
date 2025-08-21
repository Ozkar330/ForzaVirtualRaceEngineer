import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Telemetry data interface based on Forza dash format
interface TelemetryData {
  engine_current_rpm: number;
  engine_max_rpm: number;
  speed: number;
  gear_num: number;
  acceleration_x: number;
  acceleration_z: number;
  steering_angle: number;
  throttle: number;
  brake: number;
  lap_num: number;
  lap_time_current: number;
  lap_time_last: number;
  lap_time_best: number;
  race_position: number;
  [key: string]: unknown; // Allow for additional telemetry fields
}

export const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
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
        // console.log("📡 Telemetría recibida:", data);
        // Validate telemetry data before setting state
        if (data && typeof data === 'object') {
          setTelemetry(data as TelemetryData);
        } else {
          console.warn("⚠️ Invalid telemetry data received:", data);
        }
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
