const admin = require('firebase-admin');
var serviceAccount = require('./secrets/firebase-service-acc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://water-level-sensor-b2715-default-rtdb.firebaseio.com',
});

module.exports = admin;
