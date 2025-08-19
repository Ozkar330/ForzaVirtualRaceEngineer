# server.py
from flask import Flask
from flask_socketio import SocketIO
import threading
import argparse
from GameHandler import GameHandler
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = "forza-secret"
socketio = SocketIO(
    app, 
    cors_allowed_origins=['*', 'file://', 'http://localhost:5173' ],
    async_mode='threading'
)

def handle_parsed_data(data):
    socketio.emit("telemetry", data)

def start_backend(local_ip):
    print("🟢 Iniciando backend...")
    
    # Iniciar el UDP listener usando GameHandler
    gm = GameHandler(local_ip)
    udp_thread = threading.Thread(target=gm.start_udp_listener, args=(handle_parsed_data,))
    udp_thread.daemon = True
    udp_thread.start()

@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Forza Virtual Race Engineer Backend')
    parser.add_argument('--ip', default='192.168.0.86', help='IP address for UDP telemetry')
    parser.add_argument('--udp-port', default='1025', help='UDP port for Forza telemetry')
    parser.add_argument('--dev', action='store_true', help='Enable dev mode')
    
    args = parser.parse_args()
    
    local_ip = args.ip
    udp_port = int(args.udp_port)
    flask_port = 5000  # Puerto fijo para Flask
    config = {
        "flask_host": local_ip,
        "flask_port": flask_port
    }

    # Guardar config en archivo que React pueda leer
    if args.dev:
        # Desarrollo
        print(f"dev mode enabled")
        with open('../frontend/public/config.json', 'w') as f:
            json.dump(config, f)
    else:
        # Produccion
        with open('../frontend/dist/config.json', 'w') as f:
            json.dump(config, f)
    
    print(f"🟢 Configuración:")
    print(f"   IP telemetría: {local_ip}")
    print(f"   Puerto UDP: {udp_port}")
    print(f"   Puerto Flask: {flask_port}")

    start_backend(local_ip)
    print(f"🚀 Servidor Flask iniciado en http://{local_ip}:{flask_port}")
    socketio.run(app, host=local_ip, port=flask_port, allow_unsafe_werkzeug=True)
