# server.py
from flask import Flask
from flask_socketio import SocketIO
import threading
from GameHandler import GameHandler
from Login_GUI import Login_GUI

app = Flask(__name__)
app.config["SECRET_KEY"] = "forza-secret"
socketio = SocketIO(
    app, 
    cors_allowed_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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

    gui = Login_GUI()


    start_backend(gui.local_ip)
    print(f"🚀 Servidor Flask iniciado en http:// {gui.local_ip}:{gui.local_port}")
    socketio.run(app, host=gui.local_ip, port=gui.local_port, allow_unsafe_werkzeug=True)
