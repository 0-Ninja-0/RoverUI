const port = process.env.PORT || 4000;

import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import socket from './socket';
// TCP Setup
import { factor } from './constants';
// UDP Setup

// RTSP Setup
import { SetupCams, ShutdownCams } from './Modules/Cams';

// Local imports
import { rootRouter, udpTestRouter } from './routes';
import { UDPGPSSetup } from './routes/points';
import DB from './BackendDBConnector';
import mapRouter from './routes/map';
import UDPConnector from './UDPConnector';

let app = express();
let io = socket(app);
app.use(cors()).use(logger('dev')).use(bodyParser.json());
let sock = null;
const os = require('os');

let cameraSockets = {};
io.on('connection', (socket) => {
	console.info(`Client connected [id=${socket.id}]`);
	sock = socket;
	SetupCams(sock);
});

// io.on('connection', (socket) => {
// 	// Lat / Long / Bearing Update
// 	// UDPGPSSetup(socket);
// 	socket.emit('pointUpdate', { lat: 0, long: 0 });
// 	let i = 0;
// 	let max = 0;

// 	// Camera Update
// 	DB.get('/current/cm')
// 		.then(({ data }) => {
// 			for (let { id, port, testurl } of data.list) {
// 				// stream = new rtsp.FFMpeg({ input: testurl });
// 				// stream.on('data', (data) => {
// 				// 	if (i == 10) {
// 				// 		console.log(data);
// 				// 	}
// 				// 	console.log(i);
// 				// 	i += 1;
// 				// 	if (i > max) {
// 				// 		console.log('error');
// 				// 	} else {
// 				// 		max = i;
// 				// 	}
// 				// 	socket.emit(id, data.toString('base64'));
// 				// });
// 			}
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// });
// app.use('/', rootRouter);
app.use('/map', mapRouter).use(udpTestRouter);
app.get('/', (req, res) => {
	res.send('hello!');
});

export let tempIo = io;

// GPS System
UDPConnector(5003, (f) => {
	console.log('Clearing all GPS entries in database!');
	DB.get('/markers')
		.then(({ data }) => {
			let i = 0;
			for (let { id } of data) {
				i += 1;
				DB.delete(`/markers/${id}`);
			}
			console.log(`${i} markers deleted`);
		})
		.catch((e) => console.log('Error deleting markers'.red, e));
	DB.get('/points')
		.then(({ data }) => {
			let i = 0;
			for (let { id } of data) {
				i += 1;
				DB.delete(`/points/${id}`);
			}
			console.log(`${i} points deleted`);
			if (sock) {
				sock.emit('pointUpdate', 'f');
			}
		})
		.catch((e) => console.log('Error deleting points'.red));
});

UDPConnector(5011, (input) => {
	console.log(input);
	DB.put('/map/center', {
		...input,
		id: 'center'
	}).then(() => {
		if (sock) {
			sock.emit('pointUpdate', 'f');
		}
	});
});
UDPConnector(5002, (response) => {
	DB.get('/map/center').then(({ data }) => {
		let { lat, long } = data;
		let diffLat = response.lat - lat;
		let diffLong = response.long - long;
		let b = response.b;
		let date = new Date();
		console.log(diffLat * factor, diffLong * factor, date.getTime());
		DB.post('/points', {
			id: date.getTime(),
			x: diffLong * factor,
			y: diffLat * factor,
			lat: response.lat,
			long: response.long,
			center: data,
			bearing: b
		}).then(() => {
			console.log('here!');
			if (sock) {
				sock.emit('pointUpdate', 'f');
			}
		});
	});
});
UDPConnector(1001, () => {
	if (sock) {
		console.log('f');
		sock.emit('reCamera', 'f');
		ShutdownCams();
		SetupCams(sock);
	}
});

for (let addresses of Object.values(os.networkInterfaces())) {
	for (let add of addresses) {
		if (add.address.startsWith('192.168.')) {
			console.log(add.address);
		}
	}
}

app.listen(port, () => console.log(`Listening on port ${port}`.listener));
