# udp_listener.py
import socket
from data_packet import DataPacket

UDP_IP = "192.168.0.90"  # Ajustar con la IP de la computadora
UDP_PORT = 1025
BUFFER_SIZE = 1024


def start_udp_listener(on_data_callback):
    print(f"🎧 Escuchando paquetes UDP en {UDP_IP}:{UDP_PORT}...")
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((UDP_IP, UDP_PORT))

    packet_parser = DataPacket(version="dash")

    try:
        while True:
            data, _ = sock.recvfrom(BUFFER_SIZE)
            packet_parser.parse(data)
            parsed_data = packet_parser.to_dict()
            on_data_callback(parsed_data)
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido.")
