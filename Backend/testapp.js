const UDP_ADD = require('./secrets/localip').ip;
const UDP_PORT = 8080;
const port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
console.log(UDP_ADD);
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const dgram = require('dgram');
const cors = require('cors');
const rtsp = require('rtsp-ffmpeg');
const index = require('./routes/index');
const db = require('./BackendDBConnector');
const { constants } = require('buffer');

const app = express();
app.use(index);
// TCP
const server = http.createServer(app);
app.use(cors());
const io = socketIo(server);
// UDP

app.use(bodyParser.json());

// UDPSocket.on('message', (msg, rinfo) => {
// 	// The messag5
// 	let response = msg.toString();
// 	console.log(`UDP Message Recieved: ${response}`);
// });
let UDPSocket = dgram.createSocket('udp4');
UDPSocket.bind({
    address: UDP_ADD,
    port: 5252,
    exclusive: true,
});
UDPSocket.on('message', (msg, rinfo) => {
    // The message
    console.log('yay');
    let response = JSON.parse(msg.toString());
    console.log('points:', response);
});
server.listen(port, () => console.log(`Listening on port ${port}`));
