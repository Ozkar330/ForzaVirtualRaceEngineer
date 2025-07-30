# server.py
from flask import Flask
from flask_socketio import SocketIO
import threading
from GameHandler import GameHandler
from udp_listener_to_delete import start_udp_listener

app = Flask(__name__)
app.config["SECRET_KEY"] = "forza-secret"
socketio = SocketIO(app, cors_allowed_origins="*")
ip = "192.168.0.86"

def handle_parsed_data(data):
    socketio.emit("telemetry", data)

def start_backend():
    print("🟢 Iniciando backend...")
    
    # Iniciar el UDP listener usando GameHandler
    gm = GameHandler(ip)
    udp_thread = threading.Thread(target=gm.start_udp_listener, args=(handle_parsed_data,))
    udp_thread.daemon = True
    udp_thread.start()

@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":

    start_backend()
    print("🚀 Servidor Flask iniciado en http://" + ip + ":5000")
    socketio.run(app, host=ip, port=5000)
