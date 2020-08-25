import dgram from 'dgram';

import moment from 'moment';
function isJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
export default (port, action) => {
	dgram
		.createSocket('udp4')
		.bind({
			address: 'localhost',
			port,
			exclusive: true
		})
		.on('message', (msg, rinfo) => {
			console.log(moment().format('ll HH:mm:ss'));
			let response = msg.toString();
			if (isJson(response)) {
				response = JSON.parse(response);
			}
			console.log('-'.repeat(10).udp, 'RECIEVED'.udp, '-'.repeat(10).udp);
			console.log(`Recieved: ${port}`.udp);
			console.log(`Data:`.udp, JSON.stringify(response).udp);
			console.log('-'.repeat(30).udp);
			action(response);
		});
};
