import express from 'express';
import moment from 'moment';

const router = express.Router();

import { createSocket } from 'dgram';
function isJson(str) {
	if (typeof str === 'object') {
		return true;
	}
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
router.post('/postUDP', (req, res) => {
	const { port, data } = req.body;
	let server = createSocket('udp4');
	var message = Buffer.from(JSON.stringify(data), 'utf8');
	console.log(moment().format('ll HH:mm:ss'));
	server.send(message, port, 'localhost', function(err, bytes) {
		if (err) {
			console.log(err.message.test);
		}
		console.log('---- UDP TEST ----'.test);
		console.log(`PORT ${port}         `.test);
		console.log(`MESSAGE ${JSON.stringify(data)}`.test);
		console.log('-'.repeat(18).test);
		res.send(200);
	});

	// UDPConnect(port, data);
});

export default router;
