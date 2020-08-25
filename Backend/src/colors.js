import colors from 'colors';
// https://www.npmjs.com/package/colors
colors.setTheme({
	listener: [ 'bgRed', 'white' ],
	data: 'yellow',
	test: [ 'grey' ],
	udp: 'green',
	error: 'red'
});
export default colors;
