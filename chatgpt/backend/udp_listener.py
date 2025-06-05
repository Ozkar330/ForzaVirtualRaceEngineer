# udp_listener.py
import socket
from data_packet import DataPacket

UDP_IP = "0.0.0.0" # Ajustar con la IP de la computadora
UDP_PORT = 1025
BUFFER_SIZE = 4096

def start_udp_listener(on_data_callback):
    print(f"🎧 Escuchando paquetes UDP en {UDP_IP}:{UDP_PORT}...")
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((UDP_IP, UDP_PORT))

    packet_parser = DataPacket(version='dash')

    while True:
        data, _ = sock.recvfrom(BUFFER_SIZE)
        try:
            packet_parser.parse(data)
            parsed_data = packet_parser.to_dict()
            on_data_callback(parsed_data)
        except Exception as e:
            print(f"[⚠️ Error UDP] {e}")
