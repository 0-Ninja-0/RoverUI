import express from 'express';
import DB from '../BackendDBConnector';
import colors from '../colors';

let router = express.Router();
import { factor } from '../constants';
import { tempIo as io } from '../app';
router.get('/', (req, res) => {
    res.send('w').sendStatus(200);
});
router.post('/markers', (req, res) => {
    DB.get('/map/center').then(({ data }) => {
        let { lat, long } = data;
        let diffLat = (req.body.lat - lat) * factor;
        let diffLong = (req.body.long - long) * factor;
        let date = new Date();
        console.log(diffLat, diffLat);
        DB.post('/markers', {
            id: date.getTime(),
            x: diffLong,
            y: diffLat,
            lat: req.body.lat,
            long: req.body.long,
            center: data,
        }).then(() => {
            io.emit('markerUpdate', 'New Marker!');
            res.sendStatus(200);
        });
    });
});

export default router;
