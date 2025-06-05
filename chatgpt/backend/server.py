# server.py
from flask import Flask
from flask_socketio import SocketIO
import threading
import os
from udp_listener import start_udp_listener
from mock_udp_sender import start_mock_sender  # nuevo método interno
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'forza-secret'
socketio = SocketIO(app, cors_allowed_origins="*")

MOCK_MODE = os.getenv("MOCK_MODE", "False").lower() == "true"

def handle_parsed_data(data):
    socketio.emit("telemetry", data)

def start_backend():
    print("🟢 Iniciando backend...")

    # Iniciar el UDP listener SIEMPRE
    udp_thread = threading.Thread(target=start_udp_listener, args=(handle_parsed_data,))
    udp_thread.daemon = True
    udp_thread.start()

    # Si está en modo mock, lanzar el simulador
    if MOCK_MODE:
        print("⚠️ MODO SIMULADOR ACTIVADO")
        mock_thread = threading.Thread(target=start_mock_sender)
        mock_thread.daemon = True
        mock_thread.start()



@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == '__main__':
    start_backend()
    print("🚀 Servidor Flask iniciado en http://localhost:5000")
    socketio.run(app, host='127.0.0.1', port=5000) # Ajustar con la IP de la computadora
