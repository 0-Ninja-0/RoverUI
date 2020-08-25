import json
import random
import time
import socket
latitude = 43.204724
longitude = -80.409378
heading = 0

PORT = "localhost"

UDPClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
# Code produces new values every 0.5 seconds.
# Changes in lat/long are decided assuming a max speed of 2 m/s (7.2 km/h).
# Heading is produced randomly (but we do have a function that determines necessary angle of rotation in another file)

for i in range(200):
    info = {
        "lat": latitude,
        "long": longitude,
        "b": heading
    }

    with open('coordinates.txt', 'a+') as f:
        json.dump(info, f)

    latitude = round(random.uniform(
        latitude - 0.0000089, latitude + 0.0000089), 7)
    longitude = round(random.uniform(
        longitude - 0.0000123, longitude + 0.0000123), 7)
    # compass module is precise to 1 decimal
    heading = round(random.uniform(0, 359.9), 1)

    time.sleep(0.5)
    print(info)
    UDPClientSocket.sendto(str.encode(json.dumps(info)),
                           (PORT, 5002))
open('coordinates.txt', 'a+').close()
