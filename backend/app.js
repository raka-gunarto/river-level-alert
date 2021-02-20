require('dotenv').config();

const mongoose = require('mongoose');
require('./WaterLevelDatapoint.model.js');

const WaterLevelDatapoint = mongoose.model('WaterLevelDatapoint');
const sensors = require('./sensors');

const admin = require('./config/firebase');
const firebaseMessaging = admin.messaging();
const {
    sendEvacuateNotif,
    sendDangerNotif,
    sendWarnNotif,
} = require('./notify.js')(firebaseMessaging);

const bodyParser = require('body-parser');
const cors = require('cors');
const app = require('express')();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/subscribe/:sensorID', (req, res) => {
    if (!sensors[req.params.sensorID]) return res.sendStatus(404);
    firebaseMessaging.subscribeToTopic(req.body.token, req.params.sensorID);
    res.sendStatus(200);
});

app.post('/api/unsubscribe/:sensorID', (req, res) => {
    firebaseMessaging.unsubscribeFromTopic(req.body.token, req.params.sensorID);
    res.sendStatus(200);
});

app.get('/api/data/:sensorID', (req, res) => {
    const limit = req.query.limit || 50;
    WaterLevelDatapoint.find({ location: req.params.sensorID })
        .sort({ createdAt: 'desc' })
        .limit(limit)
        .exec((err, data) => {
            if (err) return res.sendStatus(500);
            res.json({
                safeLevel: sensors[req.params.sensorID].safeLevel,
                warnLevel: sensors[req.params.sensorID].warnLevel,
                dangerLevel: sensors[req.params.sensorID].dangerLevel,
                data: data,
            });
        });
});

app.get('/api/sensors', (req, res) => {
    return res.json(sensors);
});

app.post('/api/data', async (req, res) => {
    if (req.body.secret !== process.env.SHARED_SECRET)
        return res.sendStatus(403);
    if (!sensors[req.body.location]) return res.sendStatus(400);
    if (req.body.rawValue === 0) return res.sendStatus(400);

    const [lastDatapoint] = await WaterLevelDatapoint.find({})
        .sort({ createdAt: 'desc' })
        .limit(1);

    let newDatapoint = new WaterLevelDatapoint({
        location: req.body.location,
        waterLevel: sensors[req.body.location].calculateWaterLevel(
            req.body.rawValue
        ),
    });

    // TODO: discard erroneous values (sudden change in water level in small timeframe)

    newDatapoint
        .save()
        .then(async () => {
            res.sendStatus(200);
            const sensorInfo = sensors[newDatapoint.location];
            if (
                newDatapoint.waterLevel >= sensorInfo.dangerLevel &&
                lastDatapoint.waterLevel < sensorInfo.dangerLevel
            )
                sendEvacuateNotif(
                    newDatapoint.location,
                    sensors[req.body.location].name
                );
            else if (
                newDatapoint.waterLevel >= sensorInfo.warnLevel &&
                lastDatapoint.waterLevel < sensorInfo.warnLevel
            )
                sendDangerNotif(
                    newDatapoint.location,
                    sensors[req.body.location].name
                );
            else if (
                newDatapoint.waterLevel >= sensorInfo.safeLevel &&
                lastDatapoint.waterLevel < sensorInfo.safeLevel
            )
                sendWarnNotif(
                    newDatapoint.location,
                    sensors[req.body.location].name
                );
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

const port = process.env.PORT || 3000;

module.exports = new Promise((resolve, reject) => {
    mongoose.connection
        .on('error', (err) => {
            console.error(err);
            reject(err);
        }) // log error
        .once('open', () => {
            // start server on dbconn open
            app.listen(port);
            console.log(`Server started on port: ${port}`);
            resolve(app);
        });
    mongoose.connect('mongodb://127.0.0.1:27017/river-db', {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});
