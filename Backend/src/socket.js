import http from 'http';
import socketIo from 'socket.io';

import colors from './colors';

export default (app) => {
    const PORT = 4001;
    const server = http.createServer(app);
    const io = socketIo(server);

    server.listen(PORT, () => console.log(`Points Socket lisntening on port ${PORT}`.listener));
    return io;
};
