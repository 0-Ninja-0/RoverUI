import socket
import time
import json
PORT = "localhost"

UDPClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
messagetoSend = {
    "lat": 43.657640,
    "long": -79.379601,
    "b": 180
}
UDPClientSocket.sendto(str.encode(json.dumps(messagetoSend)),
                       (PORT, 7002))
print("Done")
