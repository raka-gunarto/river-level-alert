require('dotenv').config();

const mongoose = require('mongoose');
require('WaterLevelDatapoint.model.js');

const WaterLevelDatapoint = mongoose.model('WaterLevelDatapoint');
const sensors = require('./sensors');

const admin = require('./config/firebase');
const firebaseMessaging = admin.messaging();
const {sendDangerNotif, sendWarnNotif} = require('./notify.js')(firebaseMessaging);

const bodyParser = require('body-parser');
const app = require('express')();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/subscribe/:sensorID', (req, res) => {
    if (!sensors[req.params.sensorID]) return res.sendStatus(404);
    firebaseMessaging.subscribeToTopic(req.body.token, req.params.sensorID);
    res.sendStatus(200);
})

app.post('/unsubscribe/:sensorID', (req,res) => {
    firebaseMessaging.unsubscribeFromTopic(req.body.token, req.params.sensorID);
    res.sendStatus(200);
})

app.get('/data/:sensorID', (req, res) => {
    const limit = req.query.limit || 50;
    WaterLevelDatapoint
        .find({location: req.params.sensorID})
        .sort({createdAt: 'desc'})
        .limit(limit)
        .exec((err, data) => {
            if (!err)
                return res.sendStatus(500);
            res.json({
                safeLevel: sensors[req.params.sensorID].safeLevel,
                warnLevel: sensors[req.params.sensorID].warnLevel,
                dangerLevel: sensors[req.params.sensorID].dangerLevel,
                data: data
            })
        })
})

app.post('/data', (req, res) => {
    if (req.body.secret !== process.env.SHARED_SECRET)
        return res.sendStatus(403);

    if (!sensors[req.body.location]) return res.sendStatus(400);
    
    let newDatapoint = new WaterLevelDatapoint({
        location = req.body.location,
        waterLevel = sensors[req.body.location].calculateWaterLevel(req.body.rawValue),
    })

    newDatapoint.save()
        .then(() => {
            res.sendStatus(200);

            if (newDatapoint.waterLevel >= sensors[newDatapoint.location].dangerLevel)
                sendDangerNotif(newDatapoint.location);
            else if (newDatapoint.waterLevel >= sensors[newDatapoint.location].warnLevel)
                sendWarnNotif(newDatapoint.location);
        })
        .catch(() => res.sendStatus(500))
})