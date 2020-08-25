// import dgram from 'dgram';

// import DB from '../BackendDBConnector';
// import { factor } from '../constants';

// const IP = 'localhost';
// const UDP_ADD = IP;
// const UDP_PORT = 8080;
// export function UDPGPSSetup(socket) {
// 	let UDPSocket = dgram.createSocket('udp4');
// 	UDPSocket.bind({
// 		address: UDP_ADD,
// 		port: 7001,
// 		exclusive: true
// 	});
// 	UDPSocket.on('message', (msg, rinfo) => {
// 		// The message
// 		console.log('yay');
// 		let response = JSON.parse(msg.toString());
// 		console.log('points:', response);

// 	});
// }
