import csv
import os
import socket
import sys
from chatgpt.backend.data_packet import DataPacket

host = "192.168.0.90"
port = 1025

# Handles the execution of receiving/parsing to leave
# Create an ipv4 datagram-based socket and bind
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((host, port))

# Instantiate class and variables
dp = DataPacket(version="dash")

full_record = []

try:
    # Loop indefinitely until finished
    while True:
        # Receive a data packet from Forza
        packet, _ = sock.recvfrom(1024)

        # Parse this packet
        dp.parse(packet)
        # print(dp.dist_traveled)
        if dp.active == 1:
            full_record.append(dp.get_attribute_list())

        # Update the shared dict of values - we cannot just
        # re-assign here as it won't detect the change
        # for k, v in dp.to_dict().items():
        # dashboard_data[k] = v
except:
    ...

# If the loop exits, close the socket if necessary
sock.close()

with open("All_Data.csv", "w", newline="") as f:
    # using csv.writer method from CSV package
    write = csv.writer(f)

    write.writerow(dp.attributes)
    write.writerows(full_record)
