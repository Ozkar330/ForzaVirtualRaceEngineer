import socket
import struct
import json
import threading
import time
from datetime import datetime
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "forza_telemetry_secret"
socketio = SocketIO(app, cors_allowed_origins="*")


class ForzaTelemetryReceiver:
    def __init__(self, host="192.168.0.90", port=4843):
        self.host = host
        self.port = port
        self.socket = None
        self.running = False
        self.current_data = {}
        self.session_data = []

    def start_receiving(self):
        """Inicia la recepción de datos UDP de Forza"""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self.socket.bind((self.host, self.port))
            self.running = True
            print(f"Escuchando telemetría en {self.host}:{self.port}")

            while self.running:
                try:
                    data, addr = self.socket.recvfrom(1024)
                    if len(data) >= 324:  # Tamaño esperado del paquete de Forza
                        parsed_data = self.parse_forza_data(data)
                        self.current_data = parsed_data
                        self.session_data.append(parsed_data)

                        # Emitir datos en tiempo real via WebSocket
                        socketio.emit("telemetry_data", parsed_data)

                except socket.timeout:
                    continue
                except Exception as e:
                    print(f"Error recibiendo datos: {e}")

        except Exception as e:
            print(f"Error iniciando receptor: {e}")

    def parse_forza_data(self, data):
        """Parsea los datos binarios de Forza Motorsport"""
        try:
            # Estructura básica de datos de Forza (primeros campos importantes)
            # Offset 0-4: IsRaceOn (int32)
            # Offset 4-8: TimestampMS (uint32)
            # Offset 8-12: EngineMaxRpm (float)
            # Offset 12-16: EngineIdleRpm (float)
            # Offset 16-20: CurrentEngineRpm (float)
            # Offset 20-24: AccelerationX (float)
            # Offset 24-28: AccelerationY (float)
            # Offset 28-32: AccelerationZ (float)
            # Offset 32-36: VelocityX (float)
            # Offset 36-40: VelocityY (float)
            # Offset 40-44: VelocityZ (float)
            # Offset 244-248: Accel (float)
            # Offset 248-252: Brake (float)
            # Offset 252-256: Clutch (float)
            # Offset 256-260: HandBrake (float)
            # Offset 260-264: Gear (int32)
            # Offset 264-268: Steer (float)

            parsed = {
                "timestamp": datetime.now().isoformat(),
                "is_race_on": struct.unpack("<i", data[0:4])[0],
                "timestamp_ms": struct.unpack("<I", data[4:8])[0],
                "engine_max_rpm": struct.unpack("<f", data[8:12])[0],
                "engine_idle_rpm": struct.unpack("<f", data[12:16])[0],
                "current_engine_rpm": struct.unpack("<f", data[16:20])[0],
                "acceleration_x": struct.unpack("<f", data[20:24])[0],
                "acceleration_y": struct.unpack("<f", data[24:28])[0],
                "acceleration_z": struct.unpack("<f", data[28:32])[0],
                "velocity_x": struct.unpack("<f", data[32:36])[0],
                "velocity_y": struct.unpack("<f", data[36:40])[0],
                "velocity_z": struct.unpack("<f", data[40:44])[0],
                "accel_input": struct.unpack("<f", data[244:248])[0],
                "brake_input": struct.unpack("<f", data[248:252])[0],
                "clutch_input": struct.unpack("<f", data[252:256])[0],
                "handbrake_input": struct.unpack("<f", data[256:260])[0],
                "gear": struct.unpack("<i", data[260:264])[0],
                "steer_input": struct.unpack("<f", data[264:268])[0],
            }

            # Calcular velocidad total
            speed = (
                parsed["velocity_x"] ** 2
                + parsed["velocity_y"] ** 2
                + parsed["velocity_z"] ** 2
            ) ** 0.5
            parsed["speed_ms"] = speed
            parsed["speed_kmh"] = speed * 3.6

            return parsed

        except Exception as e:
            print(f"Error parseando datos: {e}")
            return {}

    def stop_receiving(self):
        """Detiene la recepción de datos"""
        self.running = False
        if self.socket:
            self.socket.close()


# Instancia global del receptor
telemetry_receiver = ForzaTelemetryReceiver()


@app.route("/")
def index():
    """Página principal del dashboard"""
    return render_template("forza_dashboard_frontend.html")


@app.route("/api/current_data")
def get_current_data():
    """API endpoint para obtener datos actuales"""
    return jsonify(telemetry_receiver.current_data)


@app.route("/api/session_data")
def get_session_data():
    """API endpoint para obtener datos de la sesión completa"""
    # Retornar solo los últimos 1000 puntos para no sobrecargar
    return jsonify(telemetry_receiver.session_data[-1000:])


@app.route("/api/start_session")
def start_session():
    """Inicia una nueva sesión de telemetría"""
    telemetry_receiver.session_data = []
    return jsonify({"status": "session_started"})


@socketio.on("connect")
def handle_connect():
    """Maneja nuevas conexiones WebSocket"""
    print("Cliente conectado")
    emit("connected", {"status": "connected"})


@socketio.on("disconnect")
def handle_disconnect():
    """Maneja desconexiones WebSocket"""
    print("Cliente desconectado")


def start_telemetry_thread():
    """Inicia el hilo de recepción de telemetría"""
    telemetry_thread = threading.Thread(target=telemetry_receiver.start_receiving)
    telemetry_thread.daemon = True
    telemetry_thread.start()


if __name__ == "__main__":
    # Iniciar el receptor de telemetría en un hilo separado
    start_telemetry_thread()

    # Iniciar el servidor web
    print("Iniciando servidor web en http://localhost:5000")
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)
