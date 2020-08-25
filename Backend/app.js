const UDP_ADD = require('./secrets/localip').ip;

const UDP_PORT = 8080;

const port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const cors = require('cors');
const rtsp = require('rtsp-ffmpeg');
const db = require('./BackendDBConnector');
const { constants } = require('buffer');

const UDPRecieve = require('./src/UDPConnector');

const app = express();
// TCP
const server = http.createServer(app);
const io = socketIo(server);
// UDP

app.use(cors()).use(bodyParser.json());

// UDPSocket.on('message', (msg, rinfo) => {
// 	// The messag5
// 	let response = msg.toString();
// 	console.log(`UDP Message Recieved: ${response}`);
// });
const factor = 10000000;
app.post('/postUDP', (req, res) => {
	const { port, data } = req.body;
	console.log(port, data);
});
app.post('/markers', (req, res) => {
	db.get('/map/center').then(({ data }) => {
		let { lat, long } = data;
		diffLat = req.body.lat - lat;
		diffLong = req.body.long - long;
		date = new Date();

		console.log(diffLat * factor, diffLong * factor, date.getTime());
		db
			.post('/markers', {
				id: date.getTime(),
				x: diffLong * factor,
				y: diffLat * factor,
				lat: req.body.lat,
				long: req.body.long,
				center: data
			})
			.then(() => {
				res.sendStatus(200);
			});
	});
});
UDPRecieve(5003, (input) => {
	console.log(input);
});

// UDPRecieve(5001, (input) => {
// 	console.log('called');
// 	console.log(input);

// 	DB.put('/map/center', {
// 		...input,
// 		id: 'center'
// 	});
// });
let mapsHandler = (socket) => {
	let UDPSocket = dgram.createSocket('udp4');
	UDPSocket.bind({
		address: UDP_ADD,
		port: 7001,
		exclusive: true
	});
	UDPSocket.on('message', (msg, rinfo) => {
		// The message
		let response = JSON.parse(msg.toString());
		console.log('points:', response);
		db.get('/map/center').then(({ data }) => {
			let { lat, long } = data;
			diffLat = response.lat - lat;
			diffLong = response.long - long;
			b = response.b;
			date = new Date();

			console.log(diffLat * factor, diffLong * factor, date.getTime());
			db
				.post('/points', {
					id: date.getTime(),
					x: diffLong * factor,
					y: diffLat * factor,
					lat: response.lat,
					long: response.long,
					center: data,
					bearing: b
				})
				.then(() => {
					socket.emit('pointUpdate', { lat: response.lat, long: response.long });
				});
		});
	});
};
io.on('connection', (socket) => {
	mapsHandler(socket);
	socket.emit('pointUpdate', { lat: 0, long: 0 });
	let i = 0;
	max = 0;
	db
		.get('/current/cm')
		.then(({ data }) => {
			for (let { id, port, testurl } of data.list) {
				// stream = new rtsp.FFMpeg({ input: testurl });
				// stream.on('data', (data) => {
				// 	if (i == 10) {
				// 		console.log(data);
				// 	}
				// 	console.log(i);
				// 	i += 1;
				// 	if (i > max) {
				// 		console.log('error');
				// 	} else {
				// 		max = i;
				// 	}
				// 	socket.emit(id, data.toString('base64'));
				// });
			}
		})
		.catch((err) => {
			console.log(err);
		});
});
server.listen(port, () => console.log(`Listening on port ${port}`));
