from TelemetryParser import TelemetryParser
import socket
import platform

class GameHandler:
    def __init__(self, host_ip:str, udp_port:int = 1025, buffer_size:int = 1024):
        self.host_ip = host_ip
        self.udp_port = udp_port
        self.buffer_size = buffer_size

    def start_udp_listener(self, on_data_callback):
        print(f"🎧 Escuchando paquetes UDP en {self.host_ip}:{self.udp_port}...")
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        if platform.system() == "Darwin":  # macOS
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
        elif platform.system() == "Windows":
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind((self.host_ip, self.udp_port))

        packet_parser = TelemetryParser(version="dash")

        try:
            while True:
                data, _ = sock.recvfrom(self.buffer_size)
                packet_parser.parse(data)
                parsed_data = packet_parser.to_dict()
                on_data_callback(parsed_data)
        except KeyboardInterrupt:
            print("\n🛑 Servidor detenido.")