# mock_udp_sender.py
import socket
import struct
import time
import random
from data_packet import DataPacket

UDP_IP = "127.0.0.1"
UDP_PORT = 1025
FREQ_HZ = 10
INTERVAL = 1.0 / FREQ_HZ

def generate_dash_packet():
    values = []
    values += [1, int(time.time() * 1000) % 4294967295]
    values += [random.uniform(0, 1) for _ in range(27)]
    values += [random.randint(0, 1000) for _ in range(4)]
    values += [random.uniform(0, 1) for _ in range(20)]
    values += [random.randint(0, 5) for _ in range(5)]
    values += [random.uniform(0, 500) for _ in range(17)]
    values += [random.randint(0, 65535)]
    values += [random.randint(0, 255) for _ in range(6)]
    values += [random.randint(-10, 10) for _ in range(3)]
    values += [random.randint(0, 100000) for _ in range(4)]
    values += [random.randint(0, 100)]

    packet_format = '<iI27f4i20f5i17fH6B3b4fi'
    return struct.pack(packet_format, *values)

def start_mock_sender():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print(f"📤 Enviando datos simulados a {UDP_IP}:{UDP_PORT}...")
    try:
        while True:
            packet = generate_dash_packet()
            sock.sendto(packet, (UDP_IP, UDP_PORT))
            time.sleep(INTERVAL)
    except KeyboardInterrupt:
        print("\n🛑 Simulación detenida.")

if __name__ == "__main__":
    start_mock_sender()
