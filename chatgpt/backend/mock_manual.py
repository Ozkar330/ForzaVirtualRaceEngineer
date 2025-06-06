# mock_udp_sender.py
import socket
import struct
import time
import random

UDP_IP = "192.168.0.89"
UDP_PORT = 1025
FREQ_HZ = 60
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

    packet_format = "<iI27f4i20f5i17fH6B3b4fi"
    return struct.pack(packet_format, *values)


def send_single_packet(sock):
    """Envía un solo paquete"""
    packet = generate_dash_packet()
    sock.sendto(packet, (UDP_IP, UDP_PORT))
    print("✅ Paquete enviado exitosamente")


def send_continuous_packets(sock):
    """Envía paquetes de forma continua"""
    print(f"📤 Enviando datos continuamente a {UDP_IP}:{UDP_PORT}...")
    print("⚠️  Presiona Ctrl+C para detener")

    try:
        while True:
            packet = generate_dash_packet()
            sock.sendto(packet, (UDP_IP, UDP_PORT))
            print("📦 Paquete enviado")
            time.sleep(INTERVAL)
    except KeyboardInterrupt:
        print("\n🛑 Envío continuo detenido")


def show_menu():
    """Muestra el menú de opciones"""
    print("\n" + "=" * 50)
    print("🚀 GENERADOR DE PAQUETES UDP")
    print("=" * 50)
    print(f"📍 Destino: {UDP_IP}:{UDP_PORT}")
    print(f"⏱️  Frecuencia: {FREQ_HZ} Hz")
    print("\nOpciones disponibles:")
    print("1️⃣  Envío manual (un solo paquete)")
    print("2️⃣  Envío indefinido (continuo)")
    print("3️⃣  Salir")
    print("-" * 50)


def main():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        while True:
            show_menu()

            try:
                opcion = input("Selecciona una opción (1-3): ").strip()

                if opcion == "1":
                    print("\n📤 Enviando paquete manual...")
                    send_single_packet(sock)
                    input("\nPresiona Enter para continuar...")

                elif opcion == "2":
                    print("\n🔄 Iniciando envío continuo...")
                    send_continuous_packets(sock)

                elif opcion == "3":
                    print("\n👋 ¡Hasta luego!")
                    break

                else:
                    print("\n❌ Opción inválida. Por favor selecciona 1, 2 o 3.")
                    input("Presiona Enter para continuar...")

            except KeyboardInterrupt:
                print("\n\n🛑 Programa interrumpido por el usuario")
                break

    except Exception as e:
        print(f"\n💥 Error: {e}")

    finally:
        sock.close()
        print("🔌 Socket cerrado")


if __name__ == "__main__":
    main()
