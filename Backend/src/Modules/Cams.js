const rtsp = require('rtsp-ffmpeg');
import DB from '../BackendDBConnector';

let cameraSockets = {};
const CAMS = [ 'camera_1', 'camera_2', 'camera_3', 'camera_4' ];
let fps = { camera_1: 0, camera_2: 0, camera_3: 0, camera_4: 0 };
export let SetupCams = (sock) =>
	CAMS.forEach((id) => {
		DB.get(`/${id}`).then(({ data: { id, testurl: input } }) => {
			cameraSockets[id] = new rtsp.FFMpeg({ input });
			console.log(`${id} loaded ${input}`);
			let p = 0;

			cameraSockets[id].on('data', (data) => {
				console.log(id, p);
				p += 1;
				if (sock) {
					fps[id] += 1;
					setTimeout(() => {
						fps[id] -= 1;
						sock.emit(`${id}f`, fps[id]);
					}, 1000);
					sock.emit(id, { i: p, data: data.toString('base64'), fps: fps[id] });
					// console.log(id, 'Socket Sent');
				}
			});
			cameraSockets[id].on('disconnect', () => {
				console.log(id, 'disconnected.');
			});
			cameraSockets[id].on('close', () => {
				console.log(id, 'disconnected.');
			});
		});
	});

export let ShutdownCams = () =>
	CAMS.forEach((id) => {
		DB.get(`/${id}`).then(({ data: { id, testurl: input } }) => {
			if (cameraSockets[id]) {
				cameraSockets[id].removeListener('data', () => {
					console.log(`${id} Disconnected`);
				});
			}
		});
	});
